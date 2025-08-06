'use client'

import { useState } from 'react'
import type {
  AboutFormState,
  AboutFormStateWithFiles,
} from '@/types/AboutFormState'
import './page.css'

const emptyLang = { en: '', th: '', jp: '', zh: '' }

const initialState: AboutFormStateWithFiles = {
  aboutDescription1: { ...emptyLang },
  aboutDescription2: { ...emptyLang },
  aboutImage: [],
  aboutImageFiles: [],
}

export default function AdminAboutPage() {
  const [form, setForm] = useState<AboutFormStateWithFiles>(initialState)
  const [saving, setSaving] = useState(false)

  const handleLangChange = (
    section: 'aboutDescription1' | 'aboutDescription2',
    lang: 'en' | 'th' | 'jp' | 'zh',
    value: string
  ) => {
    setForm((f) => ({
      ...f,
      [section]: { ...f[section], [lang]: value },
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    setForm((f) => ({
      ...f,
      aboutImageFiles: files,
    }))
  }

  // Dummy save function (replace with actual API call)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      alert('Saved (simulate)')
    }, 1000)
  }

  return (
    <main className="admin-about-main">
      <h1>About Page Admin</h1>
      <form className="admin-about-form" onSubmit={handleSubmit}>
        <h2>About Description 1</h2>
        <div className="lang-fields">
          {(['en', 'th', 'jp', 'zh'] as const).map((lang) => (
            <div key={lang} className="lang-field">
              <label>
                {lang.toUpperCase()}
                <textarea
                  value={form.aboutDescription1[lang]}
                  onChange={(e) =>
                    handleLangChange('aboutDescription1', lang, e.target.value)
                  }
                  placeholder={`Description 1 (${lang})`}
                  rows={2}
                />
              </label>
            </div>
          ))}
        </div>

        <h2>About Description 2</h2>
        <div className="lang-fields">
          {(['en', 'th', 'jp', 'zh'] as const).map((lang) => (
            <div key={lang} className="lang-field">
              <label>
                {lang.toUpperCase()}
                <textarea
                  value={form.aboutDescription2[lang]}
                  onChange={(e) =>
                    handleLangChange('aboutDescription2', lang, e.target.value)
                  }
                  placeholder={`Description 2 (${lang})`}
                  rows={2}
                />
              </label>
            </div>
          ))}
        </div>

        <h2>About Images</h2>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
        <div className="image-preview-list">
          {form.aboutImageFiles && form.aboutImageFiles.length > 0 ? (
            form.aboutImageFiles.map((file, i) =>
              file ? (
                <img
                  key={i}
                  src={URL.createObjectURL(file)}
                  alt={`preview-${i}`}
                  className="image-preview"
                />
              ) : null
            )
          ) : (
            <p>No images selected</p>
          )}
        </div>

        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </form>
    </main>
  )
}
