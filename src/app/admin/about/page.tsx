'use client'

import { useEffect, useState } from 'react'
import './page.css'
import type { AboutFormStateWithFiles } from '@/types/AboutFormState'
import { useRouter } from 'next/navigation'

const emptyLang = { en: '', th: '', jp: '', zh: '' }

const langDisplayNames: Record<'en' | 'th' | 'jp' | 'zh', string> = {
  en: 'English',
  th: 'Thai',
  jp: 'Japanese',
  zh: 'Chinese',
}


const initialState: AboutFormStateWithFiles = {
  aboutDescription1: { ...emptyLang },
  aboutDescription2: { ...emptyLang },
  aboutImage: [],
  aboutImageFiles: [],
}

export default function AdminAboutPage() {
  const [form, setForm] = useState<AboutFormStateWithFiles>(initialState)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchAbout = async () => {
      const res = await fetch('/api/about')
      if (res.ok) {
        const data = await res.json()
        setForm({ ...data, aboutImageFiles: [] })
      }
      setLoading(false)
    }
    fetchAbout()
  }, [])

  const handleLangChange = (
    section: 'aboutDescription1' | 'aboutDescription2',
    lang: keyof typeof emptyLang,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      let uploadedImageUrls: string[] = []

      if (form.aboutImageFiles && form.aboutImageFiles.length > 0) {
        const imageForm = new FormData()
        form.aboutImageFiles.forEach((file) => {
          if (file) imageForm.append('images', file)
        })

        const uploadRes = await fetch('/api/upload-images', {
          method: 'POST',
          body: imageForm,
        })

        if (uploadRes.ok) {
          const { urls } = await uploadRes.json()
          uploadedImageUrls = urls
        }
      }

      const payload = {
        aboutDescription1: form.aboutDescription1,
        aboutDescription2: form.aboutDescription2,
        aboutImage:
          uploadedImageUrls.length > 0 ? uploadedImageUrls : form.aboutImage,
      }

      const res = await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        alert('Saved successfully')
        router.refresh()
      } else {
        alert('Failed to save')
      }
    } catch (err) {
      console.error(err)
      alert('Error occurred')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p>Loading...</p>

  return (
    <section className="admin-about-main">
      <h1>About Page Admin</h1>
      <form className="admin-about-form" onSubmit={handleSubmit}>
        <h2>About Description 1</h2>
        <LangTextareaGroup
          section="aboutDescription1"
          form={form}
          handleLangChange={handleLangChange}
        />

        <h2>About Description 2</h2>
        <LangTextareaGroup
          section="aboutDescription2"
          form={form}
          handleLangChange={handleLangChange}
        />

        <h2>About Images</h2>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />
        <div className="image-preview-list">
          {(form.aboutImageFiles?.length ?? 0) > 0 ? (
            form.aboutImageFiles?.map((file, i) =>
              file ? (
                <img
                  key={i}
                  src={URL.createObjectURL(file)}
                  alt={`preview-${i}`}
                  className="image-preview"
                />
              ) : null
            )
          ) : form.aboutImage.length > 0 ? (
            form.aboutImage.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`existing-${i}`}
                className="image-preview"
              />
            ))
          ) : (
            <p>No images</p>
          )}
        </div>

        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </form>
    </section>
  )
}

type LangTextareaGroupProps = {
  section: 'aboutDescription1' | 'aboutDescription2'
  form: AboutFormStateWithFiles
  handleLangChange: (
    section: 'aboutDescription1' | 'aboutDescription2',
    lang: keyof typeof emptyLang,
    value: string
  ) => void
}

function LangTextareaGroup({
  section,
  form,
  handleLangChange,
}: LangTextareaGroupProps) {
  return (
    <div className="lang-fields">
      {(Object.keys(emptyLang) as Array<keyof typeof emptyLang>).map((lang) => (
        <div key={lang} className="lang-field">
          <label>
            {lang.toUpperCase()} ({langDisplayNames[lang]})
            <textarea
              value={form[section][lang]}
              onChange={(e) => handleLangChange(section, lang, e.target.value)}
              placeholder={`${section} (${lang})`}
              rows={2}
            />
          </label>
        </div>
      ))}
    </div>
  )
}
