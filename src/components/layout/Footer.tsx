import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-white shadow-md dark:bg-mars-dark px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Image 
                src="/assets/mars-logo.svg" 
                alt="Mars Logo" 
                width={32} 
                height={32}
                className="mr-2"
              />
              <h3 className="text-lg font-semibold text-mars-red">Martian Republic</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              A decentralized governance system for the future of Mars, powered by Marscoin blockchain and IPFS.
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="https://github.com/marscoin/marscoin" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-gray-400 hover:text-mars-red">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://marscoin.org" target="_blank" rel="noopener noreferrer" aria-label="Marscoin" className="text-gray-400 hover:text-mars-red">
                <span className="sr-only">Marscoin</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </a>
              <a href="https://ipfs.io" target="_blank" rel="noopener noreferrer" aria-label="IPFS" className="text-gray-400 hover:text-mars-red">
                <span className="sr-only">IPFS</span>
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                  <path d="M12,1.5L3,6.6v10.8l9,5.1l9-5.1V6.6L12,1.5z M12,23.1l-9.5-5.4V7.3L12,1.9l9.5,5.4v10.4L12,23.1z M12,13.1l-3.2-1.8V7.7 L12,5.9l3.2,1.8v3.6L12,13.1z M12,5.1L8.2,7.3L12,9.5l3.8-2.2L12,5.1z M8.2,12.9L12,15.1l3.8-2.2L12,10.7L8.2,12.9z"></path>
                </svg>
              </a>
              <a href="https://twitter.com/marscoin" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-400 hover:text-mars-red">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="https://t.me/marscoin" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="text-gray-400 hover:text-mars-red">
                <span className="sr-only">Telegram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"></path>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Main Sections</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/wallet" className="text-gray-600 dark:text-gray-300 hover:text-mars-red">
                  Wallet
                </Link>
              </li>
              <li>
                <Link href="/citizen" className="text-gray-600 dark:text-gray-300 hover:text-mars-red">
                  Citizen
                </Link>
              </li>
              <li>
                <Link href="/congress" className="text-gray-600 dark:text-gray-300 hover:text-mars-red">
                  Congress
                </Link>
              </li>
              <li>
                <Link href="/logbook" className="text-gray-600 dark:text-gray-300 hover:text-mars-red">
                  Logbook
                </Link>
              </li>
              <li>
                <Link href="/inventory" className="text-gray-600 dark:text-gray-300 hover:text-mars-red">
                  Inventory
                </Link>
              </li>
              <li>
                <Link href="/planet" className="text-gray-600 dark:text-gray-300 hover:text-mars-red">
                  Planet
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://marscoin.gitbook.io/marscoin-documentation/martian-basecamp/" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-gray-600 dark:text-gray-300 hover:text-mars-red">
                  Documentation
                </a>
              </li>
              <li>
                <a href="https://github.com/marscoin/martianrepublic" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-gray-600 dark:text-gray-300 hover:text-mars-red">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://marscoin.org" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-gray-600 dark:text-gray-300 hover:text-mars-red">
                  Marscoin
                </a>
              </li>
              <li>
                <a href="https://explore.marscoin.org" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-gray-600 dark:text-gray-300 hover:text-mars-red">
                  Block Explorer
                </a>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 dark:text-gray-300 hover:text-mars-red">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/whitepaper" className="text-gray-600 dark:text-gray-300 hover:text-mars-red">
                  Whitepaper
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Community</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/constitution" className="text-gray-600 dark:text-gray-300 hover:text-mars-red">
                  Martian Constitution
                </Link>
              </li>
              <li>
                <Link href="/governance" className="text-gray-600 dark:text-gray-300 hover:text-mars-red">
                  Governance Model
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="text-gray-600 dark:text-gray-300 hover:text-mars-red">
                  Project Roadmap
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-600 dark:text-gray-300 hover:text-mars-red">
                  Support
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 dark:text-gray-300 hover:text-mars-red">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-mars-red">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} Martian Republic. All rights reserved.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Building a just and prosperous future on Mars.
              </p>
            </div>
            
            <div className="flex space-x-6">
              <Link href="/contact" className="text-sm text-gray-500 dark:text-gray-400 hover:text-mars-red">
                Contact
              </Link>
              <Link href="/terms" className="text-sm text-gray-500 dark:text-gray-400 hover:text-mars-red">
                Terms
              </Link>
              <Link href="/privacy" className="text-sm text-gray-500 dark:text-gray-400 hover:text-mars-red">
                Privacy
              </Link>
              <Link href="/cookies" className="text-sm text-gray-500 dark:text-gray-400 hover:text-mars-red">
                Cookies
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <div className="inline-block px-4 py-1 rounded-full border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Powered by <a href="https://marscoin.org" target="_blank" rel="noopener noreferrer" className="text-mars-red hover:underline">Marscoin</a> and <a href="https://ipfs.io" target="_blank" rel="noopener noreferrer" className="text-mars-red hover:underline">IPFS</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}