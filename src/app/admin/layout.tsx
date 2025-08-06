import './layout.css'
import AdminNavbar from './Navbar/Navbar'
import AdminSidebar from './Sidebar/Sidebar'
import AdminFooter from './Footer/Footer'
import { Suspense } from 'react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-root">
      <AdminNavbar />
      <main className="admin-main">
        <AdminSidebar />
        {children}
      </main>
      <Suspense>
        <AdminFooter />
      </Suspense>
    </div>
  )
}
