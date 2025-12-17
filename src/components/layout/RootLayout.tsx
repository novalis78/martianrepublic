'use client';

import NavBar from './NavBar'
import Footer from './Footer'
import { WalletProvider } from '@/context/WalletContext'
import { usePathname } from 'next/navigation'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Pages where the hero handles its own spacing (homepage has full-height hero)
  const fullBleedPages = ['/']
  const isFullBleed = fullBleedPages.includes(pathname)

  return (
    <WalletProvider>
      <div className="flex flex-col min-h-screen bg-void-900">
        <NavBar />
        <main className={`flex-grow ${isFullBleed ? '' : 'pt-16'}`}>
          {children}
        </main>
        <Footer />
      </div>
    </WalletProvider>
  )
}
