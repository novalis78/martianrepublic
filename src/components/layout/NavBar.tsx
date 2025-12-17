'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'

// Navigation items configuration
const navItems = [
  { href: '/wallet', label: 'Wallet', shortLabel: 'WLT' },
  { href: '/citizen', label: 'Citizen', shortLabel: 'CTZ' },
  { href: '/congress', label: 'Congress', shortLabel: 'CON' },
  { href: '/feed', label: 'Feed', shortLabel: 'FED' },
  { href: '/logbook', label: 'Logbook', shortLabel: 'LOG' },
  { href: '/inventory', label: 'Inventory', shortLabel: 'INV' },
  { href: '/planet', label: 'Planet', shortLabel: 'PLN' },
]

export default function NavBar() {
  const { data: session, status } = useSession()
  const isAuthenticated = status === 'authenticated'
  const { theme, toggleTheme } = useTheme()
  const pathname = usePathname()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const profileRef = useRef<HTMLDivElement>(null)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

    const citizenStatus = session.user?.citizenStatus

    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      citizen: { bg: 'bg-colony-green/20 border-colony-green/30', text: 'text-colony-green', label: 'CITIZEN' },
      general_public: { bg: 'bg-colony-cyan/20 border-colony-cyan/30', text: 'text-colony-cyan', label: 'PUBLIC' },
      applicant: { bg: 'bg-colony-amber/20 border-colony-amber/30', text: 'text-colony-amber', label: 'APPLICANT' },
    }

    const config = statusConfig[citizenStatus] || {
      bg: 'bg-void-600/50 border-void-500',
      text: 'text-void-300',
      label: 'NEWCOMER'
    }

    return (
      <span className={`inline-flex items-center px-2 py-0.5 text-2xs font-mono uppercase tracking-wider border ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-void-900/95 backdrop-blur-md border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-mars-rust/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left section - Logo & Nav */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-8 h-8">
                <Image
                  src="/assets/mars-logo.svg"
                  alt="Mars Logo"
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="font-display text-sm font-semibold text-void-100 leading-none">
                  MARTIAN
                </span>
                <span className="font-display text-xs text-mars-rust leading-none">
                  REPUBLIC
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center">
              {/* Nav container with subtle border */}
              <div className="flex items-center gap-1 px-2 py-1 bg-void-800/30 border border-white/5 rounded-sm">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`relative px-3 py-1.5 font-display text-xs uppercase tracking-wider transition-all duration-200 ${
                        isActive
                          ? 'text-mars-dust bg-mars-rust/20'
                          : 'text-void-300 hover:text-void-100 hover:bg-white/5'
                      }`}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-px bg-mars-rust" />
                      )}
                      <span className="hidden xl:inline">{item.label}</span>
                      <span className="xl:hidden">{item.shortLabel}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right section - Theme toggle & Auth */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="relative p-2 text-void-400 hover:text-void-200 transition-colors"
              aria-label="Toggle theme"
            >
              <div className="relative w-5 h-5">
                {theme === 'dark' ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                  </svg>
                )}
              </div>
            </button>

            {/* Auth section */}
            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 px-3 py-1.5 bg-void-800/50 border border-white/5 hover:border-mars-rust/30 transition-all duration-200 group"
                >
                  {/* Avatar */}
                  <div className="relative w-7 h-7 bg-gradient-to-br from-mars-rust to-mars-oxide rounded-sm flex items-center justify-center">
                    <span className="font-display text-xs font-bold text-white">
                      {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : '?'}
                    </span>
                    {/* Online indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-colony-green rounded-full border border-void-900" />
                  </div>

                  {/* User info */}
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="font-display text-xs text-void-100 leading-none">
                      {session?.user?.name || 'Martian'}
                    </span>
                    <div className="mt-0.5">
                      {getCitizenStatusBadge()}
                    </div>
                  </div>

                  {/* Chevron */}
                  <svg
                    className={`w-3 h-3 text-void-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Profile dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 origin-top-right animate-slide-down">
                    <div className="bg-void-800/95 backdrop-blur-md border border-white/10 shadow-xl">
                      {/* Header */}
                      <div className="px-4 py-3 border-b border-white/5">
                        <p className="font-display text-sm text-void-100">
                          {session?.user?.name || 'Martian User'}
                        </p>
                        <p className="font-mono text-xs text-void-400 truncate">
                          {session?.user?.email}
                        </p>
                      </div>

                      {/* Menu items */}
                      <div className="py-1">
                        <Link
                          href="/wallet"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-void-200 hover:bg-white/5 hover:text-void-100 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <svg className="w-4 h-4 text-void-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                          </svg>
                          Dashboard
                        </Link>

                        <button
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-void-200 hover:bg-white/5 hover:text-void-100 transition-colors"
                          onClick={() => signOut({ callbackUrl: '/' })}
                        >
                          <svg className="w-4 h-4 text-void-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/sign-in"
                className="btn-primary text-xs py-2"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-void-400 hover:text-void-200 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden animate-slide-down">
          <div className="bg-void-900/98 backdrop-blur-md border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 py-4">
              {/* Navigation grid */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 font-display text-sm uppercase tracking-wider transition-all ${
                        isActive
                          ? 'bg-mars-rust/20 text-mars-dust border-l-2 border-mars-rust'
                          : 'text-void-300 hover:bg-white/5 hover:text-void-100 border-l-2 border-transparent'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </div>

              {/* Auth section for mobile */}
              {isAuthenticated && (
                <div className="pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between px-4 py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-mars-rust to-mars-oxide rounded-sm flex items-center justify-center">
                        <span className="font-display text-sm font-bold text-white">
                          {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : '?'}
                        </span>
                      </div>
                      <div>
                        <p className="font-display text-sm text-void-100">
                          {session?.user?.name}
                        </p>
                        {getCitizenStatusBadge()}
                      </div>
                    </div>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="px-3 py-1.5 text-xs font-display uppercase tracking-wider text-void-300 hover:text-mars-rust transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
