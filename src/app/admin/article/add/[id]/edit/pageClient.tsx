'use client'

// Import necessary React hooks for state management and lifecycle
import { useState, useEffect } from 'react'
// Import Next.js navigation hooks for routing and URL parameters
import { useRouter, useParams } from 'next/navigation'
// Import CSS styles for the page
import '../../page.css'
// Import utility functions for form handling and image processing
import {
  handleChange, // Generic form input change handler
  handleRemoveContent, // Function to remove content rows
  addContentInputRow, // Function to add new content rows
  handleContentChange, // Function to handle content-specific changes
  compressImage, // Function to compress uploaded images
} from '../../function'

// Import the initial form structure as a fallback
import { articleInitialForm } from '@/constants/article/articleInitialForm'
// Import delete button component for article deletion
import DeleteButton from './DeleteButton/DeleteButton'

/**
 * PageClient Component - Main component for editing an existing article
 * This component handles:
 * 1. Fetching existing article data
 * 2. Managing form state for editing
 * 3. Handling image uploads (cover + content images)
 * 4. Updating article data via API
 * 5. Providing user feedback and navigation
 */
export default function PageClient() {
  // ==================== STATE MANAGEMENT ====================

  /**
   * Main form state - holds all article data
   * Structure matches the article schema with additional UI-specific fields
   */
  const [form, setForm] = useState({
    ...articleInitialForm, // Spread initial form structure
    contents: articleInitialForm?.contents || [], // Ensure contents array exists to prevent undefined errors
  })

  /**
   * Loading state for form submission
   * Shows loading spinner and disables form during save operation
   */
  const [loading, setLoading] = useState(false)

  /**
   * Fetching state for initial data load
   * Shows loading message while retrieving article from API
   */
  const [fetching, setFetching] = useState(true)

  /**
   * Error state for displaying error messages
   * Used for both fetch errors and form submission errors
   */
  const [error, setError] = useState('')

  /**
   * Success state for displaying success messages
   * Shows confirmation when article is successfully updated
   */
  const [success, setSuccess] = useState('')

  // ==================== NAVIGATION HOOKS ====================

  /**
   * Next.js router hook for programmatic navigation
   * Used to redirect after successful form submission
   */
  const router = useRouter()

  /**
   * Next.js params hook to get URL parameters
   * Extracts the article ID from the URL path
   */
  const params = useParams()

  /**
   * Extract and type the article ID from URL parameters
   * This ID is used to fetch and update the specific article
   */
  const articleId = params.id as string

  // ==================== DATA FETCHING EFFECT ====================

  /**
   * Effect hook to fetch article data when component mounts or articleId changes
   * This runs once when the component loads to populate the form with existing data
   */
  useEffect(() => {
    /**
     * Async function to fetch article data from the API
     * Handles the complex data structure that might be nested or double-wrapped
     */
    async function fetchArticle() {
      // Set fetching state to show loading indicator
      setFetching(true)
      // Clear any previous errors
      setError('')

      try {
        // Make API call to fetch article data
        const res = await fetch(`/api/article/${articleId}`)

        // Parse the JSON response
        const data = await res.json()

        // Check if the request was successful
        if (!res.ok) throw new Error(data.error || 'Failed to load article')

        // Handle the nested article structure from API response
        let article = data

        // Validate that we have a valid article object
        if (!article) {
          throw new Error(`Article not found with ID: ${articleId}`)
        }

        // Double-check validation (redundant but safe)
        if (!article) {
          throw new Error(`Article not found with ID: ${articleId}`)
        }

        /**
         * Populate the form state with fetched article data
         * Each field has a fallback to prevent undefined errors
         */
        setForm({
          title: article.title || '', // Article title
          description: article.description || '', // Article description
          image: article.image || '', // Cover image URL
          date: article.date || '', // Publication date
          author: article.author || '', // Article author
          coverFile: null, // File object for new cover image (initially null)

          /**
           * Handle contents array with proper fallback
           * Map each content item to include file property for new uploads
           */
          contents: Array.isArray(article.contents)
            ? article.contents.map((c: any) => ({
                image: c?.image || '', // Content image URL
                text: c?.text || '', // Content text
                file: null, // File object for new image upload
              }))
            : [{ image: '', text: '', file: null }], // Fallback to one empty content row if no contents exist
        })
      } catch (err: any) {
        // Log error for debugging
        console.error('Error fetching article:', err)
        // Set error state to display to user
        setError(err.message || 'Unknown error')
      }

      // Always set fetching to false when done (success or error)
      setFetching(false)
    }

    // Only fetch if we have an articleId
    if (articleId) fetchArticle()
  }, [articleId]) // Re-run effect if articleId changes

  // ==================== FORM SUBMISSION HANDLER ====================

  /**
   * Handle form submission for updating the article
   * This is a complex async function that:
   * 1. Uploads new images if provided
   * 2. Processes all content images
   * 3. Generates URL slug
   * 4. Sends update to backend
   * 5. Handles success/error states
   *
   * @param e - Form submission event
   * @param form - Current form state
   * @param setError - Error state setter
   * @param setSuccess - Success state setter
   * @param setLoading - Loading state setter
   * @param router - Next.js router for navigation
   * @param articleId - ID of article being updated
   */
  async function handleUpdate(
    e: React.FormEvent,
    form: any,
    setError: (v: string) => void,
    setSuccess: (v: string) => void,
    setLoading: (v: boolean) => void,
    router: any,
    articleId: string
  ) {
    // Prevent default form submission behavior
    e.preventDefault()

    // Clear previous messages and set loading state
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      // ========== COVER IMAGE UPLOAD ==========

      /**
       * Handle cover image upload if user selected a new file
       * Keep existing image URL if no new file was selected
       */
      let coverImageUrl = form.image // Default to existing image URL

      if (form.coverFile) {
        // Create FormData for file upload
        const formData = new FormData()
        formData.append('file', form.coverFile)

        // Upload cover image to server
        const res = await fetch('/api/upload/article', {
          method: 'POST',
          body: formData,
        })

        // Check if upload was successful
        if (!res.ok) throw new Error('Cover image upload failed')

        // Get the uploaded image URL
        const data = await res.json()
        coverImageUrl = data.url
      }

      // ========== CONTENT IMAGES UPLOAD ==========

      /**
       * Process all content items and upload new images if provided
       * Uses Promise.all to upload all images concurrently for better performance
       */
      const uploadedContents = await Promise.all(
        (form.contents || []).map(async (c: any) => {
          // If this content item has a new file to upload
          if (c.file) {
            // Create FormData for this content image
            const formData = new FormData()
            formData.append('file', c.file)

            // Upload the content image
            const res = await fetch('/api/upload/article', {
              method: 'POST',
              body: formData,
            })

            // Check if upload was successful
            if (!res.ok) throw new Error('Failed to upload content image')

            // Get uploaded image URL and return content object
            const data = await res.json()
            return { image: data.url, text: c.text }
          }

          // If no new file, return existing content data
          return { image: c.image, text: c.text }
        })
      )

      // ========== GENERATE URL SLUG ==========

      /**
       * Generate SEO-friendly URL slug from article title
       * Converts "My Article Title" to "/article/my-article-title"
       */
      const generatedHref =
        '/article/' +
        encodeURIComponent(form.title.replace(/\s+/g, '-').toLowerCase())

      // ========== SEND UPDATE REQUEST ==========

      /**
       * Send the update request to the backend API
       * Include all form data with uploaded image URLs
       */
      const response = await fetch(`/api/article/${articleId}/edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form, // Spread all form fields
          image: coverImageUrl, // Use uploaded or existing cover image URL
          coverFile: undefined, // Remove file object (not needed in API)
          contents: uploadedContents, // Use processed contents with uploaded image URLs
          href: generatedHref, // Include generated URL slug
        }),
      })

      // Check if update was successful
      if (!response.ok) throw new Error('Failed to update article')

      // ========== SUCCESS HANDLING ==========

      // Show success message
      setSuccess('Article updated successfully!')
      setLoading(false)

      // Navigate back to article list after short delay
      setTimeout(() => router.push('/admin/article'), 1200)
    } catch (err: any) {
      // ========== ERROR HANDLING ==========

      // Display error message and stop loading
      setError(err.message || 'Unknown error')
      setLoading(false)
    }
  }

  // ==================== LOADING AND ERROR STATES ====================

  /**
   * Show loading message while fetching initial data
   * This prevents showing empty form before data loads
   */
  if (fetching) return <div>Loading...</div>

  /**
   * Show error message if initial data fetch failed
   * This prevents showing form with no data
   */
  if (error) return <div className="form-error">{error}</div>

  // ==================== MAIN COMPONENT RENDER ====================

  return (
    <section className="admin-article-add">
      {/* ========== HEADER SECTION ========== */}

      {/* Header with title and delete button */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between', // Space between title and delete button
          alignItems: 'center', // Vertically center items
          marginBottom: '20px', // Space below header
        }}
      >
        <h2>Edit Article</h2>
      </div>

      {/* ========== MAIN FORM ========== */}

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
        {/* ========== BASIC ARTICLE FIELDS ========== */}

        {/* Article Title Input */}
        <label>
          Title
          <input
            name="title"
            value={form.title || ''} // Controlled input with fallback
            onChange={handleChange(form, setForm)} // Generic change handler
            required // HTML5 validation
          />
        </label>

        {/* Article Description Textarea */}
        <label>
          Description
          <textarea
            name="description"
            value={form.description || ''} // Controlled input with fallback
            onChange={handleChange(form, setForm)} // Generic change handler
            required // HTML5 validation
          />
        </label>

        {/* ========== COVER IMAGE SECTION ========== */}

        <label>
          Cover Image
          {/* Show preview of cover image */}
          {form.coverFile ? (
            // Show preview of newly selected file
            <img
              src={URL.createObjectURL(form.coverFile)} // Create preview URL for file object
              alt="Cover Preview"
              className="content-image-preview"
            />
          ) : form.image ? (
            // Show existing cover image
            <img
              src={form.image} // Existing image URL
              alt="Cover Preview"
              className="content-image-preview"
            />
          ) : null}
          {/* File input for selecting new cover image */}
          <input
            type="file"
            accept="image/*" // Only allow image files
            onChange={async (e) => {
              const file = e.target.files?.[0] // Get selected file
              if (!file) return // Exit if no file selected

              // Compress image before storing in state
              const compressedFile = await compressImage(file)
              setForm({ ...form, coverFile: compressedFile })
            }}
          />
        </label>

        {/* ========== METADATA FIELDS ========== */}

        {/* Publication Date Input */}
        <label>
          Date
          <input
            className="article-date-input"
            name="date"
            value={form.date || ''} // Controlled input with fallback
            onChange={handleChange(form, setForm)} // Generic change handler
            type="date" // HTML5 date picker
          />
        </label>

        {/* Author Name Input */}
        <label>
          Author
          <input
            name="author"
            value={form.author || ''} // Controlled input with fallback
            onChange={handleChange(form, setForm)} // Generic change handler
          />
        </label>

        {/* Visual separator between basic fields and content section */}
        <hr />

        {/* ========== DYNAMIC CONTENT SECTION ========== */}

        <div className="content-input">
          <strong>Edit Contents (image + text)</strong>

          {/* Render each content item */}
          {Array.isArray(form.contents) &&
            form.contents.map((c, i) => (
              <div key={i} className="content-input-row">
                {/* Content Image Preview */}
                {c.file ? (
                  // Show preview of newly selected file
                  <img
                    src={URL.createObjectURL(c.file)} // Create preview URL for file object
                    className="content-image-preview"
                    alt="Preview"
                  />
                ) : (
                  // Show existing image or fallback
                  <img
                    src={c.image || '/logo/caroline-logo-loading.svg'} // Existing image or loading placeholder
                    className="content-image-preview"
                    alt="Fallback"
                  />
                )}

                {/* File Input for Content Image */}
                <input
                  className="content-image-input"
                  type="file"
                  accept="image/*" // Only allow image files
                  onChange={async (e) => {
                    const file = e.target.files?.[0] // Get selected file
                    if (!file) return // Exit if no file selected

                    // Compress image before storing
                    const compressedFile = await compressImage(file)

                    // Update this specific content item with new file
                    const updated = [...(form.contents || [])] // Create copy of contents array
                    updated[i].file = compressedFile // Set file for this index
                    setForm({ ...form, contents: updated }) // Update form state
                  }}
                />

                {/* Content Text Textarea */}
                <textarea
                  placeholder="Content Text"
                  value={c.text || ''} // Controlled input with fallback
                  onChange={(e) =>
                    handleContentChange(
                      // Specialized content change handler
                      form,
                      setForm,
                      i, // Index of this content item
                      'text', // Field being changed
                      e.target.value // New value
                    )
                  }
                />

                {/* Remove Content Row Button */}
                <button
                  type="button" // Prevent form submission
                  className="remove-content-btn"
                  onClick={() => handleRemoveContent(form, setForm, i)} // Remove this content item
                >
                  Remove
                </button>
              </div>
            ))}

          {/* Add New Content Row Button */}
          <button
            type="button" // Prevent form submission
            className="add-content-btn"
            onClick={() => addContentInputRow(form, setForm)} // Add new empty content row
          >
            Add Row
          </button>
        </div>

        {/* ========== STATUS MESSAGES ========== */}

        {/* Error Message Display */}
        {error && (
          <div className="form-error" role="alert">
            {' '}
            {/* Accessibility: announce errors */}
            {error}
          </div>
        )}

        {/* Success Message Display */}
        {success && (
          <div className="form-success" role="status">
            {' '}
            {/* Accessibility: announce status */}
            {success}
          </div>
        )}

        {/* ========== SUBMIT BUTTON ========== */}

        {/* Form Submit Button */}
        <button
          type="submit"
          className="save-aricle-btn"
          disabled={loading} // Disable during submission
        >
          {loading ? 'Saving...' : 'Save Changes'} {/* Dynamic button text */}
        </button>
      </form>

      {/* Delete button component - allows deleting the current article */}
      <DeleteButton
        articleId={articleId}
        articleTitle={form.title || 'this article'} // Fallback title for confirmation dialog
      />
    </section>
  )
}
