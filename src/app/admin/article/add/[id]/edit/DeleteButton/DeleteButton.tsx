'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

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
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
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

      <style jsx>{`
        .delete-btn {
          background-color: #dc2626;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
        }

        .delete-btn:hover:not(:disabled) {
          background-color: #b91c1c;
        }

        .delete-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 16px;
        }

        .modal-content {
          background: white;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          max-width: 400px;
          width: 100%;
          padding: 24px;
        }

        .modal-header h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
        }

        .modal-header p {
          margin: 0 0 16px 0;
          color: #666;
          font-size: 14px;
        }

        .modal-body {
          margin-bottom: 20px;
        }

        .modal-body p {
          margin: 0;
          line-height: 1.5;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .cancel-btn {
          background-color: #f3f4f6;
          color: #374151;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
        }

        .cancel-btn:hover:not(:disabled) {
          background-color: #e5e7eb;
        }

        .cancel-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .confirm-delete-btn {
          background-color: #dc2626;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
        }

        .confirm-delete-btn:hover:not(:disabled) {
          background-color: #b91c1c;
        }

        .confirm-delete-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .form-error {
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 12px;
          border-radius: 4px;
          margin: 16px 0;
          font-size: 14px;
        }
      `}</style>
    </>
  )
}
