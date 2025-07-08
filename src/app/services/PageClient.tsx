'use client'

import './page.css'

export default function ServicesClient() {
  return (
    <section id="services" className="services-section">
      <div className="services-container">
        <h2 className="services-title">บริการของเรา</h2>
        <p className="services-description">
          Caroline Clinic ให้บริการความงามครบวงจร
          โดยทีมแพทย์ผู้เชี่ยวชาญและเครื่องมือทันสมัย
        </p>

        <div className="services-list">
          <div className="service-card">
            <h3>Botox</h3>
            <p>ลดกราม ริ้วรอย ปรับรูปหน้าโดยไม่ต้องผ่าตัด</p>
          </div>
          <div className="service-card">
            <h3>Filler</h3>
            <p>เติมเต็มร่องลึก ปาก จมูก ใต้ตา ปรับรูปหน้าอย่างปลอดภัย</p>
          </div>
          <div className="service-card">
            <h3>HIFU</h3>
            <p>ยกกระชับผิวหน้า ลดเหนียง ไม่เจ็บ ไม่ต้องพักฟื้น</p>
          </div>
        </div>
      </div>
    </section>
  )
}
