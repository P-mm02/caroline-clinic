'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import './page.css'

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

  // Avatar preview
  useEffect(() => {
    if (form.avatarFile) {
      const url = URL.createObjectURL(form.avatarFile)
      setAvatarPreview(url)
      return () => URL.revokeObjectURL(url)
    }
    setAvatarPreview(null)
  }, [form.avatarFile])

  function handleFormChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value, type, checked, files } = e.target as any
    if (type === 'checkbox') {
      setForm((f) => ({ ...f, [name]: checked }))
    } else if (type === 'file') {
      const file = files[0] ?? null
      setForm((f) => ({ ...f, avatarFile: file }))
    } else {
      setForm((f) => ({ ...f, [name]: value }))
    }

    // Live password validation
    if (name === 'confirmPassword' || name === 'password') {
      const pwd = name === 'password' ? value : form.password
      const confirm = name === 'confirmPassword' ? value : form.confirmPassword
      setPasswordError(pwd && confirm && pwd !== confirm ? 'Passwords do not match' : '')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    // Final password validation
    if (form.password !== form.confirmPassword) {
      setPasswordError('Passwords do not match')
      setSaving(false)
      return
    }

    setSaving(true)

    const formData = new FormData()
    Object.entries(form).forEach(([k, v]) => {
      // Do not submit confirmPassword to backend
      if (k === 'avatarFile' && v) formData.append('avatar', v as File)
      else if (k !== 'avatarFile' && k !== 'confirmPassword') formData.append(k, v as string)
    })

    const res = await fetch('/api/admin-user/add', {
      method: 'POST',
      body: formData,
    })
    const resJson = await res.json()
    if (res.ok) {
      router.push('/admin/admin-user')
    } else {
      setError(resJson.error || 'Failed to add user')
      setSaving(false)
    }
  }

  return (
    <section className="admin-member-main">
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
          name="email"
          type="email"
          value={form.email}
          onChange={handleFormChange}
          placeholder="Email"
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
        {passwordError && <div style={{ color: 'red', fontSize: '2rem'}}>{passwordError}</div>}

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
        <label className="admin-user-form-avatar-wrap">
          <p className="admin-user-form-avatar-title">Profile Image</p>
          <Image
            src={avatarPreview || '/icons/Upload-Image-Icon-Circle.png'}
            alt="Preview"
            height={430}
            width={430}
            className="admin-user-form-avatar"
          />
          <input
            className="admin-user-form-input"
            name="avatar"
            type="file"
            accept="image/*"
            onChange={handleFormChange}
            style={{ display: 'none' }}
          />
        </label>
        {error && (
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
