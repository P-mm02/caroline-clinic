'use client'
import './page.css'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function UnauthorizedMessage() {
  const searchParams = useSearchParams()
  if (searchParams.get('unauthorized') === '1') {
    return (
      <div
        className="admin-login-error"
        style={{ marginBottom: 8, color: 'red', fontWeight: 'bold' }}
      >
        🚫 You are not authorized to access that page.
      </div>
    )
  }
  return null
}

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    setLoading(false)
    if (res.ok) {
      const data = await res.json()
      localStorage.setItem(
        'adminUser',
        JSON.stringify({
          username: data.username,
          avatarUrl: data.avatarUrl || '',
          role: data.role || '',
        })
      )
      window.location.href = '/admin'
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <section className="admin-login-container">
      <form className="admin-login-form" onSubmit={handleLogin}>
        <h1>Admin Login</h1>
        {/* Suspense boundary for useSearchParams */}
        <Suspense>
          <UnauthorizedMessage />
        </Suspense>
        <input
          value={username}
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          autoComplete="username"
        />
        <input
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          autoComplete="current-password"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in…' : 'Login'}
        </button>
        {error && <div className="admin-login-error">{error}</div>}
      </form>
    </section>
  )
}
