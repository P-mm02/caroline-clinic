import './layout.css'
import AdminNavbar from './Navbar/Navbar'
import AdminSidebar from './Sidebar/Sidebar'
import { Suspense } from 'react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-root">
      <Suspense>
        <AdminNavbar />
      </Suspense>
      <main className="admin-main">
        <AdminSidebar />
        {children}
      </main>
    </div>
  )
}
