// src/app/admin/article/add/function.ts

/**
 * ARTICLE FORM UTILITY FUNCTIONS
 *
 * This module contains all utility functions for handling article form operations.
 * It includes functions for:
 * - Form state management and input handling
 * - Image compression and upload functionality
 * - Dynamic content row management (add/remove/modify)
 * - Complete form submission with file uploads
 *
 * All functions are designed to work with React state management patterns
 * and maintain immutability for proper component re-rendering.
 */

import imageCompression from 'browser-image-compression'

// ==================== FORM INPUT HANDLING ====================

/**
 * GENERIC FORM INPUT CHANGE HANDLER
 *
 * Handles change events for standard input fields in the article form (e.g. title, author).
 * This higher-order function returns an event handler that:
 *   - Gets the field name from the input's `name` attribute.
 *   - Updates the form state by copying the current form and changing only the relevant field.
 * This enables controlled components and dynamic form handling.
 *
 * **Why Higher-Order Function?**
 * - Allows us to pass form state and setter to create a reusable handler
 * - Maintains React's controlled component pattern
 * - Ensures immutability by spreading existing form data
 *
 * **Usage Example:**
 * ```jsx
 * <input
 *   name="title"
 *   value={form.title}
 *   onChange={handleChange(form, setForm)}
 * />
 * ```
 *
 * @param form      The current form state object containing all article data
 * @param setForm   React state setter function for updating the form object
 * @returns         A React event handler function for input/textarea elements
 */
export function handleChange(form: any, setForm: (form: any) => void) {
  return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Safety check to ensure form exists - prevents crashes if form is null/undefined
    if (!form) return

    // Extract the name attribute from the input element and its current value
    // Use computed property syntax [e.target.name] to dynamically set the field
    // Spread operator ensures we don't mutate the original form object
    setForm({ ...form, [e.target.name]: e.target.value })
  }
}

// ==================== IMAGE PROCESSING ====================

/**
 * IMAGE COMPRESSION UTILITY
 *
 * Compresses an image file using browser-image-compression library to:
 * - Reduce file size for faster uploads and better performance
 * - Standardize image dimensions to prevent layout issues
 * - Optimize for web delivery while maintaining visual quality
 *
 * **Compression Settings Explained:**
 * - maxSizeMB: 2 - Limits file size to 2MB max (good balance of quality/size)
 * - maxWidthOrHeight: 1920 - Prevents images larger than 1920px (covers most screens)
 * - useWebWorker: true - Processes compression in background thread (non-blocking)
 *
 * **Why Compress Images?**
 * - Reduces server storage costs
 * - Improves page load times
 * - Better user experience on slower connections
 * - Prevents server timeout on large file uploads
 *
 * @param file      File object to compress (should be an image file)
 * @returns         Promise<File> - compressed File object with same type/name
 */
export async function compressImage(file: File): Promise<File> {
  try {
    return await imageCompression(file, {
      maxSizeMB: 4, // Maximum file size in megabytes
      maxWidthOrHeight: 3840, // Maximum dimension (maintains aspect ratio)
      useWebWorker: true, // Use web worker for non-blocking compression
      fileType: 'image/webp',
      initialQuality: 1,
    })
  } catch (error) {
    // If compression fails, log error but return original file
    // This ensures upload can still proceed even if compression fails
    console.warn('Image compression failed, using original file:', error)
    return file
  }
}

// ==================== DYNAMIC CONTENT MANAGEMENT ====================

/**
 * ADD NEW CONTENT ROW FUNCTION
 *
 * Adds a new, blank content row to the form's contents array.
 * Each content row consists of:
 * - image: string URL of the image (empty initially)
 * - text: string content text (empty initially)
 * - file: File object for new uploads (null initially)
 *
 * **Content Row Structure:**
 * ```typescript
 * {
 *   image: string,    // URL of uploaded/existing image
 *   text: string,     // Text content for this row
 *   file: File | null // File object when user selects new image
 * }
 * ```
 *
 * **Why Separate 'image' and 'file' Fields?**
 * - 'image' stores the final URL (from API or existing)
 * - 'file' stores the File object temporarily before upload
 * - This allows preview and editing before committing changes
 *
 * @param form      The current form state object
 * @param setForm   React state setter for the form object
 */
export function addContentInputRow(form: any, setForm: (form: any) => void) {
  // Safety check to prevent errors if form is null/undefined
  if (!form) return

  // Ensure contents is always an array, even if it doesn't exist yet
  // This prevents errors when form is first initialized
  const currentContents = Array.isArray(form.contents) ? form.contents : []

  // Create new form state with additional empty content row
  // Use spread operator to maintain immutability
  setForm({
    ...form,
    contents: [...currentContents, { image: '', text: '', file: null }], // Append blank row
  })
}

/**
 * CONTENT FIELD UPDATE FUNCTION
 *
 * Updates a specific field ('image' or 'text') in a specific content row.
 * This is used when:
 * - User types in a content text area
 * - An image upload completes and we need to store the returned URL
 * - User pastes an image URL directly
 *
 * **Immutability Pattern:**
 * 1. Create shallow copy of contents array
 * 2. Create shallow copy of the specific content object being updated
 * 3. Update only the target field while preserving other fields
 * 4. Replace the entire contents array in form state
 *
 * **Why This Approach?**
 * - Maintains React's immutability requirements
 * - Triggers proper component re-renders
 * - Allows React to optimize state updates
 * - Prevents accidental mutation of nested objects
 *
 * @param form      The current form state object
 * @param setForm   React state setter for the form object
 * @param index     Index of the content row to update (0-based)
 * @param field     Which field to update ('image' or 'text')
 * @param value     The new value for the specified field
 */
export function handleContentChange(
  form: any,
  setForm: (form: any) => void,
  index: number,
  field: 'image' | 'text',
  value: string
) {
  // Safety checks to prevent runtime errors
  if (!form || !Array.isArray(form.contents)) return
  if (index < 0 || index >= form.contents.length) return

  // Step 1: Create shallow copy of contents array for immutability
  const updatedContents = [...form.contents]

  // Step 2: Create shallow copy of specific content object and update target field
  // This preserves other fields (like 'file') while updating only the specified field
  updatedContents[index] = {
    ...updatedContents[index], // Preserve existing fields
    [field]: value, // Update only the target field
  }

  // Step 3: Update form state with new contents array
  setForm({ ...form, contents: updatedContents })
}

/**
 * REMOVE CONTENT ROW FUNCTION
 *
 * Removes a content row from the form's contents array by its index.
 * Used when user clicks "Remove" button on a content input row.
 *
 * **Safety Considerations:**
 * - Validates array bounds to prevent errors
 * - Uses filter method to create new array (immutability)
 * - Preserves order of remaining items
 *
 * **Edge Cases Handled:**
 * - Empty contents array
 * - Invalid index values (negative or out of bounds)
 * - Null/undefined form state
 *
 * **Why Use Filter Instead of Splice?**
 * - Filter creates a new array (immutable)
 * - Splice modifies existing array (mutable - bad for React)
 * - Filter is more functional programming style
 *
 * @param form      The current form state object
 * @param setForm   React state setter for the form object
 * @param idx       Index of content row to remove (0-based)
 */
export function handleRemoveContent(
  form: any,
  setForm: (form: any) => void,
  idx: number
) {
  // Safety checks to prevent runtime errors
  if (!form || !Array.isArray(form.contents)) return
  if (idx < 0 || idx >= form.contents.length) return

  // Create new form state with specified row removed
  // Filter creates new array excluding the item at index 'idx'
  setForm({
    ...form,
    contents: form.contents.filter((_row: any, i: number) => i !== idx), // Remove by index
  })
}

// ==================== FILE UPLOAD UTILITIES ====================

/**
 * SINGLE IMAGE UPLOAD HELPER
 *
 * Helper function for uploading an image file to the backend, returning a URL string.
 * This is an internal utility used by the main form submission function.
 *
 * **Upload Process:**
 * 1. Creates a FormData object (required for multipart file uploads)
 * 2. Appends the file under the 'file' key (matches backend expectation)
 * 3. Sends POST request to upload endpoint
 * 4. Validates response and extracts URL
 *
 * **Backend API Contract:**
 * - Endpoint: POST /api/upload/article
 * - Expects: multipart/form-data with 'file' field
 * - Returns: JSON with 'url' field containing public image URL
 *
 * **Error Handling:**
 * - Throws descriptive error if upload fails
 * - Allows calling function to handle retries or fallbacks
 * - Maintains error context for debugging
 *
 * @param file  The image File object to upload
 * @returns     Promise<string> The uploaded image's public URL
 * @throws      Error if upload fails or response is invalid
 */
async function uploadImage(file: File): Promise<string> {
  try {
    // Create FormData for multipart/form-data upload
    // This is required for file uploads to work properly
    const formData = new FormData()
    formData.append('file', file)

    // Send POST request to upload endpoint
    const res = await fetch('/api/upload/article', {
      method: 'POST',
      body: formData, // Browser automatically sets Content-Type for FormData
    })

    // Check if upload was successful
    if (!res.ok) {
      // Try to get error message from response
      const errorData = await res.json().catch(() => ({}))
      throw new Error(
        errorData.message || `Upload failed with status ${res.status}`
      )
    }

    // Parse response and extract URL
    const data = await res.json()

    // Validate that we got a URL back
    if (!data.url) {
      throw new Error('Upload response missing URL field')
    }

    return data.url
  } catch (error) {
    // Add context to error for better debugging
    console.error('Image upload failed:', error)
    throw new Error(
      `Image upload failed: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    )
  }
}

// ==================== MAIN FORM SUBMISSION ====================

/**
 * COMPLETE ARTICLE FORM SUBMISSION HANDLER
 *
 * Handles the complete article form submission process, including:
 *   - Optional upload of cover image (form.coverFile)
 *   - Optional upload of all content images (contents[i].file)
 *   - Construction of final data object with URLs only (no File objects)
 *   - POST to backend to create a new article in the database
 *   - Success/error handling and loading state management
 *
 * **DETAILED STEP-BY-STEP PROCESS:**
 *
 * **Phase 1: Preparation**
 * 1. Prevents default browser form submission (enables AJAX handling)
 * 2. Resets any previous error/success messages for clean state
 * 3. Sets loading state to show progress indicator and disable form
 *
 * **Phase 2: Cover Image Processing**
 * 4. Checks if user selected a new cover image file (form.coverFile)
 * 5. If yes: uploads the file and uses returned URL as cover image
 * 6. If no: uses existing URL from form.image (could be empty, pasted URL, or existing image)
 *
 * **Phase 3: Content Images Processing**
 * 7. Iterates through all content rows in parallel for efficiency
 * 8. For each content row:
 *    a. If row has a file (c.file): upload it and use returned URL
 *    b. If no file: keep existing image URL from c.image
 *    c. Always preserve the text content from c.text
 * 9. Results in clean content array with only URLs and text (no File objects)
 *
 * **Phase 4: URL Generation**
 * 10. Generates SEO-friendly slug/href from article title:
 *     - Converts spaces to hyphens
 *     - Makes lowercase
 *     - URL-encodes special characters
 *     - Prefixes with '/article/' for routing
 *
 * **Phase 5: API Submission**
 * 11. Constructs final article object with:
 *     - All original form fields
 *     - Cover image URL (uploaded or existing)
 *     - Clean contents array (URLs only)
 *     - Generated href for public URL
 *     - Removes File objects (coverFile: undefined)
 * 12. Sends POST request to backend API
 * 13. Validates response and handles API errors
 *
 * **Phase 6: Success/Error Handling**
 * 14. On success: shows success message, disables loading, redirects after delay
 * 15. On error: shows error message, re-enables form for retry
 *
 * **Key Design Decisions:**
 * - Uses Promise.all for parallel image uploads (faster than sequential)
 * - Maintains separation between File objects (UI) and URLs (API)
 * - Provides comprehensive error handling at each step
 * - Uses setTimeout for redirect to let user see success message
 * - Generates consistent URL slugs for SEO and routing
 *
 * **Error Recovery:**
 * - If cover image upload fails, entire submission fails (prevents broken articles)
 * - If content image upload fails, entire submission fails (maintains data integrity)
 * - All errors are caught and displayed to user with option to retry
 * - Form remains in editable state after errors for easy correction
 *
 * @param e           The form submission event object
 * @param form        The complete form state containing all article data
 * @param setError    React state setter for displaying error messages
 * @param setSuccess  React state setter for displaying success messages
 * @param setLoading  React state setter for loading spinner/disabled state
 * @param router      Next.js router instance for programmatic navigation
 */
export async function handleSubmit(
  e: React.FormEvent,
  form: any,
  setError: (v: string) => void,
  setSuccess: (v: string) => void,
  setLoading: (v: boolean) => void,
  router: any
) {
  // ========== PHASE 1: PREPARATION ==========

  // Prevent browser's default form submission behavior
  // This stops page reload and allows us to handle submission with JavaScript
  e.preventDefault()

  // Clear any previous messages to start with clean slate
  setError('') // Remove old error messages
  setSuccess('') // Remove old success messages
  setLoading(true) // Show loading indicator and disable form

  try {
    // ========== INPUT VALIDATION ==========

    // Basic safety check to ensure we have form data
    if (!form) {
      throw new Error('Form data is missing')
    }

    // Validate required fields before processing
    if (!form.title || form.title.trim() === '') {
      throw new Error('Article title is required')
    }

    // ========== PHASE 2: COVER IMAGE PROCESSING ==========

    /**
     * Handle cover image upload logic:
     * - If user selected a new file (form.coverFile exists), upload it
     * - Otherwise, use existing URL from form.image (could be empty string)
     * - This allows for three scenarios:
     *   1. New file upload
     *   2. Existing image URL (editing existing article)
     *   3. No cover image (empty string)
     */
    let coverImageUrl = form.image || '' // Default to existing URL or empty

    if (form.coverFile) {
      console.log('Uploading cover image...')
      coverImageUrl = await uploadImage(form.coverFile)
      console.log('Cover image uploaded:', coverImageUrl)
    }

    // ========== PHASE 3: CONTENT IMAGES PROCESSING ==========

    /**
     * Process all content images in parallel for better performance.
     * Each content row may have:
     * - An existing image URL (content.image)
     * - A new file to upload (content.file)
     * - Text content (content.text)
     *
     * We need to handle all combinations and ensure final result
     * contains only URLs and text (no File objects for API).
     */

    // Ensure contents is an array to prevent errors
    const safeContents = Array.isArray(form.contents) ? form.contents : []

    console.log(`Processing ${safeContents.length} content rows...`)

    // Use Promise.all for parallel uploads (much faster than sequential)
    const uploadedContents = await Promise.all(
      safeContents.map(async (content: any, index: number) => {
        // Handle case where content might be null/undefined
        if (!content) {
          console.warn(
            `Content at index ${index} is null/undefined, using empty content`
          )
          return { image: '', text: '' }
        }

        // If this content row has a new file to upload
        if (content.file) {
          console.log(`Uploading content image ${index + 1}...`)
          const imageUrl = await uploadImage(content.file)
          console.log(`Content image ${index + 1} uploaded:`, imageUrl)

          return {
            image: imageUrl, // Use uploaded image URL
            text: content.text || '', // Preserve text content
          }
        }

        // No new file, use existing data
        return {
          image: content.image || '', // Use existing URL or empty string
          text: content.text || '', // Use existing text or empty string
        }
      })
    )

    console.log('All content images processed successfully')

    // ========== PHASE 4: URL SLUG GENERATION ==========

    /**
     * Generate SEO-friendly URL slug from article title
     * Process: "My Great Article!" -> "my-great-article"
     * Then prefix with "/article/" for full path: "/article/my-great-article"
     *
     * This creates consistent, readable URLs for better SEO and user experience
     */
    const title = form.title || 'untitled' // Fallback title if somehow empty
    const generatedHref =
      '/article/' +
      encodeURIComponent(
        title
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .toLowerCase() // Convert to lowercase
          .replace(/[^\w\-]/g, '') // Remove special characters except hyphens
      )

    console.log('Generated article URL:', generatedHref)

    // ========== PHASE 5: API SUBMISSION ==========

    /**
     * Construct the final article object for API submission.
     * This object will be saved to the database, so it must:
     * - Contain only serializable data (no File objects)
     * - Include all necessary fields for article display
     * - Use final image URLs (not temporary File objects)
     */
    const articleData = {
      ...form, // Include all original form fields
      image: coverImageUrl, // Use final cover image URL
      coverFile: undefined, // Remove File object (not serializable)
      contents: uploadedContents, // Use processed contents with URLs only
      href: generatedHref, // Add generated URL slug
      createdAt: new Date().toISOString(), // Add timestamp
    }

    console.log('Submitting article data to API...')

    // Send POST request to create new article
    const response = await fetch('/api/article/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Specify JSON content type
      },
      body: JSON.stringify(articleData), // Serialize article data
    })

    // Check if API request was successful
    if (!response.ok) {
      // Try to get detailed error message from API response
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.message || `Failed to add article (${response.status})`
      )
    }

    console.log('Article created successfully')

    // ========== PHASE 6: SUCCESS HANDLING ==========

    // Show success message to user
    setSuccess('Article added successfully!')
    setLoading(false) // Hide loading indicator

    // Redirect to article list after delay
    // Delay allows user to see success message before navigation
    setTimeout(() => {
      console.log('Redirecting to article list...')
      router.push('/admin/article')
    }, 1200) // 1.2 second delay
  } catch (err: any) {
    // ========== PHASE 6: ERROR HANDLING ==========

    // Log detailed error for debugging
    console.error('Article submission failed:', err)

    // Extract readable error message
    const errorMessage =
      err instanceof Error ? err.message : 'Unknown error occurred'

    // Show error to user and re-enable form
    setError(errorMessage)
    setLoading(false) // Re-enable form for retry

    // Scroll to top so user can see error message
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
