'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'

export default function NavBar() {
  const { data: session, status } = useSession()
  const isAuthenticated = status === 'authenticated'
  
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  
  const profileRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Get citizen status badge
  const getCitizenStatusBadge = () => {
    if (!session?.user?.citizenStatus) return null
    
    const status = session.user.citizenStatus
    
    if (status === 'citizen') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          Citizen
        </span>
      )
    } else if (status === 'general_public') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          General Public
        </span>
      )
    } else if (status === 'applicant') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          Applicant
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
          Newcomer
        </span>
      )
    }
  }

  return (
    <nav className="bg-white shadow-md dark:bg-mars-dark">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-mars-dark dark:hover:text-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="flex items-center">
                <Image 
                  src="/assets/mars-logo.svg" 
                  alt="Mars Logo" 
                  width={32} 
                  height={32}
                  className="mr-2"
                />
                <span className="text-xl font-bold text-mars-red">Martian Republic</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                <Link href="/wallet" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-mars-red dark:text-white">
                  Wallet
                </Link>
                <Link href="/citizen" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-mars-red dark:text-white">
                  Citizen
                </Link>
                <Link href="/congress" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-mars-red dark:text-white">
                  Congress
                </Link>
                <Link href="/feed" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-mars-red dark:text-white">
                  Feed
                </Link>
                <Link href="/logbook" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-mars-red dark:text-white">
                  Logbook
                </Link>
                <Link href="/inventory" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-mars-red dark:text-white">
                  Inventory
                </Link>
                <Link href="/planet" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-mars-red dark:text-white">
                  Planet
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-mars-red focus:ring-offset-2 dark:bg-gray-800"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <span className="absolute -inset-1.5"></span>
                  <span className="sr-only">Open user menu</span>
                  <div className="flex items-center space-x-2 border border-gray-300 dark:border-gray-700 rounded-full pl-2 pr-3 py-1">
                    <div className="h-8 w-8 rounded-full bg-mars-red flex items-center justify-center text-white">
                      {session.user.name ? session.user.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {session.user.name || 'Martian User'}
                      </span>
                      <div>
                        {getCitizenStatusBadge()}
                      </div>
                    </div>
                  </div>
                </button>
                
                {/* Profile dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800">
                    <Link 
                      href="/wallet/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      href="/wallet/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                      onClick={() => signOut({ callbackUrl: '/' })}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/sign-in"
                className="relative flex items-center space-x-2 rounded-md bg-mars-red px-3 py-1.5 text-sm font-medium text-white hover:bg-mars-red/90"
              >
                <span className="absolute -inset-1.5"></span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state. */}
      {isMenuOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <Link 
              href="/wallet" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-mars-red dark:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Wallet
            </Link>
            <Link 
              href="/citizen" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-mars-red dark:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Citizen
            </Link>
            <Link 
              href="/congress" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-mars-red dark:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Congress
            </Link>
            <Link 
              href="/feed" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-mars-red dark:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Feed
            </Link>
            <Link 
              href="/logbook" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-mars-red dark:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Logbook
            </Link>
            <Link 
              href="/inventory" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-mars-red dark:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Inventory
            </Link>
            <Link 
              href="/planet" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-mars-red dark:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Planet
            </Link>
            
            {isAuthenticated && (
              <>
                <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                <Link 
                  href="/wallet/dashboard" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-mars-red dark:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/wallet/profile" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-mars-red dark:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-mars-red dark:text-white"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  Sign out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}