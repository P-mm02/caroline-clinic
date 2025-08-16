'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import './page.css'

type Profile = {
  id: string
  username: string
  email: string
  role: string
  active: boolean
  avatarUrl: string
}

export default function AdminProfilePage() {
  const router = useRouter()

  // ----- Profile form state -----
  const [profile, setProfile] = useState<Profile | null>(null)
  const [form, setForm] = useState({
    username: '',
    email: '',
    avatarFile: null as File | null,
  })
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  // ----- Password form state -----
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const passwordsMatch = useMemo(
    () => !newPassword || !confirmPassword || newPassword === confirmPassword,
    [newPassword, confirmPassword]
  )

  // ----- UI state -----
  const [loading, setLoading] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Fetch current profile
  useEffect(() => {
    ;(async () => {
      setLoading(true)
      setError('')
      setSuccess('')
      try {
        const res = await fetch('/api/admin-user/profile', { method: 'GET' })
        const data = await res.json()
        if (!res.ok) {
          setError(data?.error || 'Failed to load profile')
          setLoading(false)
          return
        }
        const p: Profile = {
          id: data.id,
          username: data.username ?? '',
          email: data.email ?? '',
          role: data.role ?? '',
          active: !!data.active,
          avatarUrl: data.avatarUrl ?? '',
        }
        setProfile(p)
        setForm({
          username: p.username,
          email: p.email ?? '',
          avatarFile: null,
        })
        setAvatarPreview(p.avatarUrl || null)
      } catch (e: any) {
        setError(e?.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  function handleFormChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value, type, files } = e.target as any

    if (type === 'file') {
      const file = files?.[0] ?? null
      setForm((f) => ({ ...f, avatarFile: file }))
      if (file) {
        const url = URL.createObjectURL(file)
        setAvatarPreview(url)
      } else {
        setAvatarPreview(profile?.avatarUrl || null)
      }
      return
    }

    setForm((f) => ({ ...f, [name]: value }))
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.username || form.username.trim().length < 3) {
      setError('Username must be at least 3 characters')
      return
    }
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      setError('Invalid email format')
      return
    }

    setSavingProfile(true)
    try {
      const fd = new FormData()
      fd.append('username', form.username.trim())
      fd.append('email', form.email.trim())
      if (form.avatarFile) fd.append('avatar', form.avatarFile)

      const res = await fetch('/api/admin-user/profile', {
        method: 'PUT',
        body: fd,
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data?.error || 'Failed to update profile')
        setSavingProfile(false)
        return
      }

      const updated = data.user
      setProfile((p) =>
        p
          ? {
              ...p,
              username: updated.username,
              email: updated.email,
              avatarUrl: updated.avatarUrl,
            }
          : p
      )
      setForm((f) => ({ ...f, avatarFile: null }))
      setAvatarPreview(updated.avatarUrl || avatarPreview)
      setSuccess('Profile updated')
      // after successful profile PUT (right after setSuccess('Profile updated'))
      localStorage.setItem(
        'adminUser',
        JSON.stringify({
          username: updated.username,
          avatarUrl: updated.avatarUrl || '',
          role: profile?.role || '', // keep existing role
        })
      )
    } catch (e: any) {
      setError(e?.message || 'Failed to update profile')
    } finally {
      setSavingProfile(false)
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!currentPassword || !newPassword) {
      setError('Please fill all password fields')
      return
    }
    if (newPassword.length < 3) {
      // or 6 if you prefer stronger rule
      setError('New password must be at least 3 characters')
      return
    }
    if (!passwordsMatch) {
      setError('Passwords do not match')
      return
    }

    setSavingPassword(true)
    try {
      const res = await fetch('/api/admin-user/profile/change-password', {
        method: 'POST', // ✅ was PATCH
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(data?.error || `Failed to update password (${res.status})`)
        setSavingPassword(false)
        return
      }

      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setSuccess('Password updated')
    } catch (e: any) {
      setError(e?.message || 'Failed to update password')
    } finally {
      setSavingPassword(false)
    }
  }

  if (loading) {
    return (
      <section className="admin-member-main">
        <div className="admin-user-form">
          <h1 className="admin-user-form-title">Loading profile…</h1>
        </div>
      </section>
    )
  }

  return (
    <section className="admin-member-main profile-page">
      {/* ---------- Profile Info ---------- */}
      <form
        className="admin-user-form"
        onSubmit={handleSaveProfile}
        encType="multipart/form-data"
        style={{ marginBottom: '2rem', width: '100%' }}
      >
        <h1 className="admin-user-form-title">My Profile</h1>

        {success && <div className="profile-alert success">{success}</div>}
        {error && <div className="profile-alert error">{error}</div>}

        <input
          className="admin-user-form-input"
          name="username"
          value={form.username}
          onChange={handleFormChange}
          required
          placeholder="Username"
          autoComplete="off"
        />

        <input
          className="admin-user-form-input"
          name="email"
          type="email"
          value={form.email}
          onChange={handleFormChange}
          placeholder="Email"
          autoComplete="off"
        />

        <label className="admin-user-form-avatar-wrap">
          <p className="admin-user-form-avatar-title">Profile Image</p>

          <Image
            src={avatarPreview || '/icons/Upload-Image-Icon-Circle.png'}
            alt="Avatar"
            height={430}
            width={430}
            className="admin-user-form-avatar"
            onClick={() => fileInputRef.current?.click()}
          />

          <input
            ref={fileInputRef}
            className="admin-user-form-input"
            name="avatar"
            type="file"
            accept="image/*"
            onChange={handleFormChange}
            style={{ display: 'none' }}
          />
        </label>

        <div className="admin-user-form-actions">
          <button
            type="button"
            className="cancel"
            onClick={() => router.push('/admin')}
            disabled={savingProfile || savingPassword}
          >
            Cancel
          </button>
          <button type="submit" className="save" disabled={savingProfile}>
            {savingProfile ? 'Saving…' : 'Save Profile'}
          </button>
        </div>
      </form>

      {/* ---------- Change Password ---------- */}
      <form
        className="admin-user-form"
        onSubmit={handleChangePassword}
        style={{ width: '100%' }}
      >
        <h1 className="admin-user-form-title">Change Password</h1>

        <input
          className="admin-user-form-input"
          name="currentPassword"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          placeholder="Current Password"
          autoComplete="current-password"
        />

        <input
          className="admin-user-form-input"
          name="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          placeholder="New Password (min 3 chars)"
          autoComplete="new-password"
        />

        <input
          className="admin-user-form-input"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder="Confirm New Password"
          autoComplete="new-password"
        />

        {!passwordsMatch && (
          <div className="profile-hint error">Passwords do not match</div>
        )}

        <div className="admin-user-form-actions">
          <button
            type="button"
            className="cancel"
            onClick={() => {
              setCurrentPassword('')
              setNewPassword('')
              setConfirmPassword('')
            }}
            disabled={savingPassword}
          >
            Clear
          </button>
          <button type="submit" className="save" disabled={savingPassword}>
            {savingPassword ? 'Saving…' : 'Update Password'}
          </button>
        </div>
      </form>
    </section>
  )
}
