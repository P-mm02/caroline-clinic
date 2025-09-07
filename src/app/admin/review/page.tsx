// src/app/admin/review/page.tsx
'use client'

import { useEffect, useState } from 'react'
// Reuse About page styles for identical UI (no new CSS required)
import './page.css'
import { compressImage } from '@/utils/imageHelpers'

type CloudinaryImage = {
  asset_id: string
  public_id: string
  format: string
  width: number
  height: number
  bytes: number
  secure_url: string
  created_at: string
}

// Tweak as you prefer for reviews (often portrait-oriented)
// Smaller cap than About to keep uploads snappy
const REVIEW_OPTS = {
  maxSizeMB: 1.5,
  maxWidthOrHeight: 1200,
  fileType: 'image/webp',
  initialQuality: 1,
}

export default function AdminReviewPage() {
  const [images, setImages] = useState<CloudinaryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [busyIds, setBusyIds] = useState<Record<string, boolean>>({})
  const [uploading, setUploading] = useState(false)
  const [uploadMsg, setUploadMsg] = useState('Uploading...')

  // ---- Fetch list from /review ----
  async function fetchList(cursor?: string | null) {
    try {
      const url = cursor
        ? `/api/cloudinary/review/list?next=${encodeURIComponent(cursor)}`
        : '/api/cloudinary/review/list'
      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to load images')
      const data = await res.json()
      if (!cursor) {
        setImages(data.resources)
      } else {
        setImages((prev) => [...prev, ...data.resources])
      }
      setNextCursor(data.next_cursor ?? null)
      setError('')
    } catch (e) {
      console.error(e)
      setError('Failed to load images')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  // helper
  function prettySize(bytes: number) {
    const mb = bytes / 1024 / 1024
    return `${mb.toFixed(2)} MB`
  }

  // ---- Upload (with client-side compression) to /review ----
  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return

    const arr = Array.from(files)
    const notImages = arr.filter((f) => !f.type.startsWith('image/'))
    if (notImages.length > 0) {
      setError(`Only image files allowed (${notImages.length} invalid).`)
      return
    }

    setUploading(true)
    setUploadMsg('Preparing...')
    setError('')

    try {
      // 1) Compress sequentially for predictable UI
      const compressed: File[] = []
      for (let i = 0; i < arr.length; i++) {
        const f = arr[i]
        setUploadMsg(
          `Compressing ${i + 1}/${arr.length} — ${f.name} (${prettySize(
            f.size
          )})`
        )
        const out = await compressImage(f, REVIEW_OPTS)
        if (out !== f) {
          setUploadMsg(
            `Compressed ${i + 1}/${arr.length} — ${f.name}: ${prettySize(
              f.size
            )} → ${prettySize(out.size)}`
          )
        }
        compressed.push(out)
      }

      // 2) Upload to /api/cloudinary/review/upload
      setUploadMsg('Uploading to Cloudinary...')
      const form = new FormData()
      compressed.forEach((f) => form.append('files', f))

      const res = await fetch('/api/cloudinary/review/upload', {
        method: 'POST',
        body: form,
      })
      if (!res.ok) throw new Error('Upload failed')

      // 3) Refresh
      setUploadMsg('Refreshing list...')
      await fetchList(null)
      setError('')
    } catch (e) {
      console.error(e)
      setError('Upload failed')
    } finally {
      setUploading(false)
      setUploadMsg('Uploading...')
    }
  }

  // ---- Delete (single) from /review ----
  async function handleDelete(public_id: string) {
    const ok = confirm(`Delete "${public_id}"?`)
    if (!ok) return
    setBusyIds((s) => ({ ...s, [public_id]: true }))
    try {
      const res = await fetch('/api/cloudinary/review/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_id }),
      })
      if (!res.ok) throw new Error('Delete failed')
      setImages((prev) => prev.filter((img) => img.public_id !== public_id))
    } catch (e) {
      console.error(e)
      alert('Failed to delete image')
    } finally {
      setBusyIds((s) => ({ ...s, [public_id]: false }))
    }
  }

  return (
    // Reuse .admin-about styles for consistency
    <section className="admin-about">
      <h2 className="admin-about-title">Review Images</h2>
      <p className="admin-about-desc">
        Manage images in Cloudinary folder <code>review</code>.
      </p>

      {/* Upload */}
      <div className="about-upload-box">
        <label className="about-upload-label">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleUpload(e.target.files)}
            hidden
          />
          <span className="about-upload-btn">
            {uploading ? uploadMsg : '+ Upload Images'}
          </span>
        </label>
        <p className="about-upload-hint">
          Client-side compression: ≤{REVIEW_OPTS.maxWidthOrHeight}px, ~
          {REVIEW_OPTS.maxSizeMB}MB, {REVIEW_OPTS.fileType?.split('/')[1]}.
        </p>
      </div>

      {/* Errors / Loading */}
      {loading ? (
        <div className="admin-about-loading">Loading...</div>
      ) : error ? (
        <div className="admin-about-error">{error}</div>
      ) : (
        <>
          {/* Grid */}
          {images.length === 0 ? (
            <div className="admin-about-empty">
              No images found in folder <code>review</code>.
            </div>
          ) : (
            <div className="about-grid">
              {images.map((img) => {
                const thumb = img.secure_url.replace(
                  '/upload/',
                  '/upload/c_limit,w_600,q_auto,f_auto/'
                )
                const transformed = img.secure_url.replace(
                  '/upload/',
                  '/upload/f_auto,q_auto/'
                )
                return (
                  <div className="about-card" key={img.asset_id}>
                    <a href={img.secure_url} target="_blank" rel="noreferrer">
                      <img
                        src={thumb}
                        alt={img.public_id}
                        className="about-thumb"
                        loading="lazy"
                      />
                    </a>
                    <div className="about-card-meta">
                      <div className="about-card-id" title={img.public_id}>
                        {img.public_id}
                      </div>
                      <div className="about-card-stats">
                        {img.width}×{img.height} · {prettySize(img.bytes)}
                      </div>
                    </div>
                    <div className="about-card-actions">
                      <button
                        className="about-delete-btn"
                        onClick={() => handleDelete(img.public_id)}
                        disabled={!!busyIds[img.public_id]}
                      >
                        {busyIds[img.public_id] ? 'Deleting...' : 'Delete'}
                      </button>
                      <button
                        className="about-copy-btn"
                        onClick={() => {
                          navigator.clipboard.writeText(img.secure_url)
                          alert('URL copied!')
                        }}
                      >
                        Copy URL
                      </button>
                      <button
                        className="about-copy-btn"
                        onClick={() => {
                          navigator.clipboard.writeText(transformed)
                          alert('Transformed URL copied!')
                        }}
                        title="Copies f_auto,q_auto delivery URL"
                      >
                        Copy (f_auto,q_auto)
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Pagination */}
          {nextCursor && (
            <div className="about-pagination">
              <button
                className="about-loadmore"
                onClick={() => fetchList(nextCursor)}
              >
                Load more
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
