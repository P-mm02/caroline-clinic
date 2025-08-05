'use client'
import { useEffect, useState } from 'react'
import '@/styles/globals.css'
import './Navbar.css'
import { useSearchParams } from 'next/navigation'

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
  const searchParams = useSearchParams()
  const [showUnauthorized, setShowUnauthorized] = useState(false)

  useEffect(() => {
    if (searchParams.get('unauthorized') === '1') {
      setShowUnauthorized(true)
      // Optionally, remove the param after displaying the message
      // (You can use router.replace for a cleaner URL if you want)
    }
  }, [searchParams])
  const [user, setUser] = useState<AdminUserType>({
    username: '',
    avatarUrl: '',
    role: '',
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
{/*       {showUnauthorized && (
        <div
          className="alert alert-warning"
          style={{ color: 'red', fontWeight: 'bold', margin: '1rem 0' }}
        >
          🚫 You are not authorized to access that page.
        </div>
      )}
 */}      <div className="admin-navbar-user">
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
            : '-'}
        </span>
        <img
          src={user.avatarUrl || '/logo/Caroline-Clinic-Logo.svg'}
          alt="User"
          className="admin-navbar-avatar"
        />
      </div>
    </nav>
  )
}
