'use client'

import './page.css'

export default function ReviewClient() {
  return (
    <section id="review" className="review-section">
      <div className="review-container">
        <span className="section-title-en">REVIEWS</span>
        <h2 className="section-title-th">รีวิวจากลูกค้า</h2>
        <p className="review-description">
          เสียงตอบรับจากลูกค้าผู้ใช้บริการจริงที่ Caroline Clinic
        </p>

        <div className="review-list">
          <div className="review-card">
            <p className="review-text">
              “ประทับใจมากค่ะ คุณหมอให้คำแนะนำดีมาก มือเบา เห็นผลชัดเจน
              จะกลับมาอีกแน่นอน!”
            </p>
            <p className="review-name">– คุณแอน, กรุงเทพฯ</p>
          </div>
          <div className="review-card">
            <p className="review-text">
              “พนักงานบริการดีมาก คลินิกสะอาด บรรยากาศอบอุ่น
              รู้สึกปลอดภัยตลอดการรักษา”
            </p>
            <p className="review-name">– คุณเจ, นนทบุรี</p>
          </div>
          <div className="review-card">
            <p className="review-text">
              “ราคาดี มีโปรโมชั่นเยอะ ใช้ผลิตภัณฑ์ของแท้แน่นอนค่ะ”
            </p>
            <p className="review-name">– คุณมายด์, ปทุมธานี</p>
          </div>
        </div>
      </div>
    </section>
  )
}
