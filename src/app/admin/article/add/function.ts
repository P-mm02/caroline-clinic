import { articleInitialForm } from '@/constants/article/articleInitialForm'

/**
 * Handles all input changes for the main article form fields.
 * - Returns a function compatible with input/textarea onChange.
 * - Updates the form state based on input name and value.
 */
export function handleChange(form: any, setForm: (form: any) => void) {
  return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Spread the existing form and update the field based on the name attribute.
    setForm({ ...form, [e.target.name]: e.target.value })
  }
}

/**
 * Adds a new content row (image+text) to the article's contents array.
 * - If both inputs are empty, does nothing.
 * - Resets contentImg/contentText state after adding.
 * - Resets imgError in case user wants to try again after a preview fail.
 */
export function handleAddContent(
  form: any,
  setForm: (form: any) => void,
  contentImg: string,
  contentText: string,
  setContentImg: (v: string) => void,
  setContentText: (v: string) => void
) {
  if (!contentImg && !contentText) return // Do nothing if both fields empty

  // Add new object to contents array and reset temporary inputs.
  setForm({
    ...form,
    contents: [...form.contents, { image: contentImg, text: contentText }],
  })
  setContentImg('')
  setContentText('')
}

/**
 * Removes a content row from the article's contents array by index.
 */
export function handleRemoveContent(
  form: any,
  setForm: (form: any) => void,
  idx: number
) {
  // Filter out the item with the matching index.
  setForm({
    ...form,
    contents: form.contents.filter((_: any, i: number) => i !== idx),
  })
}

/**
 * Handles the full form submission.
 * - Prevents default submit behavior.
 * - Clears error/success, sets loading state.
 * - Generates the href for the article (slug from title).
 * - Makes a POST request to /api/article.
 * - On success: shows success, resets form and temp fields, then redirects after a short delay.
 * - On error: displays the error and stops loading.
 */
export async function handleSubmit(
  e: React.FormEvent,
  form: any,
  setError: (v: string) => void,
  setSuccess: (v: string) => void,
  setLoading: (v: boolean) => void,
  setForm: (f: any) => void,
  setContentImg: (v: string) => void,
  setContentText: (v: string) => void,
  router: any
) {
  e.preventDefault() // Prevent browser form submission

  setError('') // Clear old errors
  setSuccess('') // Clear old success message
  setLoading(true) // Set loading flag (disable form)

  // Generate a slug-like href based on the title (for linking to this article)
  const generatedHref =
    '/article/' +
    encodeURIComponent(form.title.replace(/\s+/g, '-').toLowerCase())

  try {
    // Send POST request to your API route with all form data
    const res = await fetch('/api/article', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, href: generatedHref }),
    })

    if (!res.ok) throw new Error('Failed to add article')

    // On success: notify, reset form and content inputs
    setSuccess('Article added successfully!')
    setLoading(false)
    setForm(articleInitialForm) // Reset main form
    setContentImg('') // Reset content row input
    setContentText('') // Reset content row input

    // Redirect to articles admin after a brief delay (so user sees success message)
    setTimeout(() => {
      router.push('/admin/article')
    }, 1200)
  } catch (err: any) {
    // On error: show error message, stop loading
    setError(err.message || 'Unknown error')
    setLoading(false)
  }
}
