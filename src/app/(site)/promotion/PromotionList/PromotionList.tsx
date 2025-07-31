'use client'

import promotions from '../data.json'
import Image from 'next/image'
import './PromotionList.css'
import { useTranslation } from 'react-i18next'


export default function PromotionList() {
  const { t } = useTranslation()
  return (
    <>
      <div className="promotion-list-container-head">
        <h1>{t(`promotions.all`)}</h1>
      </div>
      <div className="promotion-list-container">
        {promotions.map((promo, index) => (
          <div key={index} className="promotion-list-card">
            <div className="promotion-list-image-wrapper">
              <Image
                src={promo.image}
                alt={promo.title}
                width={200}
                height={250}
                className="promotion-list-image"
              />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
