'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import '../../page.css'
import {
  handleChange,
  handleRemoveContent,
  addContentInputRow,
  handleContentChange,
} from '../../function'
import { articleInitialForm } from '@/constants/article/articleInitialForm'
import DeleteButton from './DeleteButton/DeleteButton'
import UploadImageStatus from '@/loading/UploadImageStatus/UploadImageStatus'
import { compressImage } from '@/utils/imageHelpers'

// ---- Compression presets (edit page) ----
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

type ContentItem = {
  image?: string
  text?: string
  file?: File | null
}
type FormState = {
  title?: string
  description?: string
  image?: string
  date?: string
  author?: string
  coverFile?: File | null
  contents: ContentItem[]
}

// ---- Helper to avoid object-URL leaks (cover) ----
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
  const [form, setForm] = useState<FormState>({
    ...articleInitialForm,
    contents: articleInitialForm?.contents || [],
    coverFile: null,
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [coverInfo, setCoverInfo] = useState<string>('') // 👈 new compression info

  const router = useRouter()
  const params = useParams()
  const articleId = params.id as string

  // Upload banner UI state
  const [imageLoading, setImageLoading] = useState(false)
  const [imageLoadingMsg, setImageLoadingMsg] = useState('Uploading...')

  // Reflect submit loading in the upload banner
  useEffect(() => {
    if (loading) {
      setImageLoading(true)
      setImageLoadingMsg('Saving...')
    } else {
      setImageLoading(false)
      setImageLoadingMsg('Uploading...')
    }
  }, [loading])

  // ---- Fetch article on mount ----
  useEffect(() => {
    async function fetchArticle() {
      setFetching(true)
      setError('')
      try {
        const res = await fetch(`/api/article/${articleId}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to load article')
        const article = data
        if (!article) throw new Error(`Article not found with ID: ${articleId}`)
        setForm({
          title: article.title || '',
          description: article.description || '',
          image: article.image || '',
          date: article.date || '',
          author: article.author || '',
          coverFile: null,
          contents: Array.isArray(article.contents)
            ? article.contents.map(
                (c: any): ContentItem => ({
                  image: c?.image || '',
                  text: c?.text || '',
                  file: null,
                })
              )
            : [{ image: '', text: '', file: null }],
        })
        setCoverInfo('') // reset info when loading from server
      } catch (err: any) {
        console.error('Error fetching article:', err)
        setError(err.message || 'Unknown error')
      } finally {
        setFetching(false)
      }
    }
    if (articleId) fetchArticle()
  }, [articleId])

  // ---- Safe preview for cover ----
  const coverPreviewUrl = useObjectURL(form.coverFile ?? null)

  // ---- Safe previews for content images ----
  const contentPreviews = useMemo(() => {
    const urls: (string | null)[] = []
    const created: string[] = []
    ;(form.contents || []).forEach((c) => {
      if (c?.file) {
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

  function prettySize(bytes: number) {
    const mb = bytes / 1024 / 1024
    return `${mb.toFixed(2)} MB`
  }

  // ---- Submit (UPDATE) ----
  async function handleUpdate(
    e: React.FormEvent,
    formState: FormState,
    setErrorFn: (v: string) => void,
    setSuccessFn: (v: string) => void,
    setLoadingFn: (v: boolean) => void,
    routerInst: typeof router,
    id: string
  ) {
    e.preventDefault()
    setErrorFn('')
    setSuccessFn('')
    setLoadingFn(true)
    try {
      let coverImageUrl = formState.image
      if (formState.coverFile) {
        const fd = new FormData()
        fd.append('file', formState.coverFile)
        const res = await fetch('/api/upload/article', {
          method: 'POST',
          body: fd,
        })
        if (!res.ok) throw new Error('Cover image upload failed')
        const data = await res.json()
        coverImageUrl = data.url
      }

      const uploadedContents = await Promise.all(
        (formState.contents || []).map(async (c) => {
          if (c.file) {
            const fd = new FormData()
            fd.append('file', c.file)
            const res = await fetch('/api/upload/article', {
              method: 'POST',
              body: fd,
            })
            if (!res.ok) throw new Error('Failed to upload content image')
            const data = await res.json()
            return { image: data.url, text: c.text || '' }
          }
          return { image: c.image || '', text: c.text || '' }
        })
      )

      const generatedHref =
        '/article/' +
        encodeURIComponent(
          (formState.title || '').replace(/\s+/g, '-').toLowerCase()
        )

      const response = await fetch(`/api/article/${id}/edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formState,
          image: coverImageUrl,
          coverFile: undefined,
          contents: uploadedContents,
          href: generatedHref,
        }),
      })

      if (!response.ok) throw new Error('Failed to update article')
      setSuccessFn('Article updated successfully!')
      setLoadingFn(false)
      setTimeout(() => routerInst.push('/admin/article'), 1200)
    } catch (err: any) {
      setErrorFn(err.message || 'Unknown error')
      setLoadingFn(false)
    }
  }

  if (fetching) return <div>Loading...</div>
  if (error && !form.title) return <div className="form-error">{error}</div>

  return (
    <section className="admin-article-add">
      <UploadImageStatus
        imageLoading={imageLoading}
        message={error ? 'Uploading failed!' : imageLoadingMsg}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h2>Edit Article</h2>
      </div>

      <form
        onSubmit={(e) =>
          handleUpdate(
            e,
            form,
            setError,
            setSuccess,
            setLoading,
            router,
            articleId
          )
        }
        className="admin-article-form"
      >
        <label>
          Title
          <input
            name="title"
            value={form.title || ''}
            onChange={handleChange(form, setForm)}
            required
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={form.description || ''}
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
          ) : form.image ? (
            <img
              src={form.image}
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
          {/* 👇 compression info under cover */}
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
                setCoverInfo('')
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
            value={form.date || ''}
            onChange={handleChange(form, setForm)}
            type="date"
          />
        </label>

        <label>
          Author
          <input
            name="author"
            value={form.author || ''}
            onChange={handleChange(form, setForm)}
          />
        </label>

        <hr />

        {/* ---- CONTENTS ---- */}
        <div className="content-input">
          <strong>Edit Contents (image + text)</strong>

          {Array.isArray(form.contents) &&
            form.contents.map((c, i) => (
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
                      src={c.image || '/icons/Upload-Image-Icon.png'}
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
                        const updated = [...(form.contents || [])]
                        if (!updated[i])
                          updated[i] = { image: '', text: '', file: null }
                        updated[i].file = compressedFile
                        setForm({ ...form, contents: updated })
                        setError('')
                      } catch (err) {
                        console.error(err)
                        setError('Failed to process content image')
                      } finally {
                        setImageLoading(false)
                        setImageLoadingMsg('Uploading...')
                      }
                    }}
                  />
                </label>

                <textarea
                  placeholder="Content Text"
                  value={c.text || ''}
                  onChange={(e) =>
                    handleContentChange(
                      form,
                      setForm,
                      i,
                      'text',
                      e.target.value
                    )
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
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      <DeleteButton
        articleId={articleId}
        articleTitle={form.title || 'this article'}
      />
    </section>
  )
}
