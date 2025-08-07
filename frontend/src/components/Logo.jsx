import nightLogo from "../assets/ostaeasy_night_logo.png";
import styles from "./Logo.module.scss";

const Logo = ({ className = "", size = "md" }) => {
  const sizeConfig = {
    sm: { text: "text-lg", icon: "h-6", spacing: "space-x-2" },
    md: { text: "text-xl", icon: "h-8", spacing: "space-x-2.5" },
    lg: { text: "text-2xl", icon: "h-10", spacing: "space-x-3" },
    xl: { text: "text-3xl", icon: "h-12", spacing: "space-x-3.5" },
  };

  const config = sizeConfig[size];

  // Map size to CSS class
  const sizeClass = {
    sm: styles.small,
    md: styles.medium,
    lg: styles.large,
    xl: styles.extraLarge,
  }[size];

  return (
    <div className={`${styles.logoContainer} ${sizeClass} ${className}`}>
      {/* Theme-aware logo images - horizontal layout */}
      <div className="relative flex">
        <img
          src={nightLogo}
          alt="OSTAEASY Logo"
          className={`${config.icon} ${styles.logoImage} w-auto object-contain rounded block`}
        />
      </div>
    </div>
  );
};

export default Logo;
