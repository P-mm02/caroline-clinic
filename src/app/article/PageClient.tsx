'use client'

import './page.css'
import Image from 'next/image'
import Link from 'next/link'
import articles from './data.json'


export default function ArticleClient() {
  return (
    <section id="article" className="article-section">
      <div className="article-container">
        <span className="section-title-en">BLOG</span>
        <h2 className="section-title-th">บทความแนะนำ</h2>
        <p className="article-description">
          ติดตามบทความเกี่ยวกับความงาม การดูแลผิวพรรณ
          และเทคโนโลยีความงามล่าสุดจากแพทย์ผู้เชี่ยวชาญของเรา
        </p>

        <div className="article-list">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={article.href}
              className="article-card"
              aria-label={`อ่าน ${article.title}`}
            >
              <div className="article-card-image-wrapper">
                <Image
                  src={article.image}
                  alt={article.title}
                  width={360}
                  height={220}
                  className="article-card-image"
                  sizes="(max-width: 600px) 100vw, 360px"
                />
              </div>
              <div className="article-card-meta">
                <span className="article-card-date">
                  {new Date(article.date).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
                <span className="article-card-author">{article.author}</span>
              </div>
              <h3 className="article-card-title">{article.title}</h3>
              <p className="article-card-desc">{article.description}</p>
              <div className="article-card-tags">
                {article.tags.map(tag => (
                  <span key={tag} className="article-card-tag">{tag}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
