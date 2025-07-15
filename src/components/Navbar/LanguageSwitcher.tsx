import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'th', label: 'TH' },
    { code: 'ja', label: 'JA' },
    { code: 'zh', label: 'ZH' },
  ];

  return (
    <div className="language-switcher">
      {languages.map(lang => (
        <button
          key={lang.code}
          className="language-switcher-button"
          onClick={() => i18n.changeLanguage(lang.code)}
          disabled={i18n.language === lang.code}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
