'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui';
import { signAndSendTransaction, formatAmount, estimateFee } from '@/lib/wallet/transactionService';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  encryptedWallet: string;
  publicAddress: string;
  recipient: string;
  amount: number;
  note?: string;
  onComplete: (txid: string) => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  encryptedWallet,
  publicAddress,
  recipient,
  amount,
  note,
  onComplete,
}) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [txid, setTxid] = useState('');

  const fee = estimateFee(amount);
  const total = amount + fee;

  // Handle transaction submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Attempt to sign and send the transaction
      const transaction = await signAndSendTransaction(
        encryptedWallet,
        password,
        recipient,
        amount,
        note
      );

      // Store the transaction ID
      setTxid(transaction.txid);
      setIsSuccess(true);
      
      // Inform parent component
      onComplete(transaction.txid);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Unknown error occurred during transaction';
      
      // Check for specific error types
      if (errorMessage.includes('password')) {
        setError('Incorrect password. Please try again.');
      } else if (errorMessage.includes('balance')) {
        setError('Insufficient balance for this transaction.');
      } else {
        setError(`Transaction failed: ${errorMessage}`);
      }
      
      console.error('Transaction error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // When user closes after success
  const handleSuccessClose = () => {
    setPassword('');
    setIsSuccess(false);
    setTxid('');
    onClose();
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {isSuccess ? 'Transaction Complete' : 'Confirm Transaction'}
          </h2>
          <button
            onClick={isSuccess ? handleSuccessClose : onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isSuccess ? (
          // Success view
          <div>
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <div className="text-center mb-6">
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Transaction Submitted
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Your transaction has been submitted to the Marscoin network and is awaiting confirmation.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-md mb-4">
              <div className="grid grid-cols-3 gap-1 text-sm">
                <div className="text-gray-500 dark:text-gray-400">Amount:</div>
                <div className="col-span-2 font-medium">{formatAmount(amount)}</div>
                
                <div className="text-gray-500 dark:text-gray-400">Fee:</div>
                <div className="col-span-2">{formatAmount(fee)}</div>
                
                <div className="text-gray-500 dark:text-gray-400">Recipient:</div>
                <div className="col-span-2 font-mono text-xs break-all">{recipient}</div>
                
                <div className="text-gray-500 dark:text-gray-400">Transaction ID:</div>
                <div className="col-span-2 font-mono text-xs break-all">{txid}</div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button
                variant="primary"
                onClick={handleSuccessClose}
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          // Confirmation view
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <div className="bg-[#1c0d10]/10 dark:bg-[#2d1216]/30 p-4 rounded-md mb-4">
                <div className="grid grid-cols-3 gap-1 text-sm">
                  <div className="text-gray-500 dark:text-gray-400">From:</div>
                  <div className="col-span-2 font-mono text-xs break-all">{publicAddress}</div>
                  
                  <div className="text-gray-500 dark:text-gray-400">To:</div>
                  <div className="col-span-2 font-mono text-xs break-all">{recipient}</div>
                  
                  <div className="text-gray-500 dark:text-gray-400">Amount:</div>
                  <div className="col-span-2 font-medium">{formatAmount(amount)}</div>
                  
                  <div className="text-gray-500 dark:text-gray-400">Fee:</div>
                  <div className="col-span-2">{formatAmount(fee)}</div>
                  
                  <div className="text-gray-500 dark:text-gray-400">Total:</div>
                  <div className="col-span-2 font-medium">{formatAmount(total)}</div>
                  
                  {note && (
                    <>
                      <div className="text-gray-500 dark:text-gray-400">Note:</div>
                      <div className="col-span-2">{note}</div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded-md border border-yellow-100 dark:border-yellow-900/50 mb-4">
                <p className="text-sm text-amber-800 dark:text-amber-500">
                  Enter your wallet password to authorize this transaction. This action cannot be undone.
                </p>
              </div>
              
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-3 rounded-md mb-4">
                  {error}
                </div>
              )}
              
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
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                disabled={isLoading || !password}
              >
                Confirm & Send
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TransactionModal;