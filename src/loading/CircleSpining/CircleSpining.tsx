import React from 'react'
import './CircleSpining.css'

type Props = {
  /** Optional: specify size in px/rem/%/em. Default: 100% of container */
  size?: string
  /** Optional: color of the spinner */
  color?: string
  /** Optional: className for more customization */
  className?: string
}

export default function CircleSpining({
  size = '100%',
  color = '#60a5fa', // Tailwind blue-400
  className = '',
}: Props) {
  return (
    <div
      className={`circle-spinning-wrapper ${className}`}
      style={{ width: size, height: size }}
      aria-label="Loading"
    >
      <span
        className="circle-spinning"
        style={{ borderTopColor: color, borderRightColor: color }}
      />
      <span className="circle-spinning-text">Loading...</span>
    </div>
  )
}
