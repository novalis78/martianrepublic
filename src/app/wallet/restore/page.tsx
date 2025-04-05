'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, Button, LoadingSpinner, ErrorBoundary } from '@/components/ui';

function WalletRestoreContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [seedPhrase, setSeedPhrase] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  // Check if user is authenticated
  if (status === 'unauthenticated') {
    router.push('/auth/sign-in?callbackUrl=/wallet/restore');
    return null;
  }

  const handleRestoreWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Client-side validations
      if (!seedPhrase.trim()) {
        throw new Error('Seed phrase is required');
      }

      // Basic validation - check if it's 12 or 24 words
      const words = seedPhrase.trim().split(/\s+/);
      if (words.length !== 12 && words.length !== 24) {
        throw new Error('Seed phrase must be 12 or 24 words');
      }

      if (!password) {
        throw new Error('Password is required');
      }

      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }

      if (password !== passwordConfirm) {
        throw new Error('Passwords do not match');
      }

      // First verify the seed phrase is valid via the API
      const verifyResponse = await fetch('/api/wallet/operations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operation: 'verify',
          seedPhrase: seedPhrase.trim(),
        }),
      });

      const verifyData = await verifyResponse.json();
      
      if (!verifyResponse.ok) {
        throw new Error(verifyData.error || 'Error verifying seed phrase');
      }
      
      if (!verifyData.isValid) {
        throw new Error('Invalid seed phrase. Please check for typos.');
      }

      // Now attempt to restore the wallet
      const response = await fetch('/api/wallet/operations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operation: 'restore',
          seedPhrase: seedPhrase.trim(),
          password: password,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to restore wallet');
      }
      
      // Redirect to wallet page
      router.push('/wallet?success=wallet_restored');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to restore wallet. Please try again.');
      }
      console.error('Wallet restoration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Restore Existing Wallet
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Recover your Martian Republic wallet using your seed phrase
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded">
            {error}
          </div>
        )}

        <Card>
          <form className="p-6" onSubmit={handleRestoreWallet}>
            <div className="space-y-6 mb-6">
              <div>
                <label htmlFor="seedPhrase" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Recovery Seed Phrase
                </label>
                <textarea
                  id="seedPhrase"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  placeholder="Enter your 12 or 24 word seed phrase, separated by spaces"
                  value={seedPhrase}
                  onChange={(e) => setSeedPhrase(e.target.value)}
                  rows={4}
                  required
                ></textarea>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Enter all words in the correct order, separated by spaces
                </p>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-md border border-yellow-100 dark:border-yellow-900/50">
                <h3 className="text-amber-800 dark:text-amber-500 font-medium mb-2">Security Warning</h3>
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  Never share your recovery seed phrase with anyone. The Martian Republic will never ask for your seed phrase.
                </p>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Wallet Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  placeholder="Create new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Password must be at least 8 characters
                </p>
              </div>
              
              <div>
                <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="passwordConfirm"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  placeholder="Confirm password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  minLength={8}
                  required
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                href="/wallet"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                disabled={isLoading}
                fullWidth
              >
                {isLoading ? 'Restoring Wallet...' : 'Restore Wallet'}
              </Button>
            </div>
          </form>
        </Card>
        
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Don&apos;t have a wallet yet?{' '}
            <Button 
              variant="ghost" 
              href="/wallet/create"
              size="sm"
            >
              Create New Wallet
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function WalletRestorePage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={
        <div className="min-h-screen flex justify-center items-center">
          <LoadingSpinner size="lg" color="primary" />
        </div>
      }>
        <WalletRestoreContent />
      </Suspense>
    </ErrorBoundary>
  );
}