import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  LiaHeart,
  LiaSearchSolid,
  LiaShoppingBagSolid,
  LiaSignOutAltSolid,
  LiaUserAltSolid,
} from "react-icons/lia";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../hooks/useCart";
import Cart from "./Cart";
import CurrencySelector from "./CurrencySelector";
import LanguageSelector from "./LanguageSelector";
import Logo from "./Logo";
import styles from "./Navbar.module.scss";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { cartItems, cartCount, fetchCartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCart, setShowCart] = useState(false);

  // Check if a link is active
  const isActiveLink = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("Cart button clicked!", {
      user: !!user,
      userDetails: user,
      cartItems: cartItems.length,
      cartCount,
      showCart,
      token: !!localStorage.getItem("token"),
    });

    if (!user) {
      Swal.fire({
        title: t("common.loginRequired"),
        text: t("common.pleaseLoginToViewCart"),
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#000",
        cancelButtonColor: "#666",
        confirmButtonText: t("navigation.login"),
        cancelButtonText: t("userActions.cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    console.log("User is logged in, fetching fresh cart data...");
    // Force refresh cart data before showing
    fetchCartItems().then(() => {
      console.log("Cart data refreshed, showing cart modal");
      setShowCart(true);
    });
  };

  const handleCloseCart = () => {
    setShowCart(false);
  };

  const handleCartUpdate = () => {
    fetchCartItems();
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#000",
      cancelButtonColor: "#666",
      confirmButtonText: t("navigation.logout"),
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/");
      }
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <nav className={styles.navbar}>
      {/* Top Header Bar */}
      <div className={styles.topBar}>
        <div className={styles.container}>
          <div className={styles.topBarContent}>
            <div className={styles.topBarLeft}>
              <span>{t("features.freeShippingDesc")}</span>
              <span className={styles.divider}>|</span>
              <span>{t("features.premiumSupport")}</span>
            </div>
            <div className={styles.topBarRight}>
              <CurrencySelector compact={true} />
              <span className={styles.divider}>|</span>
              <LanguageSelector />
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className={styles.main}>
        <div className={styles.container}>
          <div className={styles.content}>
            <Link to="/" className={styles.logo}>
              <Logo size="md" />
            </Link>

            <div className={styles.nav}>
              <Link
                to="/"
                className={`${styles.navLink} ${
                  isActiveLink("/") ? styles.active : ""
                }`}
              >
                {t("navigation.shop")}
              </Link>
              <Link
                to="/about"
                className={`${styles.navLink} ${
                  isActiveLink("/about") ? styles.active : ""
                }`}
              >
                {t("navigation.about")}
              </Link>
              <Link
                to="/contact"
                className={`${styles.navLink} ${
                  isActiveLink("/contact") ? styles.active : ""
                }`}
              >
                {t("navigation.contact")}
              </Link>
              {user && (
                <>
                  <Link
                    to="/dashboard"
                    className={`${styles.navLink} ${
                      isActiveLink("/dashboard") ? styles.active : ""
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/myitems"
                    className={`${styles.navLink} ${
                      isActiveLink("/myitems") ? styles.active : ""
                    }`}
                  >
                    {t("userActions.myItems")}
                  </Link>
                  <Link
                    to="/purchases"
                    className={`${styles.navLink} ${
                      isActiveLink("/purchases") ? styles.active : ""
                    }`}
                  >
                    {t("userActions.orders")}
                  </Link>
                </>
              )}
            </div>

            <div className={styles.actions}>
              <form onSubmit={handleSearch} className={styles.search}>
                <input
                  type="text"
                  placeholder={t("userActions.searchProducts")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit">
                  <LiaSearchSolid size={20} />
                </button>
              </form>

              {user ? (
                <div className={styles.userMenu}>
                  <Link
                    to="/account"
                    className={`${styles.actionBtn} ${
                      isActiveLink("/account") ? styles.activeAction : ""
                    }`}
                  >
                    <LiaUserAltSolid size={20} />
                  </Link>

                  <button className={styles.actionBtn}>
                    <LiaHeart size={20} />
                  </button>

                  <button
                    onClick={handleCartClick}
                    className={styles.cartBtn}
                    data-count={cartCount}
                  >
                    <LiaShoppingBagSolid size={20} />
                  </button>

                  <button onClick={handleLogout} className={styles.actionBtn}>
                    <LiaSignOutAltSolid size={20} />
                  </button>

                  <ThemeToggle />
                </div>
              ) : (
                <div className={styles.guestMenu}>
                  <Link to="/login" className={styles.actionBtn}>
                    <LiaUserAltSolid size={20} />
                  </Link>

                  <button className={styles.actionBtn}>
                    <LiaHeart size={20} />
                  </button>

                  <button
                    onClick={handleCartClick}
                    className={styles.cartBtn}
                    data-count={cartCount}
                  >
                    <LiaShoppingBagSolid size={20} />
                  </button>

                  <ThemeToggle />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cart Modal */}
      {showCart && (
        <Cart
          items={cartItems}
          onUpdate={handleCartUpdate}
          onClose={handleCloseCart}
        />
      )}
    </nav>
  );
};

export default Navbar;
