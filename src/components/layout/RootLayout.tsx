import NavBar from './NavBar'
import Footer from './Footer'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}