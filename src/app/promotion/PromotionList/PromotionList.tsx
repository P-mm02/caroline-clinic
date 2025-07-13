'use client'

import promotions from '../data.json'
import Image from 'next/image'
import './PromotionList.css'

export default function PromotionList() {
  return (
    <div className="promotion-list-container">
        <h1>รายการโปรโมชัน</h1>
      {promotions.map((promo, index) => (
        <div key={index} className="promotion-list-card">
          <div className="promotion-list-image-wrapper">
            <Image
              src={promo.image}
              alt={promo.title}
              width={200}
              height={250}
              className="promotion-list-image"
              // optionally: style={{ objectFit: 'cover' }}
            />
          </div>
{/*           <div className="promotion-list-content">
            <h3 className="promotion-list-title">{promo.title}</h3>
            <p className="promotion-list-description">{promo.description}</p>
          </div>
 */}        </div>
      ))}
    </div>
  )
}
