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

  const currentBaseLng = i18n.language.split('-')[0];

  return (
    <div className="language-switcher">
      {languages.map(lang => (
        <button
          key={lang.code}
          className="language-switcher-button"
          onClick={() => i18n.changeLanguage(lang.code)}
          disabled={currentBaseLng === lang.code}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
