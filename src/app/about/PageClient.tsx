'use client'

import './page.css'

export default function AboutClient() {
  return (
    <section id="about" className="about-section">
      <div className="about-container">
        <h2 className="about-title">เกี่ยวกับ Caroline Clinic</h2>
        <p className="about-description">
          Caroline Clinic คือคลินิกความงามที่มุ่งเน้นการให้บริการด้วยความปลอดภัย
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
    </section>
  )
}
