'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { AdminUserType } from '@/types/AdminUserType'
import './page.css'

export default function AdminMemberPage() {
  const [users, setUsers] = useState<AdminUserType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      const res = await fetch('/api/admin-user')
      const data = await res.json()
      setUsers(data)
      setLoading(false)
    }
    fetchUsers()
  }, [])

  return (
    <section className="admin-member-main">
      <h1 className="admin-member-title">Member Management</h1>
      <Link href="/admin/admin-user/add" className="admin-member-add-btn">
        + Add Member
      </Link>
      {loading ? (
        <div className="admin-member-loading">Loading...</div>
      ) : (
        <div className="admin-member-card-list">
          {users.map((u) => (
            <div className="admin-member-card" key={u._id}>
              <div className="admin-member-card-header">
                <div className="admin-member-avatar-wrap">
                  {u.avatarUrl ? (
                    <Image
                      src={u.avatarUrl}
                      alt={u.username}
                      width={48}
                      height={48}
                      className="admin-member-avatar"
                    />
                  ) : (
                    <Image
                      src={'/icons/Image-Icon.svg'}
                      alt={u.username}
                      width={48}
                      height={48}
                      className="admin-member-avatar"
                    />
                  )}
                </div>
                <div>
                  <div className="admin-member-card-username">{u.username}</div>
                  <div className="admin-member-card-role">{u.role}</div>
                </div>
                <div className="admin-member-card-active">
                  {u.active ? '✅' : '❌'}
                </div>
              </div>
              <div className="admin-member-card-body">
                <div className="admin-member-card-label">Email</div>
                <div className="admin-member-card-email">{u.email}</div>
              </div>
              <div className="admin-member-card-actions">
                <button>Edit</button>
                <button>Disable</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
