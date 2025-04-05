'use client';

import NavBar from './NavBar'
import Footer from './Footer'
import { WalletProvider } from '@/context/WalletContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WalletProvider>
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </WalletProvider>
  )
}