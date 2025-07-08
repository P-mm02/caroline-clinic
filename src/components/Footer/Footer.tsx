'use client'

import './Footer.css'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        {/* Column 1: Logo & tagline */}
        <div>
          <h2 className="footer-logo">Caroline Clinic</h2>
          <p>ความงามที่มั่นใจ ปลอดภัยทุกขั้นตอน</p>
        </div>

        {/* Column 2: Quick links */}
        <div>
          <h3 className="footer-title">ลิงก์ด่วน</h3>
          <ul className="footer-links">
            <li>
              <a href="#services">บริการ</a>
            </li>
            <li>
              <a href="#about">เกี่ยวกับเรา</a>
            </li>
            <li>
              <a href="#review">รีวิว</a>
            </li>
            <li>
              <a href="#promotion">โปรโมชั่น</a>
            </li>
            <li>
              <a href="#contact">ติดต่อ</a>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact Info */}
        <div>
          <h3 className="footer-title">ติดต่อเรา</h3>
          <p>โทร: 095-123-4567</p>
          <p>LINE: @carolineclinic</p>
          <p>เปิดทุกวัน 11.00 - 19.30</p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} Caroline Clinic. All rights reserved.
      </div>
    </footer>
  )
}
