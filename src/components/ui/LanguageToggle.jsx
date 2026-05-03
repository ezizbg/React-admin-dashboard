import { useI18n } from "../../features/i18n/i18nContext";

export function LanguageToggle() {
  const { language, languages, setLanguage, t } = useI18n();

  return (
    <div className="language-toggle" role="group" aria-label={t("common.language")}>
      {languages.map((item) => (
        <button
          className={item.value === language ? "language-toggle__button language-toggle__button--active" : "language-toggle__button"}
          key={item.value}
          type="button"
          onClick={() => setLanguage(item.value)}
          aria-pressed={item.value === language}
          title={item.name}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
