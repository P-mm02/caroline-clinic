'use client'

import './page.css'

export default function ContactClient() {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <span className="section-title-en">CONTACT</span>
        <h2 className="section-title-th">ติดต่อเรา</h2>
        <p className="contact-description">
          สามารถติดต่อ Caroline Clinic
          เพื่อสอบถามข้อมูลหรือจองคิวล่วงหน้าได้ทุกวัน
        </p>
        <div className="contact-info">
          <p>
            <strong>โทร:</strong> 095-123-4567
          </p>
          <p>
            <strong>LINE:</strong> @carolineclinic
          </p>
          <p>
            <strong>ที่อยู่:</strong> 123 ถนนสุขุมวิท เขตวัฒนา กรุงเทพฯ
          </p>
          <p>
            <strong>เวลาทำการ:</strong> ทุกวัน 11.00 - 19.30
          </p>
        </div>

        <div className="contact-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18..."
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Caroline Clinic Map"
          ></iframe>
        </div>
      </div>
    </section>
  )
}
