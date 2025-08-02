'use client'
import './DotsLoader.css'

export default function DotsLoader() {
  return (
    <div className="dots-loader-con">
      {/* <h1>Loading</h1> */}
      <div className="dots-loader-text">
        <span>L</span>
        <span>o</span>
        <span>a</span>
        <span>d</span>
        <span>i</span>
        <span>n</span>
        <span>g</span>
      </div>
      <div className="dots-loader">
        <span />
        <span />
        <span />
      </div>
    </div>
  )
}
