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
            <strong>โทร:</strong> 064-776-2422
          </p>
          <p>
            <strong>LINE:</strong> @Caroline.Clinic
          </p>
          <p>
            <strong>ที่อยู่:</strong> 88/26 ถ.เชียงรากน้อย ต.คลองหนึ่ง
            อ.คลองหลวง จ.ปทุมธานี
          </p>
          <p>
            <strong>เวลาทำการ:</strong> 12:00-20:00 (หยุดวันจันทร์)
          </p>
        </div>

        <div className="contact-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5543.024274062654!2d100.60756642011545!3d14.06567703442683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311d81b7e73cae5d%3A0x968ff4acd59c26ae!2zQ2Fyb2xpbmUgQ2xpbmljIOC5geC4hOC4o-C4reC4peC5hOC4peC4meC5jCDguITguKXguLTguJnguLTguIE!5e1!3m2!1sth!2sth!4v1752720385087!5m2!1sth!2sth"
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
