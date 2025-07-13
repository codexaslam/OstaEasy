import { Check, Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../hooks/useTheme";
import styles from "./ThemeSettings.module.scss";

const ThemeSettings = () => {
  const { t } = useTranslation();
  const { setLightTheme, setDarkTheme, isDark, isLight } = useTheme();

  const themeOptions = [
    {
      id: "light",
      name: t("theme.lightMode"),
      icon: Sun,
      active: isLight,
      action: setLightTheme,
    },
    {
      id: "dark",
      name: t("theme.darkMode"),
      icon: Moon,
      active: isDark,
      action: setDarkTheme,
    },
  ];

  return (
    <div className={styles.themeSettings}>
      <div className={styles.header}>
        <h3 className={styles.title}>{t("theme.themeSettings")}</h3>
        <p className={styles.description}>
          Choose your preferred theme. The setting will be saved and applied
          across all pages.
        </p>
      </div>

      <div className={styles.options}>
        {themeOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <button
              key={option.id}
              onClick={option.action}
              className={`${styles.option} ${
                option.active ? styles.active : ""
              }`}
            >
              <div className={styles.iconContainer}>
                <IconComponent className={styles.icon} />
                {option.active && <Check className={styles.checkIcon} />}
              </div>
              <span className={styles.optionName}>{option.name}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.preview}>
        <div className={styles.previewCard}>
          <div className={styles.previewHeader}>
            <div className={styles.previewDot}></div>
            <div className={styles.previewDot}></div>
            <div className={styles.previewDot}></div>
          </div>
          <div className={styles.previewContent}>
            <div className={styles.previewText}>Preview</div>
            <div className={styles.previewSubtext}>
              This is how your interface will look
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;
