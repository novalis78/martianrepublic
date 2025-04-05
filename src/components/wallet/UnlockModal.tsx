'use client';

import React, { useState } from 'react';
import { decryptWalletData, startWalletSession } from '@/lib/wallet/secureStorage';

interface UnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: (decryptedWallet: any) => void;
  encryptedWallet: string;
}

const UnlockModal: React.FC<UnlockModalProps> = ({
  isOpen,
  onClose,
  onUnlock,
  encryptedWallet,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Attempt to decrypt the wallet
      const decryptedWalletString = decryptWalletData(encryptedWallet, password);
      const decryptedWallet = JSON.parse(decryptedWalletString);
      
      // If decryption succeeds, start a new session
      startWalletSession(decryptedWallet.address);
      
      // Pass the decrypted wallet to the parent component
      onUnlock(decryptedWallet);
      
      // Reset state
      setPassword('');
      onClose();
    } catch (err) {
      setError('Incorrect password. Please try again.');
      console.error('Wallet unlock error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Wallet Unlock Required</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Enter your wallet password to authorize this operation
        </p>
        
        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-3 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleUnlock}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Wallet Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-mars-red hover:bg-mars-red/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mars-red"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Unlocking...
                </span>
              ) : (
                'Unlock Wallet'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UnlockModal;