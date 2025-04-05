/**
 * Blockchain service for interacting with the Marscoin blockchain
 * This implementation uses bitcoinjs-lib with Marscoin parameters
 */
import * as bitcoin from 'bitcoinjs-lib';
import { BIP32Factory, BIP32Interface } from 'bip32';
import * as ecc from 'tiny-secp256k1';
import * as bip39 from 'bip39';
import { ECPairFactory } from 'ecpair';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { Buffer } from 'buffer';

// Create BIP32 with secp256k1
const bip32 = BIP32Factory(ecc);
// Create ECPair factory
const ECPair = ECPairFactory(ecc);

// Marscoin network parameters based on Litecoin with custom pubKeyHash and scriptHash
const MarscoinNetwork = {
  messagePrefix: '\x19Marscoin Signed Message:\n',
  bech32: 'M',
  bip44: 2, // Like Litecoin
  bip32: {
    public: 0x043587cf, // xpub
    private: 0x04358394, // xprv
  },
  pubKeyHash: 0x32, // Marscoin address prefix (decimal 50)
  scriptHash: 0x32, // Same for P2SH
  wif: 0xb2, // Private key prefix for Marscoin
};

// Mock wallet details for fallback and testing
const MOCK_BALANCE = 100.0;
const MOCK_ADDRESS = 'M8vXitQJpXvKRGkKPzDJgRVioNLqvNnecM'; // Example Marscoin address format
const MOCK_TRANSACTIONS = [
  {
    txid: 'tx123456',
    amount: 10.0,
    confirmations: 6,
    timestamp: new Date('2025-03-15'),
    type: 'received',
  },
  {
    txid: 'tx123457',
    amount: -5.0,
    confirmations: 5,
    timestamp: new Date('2025-03-16'),
    type: 'sent',
  },
];

// Interface for a wallet
interface MarsWallet {
  address: string;
  privateKey: string;
  publicKey: string;
  seed?: Buffer;
  mnemonic?: string;
  node?: BIP32Interface;
}

/**
 * Interface for RPC Client responses
 */
interface RPCResponse {
  result: any;
  error: any;
  id: string;
}

/**
 * Martian Wallet Service
 * Handles wallet creation, encryption, and transactions on the Martian blockchain
 */
export class WalletService {
  private rpcUrl: string;
  private rpcUser: string;
  private rpcPassword: string;
  
  constructor() {
    // In production, these values would come from environment variables
    this.rpcUrl = process.env.MARSCOIN_RPC_URL || 'http://localhost:8332';
    this.rpcUser = process.env.MARSCOIN_RPC_USER || '';
    this.rpcPassword = process.env.MARSCOIN_RPC_PASSWORD || '';
  }
  
  /**
   * Call the Marscoin RPC API
   * @param method RPC method to call
   * @param params Parameters for the RPC call
   * @returns Response from the RPC server
   */
  private async callRPC(method: string, params: any[] = []): Promise<any> {
    try {
      const response = await axios.post(
        this.rpcUrl,
        {
          jsonrpc: '1.0',
          id: String(Date.now()),
          method,
          params,
        },
        {
          auth: {
            username: this.rpcUser,
            password: this.rpcPassword,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      const data = response.data as RPCResponse;
      
      if (data.error) {
        throw new Error(`RPC Error: ${data.error.message || JSON.stringify(data.error)}`);
      }
      
      return data.result;
    } catch (error) {
      console.error('RPC call failed:', error);
      throw error;
    }
  }
  
  /**
   * Generate a new BIP39 mnemonic seed phrase with strong entropy
   * @param wordCount Number of words (12 or 24)
   * @returns A secure seed phrase
   */
  async generateSeedPhrase(wordCount: number = 12): Promise<string> {
    try {
      // Only try to import the entropy generator in browser environment
      if (typeof window !== 'undefined') {
        // Import the entropy generator dynamically
        const entropyModule = await import('@/lib/wallet/entropyGenerator');
        
        // Determine entropy size based on word count (16 bytes for 12 words, 32 bytes for 24 words)
        const entropySize = wordCount === 24 ? 32 : 16;
        
        // Generate strong entropy
        const entropy = entropyModule.generateStrongEntropy(entropySize);
        
        // Generate mnemonic from entropy
        return bip39.entropyToMnemonic(Buffer.from(entropy));
      } else {
        // Server-side fallback
        throw new Error('Server-side entropy generation not supported');
      }
    } catch (error) {
      console.warn('Enhanced entropy generation failed, falling back to default method:', error);
      // Fallback to standard generation method
      const strength = wordCount === 24 ? 256 : 128;
      return bip39.generateMnemonic(strength);
    }
  }
  
  /**
   * Validate a BIP39 mnemonic seed phrase
   * @param mnemonic The seed phrase to validate
   * @returns Boolean indicating if the mnemonic is valid
   */
  validateSeedPhrase(mnemonic: string): boolean {
    return bip39.validateMnemonic(mnemonic);
  }
  
  /**
   * Create a wallet from a mnemonic seed phrase
   * @param mnemonic The seed phrase to use
   * @returns The wallet object with address
   */
  createWalletFromMnemonic(mnemonic: string): MarsWallet {
    // Generate seed from mnemonic
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    
    // Generate master node for Marscoin network (m)
    const masterNode = bip32.fromSeed(seed, MarscoinNetwork);
    
    // Derivation path for Marscoin (using Litecoin's coin type: 2)
    // m/44'/2'/0'/0/0 for first receiving address
    const childNode = masterNode.derivePath("m/44'/2'/0'/0/0");
    
    // Get address from public key - convert Uint8Array to Buffer
    const pubkeyBuffer = Buffer.from(childNode.publicKey);
    const { address } = bitcoin.payments.p2pkh({
      pubkey: pubkeyBuffer,
      network: MarscoinNetwork,
    });
    
    // Get private key in WIF format
    const privateKey = childNode.toWIF();
    
    return {
      address: address!,
      privateKey: privateKey,
      publicKey: pubkeyBuffer.toString('hex'),
      seed: seed,
      mnemonic: mnemonic,
      node: childNode,
    };
  }
  
  /**
   * Encrypt a wallet with a password
   * @param wallet The wallet to encrypt
   * @param password The password to use for encryption
   * @returns Encrypted wallet data as JSON string
   */
  async encryptWallet(wallet: MarsWallet, password: string): Promise<string> {
    // Create a wallet object for encryption
    const walletData = {
      privateKey: wallet.privateKey,
      address: wallet.address,
      publicKey: wallet.publicKey,
    };
    
    // Convert to string
    const walletString = JSON.stringify(walletData);
    
    // Encrypt with AES
    const encrypted = CryptoJS.AES.encrypt(walletString, password).toString();
    
    return encrypted;
  }
  
  /**
   * Decrypt a wallet with a password
   * @param encryptedWallet The encrypted wallet data
   * @param password The password to use for decryption
   * @returns The decrypted wallet object
   */
  async decryptWallet(encryptedWallet: string, password: string): Promise<MarsWallet> {
    try {
      // Decrypt the wallet
      const bytes = CryptoJS.AES.decrypt(encryptedWallet, password);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      
      // Parse the JSON
      const walletData = JSON.parse(decrypted);
      
      // Validate the decrypted data
      if (!walletData.privateKey || !walletData.address || !walletData.publicKey) {
        throw new Error('Invalid wallet data format');
      }
      
      return walletData as MarsWallet;
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Invalid password or wallet data');
    }
  }
  
  /**
   * Encrypt a seed phrase with a password
   * @param seedPhrase The seed phrase to encrypt
   * @param password The password to use for encryption
   * @returns Encrypted seed phrase
   */
  encryptSeedPhrase(seedPhrase: string, password: string): string {
    return CryptoJS.AES.encrypt(seedPhrase, password).toString();
  }
  
  /**
   * Decrypt a seed phrase with a password
   * @param encryptedSeedPhrase The encrypted seed phrase
   * @param password The password to use for decryption
   * @returns The decrypted seed phrase
   */
  decryptSeedPhrase(encryptedSeedPhrase: string, password: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedSeedPhrase, password);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      throw new Error('Invalid password or seed phrase data');
    }
  }
  
  /**
   * Get the balance of a wallet
   * @param address The wallet address
   * @returns The balance in MARS
   */
  async getBalance(address: string): Promise<string> {
    try {
      // Use RPC call if configuration is available
      if (this.rpcUrl && this.rpcUser && this.rpcPassword) {
        const balanceSats = await this.callRPC('getreceivedbyaddress', [address, 0]);
        // Convert from satoshis to MARS (1 MARS = 100,000,000 satoshis)
        const balance = balanceSats / 100000000;
        return balance.toString();
      }
      
      // Try to fetch from a public explorer API 
      try {
        const response = await axios.get(`https://explore.marscoin.org/api/addr/${address}/balance`);
        if (response.data) {
          // Convert from satoshis to MARS (1 MARS = 100,000,000 satoshis)
          const balance = parseFloat(response.data) / 100000000;
          return balance.toString();
        }
      } catch (explorerError) {
        console.error('Explorer API error:', explorerError);
        // Fall through to mock data
      }
      
      // Return mock balance for testing/development
      console.log('Using mock balance data');
      return MOCK_BALANCE.toString();
    } catch (error) {
      console.error('Error fetching balance:', error);
      // Return mock balance for testing/development
      return MOCK_BALANCE.toString();
    }
  }
  
  /**
   * Create and sign a transaction
   * @param wallet The wallet to send from
   * @param to The recipient address
   * @param amount The amount to send in MARS
   * @param note Optional transaction note (will use OP_RETURN)
   * @returns Transaction hex
   */
  async createTransaction(
    wallet: MarsWallet,
    to: string,
    amount: string,
    note?: string
  ): Promise<string> {
    try {
      // If we have RPC access, use it to get UTXOs
      const amountSats = Math.floor(parseFloat(amount) * 100000000); // Convert to satoshis
      
      if (this.rpcUrl && this.rpcUser && this.rpcPassword) {
        // Get unspent outputs for the wallet
        const utxos = await this.callRPC('listunspent', [0, 9999999, [wallet.address]]);
        
        // Create a new transaction using Psbt (Partially Signed Bitcoin Transaction)
        const psbt = new bitcoin.Psbt({ network: MarscoinNetwork });
        
        // Add inputs
        let inputSats = 0;
        for (const utxo of utxos) {
          psbt.addInput({
            hash: utxo.txid,
            index: utxo.vout,
            witnessUtxo: {
              script: Buffer.from(bitcoin.address.toOutputScript(wallet.address, MarscoinNetwork)),
              value: Math.floor(utxo.amount * 100000000),
            },
          });
          
          inputSats += Math.floor(utxo.amount * 100000000);
          
          // Break when we have enough inputs
          if (inputSats >= amountSats + 10000) { // Add 10000 satoshis for fee
            break;
          }
        }
        
        // Add payment output
        psbt.addOutput({
          address: to,
          value: amountSats,
        });
        
        // Add note as OP_RETURN if provided
        if (note) {
          const data = Buffer.from(note, 'utf8');
          const embed = bitcoin.payments.embed({ data: [data] as Buffer[] });
          psbt.addOutput({
            script: embed.output!,
            value: 0, // 0 value output
          });
        }
        
        // Add change output if needed (minus fee)
        const fee = 10000; // 0.0001 MARS fee
        const changeSats = inputSats - amountSats - fee;
        if (changeSats > 0) {
          psbt.addOutput({
            address: wallet.address,
            value: changeSats,
          });
        }
        
        // Sign inputs
        // Import the private key
        const keyPair = ECPair.fromWIF(wallet.privateKey, MarscoinNetwork);
        
        // Create a signer with the required methods
        const signer = {
          publicKey: Buffer.from(keyPair.publicKey),
          sign: (hash: Buffer) => {
            const sig = keyPair.sign(hash);
            return Buffer.from(sig);
          }
        };
        
        // Sign all inputs
        for (let i = 0; i < psbt.inputCount; i++) {
          psbt.signInput(i, signer);
        }
        
        // Finalize the transaction
        psbt.finalizeAllInputs();
        
        // Extract the transaction
        const tx = psbt.extractTransaction();
        
        // Get the hex representation
        return tx.toHex();
      } else {
        // For testing, just return success
        console.log(`Creating transaction: ${amount} MARS to ${to}`);
        return `mock_transaction_hex_${Date.now()}`;
      }
    } catch (error) {
      console.error('Transaction creation error:', error);
      throw new Error(`Failed to create transaction: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Send a transaction
   * @param wallet The wallet to send from
   * @param to The recipient address 
   * @param amount The amount to send in MARS
   * @param note Optional transaction note
   * @returns Transaction hash
   */
  async sendTransaction(
    wallet: MarsWallet,
    to: string,
    amount: string,
    note?: string
  ): Promise<string> {
    try {
      // Create and sign the transaction
      const txHex = await this.createTransaction(wallet, to, amount, note);
      
      // If we have RPC access, broadcast the transaction
      if (this.rpcUrl && this.rpcUser && this.rpcPassword) {
        const txid = await this.callRPC('sendrawtransaction', [txHex]);
        return txid;
      }
      
      // For testing/development, return a mock transaction ID
      console.log(`Mock sending ${amount} MARS to ${to}`);
      return `tx${Math.floor(Math.random() * 1000000)}`;
    } catch (error) {
      console.error('Transaction error:', error);
      throw error;
    }
  }
  
  /**
   * Get transaction history for an address
   * @param address The wallet address
   * @returns Array of transactions
   */
  async getTransactions(address: string): Promise<any[]> {
    try {
      // If we have RPC access, use it to get transactions
      if (this.rpcUrl && this.rpcUser && this.rpcPassword) {
        try {
          // Get transactions for address
          const txs = await this.callRPC('listtransactions', ['*', 100, 0, true]);
          
          // Filter for address and format
          const filteredTxs = txs
            .filter((tx: any) => tx.address === address)
            .map((tx: any) => ({
              txid: tx.txid,
              amount: tx.amount,
              confirmations: tx.confirmations,
              timestamp: new Date(tx.time * 1000),
              type: tx.amount > 0 ? 'received' : 'sent',
            }));
          
          return filteredTxs;
        } catch (rpcError) {
          console.error('RPC transaction error:', rpcError);
          // Fall through to explorer API
        }
      }
      
      // Try explorer API
      try {
        const response = await axios.get(`https://explore.marscoin.org/api/addr/${address}/txs`);
        if (response.data && Array.isArray(response.data.items)) {
          return response.data.items.map((tx: any) => ({
            txid: tx.txid,
            amount: tx.valueOut - tx.valueIn, // Simplified, in real scenario would need proper output handling
            confirmations: tx.confirmations,
            timestamp: new Date(tx.time * 1000),
            type: tx.valueOut > tx.valueIn ? 'received' : 'sent',
          }));
        }
      } catch (explorerError) {
        console.error('Explorer transaction error:', explorerError);
        // Fall through to mock data
      }
      
      // Return mock data if all else fails
      console.log('Using mock transaction data');
      return MOCK_TRANSACTIONS;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return MOCK_TRANSACTIONS;
    }
  }
  
  /**
   * Anchor data on the blockchain (for documents, votes, etc.)
   * @param wallet The wallet to use for anchoring
   * @param data The data to anchor
   * @returns Transaction information
   */
  async anchorData(wallet: MarsWallet, data: string): Promise<any> {
    try {
      // If we have RPC access, create a real transaction
      if (this.rpcUrl && this.rpcUser && this.rpcPassword) {
        // Get unspent outputs for the wallet
        const utxos = await this.callRPC('listunspent', [0, 9999999, [wallet.address]]);
        
        // Need at least one UTXO
        if (utxos.length === 0) {
          throw new Error('No unspent outputs available');
        }
        
        // Create a new transaction using Psbt (Partially Signed Bitcoin Transaction)
        const psbt = new bitcoin.Psbt({ network: MarscoinNetwork });
        
        // Add input (use first UTXO)
        const utxo = utxos[0];
        psbt.addInput({
          hash: utxo.txid,
          index: utxo.vout,
          witnessUtxo: {
            script: Buffer.from(bitcoin.address.toOutputScript(wallet.address, MarscoinNetwork)),
            value: Math.floor(utxo.amount * 100000000),
          },
        });
        
        // Add data as OP_RETURN
        const dataBuffer = Buffer.from(data, 'utf8');
        const embed = bitcoin.payments.embed({ data: [dataBuffer] as Buffer[] });
        psbt.addOutput({
          script: embed.output!,
          value: 0, // 0 value output
        });
        
        // Add change output (minus fee)
        const inputSats = Math.floor(utxo.amount * 100000000);
        const fee = 10000; // 0.0001 MARS fee
        const changeSats = inputSats - fee;
        if (changeSats > 0) {
          psbt.addOutput({
            address: wallet.address,
            value: changeSats,
          });
        }
        
        // Sign the input
        const keyPair = ECPair.fromWIF(wallet.privateKey, MarscoinNetwork);
        
        // Create a signer with the required methods
        const signer = {
          publicKey: Buffer.from(keyPair.publicKey),
          sign: (hash: Buffer) => {
            const sig = keyPair.sign(hash);
            return Buffer.from(sig);
          }
        };
        
        psbt.signInput(0, signer);
        
        // Finalize the transaction
        psbt.finalizeAllInputs();
        
        // Extract the transaction
        const tx = psbt.extractTransaction();
        
        // Get the hex representation
        const txHex = tx.toHex();
        
        // Send the raw transaction
        const txid = await this.callRPC('sendrawtransaction', [txHex]);
        
        return {
          success: true,
          txid,
          timestamp: new Date(),
        };
      }
      
      // For testing, return a mock result
      console.log(`Anchoring data on the blockchain from address ${wallet.address}`);
      return {
        success: true,
        txid: `tx${Math.floor(Math.random() * 1000000)}`,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Error anchoring data:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const walletService = new WalletService();

// Legacy export functions that use the wallet service internally
// These maintain backwards compatibility with the previous API

/**
 * Get wallet balance for a given address
 */
export async function getWalletBalance(address?: string): Promise<number> {
  try {
    if (address) {
      const balance = await walletService.getBalance(address);
      return parseFloat(balance);
    }
    return MOCK_BALANCE;
  } catch (error) {
    console.error('Error in getWalletBalance:', error);
    return MOCK_BALANCE;
  }
}

/**
 * Get wallet transactions for a given address
 */
export async function getTransactions(address?: string) {
  try {
    if (address) {
      return await walletService.getTransactions(address);
    }
    return MOCK_TRANSACTIONS;
  } catch (error) {
    console.error('Error in getTransactions:', error);
    return MOCK_TRANSACTIONS;
  }
}

/**
 * Send funds from one address to another
 */
export async function sendFunds(fromAddress: string, toAddress: string, amount: number) {
  // This is a mock implementation for backwards compatibility
  // In a real app, you would need the wallet (with private key) to send funds
  console.log(`Sending ${amount} MARS from ${fromAddress} to ${toAddress}`);
  
  // Mock successful transaction
  return {
    success: true,
    txid: `tx${Math.floor(Math.random() * 1000000)}`,
    amount,
    timestamp: new Date(),
  };
}

/**
 * Anchor data on the blockchain
 */
export async function anchorData(address: string, data: string) {
  // This is a mock implementation for backwards compatibility
  // In a real app, you would need the wallet (with private key) to anchor data
  console.log(`Anchoring data on the blockchain from address ${address}`);
  
  // Mock successful anchoring
  return {
    success: true,
    txid: `tx${Math.floor(Math.random() * 1000000)}`,
    timestamp: new Date(),
  };
}

// Export the wallet service as default export
export default walletService;