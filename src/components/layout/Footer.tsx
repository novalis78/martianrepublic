import Link from 'next/link'
import Image from 'next/image'

const footerLinks = {
  modules: [
    { href: '/wallet', label: 'Wallet' },
    { href: '/citizen', label: 'Citizen' },
    { href: '/congress', label: 'Congress' },
    { href: '/feed', label: 'Feed' },
    { href: '/logbook', label: 'Logbook' },
    { href: '/inventory', label: 'Inventory' },
    { href: '/planet', label: 'Planet' },
  ],
  resources: [
    { href: 'https://marscoin.gitbook.io/marscoin-documentation/martian-basecamp/', label: 'Documentation', external: true },
    { href: 'https://github.com/marscoin/martianrepublic', label: 'GitHub', external: true },
    { href: 'https://marscoin.org', label: 'Marscoin', external: true },
    { href: 'https://explore.marscoin.org', label: 'Block Explorer', external: true },
  ],
  community: [
    { href: '/constitution', label: 'Constitution' },
    { href: '/governance', label: 'Governance Model' },
    { href: '/roadmap', label: 'Roadmap' },
    { href: '/support', label: 'Support' },
  ],
}

const socialLinks = [
  {
    href: 'https://github.com/marscoin/marscoin',
    label: 'GitHub',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    href: 'https://twitter.com/marscoin',
    label: 'X (Twitter)',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    href: 'https://t.me/marscoin',
    label: 'Telegram',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    href: 'https://marscoin.org',
    label: 'Marscoin',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-void-900 border-t border-white/5">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-mars-rust/30 to-transparent" />

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 group mb-6">
              <div className="relative w-10 h-10">
                <Image
                  src="/assets/mars-logo.svg"
                  alt="Mars Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-lg font-bold text-void-100">
                  MARTIAN REPUBLIC
                </span>
                <span className="font-mono text-xs text-void-400 uppercase tracking-wider">
                  Est. Sol 0001
                </span>
              </div>
            </Link>

            <p className="text-void-300 leading-relaxed mb-6 max-w-sm">
              A decentralized governance system for the first human civilization on Mars.
              Powered by Marscoin blockchain and IPFS distributed storage.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-void-400 hover:text-mars-rust bg-void-800/50 hover:bg-void-800 border border-white/5 hover:border-mars-rust/30 transition-all duration-200"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Modules */}
          <div>
            <h4 className="font-display text-sm font-semibold text-void-100 uppercase tracking-wider mb-4">
              Modules
            </h4>
            <ul className="space-y-2">
              {footerLinks.modules.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-void-400 hover:text-mars-dust transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display text-sm font-semibold text-void-100 uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-void-400 hover:text-mars-dust transition-colors duration-200"
                  >
                    {link.label}
                    <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-display text-sm font-semibold text-void-100 uppercase tracking-wider mb-4">
              Community
            </h4>
            <ul className="space-y-2">
              {footerLinks.community.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-void-400 hover:text-mars-dust transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="flex flex-col md:flex-row items-center gap-2 text-void-500 text-sm">
              <span>&copy; {currentYear} Martian Republic.</span>
              <span className="hidden md:inline">|</span>
              <span className="font-mono text-xs">Building a just future on Mars</span>
            </div>

            {/* Legal links */}
            <div className="flex items-center gap-6">
              <Link href="/terms" className="text-xs text-void-500 hover:text-void-300 transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="text-xs text-void-500 hover:text-void-300 transition-colors">
                Privacy
              </Link>
              <Link href="/cookies" className="text-xs text-void-500 hover:text-void-300 transition-colors">
                Cookies
              </Link>
            </div>
          </div>

          {/* Tech stack */}
          <div className="mt-4 pt-4 border-t border-white/5 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-void-800/30 border border-white/5 rounded-sm">
              <span className="font-mono text-xs text-void-500 uppercase tracking-wider">Powered by</span>
              <div className="w-px h-3 bg-void-600" />
              <a href="https://marscoin.org" target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-colony-amber hover:text-colony-amber/80 transition-colors">
                Marscoin
              </a>
              <span className="text-void-600">+</span>
              <a href="https://ipfs.io" target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-colony-cyan hover:text-colony-cyan/80 transition-colors">
                IPFS
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
