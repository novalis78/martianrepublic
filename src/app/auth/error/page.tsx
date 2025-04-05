'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, Button } from '@/components/ui';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  // Map error codes to user-friendly messages
  const getErrorMessage = () => {
    switch (error) {
      case 'CredentialsSignin':
        return 'Invalid email or password. Please try again.';
      case 'OAuthAccountNotLinked':
        return 'This account is already linked to another sign-in method.';
      case 'OAuthSignInError':
        return 'There was an error signing in with this provider. Please try again.';
      case 'OAuthCallback':
        return 'There was an error during the authentication process. Please try again.';
      case 'SessionRequired':
        return 'You need to be signed in to access this page.';
      case 'AccessDenied':
        return 'You do not have permission to access this resource.';
      default:
        return 'An authentication error occurred. Please try again.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-mars-light to-white dark:from-mars-dark dark:to-black py-12 px-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-mars-red/10 flex items-center justify-center text-mars-red">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Authentication Error
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            We encountered a problem while signing you in
          </p>
        </div>
        
        <Card className="p-6">
          <div className="mb-6 text-center">
            <p className="text-red-600 dark:text-red-400">
              {getErrorMessage()}
            </p>
          </div>
          
          <div className="flex flex-col space-y-3">
            <Button 
              variant="primary" 
              href="/auth/sign-in"
              fullWidth
            >
              Go to Sign In
            </Button>
            
            <Button 
              variant="outline" 
              href="/"
              fullWidth
            >
              Return to Homepage
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}