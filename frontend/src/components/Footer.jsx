import { useTranslation } from "react-i18next";
import { LiaFacebookF, LiaInstagram, LiaTwitter } from "react-icons/lia";
import { Link } from "react-router-dom";
import styles from "./Footer.module.scss";
import Logo from "./Logo";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.section}>
            <div className={styles.brand}>
              <Logo size="sm" />
              <p>{t("footer.brandDescription")}</p>
            </div>
          </div>

          <div className={styles.section}>
            <h4>{t("footer.quickLinks")}</h4>
            <ul>
              <li>
                <Link to="/">{t("footer.shop")}</Link>
              </li>
              <li>
                <Link to="/about">{t("footer.aboutUs")}</Link>
              </li>
              <li>
                <Link to="/contact">{t("navigation.contact")}</Link>
              </li>
              <li>
                <Link to="/faq">{t("footer.faq")}</Link>
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h4>{t("footer.account")}</h4>
            <ul>
              <li>
                <Link to="/account">{t("footer.myAccount")}</Link>
              </li>
              <li>
                <Link to="/cart">{t("footer.shoppingCart")}</Link>
              </li>
              <li>
                <Link to="/purchases">{t("footer.orderHistory")}</Link>
              </li>
              <li>
                <Link to="/myitems">{t("userActions.myItems")}</Link>
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h4>{t("footer.customerService")}</h4>
            <ul>
              <li>
                <a href="#shipping">{t("footer.shippingInfo")}</a>
              </li>
              <li>
                <a href="#returns">{t("footer.returnsExchanges")}</a>
              </li>
              <li>
                <a href="#privacy">{t("footer.privacyPolicy")}</a>
              </li>
              <li>
                <a href="#terms">{t("footer.termsOfService")}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.bottomContent}>
            <p>
              &copy; 2025 {t("footer.brandName")}.{" "}
              {t("footer.allRightsReserved")}.
            </p>
            <div className={styles.social}>
              <a href="#" aria-label="Facebook">
                <LiaFacebookF size={20} />
              </a>
              <a href="#" aria-label="Twitter">
                <LiaTwitter size={20} />
              </a>
              <a href="#" aria-label="Instagram">
                <LiaInstagram size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
