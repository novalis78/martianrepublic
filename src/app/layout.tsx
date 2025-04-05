import type { Metadata } from 'next'
import './globals.css'
import RootLayout from '@/components/layout/RootLayout'
import AuthContext from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'

export const metadata: Metadata = {
  title: 'Martian Republic',
  description: 'A governance system for Mars',
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        <AuthContext>
          <ThemeProvider>
            <RootLayout>
              {children}
            </RootLayout>
          </ThemeProvider>
        </AuthContext>
      </body>
    </html>
  )
}