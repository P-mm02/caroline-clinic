'use client'

import './Hero.css'
import './HeroMedia.css'

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-overlay">
        <h1 className="hero-heading">Caroline Clinic</h1>
        <p className="hero-subheading">ความงามที่มั่นใจ ปลอดภัยทุกขั้นตอน</p>
      </div>
      <img
        src="/images/Hero/HeroImage2.png"
        alt="Caroline Clinic Hero"
        className="hero-image"
      />
    </section>
  )
}
