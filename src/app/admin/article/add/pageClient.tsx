'use client'
// Next.js directive: makes this a client-side component

import { useState } from 'react' // React hook for local state
import { useRouter } from 'next/navigation' // Next.js router for programmatic navigation (e.g. redirect)
import './page.css' // Import page-specific CSS
import { articleInitialForm } from '@/constants/article/articleInitialForm' // Initial form state (constant object)
import {
  handleChange,
  handleAddContent,
  handleRemoveContent,
  handleSubmit,
} from './function' // Import external handler functions for form logic

export default function PageClient() {
  // ---- STATE HOOKS ----
  const [form, setForm] = useState(articleInitialForm)
  // Main form state (title, description, image, date, author, contents)

  const [contentImg, setContentImg] = useState('') // For new content row image input
  const [contentText, setContentText] = useState('') // For new content row text input

  const [loading, setLoading] = useState(false) // Submission loading state
  const [error, setError] = useState('') // For displaying error messages
  const [success, setSuccess] = useState('') // For displaying success messages

  const router = useRouter() // Next.js hook for navigation

  // ---- RENDER FORM ----
  return (
    <section className="admin-article-add">
      {/* Section for add article form, styled by CSS */}
      <h2>+ Add New Article</h2>

      <form
        onSubmit={(e) =>
          // Custom submit handler from ./function, pass all required states and setters
          handleSubmit(
            e,
            form,
            setError,
            setSuccess,
            setLoading,
            setForm,
            setContentImg,
            setContentText,
            router
          )
        }
        className="admin-article-form"
      >
        {/* ---- BASIC FIELDS ---- */}
        <label>
          Title
          <input
            name="title"
            value={form.title}
            // handleChange returns an onChange function, tied to the current form/setForm
            onChange={handleChange(form, setForm)}
            required
          />
        </label>
        <label>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange(form, setForm)}
            required
          />
        </label>
        <label>
          Cover Image URL
          <input
            name="image"
            value={form.image}
            onChange={handleChange(form, setForm)}
            placeholder="https://..."
          />
        </label>
        <label>
          Date
          <input
            name="date"
            value={form.date}
            onChange={handleChange(form, setForm)}
            type="date"
          />
        </label>
        <label>
          Author
          <input
            name="author"
            value={form.author}
            onChange={handleChange(form, setForm)}
          />
        </label>
        <hr />

        {/* ---- CONTENT ROWS (Dynamic List) ---- */}
        <div className="content-input">
          <strong>Add Contents (image + text)</strong>
          <div className="content-input-row">
            {/* Temporary inputs for a single content row */}
            <input
              placeholder="Content Image URL"
              value={contentImg}
              onChange={(e) => {
                setContentImg(e.target.value) // update image input value
              }}
            />
            <textarea
              placeholder="Content Text"
              value={contentText}
              onChange={(e) => setContentText(e.target.value)} // update text input value
            />
            <button
              type="button"
              // Add the new row using the external handler, passing all current state/setters
              onClick={() =>
                handleAddContent(
                  form,
                  setForm,
                  contentImg,
                  contentText,
                  setContentImg,
                  setContentText
                )
              }
              disabled={!contentImg && !contentText} // disable if both fields are empty
            >
              Add Row
            </button>
          </div>
          
          {/* Show list of added content rows */}
          {form.contents.length > 0 && (
            <ul className="content-list">
              {form.contents.map((c, i) => (
                <li key={i} className="content-list-item">
                  <span className="content-label">Img:</span>{' '}
                  {c.image || '(none)'}
                  <span className="content-sep" />
                  <span className="content-label">Text:</span>{' '}
                  {c.text || '(none)'}
                  <button
                    type="button"
                    className="remove-content-btn"
                    // Remove the content row using handler
                    onClick={() => handleRemoveContent(form, setForm, i)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ---- ERROR AND SUCCESS FEEDBACK ---- */}
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
        {/* ---- SUBMIT BUTTON ---- */}
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Article'}
        </button>
      </form>
    </section>
  )
}
