import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'en', label: t('language.en'), display: 'EN' },
    { code: 'he', label: t('language.he'), display: 'HE' },
    { code: 'ru', label: t('language.ru'), display: 'RU' },
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
          {lang.display}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
