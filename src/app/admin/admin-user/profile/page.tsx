// src/app/admin/admin-user/profile/page.tsx
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import './page.css'
import UploadImageStatus from '@/loading/UploadImageStatus/UploadImageStatus'
import { compressAvatar } from '@/utils/imageHelpers'

// Profile type (matches the data returned from backend API)
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
  const [profile, setProfile] = useState<Profile | null>(null) // server copy of profile
  const [form, setForm] = useState({
    username: '',
    email: '',
    avatarFile: null as File | null, // avatar selected locally but not uploaded yet
  })
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null) // preview image for UI
  const [avatarInfo, setAvatarInfo] = useState<string>('') // show compression info (old size → new size)

  // ----- Password form state -----
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  // derived state: true if both new passwords match
  const passwordsMatch = useMemo(
    () => !newPassword || !confirmPassword || newPassword === confirmPassword,
    [newPassword, confirmPassword]
  )

  // ----- UI state -----
  const [loading, setLoading] = useState(true) // initial fetch loading
  const [savingProfile, setSavingProfile] = useState(false) // disable form while saving profile
  const [savingPassword, setSavingPassword] = useState(false) // disable form while saving password
  const [error, setError] = useState<string>('') // show error messages
  const [success, setSuccess] = useState<string>('') // show success messages

  // Banner UI while image is being compressed/uploaded
  const [imageLoading, setImageLoading] = useState(false)
  const [imageLoadingMsg, setImageLoadingMsg] = useState('Uploading...')

  const fileInputRef = useRef<HTMLInputElement | null>(null) // access <input type=file>
  const blobUrlRef = useRef<string | null>(null) // track object URL for preview to revoke later

  // cleanup on unmount → revoke any blob URL to free memory
  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current)
        blobUrlRef.current = null
      }
    }
  }, [])

  // Utility: format bytes into MB text (for info message)
  function prettySize(bytes: number) {
    const mb = bytes / 1024 / 1024
    return `${mb.toFixed(2)} MB`
  }

  // Fetch current profile when component mounts
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
        // build profile object
        const p: Profile = {
          id: data.id,
          username: data.username ?? '',
          email: data.email ?? '',
          role: data.role ?? '',
          active: !!data.active,
          avatarUrl: data.avatarUrl ?? '',
        }
        setProfile(p)
        // also set the editable form state
        setForm({
          username: p.username,
          email: p.email ?? '',
          avatarFile: null,
        })
        // show preview (server avatar)
        setAvatarPreview(p.avatarUrl || null)
        setAvatarInfo('')
      } catch (e: any) {
        setError(e?.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // Handle input changes (both text and file inputs)
  async function handleFormChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value, type, files } = e.target as any

    // If it's an <input type=file>
    if (type === 'file') {
      const file: File | null = files?.[0] ?? null

      // revoke previous preview blob if any
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current)
        blobUrlRef.current = null
      }

      // no file chosen → reset
      if (!file) {
        setForm((f) => ({ ...f, avatarFile: null }))
        setAvatarPreview(profile?.avatarUrl || null)
        setAvatarInfo('')
        return
      }

      // validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file')
        setForm((f) => ({ ...f, avatarFile: null }))
        setAvatarPreview(profile?.avatarUrl || null)
        setAvatarInfo('')
        return
      }

      try {
        setImageLoading(true)
        setImageLoadingMsg('Compressing...')
        // compress avatar before upload
        const compressed = await compressAvatar(file)
        setForm((f) => ({ ...f, avatarFile: compressed }))
        // create local preview URL
        const url = URL.createObjectURL(compressed)
        blobUrlRef.current = url
        setAvatarPreview(url)
        setError('')
        // show compression info (before/after size)
        setAvatarInfo(
          `Compressed from ${prettySize(file.size)} → ${prettySize(
            compressed.size
          )}`
        )
      } catch (err) {
        console.error(err)
        setError('Failed to process image')
        setForm((f) => ({ ...f, avatarFile: null }))
        setAvatarPreview(profile?.avatarUrl || null)
        setAvatarInfo('')
      } finally {
        setImageLoading(false)
        setImageLoadingMsg('Uploading...')
      }
      return
    }

    // Otherwise handle text/email fields
    setForm((f) => ({ ...f, [name]: value }))
  }

  // Submit profile form (username/email/avatar)
  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    // validations
    if (!form.username || form.username.trim().length < 3) {
      setError('Username must be at least 3 characters')
      return
    }
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      setError('Invalid email format')
      return
    }

    setSavingProfile(true)
    setImageLoading(true)
    setImageLoadingMsg('Saving...')
    try {
      // build FormData to send to backend
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
        setImageLoading(false)
        return
      }

      const updated = data.user

      // add timestamp query string to avatar URL to bust cache
      const bustUrl = updated.avatarUrl
        ? `${updated.avatarUrl}?t=${Date.now()}`
        : ''

      // update local profile state
      setProfile((p) =>
        p
          ? {
              ...p,
              username: updated.username,
              email: updated.email,
              avatarUrl: bustUrl || updated.avatarUrl,
            }
          : p
      )
      setForm((f) => ({ ...f, avatarFile: null }))

      // revoke blob preview now that server image is ready
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current)
        blobUrlRef.current = null
      }
      setAvatarPreview(bustUrl || updated.avatarUrl || avatarPreview)
      setAvatarInfo('')
      setSuccess('Profile updated')

      // persist for Navbar (in localStorage)
      localStorage.setItem(
        'adminUser',
        JSON.stringify({
          username: updated.username,
          avatarUrl: bustUrl || '',
          role: profile?.role || '',
        })
      )

      // tell Navbar to refresh itself
      window.dispatchEvent(new Event('profile-updated'))
    } catch (e: any) {
      setError(e?.message || 'Failed to update profile')
    } finally {
      setSavingProfile(false)
      setImageLoading(false)
      setImageLoadingMsg('Uploading...')
    }
  }

  // Submit password change form
  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    // validations
    if (!currentPassword || !newPassword) {
      setError('Please fill all password fields')
      return
    }
    if (newPassword.length < 3) {
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(data?.error || `Failed to update password (${res.status})`)
        setSavingPassword(false)
        return
      }

      // reset password form
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

  // show loader before profile is loaded
  if (loading) {
    return (
      <section className="admin-member-main">
        <div className="admin-user-form">
          <h1 className="admin-user-form-title">Loading profile…</h1>
        </div>
      </section>
    )
  }

  // ---------- Render ----------
  return (
    <section className="admin-member-main profile-page">
      {/* Banner showing uploading/compression/saving state */}
      <UploadImageStatus
        imageLoading={imageLoading}
        message={error ? 'Uploading failed!' : imageLoadingMsg}
      />

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

        {/* Username input */}
        <input
          className="admin-user-form-input"
          name="username"
          value={form.username}
          onChange={handleFormChange}
          required
          placeholder="Username"
          autoComplete="off"
        />

        {/* Email input */}
        <input
          className="admin-user-form-input"
          name="email"
          type="email"
          value={form.email}
          onChange={handleFormChange}
          placeholder="Email"
          autoComplete="off"
        />

        {/* Avatar upload */}
        <label className="admin-user-form-avatar-wrap">
          <p className="admin-user-form-avatar-title">Profile Image</p>

          <Image
            src={avatarPreview || '/icons/Upload-Image-Icon-Circle.png'}
            alt="Avatar"
            height={430}
            width={430}
            className="admin-user-form-avatar"
          />

          {/* show compression info */}
          {avatarInfo && (
            <p
              style={{ marginTop: '0.5rem', opacity: 0.8, textAlign: 'center' }}
            >
              {avatarInfo}
            </p>
          )}

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

        {/* Action buttons */}
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

        {/* inline hint if passwords don't match */}
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
