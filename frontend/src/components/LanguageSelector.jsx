import { useTranslation } from "react-i18next";
import "./LanguageSelector.scss";

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "fi", name: "Suomi", flag: "🇫🇮" },
    { code: "sv", name: "Svenska", flag: "🇸🇪" },
  ];

  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <div className="language-selector">
      <div className="language-dropdown">
        <button className="language-button">
          <span className="current-flag">
            {languages.find((lang) => lang.code === i18n.language)?.flag ||
              "🇺🇸"}
          </span>
          <span className="current-language">
            {languages.find((lang) => lang.code === i18n.language)?.name ||
              "English"}
          </span>
          <svg
            className="dropdown-arrow"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="language-dropdown-menu">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              className={`language-option ${
                i18n.language === language.code ? "active" : ""
              }`}
            >
              <span className="flag">{language.flag}</span>
              <span className="name">{language.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
