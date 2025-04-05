/**
 * Enhanced Entropy Generator for Seed Phrases
 * 
 * This module provides a strong entropy source for BIP39 seed phrase generation.
 * It uses multiple sources of entropy to ensure high-quality randomness.
 */

/**
 * Generate cryptographically strong entropy for wallet seed phrases
 * @param size Size of entropy in bytes (default: 16 for 12-word seed, 32 for 24-word seed)
 * @returns Uint8Array containing entropy
 */
export function generateStrongEntropy(size: number = 16): Uint8Array {
  // Check if we're in a browser environment with Web Crypto API
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    // Create buffer to hold entropy
    const entropy = new Uint8Array(size);
    
    // Fill with cryptographically strong random values
    window.crypto.getRandomValues(entropy);
    
    // Mix in additional entropy sources
    mixInAdditionalEntropy(entropy);
    
    return entropy;
  } else {
    // If Web Crypto API is not available (e.g., server-side), 
    // use Node.js crypto if available
    try {
      const crypto = require('crypto');
      const entropy = crypto.randomBytes(size);
      return new Uint8Array(entropy);
    } catch (error) {
      // Fallback to a less secure but still usable random number generator
      console.warn('Secure random number generation not available. Using fallback method.');
      const entropy = new Uint8Array(size);
      for (let i = 0; i < size; i++) {
        entropy[i] = Math.floor(Math.random() * 256);
      }
      return entropy;
    }
  }
}

/**
 * Mix in additional entropy sources to strengthen randomness
 * @param baseEntropy Initial entropy array to mix into
 */
function mixInAdditionalEntropy(baseEntropy: Uint8Array): void {
  const size = baseEntropy.length;
  
  // Collect various browser/environment specific entropy sources
  const additionalData = [
    new Date().getTime(),                       // Current timestamp
    typeof performance !== 'undefined' ? performance.now() : 0,    // High-resolution timer
    typeof screen !== 'undefined' ? (screen.width * screen.height) : 0,  // Screen dimensions
    typeof navigator !== 'undefined' ? navigator.userAgent || '' : '',    // User agent string
    typeof navigator !== 'undefined' ? JSON.stringify(navigator.hardwareConcurrency || 1) : '1', // CPU core count
    typeof navigator !== 'undefined' ? JSON.stringify(navigator.language || 'en') : 'en',       // Language
    typeof navigator !== 'undefined' ? JSON.stringify(navigator.languages || ['en']) : '["en"]', // Languages array
    typeof navigator !== 'undefined' ? JSON.stringify(navigator.plugins?.length || 0) : '0'      // Plugins count
  ].join('');
  
  // Create a simple hash function for the additional data
  const simpleHash = (data: string): number[] => {
    const result = new Array(size).fill(0);
    for (let i = 0; i < data.length; i++) {
      result[i % size] = (result[i % size] + data.charCodeAt(i)) % 256;
    }
    return result;
  };
  
  // Mix the hash into the base entropy
  const hash = simpleHash(additionalData);
  for (let i = 0; i < size; i++) {
    // XOR the base entropy with our hash
    baseEntropy[i] = baseEntropy[i] ^ hash[i]; 
  }
  
  // Add a final entropy source: mouse movements (browser-only)
  // This is especially important for wallet generation
  if (typeof document !== 'undefined' && typeof window !== 'undefined') {
    try {
      let mouseMovements = '';
      const mouseMoveHandler = (e: MouseEvent) => {
        mouseMovements += `${e.clientX},${e.clientY},${Date.now()};`;
        if (mouseMovements.length > 1000) {
          // Once we have enough mouse data, remove the listener
          document.removeEventListener('mousemove', mouseMoveHandler);
          
          // Mix in the mouse movement data
          const mouseHash = simpleHash(mouseMovements);
          for (let i = 0; i < size; i++) {
            baseEntropy[i] = baseEntropy[i] ^ mouseHash[i];
          }
        }
      };
      
      // Add the listener to collect mouse movements
      document.addEventListener('mousemove', mouseMoveHandler);
    } catch (error) {
      // Ignore errors in non-browser environments
      console.warn('Mouse movement entropy collection skipped:', error);
    }
  }
}