'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

function SignUpContent() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    try {
      // Send registration request
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullname: formData.fullname,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Show success message
      setSuccessMessage('Account created successfully! Redirecting to login...');
      
      // Redirect to login page after a delay
      setTimeout(() => {
        router.push('/auth/sign-in?success=Account+created+successfully');
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
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
          Join the Martian Republic
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Begin your journey as a Martian citizen
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-mars-dark py-8 px-6 shadow rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-3 rounded">
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="mb-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 p-3 rounded">
              {successMessage}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full name
              </label>
              <div className="mt-1">
                <input
                  id="fullname"
                  name="fullname"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.fullname}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-mars-red focus:ring-mars-red dark:bg-gray-800 dark:text-white sm:text-sm"
                />
              </div>
            </div>

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
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-mars-red focus:ring-mars-red dark:bg-gray-800 dark:text-white sm:text-sm"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Password must be at least 8 characters
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-mars-red focus:ring-mars-red dark:bg-gray-800 dark:text-white sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 rounded border-gray-300 text-mars-red focus:ring-mars-red"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                I agree to the{' '}
                <Link href="/terms" className="font-medium text-mars-red hover:text-mars-red/80">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="font-medium text-mars-red hover:text-mars-red/80">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-mars-red hover:bg-mars-red/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mars-red"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link href="/auth/sign-in" className="font-medium text-mars-red hover:text-mars-red/80">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mars-red"></div>
      </div>
    }>
      <SignUpContent />
    </Suspense>
  );
}