// src/app/admin/Navbar/Navbar.tsx

import '@/styles/globals.css'
import './Navbar.css'

export default function AdminNavbar() {
  return (
    <nav className="admin-navbar">
        <div className="admin-navbar-user">
          <span className="admin-navbar-username">Admin</span>
          <img
            src="/logo/Caroline-Clinic-Logo.svg"
            alt="User"
            className="admin-navbar-avatar"
          />
        </div>
    </nav>
  )
}
