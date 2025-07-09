'use client'

import { useState } from 'react'
import './page.css'
import { categorizedServices } from './data'

export default function ServicesClient() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="services" className="services-section">
      <div className="services-container">
        <span className="services-title-en">SERVICE</span>
        <h2 className="services-title">บริการของเรา</h2>
        <p className="services-description">
          Caroline Clinic offers a full range of beauty services provided by
          expert physicians and modern equipment.
        </p>

        {categorizedServices.map((section, index) => (
          <div key={index} className="services-category">
            <button className="category-title" onClick={() => toggle(index)}>
              {section.category}
              <span className="arrow">{openIndex === index ? '▲' : '▼'}</span>
            </button>

            {openIndex === index && (
              <div className="services-list">
                {section.items.map((title, idx) => (
                  <div key={idx} className="service-card">
                    <h3>{title}</h3>
                    <p>More details coming soon</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
