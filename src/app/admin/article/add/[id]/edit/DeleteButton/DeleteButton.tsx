'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import './DeleteButton.css'


interface DeleteButtonProps {
  articleId: string
  articleTitle?: string
  onDeleteSuccess?: () => void
  className?: string
}

export default function DeleteButton({
  articleId,
  articleTitle = 'this article',
  onDeleteSuccess,
  className = '',
}: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    setError('')

    try {
      const response = await fetch(`/api/article/${articleId}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete article')
      }

      // Success
      setShowConfirm(false)

      if (onDeleteSuccess) {
        onDeleteSuccess()
      } else {
        // Default behavior: redirect to articles list
        router.push('/admin/article')
        router.refresh() // Refresh to update the list
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete article')
      setIsDeleting(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={isDeleting}
        className={`delete-btn ${className}`}
      >
        {isDeleting ? 'Deleting...' : 'Delete This Article'}
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div
          className="modal-overlay"
          onClick={() => {
            setShowConfirm(false)
            setError('')
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // ← ADD THIS LINE
          >
            <div className="modal-header">
              <h3>Delete Article</h3>
              <p>This action cannot be undone.</p>
            </div>

            <div className="modal-body">
              <p>
                Are you sure you want to delete{' '}
                <strong>"{articleTitle}"</strong>? This will permanently remove
                the article and all associated images.
              </p>
            </div>

            {error && (
              <div className="form-error" role="alert">
                {error}
              </div>
            )}

            <div className="modal-actions">
              <button
                onClick={() => {
                  setShowConfirm(false)
                  setError('')
                }}
                disabled={isDeleting}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="confirm-delete-btn"
              >
                {isDeleting ? 'Deleting...' : 'Delete Article'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
