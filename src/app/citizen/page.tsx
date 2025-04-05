'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

interface CitizenshipStatus {
  status: string;
  applicationDate?: Date;
  reviewDate?: Date;
  comments?: string[];
}

export default function CitizenPage() {
  const { data: session, status: authStatus } = useSession();
  const [activeSection, setActiveSection] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [citizenshipStatus, setCitizenshipStatus] = useState<CitizenshipStatus | null>(null);

  useEffect(() => {
    if (authStatus === 'authenticated') {
      // In a real implementation, fetch the full citizenship status
      // For now, we're using the citizenStatus from the session
      setCitizenshipStatus({
        status: session?.user?.citizenStatus || 'newcomer',
        applicationDate: session?.user?.citizenStatus === 'applicant' ? new Date('2025-03-10') : undefined,
      });
      setIsLoading(false);
    } else if (authStatus === 'unauthenticated') {
      setIsLoading(false);
    }
  }, [authStatus, session]);

  if (authStatus === 'loading' || isLoading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mars-red"></div>
      </div>
    );
  }

  if (authStatus === 'unauthenticated') {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-3xl font-bold mb-6 text-center">Martian Citizenship Portal</h1>
        <p className="mb-6 text-center max-w-md">
          Sign in to manage your citizenship status and identity in the Martian Republic.
        </p>
        <Link
          href="/auth/sign-in?callbackUrl=/citizen"
          className="px-4 py-2 bg-mars-red text-white rounded hover:bg-opacity-90"
        >
          Sign In to Access Citizenship Portal
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Martian Citizenship</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Manage your identity and citizenship status in the Martian Republic.
      </p>

      {/* Citizenship Portal Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveSection('overview')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeSection === 'overview'
                ? 'border-mars-red text-mars-red'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveSection('application')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeSection === 'application'
                ? 'border-mars-red text-mars-red'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Application
          </button>
          <button
            onClick={() => setActiveSection('profile')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeSection === 'profile'
                ? 'border-mars-red text-mars-red'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveSection('id-card')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeSection === 'id-card'
                ? 'border-mars-red text-mars-red'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            ID Card
          </button>
        </nav>
      </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-2">
            <div className="bg-white dark:bg-mars-dark rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Citizenship Status</h2>
              <div className="mb-6">
                {citizenshipStatus?.status === 'citizen' ? (
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                      <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <span className="block text-lg font-medium">Full Martian Citizen</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">You have full voting rights in the Martian Republic</span>
                    </div>
                  </div>
                ) : citizenshipStatus?.status === 'applicant' ? (
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
                      <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <span className="block text-lg font-medium">Application Under Review</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Submitted on {citizenshipStatus.applicationDate?.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ) : citizenshipStatus?.status === 'general_public' ? (
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <span className="block text-lg font-medium">General Public Member</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Limited rights in the Martian Republic</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                      <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <span className="block text-lg font-medium">Newcomer</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Apply for citizenship to participate in governance</span>
                    </div>
                  </div>
                )}
              </div>

              {citizenshipStatus?.status === 'citizen' ? (
                <div className="border p-4 rounded-md border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-900/30">
                  <h3 className="font-medium text-green-700 dark:text-green-400 mb-2">Your Citizenship Rights</h3>
                  <ul className="list-disc list-inside text-sm text-green-700 dark:text-green-400 space-y-1">
                    <li>Vote on proposals in the Martian Congress</li>
                    <li>Submit new proposals for consideration</li>
                    <li>Access to all Martian territories</li>
                    <li>Eligibility for government positions</li>
                    <li>Full participation in resource allocation</li>
                  </ul>
                </div>
              ) : citizenshipStatus?.status === 'applicant' ? (
                <div>
                  <div className="border p-4 rounded-md border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-900/30 mb-4">
                    <h3 className="font-medium text-yellow-700 dark:text-yellow-400 mb-2">Application Status</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Application Submitted</div>
                          <div className="text-xs text-gray-500">{citizenshipStatus.applicationDate?.toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Under Review</div>
                          <div className="text-xs text-gray-500">Estimated completion in 7-14 days</div>
                        </div>
                      </div>
                      <div className="flex items-center opacity-50">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-medium">3</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium">Citizenship Granted</div>
                          <div className="text-xs text-gray-500">Pending verification</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Please be patient while your application is being reviewed. You will be notified once there&apos;s an update to your application status.
                  </p>
                </div>
              ) : (
                <div className="border p-4 rounded-md border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-900/30">
                  <h3 className="font-medium text-blue-700 dark:text-blue-400 mb-2">Why Become a Citizen?</h3>
                  <ul className="list-disc list-inside text-sm text-blue-700 dark:text-blue-400 space-y-1 mb-4">
                    <li>Participate in democratic governance of Mars</li>
                    <li>Vote on proposals that shape the future of the planet</li>
                    <li>Access to exclusive Martian resources and territories</li>
                    <li>Help build the foundation of a new civilization</li>
                    <li>Be part of humanity's next chapter</li>
                  </ul>
                  <button
                    onClick={() => setActiveSection('application')}
                    className="mt-2 px-4 py-2 bg-mars-red text-white rounded hover:bg-opacity-90"
                  >
                    Start Application
                  </button>
                </div>
              )}
            </div>

            {citizenshipStatus?.status === 'citizen' && (
              <div className="bg-white dark:bg-mars-dark rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Voter Record</h2>
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Total Votes Cast</span>
                    <span className="text-sm font-bold">7</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-sm font-medium">Voter Participation Rate</span>
                    <span className="text-sm font-bold">86%</span>
                  </div>
                </div>
                <Link 
                  href="/congress/votes"
                  className="text-sm text-mars-red hover:text-mars-red/80"
                >
                  View voting history →
                </Link>
              </div>
            )}
          </div>

          <div className="col-span-1">
            <div className="bg-white dark:bg-mars-dark rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Your Profile</h2>
              <div className="flex flex-col items-center mb-4">
                <div className="h-24 w-24 rounded-full bg-mars-red flex items-center justify-center text-white text-3xl font-bold mb-3">
                  {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'M'}
                </div>
                <h3 className="text-lg font-medium">{session?.user?.name || 'Martian User'}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {session?.user?.email || 'email@example.com'}
                </p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => setActiveSection('profile')}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                >
                  Edit Profile
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-mars-dark rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
              <div className="flex flex-col space-y-2">
                <Link
                  href="/citizen/id-card"
                  className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded"
                >
                  <svg className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                  <span>Citizen ID Card</span>
                </Link>
                <Link
                  href="/congress"
                  className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded"
                >
                  <svg className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>Martian Congress</span>
                </Link>
                <Link
                  href="/logbook"
                  className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded"
                >
                  <svg className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  <span>Logbook</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Application Section */}
      {activeSection === 'application' && (
        <div className="bg-white dark:bg-mars-dark rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Citizenship Application</h2>
          
          {citizenshipStatus?.status === 'citizen' ? (
            <div className="p-6 text-center bg-green-50 rounded-lg dark:bg-green-900/20">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-green-800 dark:text-green-400 mb-2">You are a Full Martian Citizen</h3>
              <p className="text-green-700 dark:text-green-300 mb-4">Congratulations! You have full citizenship rights in the Martian Republic.</p>
              <Link 
                href="/congress" 
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Visit Congress
              </Link>
            </div>
          ) : citizenshipStatus?.status === 'applicant' ? (
            <div className="p-6 bg-yellow-50 rounded-lg dark:bg-yellow-900/20 mb-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-400">Application In Progress</h3>
                  <p className="text-yellow-700 dark:text-yellow-300">
                    Your application is being reviewed by the Citizenship Committee.
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-medium mb-2">Application Timeline</h4>
                <div className="space-y-4">
                  <div className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="h-full w-0.5 bg-gray-300 dark:bg-gray-700"></div>
                    </div>
                    <div className="pb-4">
                      <div className="text-sm font-medium">Application Submitted</div>
                      <div className="text-xs text-gray-500">{citizenshipStatus.applicationDate?.toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="h-full w-0.5 bg-gray-300 dark:bg-gray-700"></div>
                    </div>
                    <div className="pb-4">
                      <div className="text-sm font-medium">Initial Review</div>
                      <div className="text-xs text-gray-500">In progress</div>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">3</span>
                      </div>
                      <div className="h-full w-0.5 bg-gray-300 dark:bg-gray-700"></div>
                    </div>
                    <div className="pb-4">
                      <div className="text-sm font-medium">Committee Vote</div>
                      <div className="text-xs text-gray-500">Pending</div>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">4</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Citizenship Granted</div>
                      <div className="text-xs text-gray-500">Pending</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-md dark:bg-blue-900/20 mb-4">
                <h3 className="text-blue-800 dark:text-blue-400 font-medium mb-2">Application Requirements</h3>
                <ul className="list-disc list-inside text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>You must have a connected Martian wallet</li>
                  <li>You must agree to uphold the Martian Constitution</li>
                  <li>You must provide your real identity</li>
                  <li>You must pass a basic civic knowledge test</li>
                </ul>
              </div>
              
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700"
                  defaultValue={session?.user?.name || ''}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700"
                  defaultValue={session?.user?.email || ''}
                  readOnly
                />
              </div>
              
              <div>
                <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Martian Wallet Address
                </label>
                <input
                  type="text"
                  id="walletAddress"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700"
                  defaultValue={session?.user?.publicAddress || ''}
                  readOnly
                />
                {!session?.user?.publicAddress && (
                  <p className="mt-1 text-sm text-red-600">
                    You need to create a Martian wallet first. <Link href="/wallet" className="underline">Visit the wallet page</Link>.
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Why do you want to become a Martian citizen?
                </label>
                <textarea
                  id="reason"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700"
                  placeholder="Explain your motivations and what you hope to contribute to the Martian Republic..."
                ></textarea>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="constitution"
                    type="checkbox"
                    className="h-4 w-4 text-mars-red focus:ring-mars-red border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="constitution" className="font-medium text-gray-700 dark:text-gray-300">
                    I agree to uphold the <Link href="/constitution" className="text-mars-red hover:underline">Martian Constitution</Link>
                  </label>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    className="h-4 w-4 text-mars-red focus:ring-mars-red border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-medium text-gray-700 dark:text-gray-300">
                    I agree to the <Link href="/terms" className="text-mars-red hover:underline">terms and conditions</Link>
                  </label>
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full px-4 py-3 bg-mars-red text-white font-medium rounded-md hover:bg-mars-red/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mars-red"
                disabled={!session?.user?.publicAddress}
              >
                Submit Application
              </button>
            </form>
          )}
        </div>
      )}

      {/* Profile Section */}
      {activeSection === 'profile' && (
        <div className="bg-white dark:bg-mars-dark rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>
          
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="h-32 w-32 rounded-full bg-mars-red flex items-center justify-center text-white text-4xl font-bold">
                {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'M'}
              </div>
              <button className="absolute bottom-0 right-0 h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-full border-4 border-white dark:border-mars-dark flex items-center justify-center">
                <svg className="h-5 w-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
          
          <form className="space-y-6">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                id="displayName"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700"
                defaultValue={session?.user?.name || ''}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700 bg-gray-100 dark:bg-gray-900"
                defaultValue={session?.user?.email || ''}
                readOnly
              />
            </div>
            
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700"
                placeholder="Tell us about yourself..."
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location on Mars
              </label>
              <select
                id="location"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="">Select a location</option>
                <option value="olympus_mons">Olympus Mons</option>
                <option value="valles_marineris">Valles Marineris</option>
                <option value="arcadia_planitia">Arcadia Planitia</option>
                <option value="elysium_planitia">Elysium Planitia</option>
                <option value="tharsis">Tharsis</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Specialization
              </label>
              <select
                id="specialization"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mars-red focus:border-mars-red dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="">Select your specialization</option>
                <option value="terraforming">Terraforming</option>
                <option value="agriculture">Agriculture</option>
                <option value="engineering">Engineering</option>
                <option value="medicine">Medicine</option>
                <option value="science">Science</option>
                <option value="governance">Governance</option>
                <option value="exploration">Exploration</option>
                <option value="education">Education</option>
              </select>
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                className="w-full px-4 py-3 bg-mars-red text-white font-medium rounded-md hover:bg-mars-red/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mars-red"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ID Card Section */}
      {activeSection === 'id-card' && (
        <div className="bg-white dark:bg-mars-dark rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Martian ID Card</h2>
          
          <div className="max-w-md mx-auto">
            <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
              {/* ID Card Header */}
              <div className="bg-mars-red p-4 text-white">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Image 
                      src="/assets/mars-logo.svg" 
                      alt="Mars Logo" 
                      width={32} 
                      height={32}
                      className="mr-2"
                    />
                    <h3 className="text-lg font-bold">Martian Republic</h3>
                  </div>
                  <div className="text-sm">ID: MR-{Math.floor(10000 + Math.random() * 90000)}</div>
                </div>
              </div>
              
              {/* ID Card Body */}
              <div className="p-6 space-y-4">
                <div className="flex">
                  <div className="mr-4">
                    <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 text-3xl">
                      {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'M'}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold">{session?.user?.name || 'Martian Citizen'}</h4>
                    <div className="mt-2 space-y-1">
                      <div className="text-sm flex">
                        <span className="w-24 text-gray-500 dark:text-gray-400">Status:</span>
                        <span className="font-medium">
                          {citizenshipStatus?.status === 'citizen' 
                            ? 'Citizen' 
                            : citizenshipStatus?.status === 'applicant'
                            ? 'Applicant'
                            : citizenshipStatus?.status === 'general_public'
                            ? 'General Public'
                            : 'Newcomer'}
                        </span>
                      </div>
                      <div className="text-sm flex">
                        <span className="w-24 text-gray-500 dark:text-gray-400">Location:</span>
                        <span className="font-medium">Olympus Mons</span>
                      </div>
                      <div className="text-sm flex">
                        <span className="w-24 text-gray-500 dark:text-gray-400">Issued:</span>
                        <span className="font-medium">April 4, 2025</span>
                      </div>
                      <div className="text-sm flex">
                        <span className="w-24 text-gray-500 dark:text-gray-400">Valid Until:</span>
                        <span className="font-medium">April 4, 2027</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-dashed border-gray-300 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <div>Wallet Address:</div>
                      <div className="font-mono text-xs mt-1">{session?.user?.publicAddress || 'No wallet connected'}</div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                      {/* This would be a QR code in a real app */}
                      <div className="h-16 w-16 border-2 border-gray-300 dark:border-gray-700 rounded-sm grid grid-cols-4 grid-rows-4 gap-0.5">
                        <div className="bg-gray-400"></div>
                        <div className="bg-gray-400"></div>
                        <div className="bg-gray-400"></div>
                        <div className="bg-gray-400"></div>
                        <div className="bg-gray-400"></div>
                        <div className="bg-white dark:bg-mars-dark"></div>
                        <div className="bg-white dark:bg-mars-dark"></div>
                        <div className="bg-gray-400"></div>
                        <div className="bg-gray-400"></div>
                        <div className="bg-white dark:bg-mars-dark"></div>
                        <div className="bg-white dark:bg-mars-dark"></div>
                        <div className="bg-gray-400"></div>
                        <div className="bg-gray-400"></div>
                        <div className="bg-gray-400"></div>
                        <div className="bg-gray-400"></div>
                        <div className="bg-gray-400"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* ID Card Footer */}
              <div className="bg-gray-100 dark:bg-gray-800 p-3 text-center text-xs text-gray-500 dark:text-gray-400">
                This ID card is property of the Martian Republic. If found, please return to nearest government office.
              </div>
            </div>
            
            <div className="mt-6 flex justify-center space-x-4">
              <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 text-sm flex items-center">
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 text-sm flex items-center">
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}