'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  SecurityTier,
  hasStoredWallet,
  getWalletData,
  hasActiveSession,
  saveWalletData,
  clearWalletData,
  endSession,
} from '@/lib/wallet/secureStorage';

interface WalletContextType {
  isWalletStored: boolean;
  isSessionActive: boolean;
  publicAddress: string | null;
  securityTier: SecurityTier;
  walletBalance: number | null;
  reloadWalletData: () => void;
  lockWallet: () => void;
  clearWallet: () => void;
  encryptedWallet: string | null;
  encryptedSeedPhrase: string | null;
}

const WalletContext = createContext<WalletContextType>({
  isWalletStored: false,
  isSessionActive: false,
  publicAddress: null,
  securityTier: SecurityTier.BASIC,
  walletBalance: null,
  reloadWalletData: () => {},
  lockWallet: () => {},
  clearWallet: () => {},
  encryptedWallet: null,
  encryptedSeedPhrase: null,
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const [isWalletStored, setIsWalletStored] = useState<boolean>(false);
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [publicAddress, setPublicAddress] = useState<string | null>(null);
  const [securityTier, setSecurityTier] = useState<SecurityTier>(SecurityTier.BASIC);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [encryptedWallet, setEncryptedWallet] = useState<string | null>(null);
  const [encryptedSeedPhrase, setEncryptedSeedPhrase] = useState<string | null>(null);

  // Effect to check wallet status on mount and when session changes
  useEffect(() => {
    if (status === 'authenticated') {
      // First check browser storage
      const storedWallet = hasStoredWallet();
      setIsWalletStored(storedWallet);
      
      if (storedWallet) {
        const walletData = getWalletData();
        if (walletData) {
          setPublicAddress(walletData.publicAddress);
          setSecurityTier(walletData.securityTier);
          setEncryptedWallet(walletData.encryptedWallet);
          setEncryptedSeedPhrase(walletData.encryptedSeedPhrase);
        }
      } else if (session?.user?.publicAddress) {
        // If no local wallet but user has an address in session,
        // they might be using a server-side wallet or hardware wallet
        setPublicAddress(session.user.publicAddress);
      }
      
      // Check if there's an active session
      setIsSessionActive(hasActiveSession());
    } else {
      // Clear state when logged out
      setIsWalletStored(false);
      setIsSessionActive(false);
      setPublicAddress(null);
      setSecurityTier(SecurityTier.BASIC);
      setWalletBalance(null);
      setEncryptedWallet(null);
      setEncryptedSeedPhrase(null);
    }
  }, [status, session]);

  // Fetch wallet balance if we have a public address
  useEffect(() => {
    if (publicAddress) {
      fetchWalletBalance(publicAddress);
    }
  }, [publicAddress]);

  // Fetch wallet balance
  const fetchWalletBalance = async (address: string) => {
    try {
      const response = await fetch('/api/wallet/balance');
      if (response.ok) {
        const data = await response.json();
        setWalletBalance(parseFloat(data.balance));
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  };

  // Reload wallet data
  const reloadWalletData = () => {
    if (status === 'authenticated') {
      // Check if there's a wallet in localStorage
      const storedWallet = hasStoredWallet();
      setIsWalletStored(storedWallet);
      
      if (storedWallet) {
        const walletData = getWalletData();
        if (walletData) {
          setPublicAddress(walletData.publicAddress);
          setSecurityTier(walletData.securityTier);
          setEncryptedWallet(walletData.encryptedWallet);
          setEncryptedSeedPhrase(walletData.encryptedSeedPhrase);
        }
      }
      
      // Check if there's an active session
      setIsSessionActive(hasActiveSession());
      
      // Fetch updated balance if we have an address
      if (publicAddress) {
        fetchWalletBalance(publicAddress);
      }
    }
  };

  // Lock the wallet (end the session)
  const lockWallet = () => {
    endSession();
    setIsSessionActive(false);
  };

  // Clear the wallet (remove from localStorage)
  const clearWallet = () => {
    clearWalletData();
    setIsWalletStored(false);
    setIsSessionActive(false);
    setEncryptedWallet(null);
    setEncryptedSeedPhrase(null);
  };

  return (
    <WalletContext.Provider value={{
      isWalletStored,
      isSessionActive,
      publicAddress,
      securityTier,
      walletBalance,
      reloadWalletData,
      lockWallet,
      clearWallet,
      encryptedWallet,
      encryptedSeedPhrase,
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletContext;