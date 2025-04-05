'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, Button, LoadingSpinner, ErrorBoundary, Badge } from '@/components/ui';
import { useWallet } from '@/context/WalletContext';
import SecurityTierIndicator from '@/components/wallet/SecurityTierIndicator';
import UnlockModal from '@/components/wallet/UnlockModal';
import ExportToMobileModal from '@/components/wallet/ExportToMobileModal';
import TransactionModal from '@/components/wallet/TransactionModal';
import WalletCard from '@/components/wallet/WalletCard';
import { isValidAddress } from '@/lib/wallet/transactionService';

interface WalletData {
  balance: number;
  address: string;
  txCount: number;
}

interface Transaction {
  txid: string;
  amount: number;
  confirmations: number;
  timestamp: Date;
  type: 'sent' | 'received';
}

function WalletContent() {
  const { data: session, status } = useSession();
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // State for wallet unlock modal
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  
  // State for export to mobile modal
  const [showExportModal, setShowExportModal] = useState(false);
  
  // State for transaction form and modal
  const [recipientAddress, setRecipientAddress] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [transactionNote, setTransactionNote] = useState('');
  const [addressError, setAddressError] = useState('');
  const [amountError, setAmountError] = useState('');
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  
  // Get wallet context
  const { 
    isWalletStored, 
    isSessionActive, 
    publicAddress, 
    securityTier, 
    walletBalance,
    encryptedWallet,
    encryptedSeedPhrase,
    reloadWalletData: reloadWalletContext,
    lockWallet: endSession
  } = useWallet();

  useEffect(() => {
    if (status === 'authenticated') {
      fetchWalletData();
      fetchTransactions();
    } else if (status === 'unauthenticated') {
      setIsLoading(false);
    }
  }, [status, isSessionActive, publicAddress]);

  // Set wallet data from context when available
  useEffect(() => {
    if (publicAddress && walletBalance !== null) {
      setWalletData({
        balance: walletBalance,
        address: publicAddress,
        txCount: transactions.length
      });
    }
  }, [publicAddress, walletBalance, transactions.length]);

  const fetchWalletData = async () => {
    try {
      const response = await fetch('/api/wallet/balance');
      if (response.ok) {
        const data = await response.json();
        setWalletData(data);
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      // Mocked transactions for now
      setTransactions([
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
      ]);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };
  
  // Handle sensitive operations that require wallet unlock
  const handleSensitiveOperation = (action: string) => {
    if (!isSessionActive) {
      setShowUnlockModal(true);
      setPendingAction(action);
    } else {
      // Session is active, proceed with operation
      executePendingAction(action);
    }
  };
  
  // Execute operation after wallet is unlocked
  const executePendingAction = (action: string) => {
    switch (action) {
      case 'send':
        setActiveTab('send');
        break;
      case 'export':
        setShowExportModal(true);
        break;
      case 'sendTransaction':
        setShowTransactionModal(true);
        break;
      default:
        console.log('Unknown action:', action);
    }
    
    // Reset pending action
    setPendingAction(null);
  };
  
  // Handle wallet unlock
  const handleWalletUnlocked = (decryptedWallet: any) => {
    // Reload wallet data
    reloadWalletContext();
    
    // Execute pending action if there is one
    if (pendingAction) {
      executePendingAction(pendingAction);
    }
  };
  
  // Validate transaction form
  const validateTransactionForm = () => {
    let isValid = true;
    setAddressError('');
    setAmountError('');
    
    // Validate address
    if (!recipientAddress) {
      setAddressError('Recipient address is required');
      isValid = false;
    } else if (!isValidAddress(recipientAddress)) {
      setAddressError('Invalid Marscoin address');
      isValid = false;
    }
    
    // Validate amount
    if (!sendAmount) {
      setAmountError('Amount is required');
      isValid = false;
    } else {
      const amount = parseFloat(sendAmount);
      if (isNaN(amount) || amount <= 0) {
        setAmountError('Amount must be greater than zero');
        isValid = false;
      } else if (walletData && amount > walletData.balance) {
        setAmountError('Insufficient balance');
        isValid = false;
      }
    }
    
    return isValid;
  };
  
  // Handle transaction form submission
  const handleSendFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateTransactionForm()) {
      // If form is valid, prompt for wallet password
      handleSensitiveOperation('sendTransaction');
    }
  };
  
  // Handle transaction completion
  const handleTransactionComplete = (txid: string) => {
    setShowTransactionModal(false);
    
    // Reset form
    setRecipientAddress('');
    setSendAmount('');
    setTransactionNote('');
    
    // Refresh wallet data
    fetchWalletData();
    fetchTransactions();
    
    // Show success message or notification
    alert(`Transaction submitted! Transaction ID: ${txid}`);
    
    // In a real app, you would use a toast notification
    // and redirect to the transaction tab
    setActiveTab('transactions');
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-[60vh] max-w-md mx-auto p-8 flex flex-col items-center justify-center">
        <Card className="w-full text-center p-8">
          <div className="mx-auto h-16 w-16 rounded-full bg-mars-red flex items-center justify-center text-white mb-6">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Wallet Access Required
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            You need to sign in to access your Martian wallet and manage your digital assets.
          </p>
          <Button 
            variant="primary"
            href="/auth/sign-in?callbackUrl=/wallet"
            fullWidth
          >
            Sign In to Access Wallet
          </Button>
        </Card>
      </div>
    );
  }

  // Check if user has no wallet
  const hasNoWallet = !session?.user?.publicAddress && !walletData?.address;

  if (hasNoWallet) {
    return (
      <div className="min-h-[60vh] max-w-md mx-auto p-8 flex flex-col items-center justify-center">
        <Card className="w-full text-center p-8">
          <div className="mx-auto h-16 w-16 rounded-full bg-mars-red/10 flex items-center justify-center text-mars-red mb-6">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            No Wallet Found
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            You don&apos;t have an active wallet connected to your account yet. 
            Create a new wallet or restore an existing one to continue.
          </p>
          <div className="flex flex-col sm:flex-row sm:justify-center gap-3">
            <Button 
              variant="primary"
              href="/wallet/create"
            >
              Create New Wallet
            </Button>
            <Button 
              variant="outline"
              href="/wallet/restore"
            >
              Restore Wallet
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Martian Wallet</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Manage your Marscoin and digital assets on the Martian blockchain.
        </p>

        {/* Wallet Dashboard Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-mars-red text-mars-red'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('send')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'send'
                  ? 'border-mars-red text-mars-red'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Send
            </button>
            <button
              onClick={() => setActiveTab('receive')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'receive'
                  ? 'border-mars-red text-mars-red'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Receive
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'transactions'
                  ? 'border-mars-red text-mars-red'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Transactions
            </button>
          </nav>
        </div>

        {/* Wallet Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2">
              {/* Security tier indicator */}
              <SecurityTierIndicator 
                securityTier={securityTier}
                className="mb-6"
              />
              
              {/* Balance card with Phobos-inspired design */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <WalletCard
                  title="Available Balance"
                  value={`${walletData?.balance || 0} MARS`}
                  icon={
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  trend="up"
                  trendValue="3.5% this week"
                  onClick={() => fetchWalletData()}
                />
                
                <WalletCard
                  title="Transaction Count"
                  value={walletData?.txCount || 0}
                  icon={
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  }
                />
              </div>
              
              {/* Wallet address with copy button */}
              <Card className="mb-6">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Wallet Details</h2>
                    <Button
                      variant="ghost"
                      onClick={fetchWalletData}
                      leftIcon={
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      }
                    >
                      Refresh
                    </Button>
                  </div>
                  
                  <div className="flex flex-col mb-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Wallet Address</span>
                    <div className="flex items-center">
                      <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 break-all flex-grow">
                        {walletData?.address || session?.user?.publicAddress || 'No wallet connected'}
                      </span>
                      <button 
                        className="ml-2 p-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded"
                        onClick={() => {
                          if (walletData?.address) {
                            navigator.clipboard.writeText(walletData.address);
                            // In a real app, show a toast notification
                            alert('Address copied to clipboard');
                          }
                        }}
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {isWalletStored && encryptedSeedPhrase && (
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSensitiveOperation('export')}
                        leftIcon={
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        }
                      >
                        Export to Mobile Wallet
                      </Button>
                    </div>
                  )}
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
                  {transactions.length > 0 ? (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {transactions.slice(0, 3).map((tx) => (
                        <div key={tx.txid} className="py-3 flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
                              tx.type === 'received' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {tx.type === 'received' ? '↓' : '↑'}
                            </div>
                            <div>
                              <div className="text-sm font-medium">
                                {tx.type === 'received' ? 'Received' : 'Sent'} MARS
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(tx.timestamp).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className={`text-sm font-medium ${
                            tx.type === 'received' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            {tx.type === 'received' ? '+' : '-'}{Math.abs(tx.amount)} MARS
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-gray-500 dark:text-gray-400">
                      <p>No transactions found.</p>
                    </div>
                  )}
                  {transactions.length > 3 && (
                    <div className="mt-4 text-right">
                      <Button
                        variant="ghost"
                        onClick={() => setActiveTab('transactions')}
                      >
                        View all transactions →
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            <div className="col-span-1">
              <Card className="mb-6">
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                  <div className="flex flex-col space-y-2">
                    <Button 
                      variant="primary"
                      onClick={() => handleSensitiveOperation('send')} 
                      fullWidth
                      leftIcon={
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      }
                    >
                      Send MARS
                    </Button>
                    <Button 
                      variant="secondary"
                      onClick={() => setActiveTab('receive')}
                      fullWidth
                      leftIcon={
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      }
                    >
                      Receive MARS
                    </Button>
                    {isSessionActive && (
                      <Button 
                        variant="outline"
                        onClick={() => endSession()}
                        fullWidth
                        leftIcon={
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        }
                      >
                        Lock Wallet
                      </Button>
                    )}
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Citizenship Status</h2>
                  <div className="mb-4">
                    {session?.user?.citizenStatus === 'citizen' ? (
                      <div className="flex items-start">
                        <Badge variant="success" rounded>Verified Citizen</Badge>
                        <p className="text-sm mt-2">You have full voting rights in the Martian Republic.</p>
                      </div>
                    ) : session?.user?.citizenStatus === 'applicant' ? (
                      <div className="flex items-start">
                        <Badge variant="warning" rounded>Application Pending</Badge>
                        <p className="text-sm mt-2">Your application is being processed.</p>
                      </div>
                    ) : (
                      <div className="flex items-start">
                        <Badge variant="info" rounded>Newcomer</Badge>
                        <p className="text-sm mt-2">Apply for citizenship to participate in governance.</p>
                      </div>
                    )}
                  </div>
                  {session?.user?.citizenStatus !== 'citizen' && (
                    <Button
                      variant="outline"
                      href="/citizen/apply"
                      size="sm"
                    >
                      Apply for citizenship →
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Send Tab */}
        {activeTab === 'send' && (
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Send MARS</h2>
              
              <form className="space-y-6" onSubmit={handleSendFormSubmit}>
                <div>
                  <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Recipient Address
                  </label>
                  <input
                    type="text"
                    id="recipient"
                    className={`w-full px-3 py-2 border ${addressError ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:text-white`}
                    placeholder="Enter MARS address"
                    value={recipientAddress}
                    onChange={(e) => {
                      setRecipientAddress(e.target.value);
                      if (addressError) setAddressError('');
                    }}
                    required
                  />
                  {addressError && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {addressError}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Amount (MARS)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="number"
                      id="amount"
                      className={`w-full px-3 py-2 border ${amountError ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:text-white`}
                      placeholder="0.00"
                      min="0.001"
                      step="0.001"
                      value={sendAmount}
                      onChange={(e) => {
                        setSendAmount(e.target.value);
                        if (amountError) setAmountError('');
                      }}
                      required
                    />
                  </div>
                  {amountError ? (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {amountError}
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Available balance: {walletData?.balance || 0} MARS
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="note" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Note (optional)
                  </label>
                  <input
                    type="text"
                    id="note"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    placeholder="Add a note to this transaction"
                    value={transactionNote}
                    onChange={(e) => setTransactionNote(e.target.value)}
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    This note will be stored on the blockchain
                  </p>
                </div>

                <div className="bg-[#1c0d10]/10 dark:bg-[#2d1216]/20 p-4 rounded-lg border border-mars-red/20">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg className="h-5 w-5 text-mars-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">Transaction Security</h3>
                      <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                        <p>You'll need to enter your wallet password to confirm this transaction.</p>
                        {securityTier === 'basic' && (
                          <p className="mt-1 text-amber-700 dark:text-amber-400">
                            Consider using the Martian mobile app for enhanced security.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                >
                  Continue to Confirm
                </Button>
              </form>
            </div>
          </Card>
        )}

        {/* Receive Tab */}
        {activeTab === 'receive' && (
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Receive MARS</h2>
              
              <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg mb-6">
                <h3 className="text-lg font-medium mb-4">Your Wallet Address</h3>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-4 break-all font-mono text-sm">
                  {walletData?.address || session?.user?.publicAddress || 'Wallet address not available'}
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="secondary"
                    size="sm"
                    leftIcon={
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    }
                  >
                    Copy Address
                  </Button>
                  <Button 
                    variant="secondary"
                    size="sm"
                    leftIcon={
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2m0 0v5m0-5h-2m2 0h2M4 12h12" />
                      </svg>
                    }
                  >
                    Show QR Code
                  </Button>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-md border border-yellow-100 dark:border-yellow-900/50">
                <h3 className="text-amber-800 dark:text-amber-500 font-medium mb-2">Important</h3>
                <ul className="list-disc pl-5 text-sm text-amber-700 dark:text-amber-400 space-y-1">
                  <li>Only send MARS or MARS-based tokens to this address</li>
                  <li>Sending any other cryptocurrency may result in permanent loss</li>
                  <li>Verify the address before sending funds</li>
                </ul>
              </div>
            </div>
          </Card>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <Card>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Transaction History</h2>
                <Button
                  variant="ghost"
                  onClick={fetchTransactions}
                  leftIcon={
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  }
                >
                  Refresh
                </Button>
              </div>
              
              {transactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Confirmations
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Transaction ID
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {transactions.map((tx) => (
                        <tr key={tx.txid}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge 
                              variant={tx.type === 'received' ? 'success' : 'danger'} 
                              rounded
                            >
                              {tx.type === 'received' ? 'Received' : 'Sent'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(tx.timestamp).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={tx.type === 'received' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                              {tx.type === 'received' ? '+' : '-'}{Math.abs(tx.amount)} MARS
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {tx.confirmations} {tx.confirmations === 1 ? 'confirmation' : 'confirmations'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500 dark:text-gray-400">
                            <a 
                              href={`https://marscoin.example/tx/${tx.txid}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:text-mars-red"
                            >
                              {tx.txid.substring(0, 8)}...{tx.txid.substring(tx.txid.length - 8)}
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-6 text-center text-gray-500 dark:text-gray-400">
                  <p>No transactions found.</p>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
      
      {/* Wallet Unlock Modal */}
      {showUnlockModal && encryptedWallet && (
        <UnlockModal
          isOpen={showUnlockModal}
          onClose={() => {
            setShowUnlockModal(false);
            setPendingAction(null);
          }}
          onUnlock={handleWalletUnlocked}
          encryptedWallet={encryptedWallet}
        />
      )}
      
      {/* Export to Mobile Modal */}
      {showExportModal && encryptedWallet && encryptedSeedPhrase && (
        <ExportToMobileModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          encryptedWallet={encryptedWallet}
          encryptedSeedPhrase={encryptedSeedPhrase}
        />
      )}
      
      {/* Transaction Modal */}
      {showTransactionModal && encryptedWallet && publicAddress && (
        <TransactionModal
          isOpen={showTransactionModal}
          onClose={() => setShowTransactionModal(false)}
          encryptedWallet={encryptedWallet}
          publicAddress={publicAddress}
          recipient={recipientAddress}
          amount={parseFloat(sendAmount)}
          note={transactionNote || undefined}
          onComplete={handleTransactionComplete}
        />
      )}
    </div>
  );
}

export default function WalletPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={
        <div className="min-h-screen flex justify-center items-center">
          <LoadingSpinner size="lg" color="primary" />
        </div>
      }>
        <WalletContent />
      </Suspense>
    </ErrorBoundary>
  );
}