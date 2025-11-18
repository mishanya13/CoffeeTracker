import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'en', label: t('language.en'), flag: '🇬🇧' },
    { code: 'he', label: t('language.he'), flag: '🇮🇱' },
    { code: 'ru', label: t('language.ru'), flag: '🇷🇺' },
  ];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <div className="flex gap-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            i18n.language === lang.code
              ? 'bg-coffee-600 text-white'
              : 'bg-cream-200 text-coffee-800 hover:bg-cream-300'
          }`}
          title={lang.label}
        >
          {lang.flag}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
