'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation' // ✅ import router
import '@/styles/globals.css'
import './Navbar.css'

type AdminUserType = {
  username: string
  avatarUrl: string
  role: string
}

const roleDisplay: Record<string, string> = {
  superadmin: 'Super Admin',
  admin: 'Admin',
  operator: 'Operator',
  viewer: 'Viewer',
}

export default function AdminNavbar() {
  const router = useRouter() // ✅ create router instance
  const [user, setUser] = useState<AdminUserType>({
    username: 'username',
    avatarUrl: '/logo/Caroline-Clinic-Logo.svg',
    role: 'Role',
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('adminUser')
      if (raw) {
        try {
          setUser(JSON.parse(raw))
        } catch (e) {
          setUser({ username: '', avatarUrl: '', role: '' })
        }
      }
    }
  }, [])

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-user">
        {user.role && (
          <span className="admin-navbar-role">
            {roleDisplay[user.role] || user.role || '-'}
          </span>
        )}
        <span className="admin-navbar-username">
          |{' '}
          {user.username
            ? user.username.length > 10
              ? user.username.slice(0, 10) + '…'
              : user.username
            : ' '}
        </span>
        <img
          src={user.avatarUrl || ''}
          alt="User"
          className="admin-navbar-avatar"
          onClick={() => router.push('/admin/admin-user/profile')} // ✅ redirect
          style={{ cursor: 'pointer' }} // make it look clickable
        />
      </div>
    </nav>
  )
}
