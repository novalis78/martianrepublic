'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

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

export default function WalletPage() {
  const { data: session, status } = useSession();
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (status === 'authenticated') {
      fetchWalletData();
      fetchTransactions();
    } else if (status === 'unauthenticated') {
      setIsLoading(false);
    }
  }, [status]);

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

  if (status === 'loading' || isLoading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mars-red"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-3xl font-bold mb-6 text-center">Martian Wallet Access</h1>
        <p className="mb-6 text-center max-w-md">
          You need to sign in to access your Martian wallet and manage your digital assets.
        </p>
        <Link
          href="/auth/sign-in?callbackUrl=/wallet"
          className="px-4 py-2 bg-mars-red text-white rounded hover:bg-opacity-90"
        >
          Sign In to Access Wallet
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
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
            <div className="bg-white dark:bg-mars-dark rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Balance Overview</h2>
                <button 
                  className="text-mars-red hover:text-mars-red/80"
                  onClick={fetchWalletData}
                >
                  Refresh
                </button>
              </div>
              <div className="flex flex-col">
                <div className="flex flex-col mb-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Available Balance</span>
                  <span className="text-3xl font-bold">{walletData?.balance || 0} MARS</span>
                </div>
                <div className="flex flex-col mb-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Wallet Address</span>
                  <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 break-all">
                    {walletData?.address || 'No wallet connected'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-mars-dark rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
              {transactions.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {transactions.slice(0, 3).map((tx) => (
                    <div key={tx.txid} className="py-3 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
                          tx.type === 'received' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
                        tx.type === 'received' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {tx.type === 'received' ? '+' : '-'}{Math.abs(tx.amount)} MARS
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No transactions found.</p>
              )}
              {transactions.length > 3 && (
                <button
                  onClick={() => setActiveTab('transactions')}
                  className="mt-4 text-sm text-mars-red hover:text-mars-red/80"
                >
                  View all transactions →
                </button>
              )}
            </div>
          </div>

          <div className="col-span-1">
            <div className="bg-white dark:bg-mars-dark rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="flex flex-col space-y-2">
                <button 
                  onClick={() => setActiveTab('send')}
                  className="w-full py-2 px-4 bg-mars-red text-white rounded hover:bg-mars-red/90 flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Send MARS
                </button>
                <button 
                  onClick={() => setActiveTab('receive')}
                  className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  Receive MARS
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-mars-dark rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Citizenship Status</h2>
              <div className="mb-4">
                {session?.user?.citizenStatus === 'citizen' ? (
                  <div className="bg-green-100 text-green-800 p-4 rounded-md">
                    <div className="font-medium">Verified Citizen</div>
                    <p className="text-sm mt-1">You have full voting rights in the Martian Republic.</p>
                  </div>
                ) : session?.user?.citizenStatus === 'applicant' ? (
                  <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md">
                    <div className="font-medium">Citizenship Application Pending</div>
                    <p className="text-sm mt-1">Your application is being processed.</p>
                  </div>
                ) : (
                  <div className="bg-blue-100 text-blue-800 p-4 rounded-md">
                    <div className="font-medium">Newcomer</div>
                    <p className="text-sm mt-1">Apply for citizenship to participate in governance.</p>
                  </div>
                )}
              </div>
              {session?.user?.citizenStatus !== 'citizen' && (
                <Link href="/citizen/apply" className="text-sm text-mars-red hover:text-mars-red/80">
                  Apply for citizenship →
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Send Tab */}
      {activeTab === 'send' && (
        <div className="bg-white dark:bg-mars-dark rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Send MARS</h2>
          
          <form className="space-y-6">
            <div>
              <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Recipient Address
              </label>
              <input
                type="text"
                id="recipient"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700"
                placeholder="Enter MARS address"
              />
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Amount (MARS)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  id="amount"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700"
                  placeholder="0.00"
                  min="0.001"
                  step="0.001"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Available balance: {walletData?.balance || 0} MARS
              </p>
            </div>

            <div>
              <label htmlFor="note" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Note (optional)
              </label>
              <input
                type="text"
                id="note"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700"
                placeholder="Add a note to this transaction"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                This note will be stored on the blockchain
              </p>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 bg-mars-red text-white font-medium rounded-md hover:bg-mars-red/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mars-red"
            >
              Send MARS
            </button>
          </form>
        </div>
      )}

      {/* Receive Tab */}
      {activeTab === 'receive' && (
        <div className="bg-white dark:bg-mars-dark rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Receive MARS</h2>
          
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg mb-6">
            <h3 className="text-lg font-medium mb-4">Your Wallet Address</h3>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-4 break-all font-mono text-sm">
              {walletData?.address || 'Wallet address not available'}
            </div>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 text-sm">
                Copy Address
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 text-sm">
                Show QR Code
              </button>
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
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="bg-white dark:bg-mars-dark rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Transaction History</h2>
            <button 
              className="text-mars-red hover:text-mars-red/80"
              onClick={fetchTransactions}
            >
              Refresh
            </button>
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
                <tbody className="bg-white dark:bg-mars-dark divide-y divide-gray-200 dark:divide-gray-700">
                  {transactions.map((tx) => (
                    <tr key={tx.txid}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tx.type === 'received' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {tx.type === 'received' ? 'Received' : 'Sent'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(tx.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={tx.type === 'received' ? 'text-green-600' : 'text-red-600'}>
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
      )}
    </div>
  );
}