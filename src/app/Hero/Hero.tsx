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
            src="/Caroline-Clinic-Logo-noBG-Text.png"
            alt="Caroline Clinic Logo"
            width={2560} // or appropriate width
            height={320} // maintain aspect ratio
            className="hero-heading"
          />
        </div>
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
