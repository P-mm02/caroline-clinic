import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import './LanguageSwitcher.css'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const languages = [
    { code: 'en', label: 'EN', image: '/flags/en-USA.svg' },
    { code: 'th', label: 'TH', image: '/flags/th-Thailand.svg' },
    { code: 'ja', label: 'JA', image: '/flags/ja-Japan.svg' },
    { code: 'zh', label: 'ZH', image: '/flags/zh-China.svg' },
  ]

  // Only get language after mounted to avoid SSR mismatch
  const currentBaseLng = mounted ? (i18n.language || 'en').split('-')[0] : 'en'

  if (!mounted) return null // or a spinner if you like

  return (
    <div className="language-switcher">
      {languages.map((lang) => (
        <button
          key={lang.code}
          className="language-switcher-button"
          onClick={() => i18n.changeLanguage(lang.code)}
          disabled={currentBaseLng === lang.code}
        >
          <img src={lang.image} alt={lang.label} />
        </button>
      ))}
    </div>
  )
}
