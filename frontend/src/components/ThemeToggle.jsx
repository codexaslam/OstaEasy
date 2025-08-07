import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import styles from "./ThemeToggle.module.scss";

const ThemeToggle = ({ className }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`${styles.themeToggle} ${className || ""}`}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <div className={styles.iconContainer}>
        <Sun
          className={`${styles.icon} ${styles.sunIcon} ${
            theme === "light" ? styles.active : ""
          }`}
        />
        <Moon
          className={`${styles.icon} ${styles.moonIcon} ${
            theme === "dark" ? styles.active : ""
          }`}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
