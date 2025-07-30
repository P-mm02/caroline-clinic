// src/utils/imageHelpers.ts

// Extract Cloudinary public ID from URL
export function extractPublicId(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(\.[a-zA-Z0-9]+)?(\?.*)?$/)
  return match ? match[1] : null
}

// Collect all image changes between two articles
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
