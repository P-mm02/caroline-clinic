'use client'

import './UploadImageStatus.css' // Import global styles

type UploadImageStatusProps = {
  imageLoading: boolean
  message?: string
  progress?: number
}

export default function UploadImageStatus({
  imageLoading,
  message = 'Uploading...',
  progress,
}: UploadImageStatusProps) {
  if (!imageLoading) return null

  return (
    <div className="upload-overlay">
      <div className="upload-modal">
        <div className="upload-spinner" />
        <div className="upload-message">
          {message}
          {progress !== undefined && (
            <span style={{ marginLeft: 8 }}>{progress}%</span>
          )}
        </div>
      </div>
    </div>
  )
}
