'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()
  const [user, setUser] = useState<AdminUserType>({
    username: 'username',
    avatarUrl: '/logo/Caroline-Clinic-Logo.svg',
    role: 'Role',
  })

  // 🔹 helper to reload from localStorage
  const loadUserFromStorage = () => {
    if (typeof window === 'undefined') return
    const raw = localStorage.getItem('adminUser')
    if (raw) {
      try {
        setUser(JSON.parse(raw))
      } catch {
        setUser({ username: '', avatarUrl: '', role: '' })
      }
    }
  }

  useEffect(() => {
    // load on mount
    loadUserFromStorage()

    // listen for profile update events
    const onProfileUpdate = () => loadUserFromStorage()
    window.addEventListener('profile-updated', onProfileUpdate)

    return () => {
      window.removeEventListener('profile-updated', onProfileUpdate)
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
          onClick={() => router.push('/admin/admin-user/profile')}
          style={{ cursor: 'pointer' }}
        />
      </div>
    </nav>
  )
}
