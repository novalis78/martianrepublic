/**
 * Transaction Service
 * 
 * This module handles secure transaction signing and management.
 * It works together with the secure wallet storage to provide a
 * secure way to create and sign transactions.
 */
import { decryptWalletData } from "./secureStorage";
import walletService from "@/lib/services/blockchain";

/**
 * Transaction status
 */
export enum TransactionStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed'
}

/**
 * Transaction interface
 */
export interface Transaction {
  txid: string;
  to: string;
  amount: number;
  fee?: number;
  status: TransactionStatus;
  timestamp: Date;
  confirmations?: number;
  note?: string;
}

/**
 * Create a transaction request that needs to be signed
 * @param to Recipient address
 * @param amount Amount to send
 * @param note Optional transaction note
 * @returns Transaction object (unsigned)
 */
export async function createTransactionRequest(
  to: string, 
  amount: number,
  note?: string
): Promise<Omit<Transaction, 'txid' | 'status' | 'timestamp' | 'confirmations'>> {
  // Validate the recipient address
  if (!isValidAddress(to)) {
    throw new Error('Invalid recipient address');
  }

  // Validate amount
  if (amount <= 0) {
    throw new Error('Amount must be greater than zero');
  }

  // Calculate fee (in a real implementation, this would be dynamic)
  const fee = 0.001; // Mock fee for now

  return {
    to,
    amount,
    fee,
    note
  };
}

/**
 * Sign and send a transaction using the encrypted wallet
 * @param encryptedWallet Encrypted wallet data
 * @param password Wallet password
 * @param to Recipient address
 * @param amount Amount to send
 * @param note Optional transaction note
 * @returns Transaction details including txid
 */
export async function signAndSendTransaction(
  encryptedWallet: string,
  password: string,
  to: string,
  amount: number,
  note?: string
): Promise<Transaction> {
  try {
    // Decrypt the wallet
    const walletDataStr = decryptWalletData(encryptedWallet, password);
    const walletData = JSON.parse(walletDataStr);

    // Create and sign the transaction
    const txid = await walletService.sendTransaction(
      walletData, // The decrypted wallet
      to, // Recipient address
      amount.toString(), // Amount as string
      note // Optional note
    );

    // Create the transaction record
    const transaction: Transaction = {
      txid,
      to,
      amount,
      fee: 0.001, // Mock fee for now
      status: TransactionStatus.PENDING,
      timestamp: new Date(),
      note
    };

    // Return the transaction
    return transaction;
  } catch (error) {
    console.error('Transaction signing error:', error);
    throw new Error(`Failed to sign and send transaction: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Validate a MARS address
 * @param address Address to validate
 * @returns Boolean indicating if address is valid
 */
export function isValidAddress(address: string): boolean {
  // This is a simple validation for now
  // In a real implementation, you would do proper blockchain-specific validation
  return address.startsWith('M') && address.length >= 26 && address.length <= 35;
}

/**
 * Format an amount with the MARS currency symbol
 * @param amount Amount to format
 * @returns Formatted amount
 */
export function formatAmount(amount: number): string {
  return `${amount.toFixed(8)} MARS`;
}

/**
 * Get transaction fee estimate
 * @param amount Amount to send
 * @returns Estimated fee
 */
export function estimateFee(amount: number): number {
  // In a real implementation, this would calculate based on tx size, priority, etc.
  return 0.001; // Fixed fee for now
}