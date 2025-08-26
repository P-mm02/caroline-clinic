// src/app/admin/article/add/pageClient.tsx
'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import './page.css'
import { articleInitialForm } from '@/constants/article/articleInitialForm'
import {
  handleChange,
  handleRemoveContent,
  handleSubmit,
  addContentInputRow,
  handleContentChange,
} from './function'
import { compressImage } from '@/utils/imageHelpers'
import UploadImageStatus from '@/loading/UploadImageStatus/UploadImageStatus'

// Compression presets
const COVER_OPTS = {
  maxSizeMB: 1.5,
  maxWidthOrHeight: 1920,
  fileType: 'image/webp',
  initialQuality: 0.92,
}
const CONTENT_OPTS = {
  maxSizeMB: 1.0,
  maxWidthOrHeight: 1600,
  fileType: 'image/webp',
  initialQuality: 0.9,
}

function prettySize(bytes: number) {
  const mb = bytes / 1024 / 1024
  return `${mb.toFixed(2)} MB`
}

// Helper to avoid leaking object URLs
function useObjectURL(file: File | null | undefined) {
  const [url, setUrl] = useState<string | null>(null)
  useEffect(() => {
    if (!file) {
      setUrl(null)
      return
    }
    const u = URL.createObjectURL(file)
    setUrl(u)
    return () => URL.revokeObjectURL(u)
  }, [file])
  return url
}

export default function PageClient() {
  // ---- STATE ----
  const [form, setForm] = useState(articleInitialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [imageLoading, setImageLoading] = useState(false)
  const [imageLoadingMsg, setImageLoadingMsg] = useState('Uploading...')

  const [coverInfo, setCoverInfo] = useState<string>('') // ⬅️ cover compression info
  const [contentInfo, setContentInfo] = useState<string[]>([]) // ⬅️ per-content compression info

  const router = useRouter()

  // Reflect submit loading in the upload status banner
  useEffect(() => {
    if (loading) {
      setImageLoading(true)
      setImageLoadingMsg('Saving...')
    } else {
      setImageLoading(false)
      setImageLoadingMsg('Uploading...')
    }
  }, [loading])

  // Cover preview
  const coverPreviewUrl = useObjectURL(form.coverFile)

  // Content previews
  const contentPreviews = useMemo(() => {
    const urls: (string | null)[] = []
    const created: string[] = []
    form.contents.forEach((c) => {
      if (c.file) {
        const u = URL.createObjectURL(c.file)
        urls.push(u)
        created.push(u)
      } else {
        urls.push(null)
      }
    })
    return { urls, created }
  }, [form.contents])

  useEffect(() => {
    return () => {
      contentPreviews.created.forEach((u) => URL.revokeObjectURL(u))
    }
  }, [contentPreviews])

  // ---- RENDER ----
  return (
    <section className="admin-article-add">
      <UploadImageStatus
        imageLoading={imageLoading}
        message={error ? 'Uploading failed!' : imageLoadingMsg}
      />

      <h2>+ Add New Article</h2>

      <form
        onSubmit={(e) =>
          handleSubmit(e, form, setError, setSuccess, setLoading, router)
        }
        className="admin-article-form"
      >
        {/* ---- BASIC FIELDS ---- */}
        <label>
          Title
          <input
            name="title"
            value={form.title}
            onChange={handleChange(form, setForm)}
            required
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange(form, setForm)}
            required
          />
        </label>

        {/* ---- COVER IMAGE ---- */}
        <label>
          Cover Image
          {form.coverFile ? (
            <img
              src={coverPreviewUrl ?? ''}
              alt="Cover Preview"
              className="content-image-preview"
            />
          ) : (
            <img
              src="/icons/Upload-Image-Icon.png"
              alt="Fallback"
              className="content-image-preview"
              style={{ padding: '2rem' }}
            />
          )}
          {coverInfo && (
            <p style={{ marginTop: '0.5rem', opacity: 0.8 }}>{coverInfo}</p>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (!file) return
              if (!file.type.startsWith('image/')) {
                setError('Please select an image file')
                return
              }
              setImageLoading(true)
              try {
                setImageLoadingMsg('Compressing cover...')
                const compressedFile = await compressImage(file, COVER_OPTS)
                setForm({ ...form, coverFile: compressedFile })
                setCoverInfo(
                  `Compressed from ${prettySize(file.size)} → ${prettySize(
                    compressedFile.size
                  )}`
                )
                setError('')
              } catch (err) {
                console.error(err)
                setError('Failed to process cover image')
                setCoverInfo('')
              } finally {
                setImageLoading(false)
                setImageLoadingMsg('Uploading...')
              }
            }}
          />
        </label>

        <label>
          Date
          <input
            className="article-date-input"
            name="date"
            value={form.date}
            onChange={handleChange(form, setForm)}
            type="date"
          />
        </label>

        <label>
          Author
          <input
            name="author"
            value={form.author}
            onChange={handleChange(form, setForm)}
          />
        </label>

        <hr />

        {/* ---- CONTENT ROWS ---- */}
        <div className="content-input">
          <strong>Add Contents (image + text)</strong>

          {form.contents.map((c, i) => (
            <div key={i} className="content-input-row">
              <label>
                {c.file ? (
                  <img
                    src={contentPreviews.urls[i] ?? ''}
                    className="content-image-preview"
                    alt="Preview"
                  />
                ) : (
                  <img
                    src="/icons/Upload-Image-Icon.png"
                    className="content-image-preview"
                    alt="Fallback"
                    style={{ padding: '2rem' }}
                  />
                )}
                {contentInfo[i] && (
                  <p
                    style={{
                      marginTop: '0.3rem',
                      opacity: 0.8,
                      fontSize: '0.9rem',
                    }}
                  >
                    {contentInfo[i]}
                  </p>
                )}
                <input
                  className="content-image-input"
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    if (!file.type.startsWith('image/')) {
                      setError('Please select an image file')
                      return
                    }
                    setImageLoading(true)
                    try {
                      setImageLoadingMsg('Compressing image...')
                      const compressedFile = await compressImage(
                        file,
                        CONTENT_OPTS
                      )
                      const updated = [...form.contents]
                      updated[i].file = compressedFile
                      setForm({ ...form, contents: updated })

                      const info = [...contentInfo]
                      info[i] = `Compressed from ${prettySize(
                        file.size
                      )} → ${prettySize(compressedFile.size)}`
                      setContentInfo(info)

                      setError('')
                    } catch (err) {
                      console.error(err)
                      setError('Failed to process content image')
                      const info = [...contentInfo]
                      info[i] = ''
                      setContentInfo(info)
                    } finally {
                      setImageLoading(false)
                      setImageLoadingMsg('Uploading...')
                    }
                  }}
                />
              </label>

              <textarea
                placeholder="Content Text"
                value={c.text}
                onChange={(e) =>
                  handleContentChange(form, setForm, i, 'text', e.target.value)
                }
              />

              <button
                type="button"
                className="remove-content-btn"
                onClick={() => handleRemoveContent(form, setForm, i)}
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            className="add-content-btn"
            onClick={() => addContentInputRow(form, setForm)}
          >
            Add Row
          </button>
        </div>

        {/* ---- FEEDBACK ---- */}
        {error && (
          <div className="form-error" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="form-success" role="status">
            {success}
          </div>
        )}

        {/* ---- SUBMIT ---- */}
        <button type="submit" className="save-aricle-btn" disabled={loading}>
          {loading ? 'Saving...' : 'Save Article'}
        </button>
      </form>
    </section>
  )
}
