'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/wallet/dashboard';
  const error = searchParams.get('error');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.push(callbackUrl);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-mars-light to-white dark:from-mars-dark dark:to-black py-12 px-6">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-6">
          <div className="mx-auto w-20 h-20 rounded-full bg-mars-red flex items-center justify-center text-white text-2xl font-bold">
            MR
          </div>
        </div>
        <h2 className="text-center text-3xl font-bold tracking-tight text-mars-red">
          Sign in to Martian Republic
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Your gateway to Martian governance
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-mars-dark py-8 px-6 shadow rounded-lg sm:px-10">
          {(error || formError) && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-3 rounded">
              {error === 'CredentialsSignin' ? 'Invalid email or password' : formError || error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-mars-red focus:ring-mars-red dark:bg-gray-800 dark:text-white sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-mars-red focus:ring-mars-red dark:bg-gray-800 dark:text-white sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-mars-red focus:ring-mars-red"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link href="/auth/forgot-password" className="font-medium text-mars-red hover:text-mars-red/80">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-mars-red hover:bg-mars-red/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mars-red"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-mars-dark text-gray-500">New to Mars?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link 
                href="/auth/sign-up"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-mars-red bg-white dark:bg-transparent border-mars-red hover:bg-red-50 dark:hover:bg-mars-dark/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mars-red"
              >
                Sign up for the Martian Republic
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mars-red"></div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}