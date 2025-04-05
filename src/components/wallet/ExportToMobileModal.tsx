'use client';

import React, { useState } from 'react';
import { decryptWalletData } from '@/lib/wallet/secureStorage';

interface ExportToMobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  encryptedWallet: string;
  encryptedSeedPhrase: string;
}

const ExportToMobileModal: React.FC<ExportToMobileModalProps> = ({
  isOpen,
  onClose,
  encryptedWallet,
  encryptedSeedPhrase,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState('');
  const [showQR, setShowQR] = useState(false);
  
  // QR code data to be passed to the mobile app
  const [qrData, setQrData] = useState('');

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Attempt to decrypt the seed phrase
      const decryptedSeedPhrase = decryptWalletData(encryptedSeedPhrase, password);
      
      // If successful, show the QR code with the seed phrase
      setSeedPhrase(decryptedSeedPhrase);
      
      // Create data for QR code (in production, you might want to encrypt this or use a more secure method)
      const exportData = {
        type: 'martian_wallet_import',
        seedPhrase: decryptedSeedPhrase,
        timestamp: Date.now(),
      };
      
      setQrData(JSON.stringify(exportData));
      setShowQR(true);
      setPassword('');
    } catch (err) {
      setError('Incorrect password. Please try again.');
      console.error('Wallet export error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetModal = () => {
    setPassword('');
    setSeedPhrase('');
    setShowQR(false);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {showQR ? 'Export to Mobile Wallet' : 'Verify Your Identity'}
          </h2>
          <button
            onClick={resetModal}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {!showQR ? (
          <>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Enter your wallet password to export your wallet to the Martian mobile app
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
                  onClick={resetModal}
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
                      Verifying...
                    </span>
                  ) : (
                    'Continue'
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="mb-4">
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Scan this QR code with the Martian mobile wallet app to import your wallet
              </p>
              
              {/* In a real implementation, this would be a proper QR code component */}
              <div className="bg-white p-4 mx-auto w-64 h-64 flex items-center justify-center border-2 border-gray-300 rounded-lg">
                <div className="text-sm text-gray-500 text-center">
                  {/* This would be replaced with an actual QR code */}
                  [QR Code Placeholder]
                  <br />
                  Containing your seed phrase
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-md border border-yellow-100 dark:border-yellow-900/50 text-left mb-4">
              <h3 className="text-amber-800 dark:text-amber-500 font-medium mb-2">Security Warning</h3>
              <ul className="list-disc pl-5 text-sm text-amber-700 dark:text-amber-400 space-y-1">
                <li>Make sure no one else can see this QR code</li>
                <li>Only scan with the official Martian wallet app</li>
                <li>This QR code contains your private seed phrase</li>
              </ul>
            </div>
            
            <div className="flex flex-col space-y-3">
              <button
                type="button"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => {
                  // In a real app, this would deep link to app store if not installed
                  window.open('https://martianapp.example/download', '_blank');
                }}
              >
                Download Martian Mobile App
              </button>
              
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                onClick={resetModal}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportToMobileModal;