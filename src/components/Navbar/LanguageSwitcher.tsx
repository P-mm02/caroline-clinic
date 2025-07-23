import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', label: 'EN', image: '/flags/en-USA.svg' },
    { code: 'th', label: 'TH', image: '/flags/th-Thailand.svg' },
    { code: 'ja', label: 'JA', image: '/flags/ja-Japan.svg' },
    { code: 'zh', label: 'ZH', image: '/flags/zh-China.svg' },
  ]

  const currentBaseLng = i18n.language.split('-')[0];

  return (
    <div className="language-switcher">
      {languages.map((lang) => (
        <button
          key={lang.code}
          className="language-switcher-button"
          onClick={() => i18n.changeLanguage(lang.code)}
          disabled={currentBaseLng === lang.code}
        >
          <img src={lang.image} alt={lang.image} />
        </button>
      ))}
    </div>
  )
}
