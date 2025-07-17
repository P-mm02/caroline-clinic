import '@/styles/globals.css'
import Navbar from '@/components/Navbar/Navbar'
import '@/components/Navbar/Navbar.css'
import '@/components/Navbar/NavbarMedia.css'
import Footer from '@/components/Footer/Footer'
import '@/components/Footer/Footer.css'

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
