'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import '../../page.css'
import {
  handleChange,
  handleRemoveContent,
  addContentInputRow,
  handleContentChange,
  compressImage,
} from '../../function'
import { articleInitialForm } from '@/constants/article/articleInitialForm'
import DeleteButton from './DeleteButton/DeleteButton'

import UploadImageStatus from '@/loading/UploadImageStatus/UploadImageStatus'

export default function PageClient() {
  const [form, setForm] = useState({
    ...articleInitialForm,
    contents: articleInitialForm?.contents || [],
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const router = useRouter()
  const params = useParams()
  const articleId = params.id as string

  useEffect(() => {
    async function fetchArticle() {
      setFetching(true)
      setError('')
      try {
        const res = await fetch(`/api/article/${articleId}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to load article')
        let article = data
        if (!article) throw new Error(`Article not found with ID: ${articleId}`)
        setForm({
          title: article.title || '',
          description: article.description || '',
          image: article.image || '',
          date: article.date || '',
          author: article.author || '',
          coverFile: null,
          contents: Array.isArray(article.contents)
            ? article.contents.map((c: any) => ({
                image: c?.image || '',
                text: c?.text || '',
                file: null,
              }))
            : [{ image: '', text: '', file: null }],
        })
      } catch (err: any) {
        console.error('Error fetching article:', err)
        setError(err.message || 'Unknown error')
      }
      setFetching(false)
    }
    if (articleId) fetchArticle()
  }, [articleId])

  async function handleUpdate(
    e: React.FormEvent,
    form: any,
    setError: (v: string) => void,
    setSuccess: (v: string) => void,
    setLoading: (v: boolean) => void,
    router: any,
    articleId: string
  ) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      let coverImageUrl = form.image
      if (form.coverFile) {
        const formData = new FormData()
        formData.append('file', form.coverFile)
        const res = await fetch('/api/upload/article', {
          method: 'POST',
          body: formData,
        })
        if (!res.ok) throw new Error('Cover image upload failed')
        const data = await res.json()
        coverImageUrl = data.url
      }
      const uploadedContents = await Promise.all(
        (form.contents || []).map(async (c: any) => {
          if (c.file) {
            const formData = new FormData()
            formData.append('file', c.file)
            const res = await fetch('/api/upload/article', {
              method: 'POST',
              body: formData,
            })
            if (!res.ok) throw new Error('Failed to upload content image')
            const data = await res.json()
            return { image: data.url, text: c.text }
          }
          return { image: c.image, text: c.text }
        })
      )
      const generatedHref =
        '/article/' +
        encodeURIComponent(form.title.replace(/\s+/g, '-').toLowerCase())
      const response = await fetch(`/api/article/${articleId}/edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          image: coverImageUrl,
          coverFile: undefined,
          contents: uploadedContents,
          href: generatedHref,
        }),
      })
      if (!response.ok) throw new Error('Failed to update article')
      setSuccess('Article updated successfully!')
      setLoading(false)
      setTimeout(() => router.push('/admin/article'), 1200)
    } catch (err: any) {
      setError(err.message || 'Unknown error')
      setLoading(false)
    }
  }
  
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

  if (fetching) return <div>Loading...</div>
  if (error) return <div className="form-error">{error}</div>
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
        <label>
          Cover Image
          {form.coverFile ? (
            <img
              src={URL.createObjectURL(form.coverFile)}
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
              src={'/icons/Upload-Image-Icon.png'}
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
        <div className="content-input">
          <strong>Edit Contents (image + text)</strong>
          {Array.isArray(form.contents) &&
            form.contents.map((c, i) => (
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
                      setImageLoading(true)
                      try {
                        const file = e.target.files?.[0]
                        if (!file) return
                        setImageLoadingMsg('Compressing...')
                        const compressedFile = await compressImage(file)
                        const updated = [...(form.contents || [])]
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
