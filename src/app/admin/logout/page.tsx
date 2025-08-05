'use client'
import { useEffect } from 'react'

export default function AdminLogoutPage() {
  useEffect(() => {
    fetch('/api/admin/logout', { method: 'POST' }).then(() => {
      localStorage.removeItem('adminUser')
      window.location.href = '/admin/login'
    })
  }, [])

  return (
    <main style={{ padding: '3rem', textAlign: 'center' }}>
      <h2>Logging out...</h2>
    </main>
  )
}
