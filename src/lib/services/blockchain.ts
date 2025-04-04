/**
 * Blockchain service for interacting with the Marscoin blockchain
 * This is a simplified mock implementation.
 * In a real implementation, this would connect to a Marscoin node via RPC.
 */

// Mock wallet details
const MOCK_BALANCE = 100.0
const MOCK_ADDRESS = 'MARS1234567890abcdef'
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
]

/**
 * Get wallet balance for a given address
 */
export async function getWalletBalance(address?: string): Promise<number> {
  // In a real implementation, this would connect to a Marscoin node
  // and fetch the balance for the given address
  console.log(`Getting balance for address: ${address || MOCK_ADDRESS}`)
  return MOCK_BALANCE
}

/**
 * Get wallet transactions for a given address
 */
export async function getTransactions(address?: string) {
  // In a real implementation, this would connect to a Marscoin node
  // and fetch transactions for the given address
  console.log(`Getting transactions for address: ${address || MOCK_ADDRESS}`)
  return MOCK_TRANSACTIONS
}

/**
 * Send funds from one address to another
 */
export async function sendFunds(fromAddress: string, toAddress: string, amount: number) {
  // In a real implementation, this would connect to a Marscoin node
  // and send the transaction
  console.log(`Sending ${amount} MARS from ${fromAddress} to ${toAddress}`)
  
  // Mock successful transaction
  return {
    success: true,
    txid: `tx${Math.floor(Math.random() * 1000000)}`,
    amount,
    timestamp: new Date(),
  }
}

/**
 * Anchor data on the blockchain
 */
export async function anchorData(address: string, data: string) {
  // In a real implementation, this would connect to a Marscoin node
  // and create an OP_RETURN transaction with the data hash
  console.log(`Anchoring data on the blockchain from address ${address}`)
  
  // Mock successful anchoring
  return {
    success: true,
    txid: `tx${Math.floor(Math.random() * 1000000)}`,
    timestamp: new Date(),
  }
}