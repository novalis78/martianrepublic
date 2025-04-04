/**
 * General utility functions for the MartianRepublic application
 */

/**
 * Format a date to a human-readable string
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

/**
 * Format a date to a Martian Sol
 * This is a simplified conversion, in reality the calculation would be more complex
 */
export function formatSol(date: Date): string {
  // Mock implementation - in reality this would convert Earth dates to Martian sols
  const earthDays = Math.floor((date.getTime() - new Date('2025-01-01').getTime()) / (1000 * 60 * 60 * 24))
  const sol = Math.floor(earthDays / 1.027) // Mars day is approximately 1.027 Earth days
  return `Sol ${sol}`
}

/**
 * Format a Marscoin amount with proper decimal places
 */
export function formatMarscoin(amount: number): string {
  return amount.toFixed(8) + ' MARS'
}

/**
 * Truncate a string (like an address) with ellipsis in the middle
 */
export function truncateMiddle(text: string, startChars = 6, endChars = 4): string {
  if (text.length <= startChars + endChars) {
    return text
  }
  return `${text.substring(0, startChars)}...${text.substring(text.length - endChars)}`
}

/**
 * Create a slug from a string (for URLs)
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

/**
 * Check if a wallet address is valid (simplified mock implementation)
 */
export function isValidMarscoinAddress(address: string): boolean {
  // In a real implementation, this would check if the address is a valid Marscoin address
  return address.startsWith('MARS') && address.length === 20
}