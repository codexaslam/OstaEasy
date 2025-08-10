import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  LiaEyeSolid,
  LiaHeart,
  LiaImageSolid,
  LiaShoppingBagSolid,
} from "react-icons/lia";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import styles from "./ItemCard.module.scss";
import PriceDisplay from "./PriceDisplay";

const ItemCard = ({
  item,
  onAddToCart,
  currentUser,
  showDescription = false,
  isMyItem = false,
  hideActions = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleImageError = () => {
    setImageError(true);
  };

  const handleCardClick = () => {
    navigate(`/items/${item.id}`);
  };

  const handleAddToCartClick = async (e) => {
    e.stopPropagation();

    if (!currentUser) {
      // Show login prompt for non-authenticated users
      const result = await Swal.fire({
        title: t("common.loginRequired"),
        text: t("common.pleaseLoginToAddItems"),
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#000",
        cancelButtonColor: "#666",
        confirmButtonText: t("navigation.login"),
        cancelButtonText: t("userActions.cancel"),
      });

      if (result.isConfirmed) {
        navigate("/login");
      }
      return;
    }

    if (currentUser.id === item.seller.id) {
      Swal.fire({
        title: t("itemCard.cannotAddOwnItem"),
        text: t("itemCard.cannotAddOwnItemText"),
        icon: "warning",
        confirmButtonText: t("common.ok"),
      });
      return;
    }

    try {
      await onAddToCart(item.id);
      Swal.fire({
        title: t("itemCard.itemAddedToCart"),
        text: `${item.title} ${t("itemCard.itemAddedToCartText")}`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
    } catch {
      Swal.fire({
        title: t("common.error"),
        text: t("itemCard.failedToAddToCart"),
        icon: "error",
        confirmButtonText: t("common.ok"),
      });
    }
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    navigate(`/items/${item.id}`);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    Swal.fire({
      title: t("itemCard.wishlistFeature"),
      text: t("itemCard.wishlistComingSoon"),
      icon: "info",
      confirmButtonText: t("common.ok"),
    });
  };

  return (
    <div
      className={styles.itemCard}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.imageContainer}>
        {item.image_url && !imageError ? (
          <img
            src={item.image_url}
            alt={item.title}
            className={styles.image}
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className={styles.imagePlaceholder}>
            <LiaImageSolid size={48} />
          </div>
        )}

        {/* Hover Actions */}
        <div
          className={`${styles.actionsOverlay} ${
            isHovered ? styles.visible : ""
          }`}
        >
          <button
            onClick={handleQuickView}
            className={styles.actionBtn}
            title="Quick View"
          >
            <LiaEyeSolid size={16} />
          </button>
          <button
            onClick={handleWishlist}
            className={styles.actionBtn}
            title={t("itemCard.addToWishlist")}
          >
            <LiaHeart size={16} />
          </button>
        </div>

        {/* Sale Badge */}
        {item.is_sale && (
          <div className={`${styles.badge} ${styles.sale}`}>
            {t("itemCard.onSale")}
          </div>
        )}

        {/* New Badge */}
        {item.is_new && (
          <div className={`${styles.badge} ${styles.new}`}>
            {t("hero.newArrivals")}
          </div>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.info}>
          <h3 className={styles.title}>{item.title}</h3>
          {showDescription && item.description && (
            <p className={styles.description}>
              {item.description.length > 150
                ? `${item.description.substring(0, 150)}...`
                : item.description}
            </p>
          )}
          <div className={styles.priceContainer}>
            <PriceDisplay
              price={item.price}
              size="medium"
              className={`${styles.price} price-display--item-card`}
            />
            {item.original_price && item.original_price !== item.price && (
              <PriceDisplay
                price={item.original_price}
                size="small"
                showSecondary={false}
                className={styles.originalPrice}
              />
            )}
          </div>
          <div className={styles.meta}>
            <span className={styles.seller}>by {item.seller.username}</span>
          </div>
        </div>

        <div className={styles.actions}>
          {hideActions ? null : isMyItem ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/edit-item/${item.id}`);
              }}
              className={styles.editBtn}
            >
              {t("itemCard.editPrice")}
            </button>
          ) : (
            <button
              onClick={handleAddToCartClick}
              className={styles.addToCartBtn}
            >
              <LiaShoppingBagSolid size={16} />
              {t("itemCard.addToCart")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
