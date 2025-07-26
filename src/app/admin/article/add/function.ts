// src/app/admin/article/add/function.ts

import imageCompression from 'browser-image-compression'


// Handles input change for standard fields (title, author, etc.)
export function handleChange(form: any, setForm: (form: any) => void) {
  return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
}

// Adds a new content row with default empty fields
export function addContentInputRow(form: any, setForm: (form: any) => void) {
  setForm({
    ...form,
    contents: [...form.contents, { image: '', text: '', file: null }],
  })
}

// Updates either the 'image' or 'text' field of a specific content row by index
export function handleContentChange(
  form: any,
  setForm: (form: any) => void,
  index: number,
  field: 'image' | 'text',
  value: string
) {
  const updatedContents = [...form.contents]
  updatedContents[index][field] = value
  setForm({ ...form, contents: updatedContents })
}

// Removes a content row from the form by index
export function handleRemoveContent(
  form: any,
  setForm: (form: any) => void,
  idx: number
) {
  setForm({
    ...form,
    contents: form.contents.filter((_row: any, i: number) => i !== idx),
  })
}

// Uploads a single image file for a content row (immediate upload version)
export async function handleUploadContentImage(
  e: React.ChangeEvent<HTMLInputElement>,
  index: number,
  form: any,
  setForm: (form: any) => void
) {
  const file = e.target.files?.[0]
  if (!file) return

  try {
    // ✅ Compress the image
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 2,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    })

    const formData = new FormData()
    formData.append('file', compressedFile)

    const res = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) throw new Error('Upload failed')
    const data = await res.json()
    const imageUrl = data.url

    // Set compressed & uploaded URL in form
    handleContentChange(form, setForm, index, 'image', imageUrl)
  } catch (err) {
    console.error('Image upload error:', err)
  }
}

// Handles full form submission including image uploads
export async function handleSubmit(
  e: React.FormEvent,
  form: any,
  setError: (v: string) => void,
  setSuccess: (v: string) => void,
  setLoading: (v: boolean) => void,
  router: any
) {
  e.preventDefault()
  setError('')
  setSuccess('')
  setLoading(true)

  try {
    // Upload cover image if exists
    let coverImageUrl = form.image
    if (form.coverFile) {
      const coverFormData = new FormData()
      coverFormData.append('file', form.coverFile)

      const coverRes = await fetch('/api/upload/image', {
        method: 'POST',
        body: coverFormData,
      })

      if (!coverRes.ok) throw new Error('Cover image upload failed')
      const coverData = await coverRes.json()
      coverImageUrl = coverData.url
    }

    // Upload each content image if needed
    const uploadedContents = await Promise.all(
      form.contents.map(async (c: any) => {
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

    const res = await fetch('/api/article/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        image: coverImageUrl,
        coverFile: undefined,
        contents: uploadedContents,
        href: generatedHref,
      }),
    })

    if (!res.ok) throw new Error('Failed to add article')

    setSuccess('Article added successfully!')
    setLoading(false)

    setTimeout(() => {
      router.push('/admin/article')
    }, 1200)
  } catch (err: any) {
    setError(err.message || 'Unknown error')
    setLoading(false)
  }
}
