'use client'

import './page.css'

export default function ArticleClient() {
  return (
    <section id="article" className="article-section">
      <div className="article-container">
        <h2 className="article-title">บทความแนะนำ</h2>
        <p className="article-description">
          ติดตามบทความเกี่ยวกับความงาม การดูแลผิวพรรณ
          และเทคโนโลยีความงามล่าสุดจากแพทย์ผู้เชี่ยวชาญของเรา
        </p>

        <div className="article-list">
          <div className="article-card">
            <h3>วิธีเตรียมตัวก่อนฉีดฟิลเลอร์</h3>
            <p>
              สิ่งที่ควรรู้ก่อนเข้ารับบริการฉีดฟิลเลอร์
              เพื่อผลลัพธ์ที่ปลอดภัยและเป็นธรรมชาติ
            </p>
          </div>
          <div className="article-card">
            <h3>เลือกคลินิกอย่างไรให้มั่นใจ</h3>
            <p>
              รวมเคล็ดลับการเลือกคลินิกเสริมความงามให้ปลอดภัย มั่นใจในคุณภาพ
            </p>
          </div>
          <div className="article-card">
            <h3>เทรนด์ความงาม 2025</h3>
            <p>ส่องเทรนด์ความงามและเทคโนโลยีเสริมความงามที่มาแรงในปีนี้</p>
          </div>
        </div>
      </div>
    </section>
  )
}
