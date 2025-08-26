'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import './page.css'
import { compressAvatar } from '@/utils/imageHelpers'
import UploadImageStatus from '@/loading/UploadImageStatus/UploadImageStatus'

export default function AddAdminMemberPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'viewer',
    active: true,
    avatarFile: null as File | null,
  })

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [avatarInfo, setAvatarInfo] = useState<string>('') // size info

  // Upload banner states
  const [imageLoading, setImageLoading] = useState(false)
  const [imageLoadingMsg, setImageLoadingMsg] = useState('Uploading...')

  // Avatar preview
  useEffect(() => {
    if (form.avatarFile) {
      const url = URL.createObjectURL(form.avatarFile)
      setAvatarPreview(url)
      return () => URL.revokeObjectURL(url)
    }
    setAvatarPreview(null)
  }, [form.avatarFile])

  function prettySize(bytes: number) {
    const mb = bytes / 1024 / 1024
    return `${mb.toFixed(2)} MB`
  }

  async function handleFormChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value, type, checked, files } = e.target as any

    if (type === 'checkbox') {
      setForm((f) => ({ ...f, [name]: checked }))
    } else if (type === 'file') {
      const file: File | null = files?.[0] ?? null
      if (!file) {
        setForm((f) => ({ ...f, avatarFile: null }))
        setAvatarInfo('')
        return
      }

      if (!file.type.startsWith('image/')) {
        setError('Please select an image file')
        setForm((f) => ({ ...f, avatarFile: null }))
        setAvatarInfo('')
        return
      }

      try {
        setImageLoading(true)
        setImageLoadingMsg('Compressing...')
        const compressed = await compressAvatar(file)
        setForm((f) => ({ ...f, avatarFile: compressed }))
        setError('')
        setAvatarInfo(
          `Compressed from ${prettySize(file.size)} → ${prettySize(
            compressed.size
          )}`
        )
      } catch (err) {
        console.error(err)
        setError('Failed to process image')
        setForm((f) => ({ ...f, avatarFile: null }))
        setAvatarInfo('')
      } finally {
        setImageLoading(false)
        setImageLoadingMsg('Uploading...')
      }
    } else {
      setForm((f) => ({ ...f, [name]: value }))
    }

    // Password validation
    if (name === 'confirmPassword' || name === 'password') {
      const pwd = name === 'password' ? value : form.password
      const confirm = name === 'confirmPassword' ? value : form.confirmPassword
      setPasswordError(
        pwd && confirm && pwd !== confirm ? 'Passwords do not match' : ''
      )
    }

    // Email validation
    if (name === 'email') {
      if (value && !/^\S+@\S+\.\S+$/.test(value)) {
        setError('Invalid email format')
      } else {
        setError('')
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setPasswordError('Passwords do not match')
      setSaving(false)
      return
    }

    setSaving(true)
    setImageLoading(true)
    setImageLoadingMsg('Saving...')

    const formData = new FormData()
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'avatarFile' && v) formData.append('avatar', v as File)
      else if (k !== 'avatarFile' && k !== 'confirmPassword') {
        formData.append(k, String(v))
      }
    })

    const res = await fetch('/api/admin-user/add', {
      method: 'POST',
      body: formData,
    })
    const resJson = await res.json().catch(() => ({}))

    if (res.ok) {
      router.push('/admin/admin-user')
    } else {
      setError((resJson as any)?.error || 'Failed to add user')
      setSaving(false)
    }
    setImageLoading(false)
  }

  return (
    <section className="admin-member-main">
      <UploadImageStatus
        imageLoading={imageLoading}
        message={error ? 'Uploading failed!' : imageLoadingMsg}
      />

      <form
        className="admin-user-form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <h1 className="admin-user-form-title">Add Member</h1>

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
          name="password"
          type="password"
          value={form.password}
          onChange={handleFormChange}
          required
          placeholder="Password"
        />
        <input
          className="admin-user-form-input"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleFormChange}
          required
          placeholder="Confirm Password"
        />
        {passwordError && (
          <div style={{ color: 'red', fontSize: '2rem' }}>{passwordError}</div>
        )}

        <select
          className="admin-user-form-input"
          name="role"
          value={form.role}
          onChange={handleFormChange}
        >
          <option value="superadmin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="operator">Operator</option>
          <option value="viewer">Viewer</option>
        </select>

        <input
          className="admin-user-form-input"
          name="email"
          type="email"
          value={form.email}
          onChange={handleFormChange}
          placeholder="Email (optional)"
          autoComplete="off"
        />
        {error === 'Invalid email format' && (
          <div style={{ color: 'red', fontSize: '1.5rem' }}>{error}</div>
        )}

        <label className="admin-user-form-checkbox-label">
          <input
            className="admin-user-form-checkbox"
            name="active"
            type="checkbox"
            checked={form.active ?? true}
            onChange={handleFormChange}
          />
          Active
        </label>

        <label className="admin-user-form-avatar-wrap" htmlFor="avatar-input">
          <p className="admin-user-form-avatar-title">Profile Image</p>
          <Image
            src={avatarPreview || '/icons/Upload-Image-Icon-Circle.png'}
            alt="Preview"
            height={430}
            width={430}
            className="admin-user-form-avatar"
          />
          {avatarInfo && (
            <p style={{ marginTop: '0.5rem', opacity: 0.8 }}>{avatarInfo}</p>
          )}
        </label>
        <input
          id="avatar-input"
          className="admin-user-form-input"
          name="avatar"
          type="file"
          accept="image/*"
          onChange={handleFormChange}
          style={{ display: 'none' }}
        />

        {error && error !== 'Invalid email format' && (
          <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>
        )}

        <div className="admin-user-form-actions">
          <button
            type="button"
            className="cancel"
            onClick={() => router.push('/admin/admin-user')}
            disabled={saving}
          >
            Cancel
          </button>
          <button type="submit" className="save" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </section>
  )
}
