'use client'
// Next.js directive: makes this a client-side component

import { useState, useEffect } from 'react' // React hook for local state
import { useRouter } from 'next/navigation' // Next.js router for programmatic navigation (e.g. redirect)
import './page.css' // Import page-specific CSS
import { articleInitialForm } from '@/constants/article/articleInitialForm' // Initial form state (constant object)
import {
  handleChange,
  handleRemoveContent,
  handleSubmit,
  addContentInputRow,
  handleContentChange,
  compressImage,
} from './function' // Import external handler functions for form logic

import UploadImageStatus from '@/loading/UploadImageStatus/UploadImageStatus'

export default function PageClient() {
  // ---- STATE HOOKS ----
  const [form, setForm] = useState(articleInitialForm)
  // Main form state (title, description, image, date, author, contents)

  const [loading, setLoading] = useState(false) // Submission loading state
  const [error, setError] = useState('') // For displaying error messages
  const [success, setSuccess] = useState('') // For displaying success messages

  const router = useRouter() // Next.js hook for navigation

  const [imageLoading, setImageLoading] = useState(false)
  const [imageLoadingMsg, setImageLoadingMsg] = useState('Uploading...')

  useEffect(() => {
    if (loading) {
      setImageLoading(true)
      setImageLoadingMsg('Saving...')
    } else {
      setImageLoading(false)
    }
  }, [loading])

  // ---- RENDER FORM ----
  return (
    <section className="admin-article-add">
      {/* Section for add article form, styled by CSS */}
      <UploadImageStatus
        imageLoading={imageLoading}
        message={error ? 'Uploading failed!' : imageLoadingMsg}
      />

      <h2>+ Add New Article</h2>

      <form
        onSubmit={(e) =>
          // Custom submit handler from ./function, pass all required states and setters
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
        <label>
          Cover Image
          {form.coverFile ? (
            <img
              src={URL.createObjectURL(form.coverFile)}
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
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              setImageLoading(true)
              try {
                const file = e.target.files?.[0]
                if (!file) return
                setImageLoadingMsg('Compressing...')
                const compressedFile = await compressImage(file)
                setForm({ ...form, coverFile: compressedFile })
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

        {/* ---- CONTENT ROWS (Dynamic List) ---- */}
        <div className="content-input">
          <strong>Add Contents (image + text)</strong>
          {form.contents.map((c, i) => (
            <div key={i} className="content-input-row">
              <label>
                {c.file ? (
                  <img
                    src={URL.createObjectURL(c.file)}
                    className="content-image-preview"
                    alt="Preview"
                  />
                ) : (
                  <img
                    src={'/icons/Upload-Image-Icon.png'}
                    className="content-image-preview"
                    alt="Fallback"
                    style={{ padding: '2rem' }}
                  />
                )}
                <input
                  className="content-image-input"
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    setImageLoading(true)
                    try {
                      const file = e.target.files?.[0]
                      if (!file) return
                      setImageLoadingMsg('Compressing...')
                      const compressedFile = await compressImage(file)
                      const updated = [...form.contents]
                      updated[i].file = compressedFile
                      setForm({ ...form, contents: updated })
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
                // Remove the content row using handler
                onClick={() => handleRemoveContent(form, setForm, i)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="add-content-btn"
            // Add the new row using the external handler, passing all current state/setters
            onClick={() => addContentInputRow(form, setForm)}
          >
            Add Row
          </button>
        </div>

        {/* ---- ERROR AND SUCCESS FEEDBACK ---- */}
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
        {/* ---- SUBMIT BUTTON ---- */}
        <button type="submit" className="save-aricle-btn" disabled={loading}>
          {loading ? 'Saving...' : 'Save Article'}
        </button>
      </form>
    </section>
  )
}
