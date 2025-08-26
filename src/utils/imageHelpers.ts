// src/utils/imageHelpers.ts
import imageCompression from 'browser-image-compression'

// Extract Cloudinary public ID from URL
export function extractPublicId(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(\.[a-zA-Z0-9]+)?(\?.*)?$/)
  return match ? match[1] : null
}

export type ImageChange = { oldUrl: string; newUrl: string }

export function collectImageChanges(
  existing: any,
  updated: any
): ImageChange[] {
  const changes: ImageChange[] = []
  if (existing.image && updated.image && existing.image !== updated.image) {
    changes.push({ oldUrl: existing.image, newUrl: updated.image })
  }
  const oldContents = existing.contents || []
  const newContents = updated.contents || []
  const maxLen = Math.max(oldContents.length, newContents.length)
  for (let i = 0; i < maxLen; i++) {
    const oldImg = oldContents[i]?.image || ''
    const newImg = newContents[i]?.image || ''
    if (oldImg && newImg && oldImg !== newImg) {
      changes.push({ oldUrl: oldImg, newUrl: newImg })
    }
  }
  return changes
}

/**
 * Generic compressor with options (kept for articles/large images).
 */
export async function compressImage(
  file: File,
  opts?: {
    maxSizeMB?: number
    maxWidthOrHeight?: number
    fileType?: string
    initialQuality?: number
  }
): Promise<File> {
  try {
    const options = {
      maxSizeMB: opts?.maxSizeMB ?? 4,
      maxWidthOrHeight: opts?.maxWidthOrHeight ?? 3840,
      useWebWorker: true,
      fileType: opts?.fileType ?? 'image/webp',
      initialQuality: opts?.initialQuality ?? 1,
    }
    const out = await imageCompression(file, options)
    return renameToMatchType(out, options.fileType!)
  } catch (error) {
    console.warn('Image compression failed, using original file:', error)
    return file
  }
}

/**
 * Avatar-specific preset: ~≤1 MB, ≤1024 px, webp.
 * Will try again with tighter size if still too large.
 */
export async function compressAvatar(file: File): Promise<File> {
  // 1st pass
  let out = await compressImage(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1024,
    fileType: 'image/webp',
    initialQuality: 0.9,
  })

  // If still > 1.2 MB, try a bit smaller
  if (out.size > 1.2 * 1024 * 1024) {
    out = await compressImage(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      fileType: 'image/webp',
      initialQuality: 0.85,
    })
  }
  return out
}

function renameToMatchType(f: File, mime: string): File {
  try {
    const ext = mime.includes('webp')
      ? 'webp'
      : mime.includes('jpeg')
      ? 'jpg'
      : mime.split('/')[1] || 'img'
    // Keep base name, add -compressed
    const base = (f.name || 'image').replace(/\.[a-z0-9]+$/i, '')
    return new File([f], `${base}-compressed.${ext}`, {
      type: mime,
      lastModified: Date.now(),
    })
  } catch {
    return f
  }
}
