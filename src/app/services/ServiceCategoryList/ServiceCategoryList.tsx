'use client'

import categorizedServices from '../data.json'
import Image from 'next/image'
import './ServiceCategoryList.css'

export default function ServiceCategoryList() {
  return (
    <div className="services-category-list-container">
      {categorizedServices.map((section, index) => (
        <div
          key={index}
          id={`category-${section.category.toLowerCase().replace(/\s+/g, '-').toLowerCase()}`}
          className="services-category-list"
        >
          <div className="category-list-header">
            <Image
              src={section.image}
              alt="Caroline Clinic service example"
              width={150}
              height={150}
              className="services-category-list-example"
            />
            <h3>{section.category}</h3>
          </div>

          <ul className="service-item-list">
            {section.items.map((item, idx) => (
              <li key={idx} className="service-item">
                <h4 className="service-name">{item.name}</h4>
                <p className="service-description">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
