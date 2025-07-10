'use client'

import './page.css'
import './pageMedia.css'
import categorizedServices from './data.json'
import Image from 'next/image'
import Link from 'next/link'

export default function ServicesClient() {
  return (
    <section id="services" className="services-section">
      <div className="services-container">
        <span className="section-title-en">SERVICE</span>
        <h2 className="section-title-th">บริการของเรา</h2>
        <p className="services-description">
          Caroline Clinic offers a full range of beauty services provided by
          expert physicians and modern equipment.
        </p>
        <div className="services-category-container">
          {categorizedServices.map((section, index) => (
            <div key={index} className="services-category">
              <Link
                href={`/services#category-${section.category}`}
                className="category-title"
              >
                {/* </Link><Link href={`/services/${index}`} className="category-title"> */}
                <Image
                  src="/icons/example.png"
                  alt="Caroline Clinic service example"
                  width={100}
                  height={100}
                  className="services-example"
                />
                {section.category}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
