'use client'

import './page.css'

export default function PromotionClient() {
  return (
    <section id="promotion" className="promotion-section">
      <div className="promotion-container">
        <h2 className="promotion-title">โปรโมชั่นพิเศษ</h2>
        <p className="promotion-description">
          โปรโมชั่นเสริมความงามราคาสุดคุ้ม สำหรับลูกค้า Caroline Clinic
        </p>

        <div className="promotion-list">
          <div className="promotion-card">
            <h3>Botox ลดกราม</h3>
            <p>เพียง 3,999 บาท (จากปกติ 6,500 บาท)</p>
          </div>
          <div className="promotion-card">
            <h3>HIFU ปรับรูปหน้า</h3>
            <p>โปร 1 แถม 1 ทุกคอร์ส เฉพาะเดือนนี้</p>
          </div>
          <div className="promotion-card">
            <h3>Filler ปากสายฝอ</h3>
            <p>เริ่มต้นเพียง 6,999 บาท พร้อมปรับทรงฟรี</p>
          </div>
        </div>
      </div>
    </section>
  )
}
