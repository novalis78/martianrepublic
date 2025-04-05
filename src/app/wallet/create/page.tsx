'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, Button, LoadingSpinner, ErrorBoundary } from '@/components/ui';

function WalletCreateContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [seed, setSeed] = useState('');
  const [seedConfirmed, setSeedConfirmed] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [seedWords, setSeedWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [wordCount, setWordCount] = useState<number>(12);

  // Check if user is authenticated
  if (status === 'unauthenticated') {
    router.push('/auth/sign-in?callbackUrl=/wallet/create');
    return null;
  }

  // Generate a new seed phrase with enhanced entropy
  const generateSeed = async () => {
    try {
      // Fetch a new seed phrase from our API with specified word count
      const response = await fetch('/api/wallet/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wordCount }),
      });
      
      if (!response.ok) {
        // If the API fails, show an error
        setError('Failed to generate secure seed phrase from server. Using fallback method.');
        
        // For demo purposes only - in production you'd want proper entropy
        if (wordCount === 24) {
          return 'abandon ability able about above absent absorb abstract absurd abuse access accident account accuse achieve acid acoustic acquire across act action actor actress actual adapt add addict address adjust admit adult advance advice aerobic affair afford afraid again age agent agree ahead aim air airport aisle alarm album alcohol alert';
        }
        return 'abandon ability able about above absent absorb abstract absurd abuse access accident';
      }
      
      const data = await response.json();
      return data.seedPhrase;
    } catch (error) {
      setError('Failed to generate seed phrase');
      console.error('Seed generation error:', error);
      
      // Fallback seed
      if (wordCount === 24) {
        return 'abandon ability able about above absent absorb abstract absurd abuse access accident account accuse achieve acid acoustic acquire across act action actor actress actual adapt add addict address adjust admit adult advance advice aerobic affair afford afraid again age agent agree ahead aim air airport aisle alarm album alcohol alert';
      }
      return 'abandon ability able about above absent absorb abstract absurd abuse access accident';
    }
  };

  // Handle seed phrase confirmation
  const handleSeedConfirmation = () => {
    if (selectedWords.join(' ') === seed) {
      setSeedConfirmed(true);
      setStep(3);
    } else {
      setError('The seed phrase does not match. Please try again.');
    }
  };

  // Handle wallet creation
  const handleCreateWallet = async () => {
    if (password !== passwordConfirm) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!seedConfirmed || !seed) {
      setError('Seed phrase not confirmed');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Call the API to create the wallet
      const response = await fetch('/api/wallet/operations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operation: 'create',
          seedPhrase: seed,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create wallet');
      }
      
      // Redirect to wallet page
      router.push('/wallet?success=wallet_created');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create wallet. Please try again.');
      }
      console.error('Wallet creation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize seed phrase when stepping to step 2
  const goToBackupStep = async () => {
    setIsLoading(true);
    
    try {
      const newSeed = await generateSeed();
      setSeed(newSeed);
      
      // Shuffle the seed words for verification step
      const words = newSeed.split(' ');
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      setSeedWords(shuffled);
      setSelectedWords([]);
      
      setStep(2);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to generate seed phrase');
      }
      console.error('Error generating seed phrase:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Create New Wallet
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Set up your Martian Republic wallet to manage your digital assets
          </p>
        </div>

        {/* Step indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className={`flex items-center justify-center h-10 w-10 rounded-full ${
              step >= 1 ? 'bg-mars-red text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              1
            </div>
            <div className={`flex-1 h-1 ${
              step > 1 ? 'bg-mars-red' : 'bg-gray-200 dark:bg-gray-700'
            }`}></div>
            <div className={`flex items-center justify-center h-10 w-10 rounded-full ${
              step >= 2 ? 'bg-mars-red text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              2
            </div>
            <div className={`flex-1 h-1 ${
              step > 2 ? 'bg-mars-red' : 'bg-gray-200 dark:bg-gray-700'
            }`}></div>
            <div className={`flex items-center justify-center h-10 w-10 rounded-full ${
              step >= 3 ? 'bg-mars-red text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              3
            </div>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <div className="text-center w-20">Information</div>
            <div className="text-center w-20">Backup</div>
            <div className="text-center w-20">Secure</div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded">
            {error}
          </div>
        )}

        {/* Step 1: Information */}
        {step === 1 && (
          <Card>
            <div className="p-6">
              <div className="mb-6">
                <div className="mb-8 flex justify-center">
                  <div className="h-24 w-24 rounded-full bg-mars-red/10 flex items-center justify-center text-mars-red">
                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Important Information</h2>
                
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <p>
                    You are about to create a new Martian wallet. This wallet will allow you to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Store and manage your MARS tokens</li>
                    <li>Participate in Martian governance</li>
                    <li>Access Martian Republic services</li>
                  </ul>
                  
                  <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-md border border-yellow-100 dark:border-yellow-900/50 my-6">
                    <h3 className="text-amber-800 dark:text-amber-500 font-medium mb-2">Important Security Information</h3>
                    <ul className="list-disc pl-5 text-sm text-amber-700 dark:text-amber-400 space-y-1">
                      <li>In the next step, you will receive a <strong>recovery seed phrase</strong></li>
                      <li>This phrase is the <strong>ONLY way</strong> to recover your wallet if you lose access</li>
                      <li>Write it down and store it in a secure location</li>
                      <li>Never share your seed phrase with anyone</li>
                      <li>The Martian Republic will never ask for your seed phrase</li>
                    </ul>
                  </div>
                  
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Security Level
                    </label>
                    <div className="flex items-center space-x-4">
                      <div 
                        className={`relative flex items-center justify-center px-4 py-2 rounded-md cursor-pointer ${
                          wordCount === 12 
                            ? 'bg-mars-red text-white' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => setWordCount(12)}
                      >
                        <div className="flex flex-col items-center">
                          <span className="font-medium">12 Words</span>
                          <span className="text-xs mt-1 opacity-80">128-bit Security</span>
                        </div>
                      </div>
                      
                      <div 
                        className={`relative flex items-center justify-center px-4 py-2 rounded-md cursor-pointer ${
                          wordCount === 24 
                            ? 'bg-mars-red text-white' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => setWordCount(24)}
                      >
                        <div className="flex flex-col items-center">
                          <span className="font-medium">24 Words</span>
                          <span className="text-xs mt-1 opacity-80">256-bit Security</span>
                        </div>
                        {wordCount !== 24 && (
                          <span className="absolute top-0 right-0 transform -translate-y-1/2 translate-x-1/2 flex h-5 w-5">
                            <span className="relative inline-flex rounded-full h-5 w-5 bg-green-500 text-white text-xs font-bold items-center justify-center">
                              ✓
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      A 24-word recovery phrase provides maximum security for high-value wallets.
                    </p>
                  </div>
                </div>
              </div>
              
              <Button
                variant="primary"
                onClick={goToBackupStep}
                fullWidth
              >
                Continue to Backup
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Backup seed phrase */}
        {step === 2 && (
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Backup Your Seed Phrase
              </h2>
              
              <div className="mb-6 text-gray-600 dark:text-gray-300">
                <p className="mb-4">
                  Write down these 12 words in order and keep them in a safe place. 
                  Anyone with this seed phrase can access your wallet.
                </p>
                
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
                  <div className="grid grid-cols-3 gap-2">
                    {seed.split(' ').map((word, index) => (
                      <div key={index} className="flex items-center">
                        <span className="text-gray-500 w-6 text-right mr-2">{index + 1}.</span>
                        <span className="font-mono bg-white dark:bg-gray-700 px-2 py-1 rounded text-gray-900 dark:text-white">{word}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-md border border-yellow-100 dark:border-yellow-900/50">
                  <p className="text-amber-800 dark:text-amber-500 font-medium">
                    Verify your recovery phrase by selecting the words in the correct order.
                  </p>
                </div>
                
                {/* Selected words area */}
                <div className="mt-6 mb-3">
                  <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 min-h-16 flex flex-wrap gap-2">
                    {selectedWords.map((word, index) => (
                      <div 
                        key={index}
                        className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 flex items-center"
                        onClick={() => {
                          setSelectedWords(selectedWords.filter((_, i) => i !== index));
                          setSeedWords([...seedWords, word]);
                        }}
                      >
                        <span>{word}</span>
                        <svg className="h-4 w-4 ml-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Word selection area */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {seedWords.map((word, index) => (
                    <button
                      key={index}
                      className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-gray-900 dark:text-white"
                      onClick={() => {
                        setSelectedWords([...selectedWords, word]);
                        setSeedWords(seedWords.filter((_, i) => i !== index));
                      }}
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSeedConfirmation}
                  disabled={selectedWords.length !== 12}
                  fullWidth
                >
                  Confirm Backup
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Step 3: Set password */}
        {step === 3 && (
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Secure Your Wallet
              </h2>
              
              <div className="space-y-6 mb-6">
                <p className="text-gray-600 dark:text-gray-300">
                  Set a strong password to encrypt your wallet. You will need this password to access your wallet.
                </p>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Wallet Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    placeholder="Enter password"
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
                
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-md border border-blue-100 dark:border-blue-900/50">
                  <h3 className="text-blue-800 dark:text-blue-400 font-medium mb-2">Password Tips</h3>
                  <ul className="list-disc pl-5 text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>Use a combination of letters, numbers, and special characters</li>
                    <li>Avoid using easily guessable information</li>
                    <li>Don&apos;t reuse passwords from other websites</li>
                    <li>Consider using a password manager</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={handleCreateWallet}
                  disabled={isLoading || !password || !passwordConfirm || password !== passwordConfirm || password.length < 8}
                  isLoading={isLoading}
                  fullWidth
                >
                  {isLoading ? 'Creating Wallet...' : 'Create Wallet'}
                </Button>
              </div>
            </div>
          </Card>
        )}
        
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Already have a wallet?{' '}
            <Button 
              variant="ghost" 
              href="/wallet/restore"
              size="sm"
            >
              Restore Existing Wallet
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function WalletCreatePage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={
        <div className="min-h-screen flex justify-center items-center">
          <LoadingSpinner size="lg" color="primary" />
        </div>
      }>
        <WalletCreateContent />
      </Suspense>
    </ErrorBoundary>
  );
}