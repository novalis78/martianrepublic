/**
 * Secure Wallet Storage Service
 * 
 * This module provides secure browser-based wallet storage with:
 * - Strong encryption (AES-256)
 * - Session-based temporary decryption
 * - Automatic session timeouts
 * - Security tier indicators
 */
import CryptoJS from 'crypto-js';

// Security tiers for wallet storage
export enum SecurityTier {
  BASIC = 'basic',     // Browser-based storage (lowest security)
  ENHANCED = 'enhanced', // Mobile wallet integration (medium security)
  MAXIMUM = 'maximum'  // Hardware wallet integration (highest security)
}

// Session timeout in milliseconds
const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes

// LocalStorage keys
const WALLET_STORAGE_KEY = 'martianrepublic_wallet';
const WALLET_SESSION_KEY = 'martianrepublic_wallet_session';

interface WalletData {
  encryptedWallet: string;
  encryptedSeedPhrase: string;
  publicAddress: string;
  securityTier: SecurityTier;
  lastAccessed: number;
}

interface WalletSession {
  publicAddress: string;
  expiresAt: number;
}

/**
 * Save encrypted wallet data to localStorage
 */
export function saveWalletData(
  encryptedWallet: string,
  encryptedSeedPhrase: string,
  publicAddress: string,
  securityTier: SecurityTier = SecurityTier.BASIC
): void {
  const walletData: WalletData = {
    encryptedWallet,
    encryptedSeedPhrase,
    publicAddress,
    securityTier,
    lastAccessed: Date.now(),
  };
  
  localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(walletData));
}

/**
 * Get wallet data from localStorage
 */
export function getWalletData(): WalletData | null {
  const data = localStorage.getItem(WALLET_STORAGE_KEY);
  
  if (!data) {
    return null;
  }
  
  try {
    return JSON.parse(data) as WalletData;
  } catch (error) {
    console.error('Error parsing wallet data:', error);
    return null;
  }
}

/**
 * Check if a wallet exists in localStorage
 */
export function hasStoredWallet(): boolean {
  return localStorage.getItem(WALLET_STORAGE_KEY) !== null;
}

/**
 * Remove wallet data from localStorage
 */
export function clearWalletData(): void {
  localStorage.removeItem(WALLET_STORAGE_KEY);
  localStorage.removeItem(WALLET_SESSION_KEY);
}

/**
 * Start a new wallet session
 * This creates a temporary session for the decrypted wallet
 */
export function startWalletSession(publicAddress: string): void {
  const session: WalletSession = {
    publicAddress,
    expiresAt: Date.now() + SESSION_TIMEOUT,
  };
  
  localStorage.setItem(WALLET_SESSION_KEY, JSON.stringify(session));
}

/**
 * Check if there is an active wallet session
 */
export function hasActiveSession(): boolean {
  const sessionData = localStorage.getItem(WALLET_SESSION_KEY);
  
  if (!sessionData) {
    return false;
  }
  
  try {
    const session = JSON.parse(sessionData) as WalletSession;
    
    // Check if session has expired
    if (session.expiresAt < Date.now()) {
      // Clean up expired session
      localStorage.removeItem(WALLET_SESSION_KEY);
      return false;
    }
    
    // Extend session on active use
    extendSession();
    return true;
  } catch (error) {
    console.error('Error parsing wallet session:', error);
    return false;
  }
}

/**
 * Get the public address from the active session
 */
export function getSessionAddress(): string | null {
  if (!hasActiveSession()) {
    return null;
  }
  
  const sessionData = localStorage.getItem(WALLET_SESSION_KEY);
  const session = JSON.parse(sessionData!) as WalletSession;
  return session.publicAddress;
}

/**
 * Extend the current session timeout
 */
export function extendSession(): void {
  const sessionData = localStorage.getItem(WALLET_SESSION_KEY);
  
  if (!sessionData) {
    return;
  }
  
  try {
    const session = JSON.parse(sessionData) as WalletSession;
    session.expiresAt = Date.now() + SESSION_TIMEOUT;
    localStorage.setItem(WALLET_SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Error extending wallet session:', error);
  }
}

/**
 * End the current wallet session
 */
export function endSession(): void {
  localStorage.removeItem(WALLET_SESSION_KEY);
}

/**
 * Enhanced wallet encryption with a stronger key derivation
 * (For production, consider using PBKDF2 or Argon2 instead of simple SHA-256)
 */
export function encryptWalletData(data: string, password: string): string {
  // Create a stronger key from the password using SHA-256
  const key = CryptoJS.SHA256(password).toString();
  // Encrypt the data with AES using the derived key
  return CryptoJS.AES.encrypt(data, key).toString();
}

/**
 * Decrypt wallet data with password
 */
export function decryptWalletData(encryptedData: string, password: string): string {
  try {
    // Create the same key derivation as during encryption
    const key = CryptoJS.SHA256(password).toString();
    // Decrypt the data
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedData) {
      throw new Error('Decryption produced empty result');
    }
    
    return decryptedData;
  } catch (error) {
    throw new Error('Failed to decrypt data. Incorrect password.');
  }
}

/**
 * Get the security tier description
 */
export function getSecurityTierDescription(tier: SecurityTier): string {
  switch (tier) {
    case SecurityTier.BASIC:
      return "Browser-based wallet (Basic Security)";
    case SecurityTier.ENHANCED:
      return "Mobile wallet integration (Enhanced Security)";
    case SecurityTier.MAXIMUM:
      return "Hardware wallet integration (Maximum Security)";
    default:
      return "Unknown security tier";
  }
}

/**
 * Get security recommendations based on current tier
 */
export function getSecurityRecommendations(currentTier: SecurityTier): string[] {
  switch (currentTier) {
    case SecurityTier.BASIC:
      return [
        "Install the Martian mobile wallet app for enhanced security",
        "Never keep large amounts in a browser-based wallet",
        "Consider using a hardware wallet for maximum security",
        "Backup your seed phrase in a secure physical location"
      ];
    case SecurityTier.ENHANCED:
      return [
        "Consider upgrading to a hardware wallet for maximum security",
        "Keep your mobile device updated with the latest security patches",
        "Enable biometric authentication on your mobile wallet"
      ];
    case SecurityTier.MAXIMUM:
      return [
        "Store your hardware wallet in a secure location",
        "Consider using a passphrase for additional protection",
        "Follow manufacturer recommendations for firmware updates"
      ];
    default:
      return [];
  }
}