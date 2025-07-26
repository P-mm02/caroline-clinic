// src/app/admin/article/add/function.ts

import imageCompression from 'browser-image-compression'

/**
 * Handles change events for standard input fields in the article form (e.g. title, author).
 * This higher-order function returns an event handler that:
 *   - Gets the field name from the input's `name` attribute.
 *   - Updates the form state by copying the current form and changing only the relevant field.
 * This enables controlled components and dynamic form handling.
 *
 * @param form      The current form state object
 * @param setForm   React state setter for the form object
 * @returns         A React event handler function for input/textarea elements
 */
export function handleChange(form: any, setForm: (form: any) => void) {
  return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Get name of changed field, update that field in form state
    setForm({ ...form, [e.target.name]: e.target.value })
  }
}

/**
 * Adds a new, blank content row to the form's contents array.
 * Each content row consists of an image (string URL), text, and an optional file (File object, for upload).
 *
 * @param form      The current form state object
 * @param setForm   React state setter for the form object
 */
export function addContentInputRow(form: any, setForm: (form: any) => void) {
  setForm({
    ...form,
    contents: [...form.contents, { image: '', text: '', file: null }], // Append blank row
  })
}

/**
 * Updates a field ('image' or 'text') in a specific content row in the form's contents array.
 * Used for when the user edits a content's text, or when an image upload returns a URL.
 *
 * @param form      The current form state object
 * @param setForm   React state setter for the form object
 * @param index     Index of the content row to update
 * @param field     Which field to update ('image' or 'text')
 * @param value     The new value for the field
 */
export function handleContentChange(
  form: any,
  setForm: (form: any) => void,
  index: number,
  field: 'image' | 'text',
  value: string
) {
  const updatedContents = [...form.contents] // Shallow copy array for immutability
  updatedContents[index][field] = value // Set new value
  setForm({ ...form, contents: updatedContents }) // Replace in form state
}

/**
 * Removes a content row from the form's contents array by its index.
 * Used when user clicks "Remove" on a content input row.
 *
 * @param form      The current form state object
 * @param setForm   React state setter for the form object
 * @param idx       Index of content row to remove
 */
export function handleRemoveContent(
  form: any,
  setForm: (form: any) => void,
  idx: number
) {
  setForm({
    ...form,
    contents: form.contents.filter((_row: any, i: number) => i !== idx), // Remove by index
  })
}

/**
 * Helper function for uploading an image file to the backend, returning a URL string.
 *
 * 1. Creates a FormData object and appends the given file under the 'file' key.
 * 2. Sends a POST request to the backend API (`/api/upload/article`) which handles file upload.
 * 3. Throws an error if upload fails (non-2xx status).
 * 4. Returns the URL string returned by the API response.
 *
 * @param file  The image File object to upload
 * @returns     The uploaded image's public URL (string)
 */
async function uploadImage(file: File): Promise<string> {
  // Create FormData for multipart/form-data upload
  const formData = new FormData()
  formData.append('file', file)
  // Send POST to upload endpoint
  const res = await fetch('/api/upload/article', {
    method: 'POST',
    body: formData,
  })
  if (!res.ok) throw new Error('Image upload failed')
  const data = await res.json()
  // Return the URL from API response
  return data.url
}

/**
 * Handles the complete article form submission, including:
 *   - Optional upload of cover image (form.coverFile)
 *   - Optional upload of all content images (contents[i].file)
 *   - Construction of final data object with URLs only (no File objects)
 *   - POST to backend to create a new article in the database
 *   - Success/error handling and loading state management
 *
 * **Deep step-by-step explanation:**
 *
 * 1. Prevents default browser form submission (so we can use AJAX).
 * 2. Resets error and success messages, and sets loading state to true.
 * 3. If a cover image file (`form.coverFile`) exists, uploads it, and sets the returned URL as the cover image.
 *    Otherwise, uses the existing URL in `form.image` (may be blank or pasted).
 * 4. For each content row:
 *      a. If the row has a file (`c.file`), upload it and replace the row's image URL with the returned value.
 *      b. If no file, use the existing image URL.
 *    This ensures only URLs are sent to the backend, not File objects.
 * 5. Generates a slug/href for the article based on its title (for pretty URLs).
 * 6. Constructs a final object with all article fields:
 *      - Uses only the cover image URL (`image: coverImageUrl`)
 *      - Omits the File objects (`coverFile: undefined`)
 *      - Uses content rows with only {image, text} (no files)
 *      - Adds the generated href
 * 7. Sends a POST request to the backend to save the article.
 * 8. On success, displays a success message, disables loading, and after a delay, redirects the user to the article admin page.
 * 9. On error, shows the error and disables loading.
 *
 * @param e           The form event object
 * @param form        The complete form state
 * @param setError    React state setter for error message
 * @param setSuccess  React state setter for success message
 * @param setLoading  React state setter for loading spinner
 * @param router      Next.js router (for redirecting)
 */
export async function handleSubmit(
  e: React.FormEvent,
  form: any,
  setError: (v: string) => void,
  setSuccess: (v: string) => void,
  setLoading: (v: boolean) => void,
  router: any
) {
  e.preventDefault() // Prevent browser submit (which would reload page)
  setError('') // Clear any previous errors
  setSuccess('') // Clear any previous success messages
  setLoading(true) // Show loading spinner or disable submit button

  try {
    // --- 1. Upload cover image if present ---
    // If user uploaded a file, upload it and use the returned URL as the article's cover image.
    // If not, use whatever is already in form.image (e.g., a pasted or previously uploaded URL).
    let coverImageUrl = form.image
    if (form.coverFile) {
      coverImageUrl = await uploadImage(form.coverFile)
    }

    // --- 2. Upload all content images if needed ---
    // For each content row, check if there is a file attached:
    //   - If so, upload it, and use the returned URL.
    //   - Otherwise, keep the existing image URL (could be blank or a remote link).
    // This ensures backend only receives string URLs, never File objects.
    const uploadedContents = await Promise.all(
      form.contents.map(async (content: any) => {
        if (content.file) {
          const imageUrl = await uploadImage(content.file)
          return { image: imageUrl, text: content.text }
        }
        return { image: content.image, text: content.text }
      })
    )

    // --- 3. Generate a user-friendly slug/href for the article based on its title ---
    // This is used for the article's public URL.
    const generatedHref =
      '/article/' +
      encodeURIComponent(form.title.replace(/\s+/g, '-').toLowerCase())

    // --- 4. Send final article data (no File objects) to backend API ---
    // This object is what gets saved in MongoDB.
    // - Uses new image URLs
    // - Strips file fields (coverFile: undefined)
    // - Updates contents array
    // - Adds the slug/href
    const response = await fetch('/api/article/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        image: coverImageUrl, // Final cover image URL (uploaded or pasted)
        coverFile: undefined, // Ensure no File object is sent to server
        contents: uploadedContents, // All content images as URLs only
        href: generatedHref, // Slugified URL path for the article
      }),
    })
    if (!response.ok) throw new Error('Failed to add article')

    // --- 5. Show feedback and redirect on success ---
    setSuccess('Article added successfully!')
    setLoading(false)
    // Give user time to see the success message before redirect
    setTimeout(() => router.push('/admin/article'), 1200)
  } catch (err: any) {
    // --- 6. Handle errors gracefully, display message and re-enable UI ---
    setError(err.message || 'Unknown error')
    setLoading(false)
  }
}
