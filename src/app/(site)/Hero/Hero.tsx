'use client'

import './Hero.css'
import './HeroMedia.css'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-overlay">
        <div className="hero-heading-wrapper">
          <Image
            src="/logo/Caroline-Clinic-Logo-noBG-Text.svg"
            alt="Caroline Clinic Logo"
            width={1080}
            height={1350}
            className="hero-heading"
          />
        </div>
        {/* <p className="hero-subheading">ความงามที่มั่นใจ ปลอดภัยทุกขั้นตอน</p> */}
      </div>
      <img
        src="/images/Hero/HeroImage5.png"
        alt="Caroline Clinic Hero"
        className="hero-image"
      />
<div className="hero-wave">
</div>
  </section>
  )
}
