'use client'

import './page.css'
import '@/styles/apearFrom.css'
import Image from 'next/image'
import appearFromRight from '@/lib/appearFrom/right'
import appearFromLeft from '@/lib/appearFrom/left'
import { useRef } from 'react'


export default function AboutClient() {
  const fromRightRefsDiv = useRef<Array<HTMLDivElement | null>>([])
  const fromRightRefsSpan = useRef<Array<HTMLSpanElement | null>>([])
  const fromLeftRefsSpan = useRef<Array<HTMLSpanElement | null>>([])
  
  appearFromRight(fromRightRefsDiv.current, 'show', 0.15)
  appearFromRight(fromRightRefsSpan.current, 'show', 0.15)
  appearFromLeft(fromLeftRefsSpan.current, 'show', 0.15)

  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <div className="about-content">
          {/* Left: Text */}
          <div className="about-text">
            <span
              className="section-title-en appear-from-left"
              ref={(el) => {
                fromLeftRefsSpan.current[0] = el
              }}
            >
              ABOUT US
            </span>
            <h2
              className="section-title-th appear-from-right"
              ref={(el) => {
                fromRightRefsSpan.current[0] = el
              }}
            >
              เกี่ยวกับเรา
            </h2>
            <p
              className="about-description appear-from-left"
              ref={(el) => {
                fromLeftRefsSpan.current[1] = el
              }}
            >
              Caroline Clinic
              คือคลินิกความงามที่มุ่งเน้นการให้บริการด้วยความปลอดภัย
              มาตรฐานระดับสากล เรามีทีมแพทย์ผู้เชี่ยวชาญ และเทคโนโลยีที่ทันสมัย
              ครบครันสำหรับการดูแลผิวพรรณ ปรับรูปหน้า ฟื้นฟูความงาม
              และให้คำปรึกษาอย่างใกล้ชิด
            </p>
            <p
              className="about-description appear-from-left"
              ref={(el) => {
                fromLeftRefsSpan.current[2] = el
              }}
            >
              ด้วยบรรยากาศที่เป็นกันเอง Caroline Clinic
              มุ่งเน้นการสร้างความมั่นใจให้กับลูกค้าทุกคน
              เพื่อให้คุณรู้สึกดีที่สุดในแบบของตัวเอง
            </p>
          </div>
          <div
            className="about-image-wrapper appear-from-right"
            ref={(el) => {
              fromRightRefsDiv.current[0] = el
            }}
          >
            <Image
              src="/images/about/Caroline_Team-min.png"
              alt="Caroline Clinic"
              width={400}
              height={600}
              className="about-image"
              priority
              blurDataURL="/images/about/Caroline_Team-min-blur.png" // If you generate one
            />
          </div>
        </div>
      </div>
    </section>
  )
}
