'use client'

import './page.css'
import Image from 'next/image'

export default function AboutClient() {
  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <div className="about-content">
          {/* Left: Text */}
          <div className="about-text">
            <span className="section-title-en">ABOUT US</span>
            <h2 className="section-title-th">เกี่ยวกับเรา</h2>
            <p className="about-description">
              Caroline Clinic
              คือคลินิกความงามที่มุ่งเน้นการให้บริการด้วยความปลอดภัย
              มาตรฐานระดับสากล เรามีทีมแพทย์ผู้เชี่ยวชาญ และเทคโนโลยีที่ทันสมัย
              ครบครันสำหรับการดูแลผิวพรรณ ปรับรูปหน้า ฟื้นฟูความงาม
              และให้คำปรึกษาอย่างใกล้ชิด
            </p>
            <p className="about-description">
              ด้วยบรรยากาศที่เป็นกันเอง Caroline Clinic
              มุ่งเน้นการสร้างความมั่นใจให้กับลูกค้าทุกคน
              เพื่อให้คุณรู้สึกดีที่สุดในแบบของตัวเอง
            </p>
          </div>

          {/* Right: Image */}
          <div className="about-image-wrapper">
            <Image
              src="/icons/example.png"
              alt="Caroline Clinic"
              width={400}
              height={400}
              className="about-image"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
