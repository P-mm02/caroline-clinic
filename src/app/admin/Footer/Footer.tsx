'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import './Footer.css'

export default function Footer() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [showUnauthorized, setShowUnauthorized] = useState(false)
  const [unauthorizedMsg, setUnauthorizedMsg] = useState(
    '🚫 You are not authorized to access that page.'
  )

  // Authorization messages for different levels
  const unauthorizedLevel: Record<string, string> = {
    '1': '⛔ Only Super Admin is authorized to access this page.',
    '2': '⛔ Only Admin and above are authorized to access this page.',
    '3': '⛔ Only Operator and above are authorized to access this page.',
  }

  useEffect(() => {
    const unauthorized = searchParams.get('unauthorized')
    if (unauthorized) {
      setShowUnauthorized(true)
      setUnauthorizedMsg(
        unauthorizedLevel[unauthorized] ||
          '🚫 You are not authorized to access this page.'
      )
      setTimeout(() => {
        router.replace(window.location.pathname + window.location.hash)
      }, 100) // Short delay ensures the component renders first
    }
    // eslint-disable-next-line
  }, [searchParams, router])

  return (
    <>
      {showUnauthorized && (
        <div
          className="footer-warning-box"
          onClick={() => setShowUnauthorized(false)}
        >
          {unauthorizedMsg}
        </div>
      )}
      <footer className="footer">
        <div className="footer-content">
          <span>© {new Date().getFullYear()} Caroline Admin Panel</span>
          <span>Powered by Vetra</span>
        </div>
      </footer>
    </>
  )
}
