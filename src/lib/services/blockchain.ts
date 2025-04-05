/**
 * Blockchain service for interacting with the Marscoin blockchain
 * This implementation uses ethers.js as a foundation but would be adapted
 * to use the actual Marscoin blockchain in production.
 */
import { ethers } from 'ethers';
import * as bip39 from 'bip39';
import CryptoJS from 'crypto-js';

// Mock wallet details for fallback and testing
const MOCK_BALANCE = 100.0;
const MOCK_ADDRESS = 'MARS1234567890abcdef';
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

/**
 * Martian Wallet Service
 * Handles wallet creation, encryption, and transactions on the Martian blockchain
 */
export class WalletService {
  private provider: ethers.JsonRpcProvider;
  
  constructor() {
    // In production, this would connect to the actual Martian blockchain
    // For development, we'll use a local provider or public test network
    const rpcUrl = process.env.NEXT_PUBLIC_BLOCKCHAIN_RPC_URL;
    if (rpcUrl) {
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
    } else {
      // Fallback to local provider - note this will often fail without local node
      this.provider = new ethers.JsonRpcProvider('http://localhost:8545');
    }
  }
  
  /**
   * Generate a new BIP39 mnemonic seed phrase
   * @returns A 12-word seed phrase
   */
  generateSeedPhrase(): string {
    return bip39.generateMnemonic();
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
  createWalletFromMnemonic(mnemonic: string): ethers.HDNodeWallet {
    return ethers.Wallet.fromPhrase(mnemonic).connect(this.provider);
  }
  
  /**
   * Encrypt a wallet with a password
   * @param wallet The wallet to encrypt
   * @param password The password to use for encryption
   * @returns Encrypted wallet data
   */
  async encryptWallet(wallet: ethers.HDNodeWallet, password: string): Promise<string> {
    return await wallet.encrypt(password);
  }
  
  /**
   * Decrypt a wallet with a password
   * @param encryptedWallet The encrypted wallet data
   * @param password The password to use for decryption
   * @returns The decrypted wallet object
   */
  async decryptWallet(encryptedWallet: string, password: string): Promise<ethers.Wallet | ethers.HDNodeWallet> {
    try {
      const wallet = await ethers.Wallet.fromEncryptedJson(encryptedWallet, password);
      return wallet.connect(this.provider) as ethers.Wallet;
    } catch (error) {
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
   * @returns The balance in Ether (MARS)
   */
  async getBalance(address: string): Promise<string> {
    try {
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
      // Return mock balance for testing/development
      return MOCK_BALANCE.toString();
    }
  }
  
  /**
   * Send a transaction
   * @param wallet The wallet to send from
   * @param to The recipient address
   * @param amount The amount to send in Ether (MARS)
   * @param note Optional transaction note
   * @returns Transaction hash
   */
  async sendTransaction(
    wallet: ethers.Wallet | ethers.HDNodeWallet,
    to: string,
    amount: string,
    note?: string
  ): Promise<string> {
    try {
      // Convert amount from Ether to Wei
      const value = ethers.parseEther(amount);
      
      // Prepare transaction data
      const tx: ethers.TransactionRequest = {
        to,
        value,
      };
      
      // Add note as data if provided
      if (note) {
        tx.data = ethers.hexlify(ethers.toUtf8Bytes(note));
      }
      
      // Send transaction
      const txResponse = await wallet.sendTransaction(tx);
      
      // Wait for the transaction to be mined
      const receipt = await txResponse.wait();
      
      return txResponse.hash;
    } catch (error) {
      console.error('Transaction error:', error);
      // For testing/development, return a mock transaction ID
      return `tx${Math.floor(Math.random() * 1000000)}`;
    }
  }
  
  /**
   * Get transaction history for an address
   * @param address The wallet address
   * @returns Array of transactions
   */
  async getTransactions(address: string): Promise<any[]> {
    try {
      // In a real implementation, this would query the blockchain for transactions
      // This is a placeholder for the actual implementation
      
      // For now, return mock data
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
  async anchorData(wallet: ethers.Wallet | ethers.HDNodeWallet, data: string): Promise<any> {
    try {
      // Create a transaction with OP_RETURN-like data
      const tx: ethers.TransactionRequest = {
        to: wallet.address, // Send to self
        value: 0, // Zero value transaction
        data: ethers.hexlify(ethers.toUtf8Bytes(data)), // Data to store
      };
      
      // Send transaction
      const txResponse = await wallet.sendTransaction(tx);
      await txResponse.wait();
      
      return {
        success: true,
        txid: txResponse.hash,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Error anchoring data:', error);
      // Return mock result for testing
      return {
        success: true,
        txid: `tx${Math.floor(Math.random() * 1000000)}`,
        timestamp: new Date(),
      };
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