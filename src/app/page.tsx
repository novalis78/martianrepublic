'use client';

import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-black to-mars-dark overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black opacity-60"></div>
          {/* Fallback gradient background instead of image */}
          <div className="absolute inset-0 bg-gradient-to-br from-mars-dark to-black"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40 text-center">
          <div className="flex justify-center mb-8">
            <Image 
              src="/assets/mars-logo.svg" 
              alt="Mars Logo" 
              width={120} 
              height={120}
              className="animate-pulse"
            />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6">
            The Martian Republic
          </h1>
          <p className="max-w-3xl mx-auto text-xl text-gray-300 mb-8">
            A decentralized governance system for the future of Mars. Powered by blockchain technology and democratic principles.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/citizen"
              className="px-8 py-3 bg-mars-red text-white font-medium rounded-md hover:bg-mars-red/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mars-red"
            >
              Become a Citizen
            </Link>
            <Link
              href="/congress"
              className="px-8 py-3 bg-white bg-opacity-20 text-white font-medium rounded-md hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
            >
              Explore Congress
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-mars-dark to-transparent"></div>
      </div>

      {/* Features Section */}
      <div className="bg-mars-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Core Pillars of the Martian Republic</h2>
            <p className="max-w-3xl mx-auto text-gray-300">
              Our governance system is built on fundamental principles that ensure a fair, transparent, and prosperous future for all Martians.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-black bg-opacity-30 p-6 rounded-lg">
              <div className="h-12 w-12 rounded-lg bg-mars-red flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Democratic Governance</h3>
              <p className="text-gray-300">
                Every citizen has an equal voice in the Martian Republic, with the power to propose and vote on legislation that shapes our future.
              </p>
            </div>
            
            <div className="bg-black bg-opacity-30 p-6 rounded-lg">
              <div className="h-12 w-12 rounded-lg bg-mars-red flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Blockchain Transparency</h3>
              <p className="text-gray-300">
                All governance decisions are recorded on the Martian blockchain, ensuring complete transparency and immutability of the public record.
              </p>
            </div>
            
            <div className="bg-black bg-opacity-30 p-6 rounded-lg">
              <div className="h-12 w-12 rounded-lg bg-mars-red flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Resource Autonomy</h3>
              <p className="text-gray-300">
                Our economic systems ensure fair distribution of Martian resources, creating a self-sustaining civilization independent from Earth.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Sections Grid */}
      <div className="bg-white dark:bg-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Explore the Martian Republic</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Wallet */}
            <Link
              href="/wallet"
              className="bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
            >
              <div className="h-48 bg-gradient-to-br from-mars-red to-mars-dark relative">
                <div className="absolute bottom-4 left-4">
                  <div className="h-12 w-12 rounded-lg bg-mars-red flex items-center justify-center mb-1">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Martian Wallet</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Manage your Martian identity and digital assets with our secure blockchain wallet.
                </p>
                <span className="text-mars-red font-medium">Get started →</span>
              </div>
            </Link>
            
            {/* Citizen */}
            <Link
              href="/citizen"
              className="bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
            >
              <div className="h-48 bg-gradient-to-br from-mars-red to-mars-dark relative">
                <div className="absolute bottom-4 left-4">
                  <div className="h-12 w-12 rounded-lg bg-mars-red flex items-center justify-center mb-1">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Citizen Portal</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Apply for citizenship and enjoy the rights and responsibilities of being a Martian.
                </p>
                <span className="text-mars-red font-medium">Become a citizen →</span>
              </div>
            </Link>
            
            {/* Congress */}
            <Link
              href="/congress"
              className="bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
            >
              <div className="h-48 bg-gradient-to-br from-mars-red to-mars-dark relative">
                <div className="absolute bottom-4 left-4">
                  <div className="h-12 w-12 rounded-lg bg-mars-red flex items-center justify-center mb-1">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Martian Congress</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Participate in democratic governance and shape the future of Mars through voting.
                </p>
                <span className="text-mars-red font-medium">View proposals →</span>
              </div>
            </Link>
            
            {/* Feed */}
            <Link
              href="/feed"
              className="bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
            >
              <div className="h-48 bg-gradient-to-br from-mars-red to-mars-dark relative">
                <div className="absolute bottom-4 left-4">
                  <div className="h-12 w-12 rounded-lg bg-mars-red flex items-center justify-center mb-1">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Community Feed</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Connect with other Martians and stay updated on the latest happenings.
                </p>
                <span className="text-mars-red font-medium">Join the conversation →</span>
              </div>
            </Link>
            
            {/* Logbook */}
            <Link
              href="/logbook"
              className="bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
            >
              <div className="h-48 bg-gradient-to-br from-mars-red to-mars-dark relative">
                <div className="absolute bottom-4 left-4">
                  <div className="h-12 w-12 rounded-lg bg-mars-red flex items-center justify-center mb-1">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Martian Logbook</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Record and browse Martian activities, permanently stored on the blockchain.
                </p>
                <span className="text-mars-red font-medium">Record activity →</span>
              </div>
            </Link>
            
            {/* Inventory */}
            <Link
              href="/inventory"
              className="bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
            >
              <div className="h-48 bg-gradient-to-br from-mars-red to-mars-dark relative">
                <div className="absolute bottom-4 left-4">
                  <div className="h-12 w-12 rounded-lg bg-mars-red flex items-center justify-center mb-1">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Resource Inventory</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Track and manage vital Martian resources to ensure colony sustainability.
                </p>
                <span className="text-mars-red font-medium">View resources →</span>
              </div>
            </Link>
            
            {/* Planet */}
            <Link
              href="/planet"
              className="bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
            >
              <div className="h-48 bg-gradient-to-br from-mars-red to-mars-dark relative">
                <div className="absolute bottom-4 left-4">
                  <div className="h-12 w-12 rounded-lg bg-mars-red flex items-center justify-center mb-1">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Planet Map</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Explore Mars geography, settlements, and important locations across the planet.
                </p>
                <span className="text-mars-red font-medium">Explore Mars →</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-mars-red text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Join the Martian Republic Today</h2>
          <p className="max-w-2xl mx-auto text-lg mb-8">
            Be part of humanity&apos;s greatest adventure. Create your account and begin your journey to Martian citizenship.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/auth/sign-up"
              className="px-8 py-3 bg-white text-mars-red font-medium rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
            >
              Sign Up
            </Link>
            <Link
              href="/auth/sign-in"
              className="px-8 py-3 bg-transparent border border-white text-white font-medium rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}