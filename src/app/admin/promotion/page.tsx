'use client'

import { useEffect, useState } from 'react'
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

const PROMO_OPTS = {
  // Promotions are often wide banners; keep quality high but still compressed
  maxSizeMB: 1.8,
  maxWidthOrHeight: 1600,
  fileType: 'image/webp',
  initialQuality: 1,
}

export default function AdminPromotionPage() {
  const [images, setImages] = useState<CloudinaryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [busyIds, setBusyIds] = useState<Record<string, boolean>>({})
  const [uploading, setUploading] = useState(false)
  const [uploadMsg, setUploadMsg] = useState('Uploading...')

  // ---- Fetch list ----
  async function fetchList(cursor?: string | null) {
    try {
      const url = cursor
        ? `/api/cloudinary/promotion/list?next=${encodeURIComponent(cursor)}`
        : '/api/cloudinary/promotion/list'
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

  // ---- Upload (with client-side compression) ----
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
      // 1) Compress sequentially
      const compressed: File[] = []
      for (let i = 0; i < arr.length; i++) {
        const f = arr[i]
        setUploadMsg(
          `Compressing ${i + 1}/${arr.length} — ${f.name} (${prettySize(
            f.size
          )})`
        )
        const out = await compressImage(f, PROMO_OPTS)
        if (out !== f) {
          setUploadMsg(
            `Compressed ${i + 1}/${arr.length} — ${f.name}: ${prettySize(
              f.size
            )} → ${prettySize(out.size)}`
          )
        }
        compressed.push(out)
      }

      // 2) Upload
      setUploadMsg('Uploading to Cloudinary...')
      const form = new FormData()
      compressed.forEach((f) => form.append('files', f))

      const res = await fetch('/api/cloudinary/promotion/upload', {
        method: 'POST',
        body: form,
      })
      if (!res.ok) throw new Error('Upload failed')

      // 3) Refresh list
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

  // ---- Delete (single) ----
  async function handleDelete(public_id: string) {
    const ok = confirm(`Delete "${public_id}"?`)
    if (!ok) return
    setBusyIds((s) => ({ ...s, [public_id]: true }))
    try {
      const res = await fetch('/api/cloudinary/promotion/delete', {
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
    <section className="admin-promotion">
      <h2 className="promotion-title">Promotion Images</h2>
      <p className="promotion-desc">
        Manage images in Cloudinary folder <code>promotion</code>.
      </p>

      {/* Upload */}
      <div className="promotion-upload-box">
        <label className="promotion-upload-label">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleUpload(e.target.files)}
            hidden
          />
          <span className="promotion-upload-btn">
            {uploading ? uploadMsg : '+ Upload Images'}
          </span>
        </label>
        <p className="promotion-upload-hint">
          Client-side compression: ≤{PROMO_OPTS.maxWidthOrHeight}px, ~
          {PROMO_OPTS.maxSizeMB}MB, {PROMO_OPTS.fileType?.split('/')[1]}.
        </p>
      </div>

      {/* Errors / Loading */}
      {loading ? (
        <div className="promotion-loading">Loading...</div>
      ) : error ? (
        <div className="promotion-error">{error}</div>
      ) : (
        <>
          {/* Grid */}
          {images.length === 0 ? (
            <div className="promotion-empty">
              No images found in folder <code>promotion</code>.
            </div>
          ) : (
            <div className="promotion-grid">
              {images.map((img) => {
                const thumb = img.secure_url.replace(
                  '/upload/',
                  '/upload/c_limit,w_800,q_auto,f_auto/'
                )
                const transformed = img.secure_url.replace(
                  '/upload/',
                  '/upload/f_auto,q_auto/'
                )
                return (
                  <div className="promotion-card" key={img.asset_id}>
                    <a href={img.secure_url} target="_blank" rel="noreferrer">
                      <img
                        src={thumb}
                        alt={img.public_id}
                        className="promotion-thumb"
                        loading="lazy"
                      />
                    </a>
                    <div className="promotion-card-meta">
                      <div className="promotion-card-id" title={img.public_id}>
                        {img.public_id}
                      </div>
                      <div className="promotion-card-stats">
                        {img.width}×{img.height} · {prettySize(img.bytes)}
                      </div>
                    </div>
                    <div className="promotion-card-actions">
                      <button
                        className="promotion-delete-btn"
                        onClick={() => handleDelete(img.public_id)}
                        disabled={!!busyIds[img.public_id]}
                      >
                        {busyIds[img.public_id] ? 'Deleting...' : 'Delete'}
                      </button>
                      <button
                        className="promotion-copy-btn"
                        onClick={() => {
                          navigator.clipboard.writeText(img.secure_url)
                          alert('URL copied!')
                        }}
                      >
                        Copy URL
                      </button>
                      <button
                        className="promotion-copy-btn"
                        title="Copy optimized delivery URL (f_auto,q_auto)"
                        onClick={() => {
                          navigator.clipboard.writeText(transformed)
                          alert('Transformed URL copied!')
                        }}
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
            <div className="promotion-pagination">
              <button
                className="promotion-loadmore"
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
