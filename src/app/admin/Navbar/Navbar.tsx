// src/app/admin/Navbar/Navbar.tsx

import '@/styles/globals.css'
import './Navbar.css'

export default function AdminNavbar() {
  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-left">
        <span className="admin-navbar-logo">Logo image</span>
      </div>
      <div className="admin-navbar-center">
        {/* (Optional) Place for search, nav links, etc. */}
      </div>
      <div className="admin-navbar-right">
        {/* (Optional) Notification, user info, etc. */}
        <div className="admin-navbar-user">
          <img
            src="/logo/Caroline-Clinic-Logo.svg"
            alt="User"
            className="admin-navbar-avatar"
          />
          <span className="admin-navbar-username">Admin</span>
        </div>
      </div>
    </nav>
  )
}
