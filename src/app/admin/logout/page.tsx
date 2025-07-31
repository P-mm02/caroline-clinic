'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // Remove cookies by hitting an API route
    fetch('/api/admin/logout', { method: 'POST' }).then(() => {
      router.replace('/admin/login')
    })
  }, [router])

  return (
    <main style={{ padding: '3rem', textAlign: 'center' }}>
      <h2>Logging out...</h2>
    </main>
  )
}
