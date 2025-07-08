import './globals.css'
import Navbar from '@/components/Navbar/Navbar'
import '@/components/Navbar/Navbar.css'
import Footer from '@/components/Footer/Footer'
import '@/components/Footer/Footer.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
