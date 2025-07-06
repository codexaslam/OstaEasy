import { useState } from "react";
import {
  LiaEyeSolid,
  LiaHeart,
  LiaImageSolid,
  LiaShoppingBagSolid,
} from "react-icons/lia";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/components/_item-card.scss";

const ItemCard = ({
  item,
  onAddToCart,
  currentUser,
  showDescription = false,
  isMyItem = false,
  onEditPrice = null,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

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
        title: "Login Required",
        text: "Please login to add items to your cart",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#000",
        cancelButtonColor: "#666",
        confirmButtonText: "Login",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        navigate("/login");
      }
      return;
    }

    if (currentUser.id === item.seller.id) {
      Swal.fire({
        title: "Cannot Add Own Item",
        text: "You cannot add your own item to the cart",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      await onAddToCart(item.id);
      Swal.fire({
        title: "Added to Cart!",
        text: `${item.title} has been added to your cart.`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
    } catch {
      Swal.fire({
        title: "Error!",
        text: "Failed to add item to cart. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
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
      title: "Wishlist Feature",
      text: "Wishlist functionality coming soon!",
      icon: "info",
      confirmButtonText: "OK",
    });
  };

  return (
    <div
      className="item-card"
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="item-card__image-container">
        {item.image_url && !imageError ? (
          <img
            src={item.image_url}
            alt={item.title}
            className="item-card__image"
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="item-card__image-placeholder">
            <LiaImageSolid size={48} />
          </div>
        )}

        {/* Hover Actions */}
        <div
          className={`item-card__actions-overlay ${
            isHovered ? "item-card__actions-overlay--visible" : ""
          }`}
        >
          <button
            onClick={handleQuickView}
            className="item-card__action-btn"
            title="Quick View"
          >
            <LiaEyeSolid size={16} />
          </button>
          <button
            onClick={handleWishlist}
            className="item-card__action-btn"
            title="Add to Wishlist"
          >
            <LiaHeart size={16} />
          </button>
        </div>

        {/* Sale Badge */}
        {item.is_sale && (
          <div className="item-card__badge item-card__badge--sale">Sale</div>
        )}

        {/* New Badge */}
        {item.is_new && (
          <div className="item-card__badge item-card__badge--new">New</div>
        )}
      </div>

      <div className="item-card__content">
        <div className="item-card__info">
          <h3 className="item-card__title">{item.title}</h3>
          {showDescription && item.description && (
            <p className="item-card__description">
              {item.description.length > 150
                ? `${item.description.substring(0, 150)}...`
                : item.description}
            </p>
          )}
          <div className="item-card__price-container">
            <span className="item-card__price">{formatPrice(item.price)}</span>
            {item.original_price && item.original_price !== item.price && (
              <span className="item-card__original-price">
                {formatPrice(item.original_price)}
              </span>
            )}
          </div>
          <div className="item-card__meta">
            <span className="item-card__seller">by {item.seller.username}</span>
          </div>
        </div>

        <div className="item-card__actions">
          {isMyItem ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onEditPrice) onEditPrice(item);
              }}
              className="item-card__edit-btn"
            >
              Edit Price
            </button>
          ) : (
            <button
              onClick={handleAddToCartClick}
              className="item-card__add-to-cart-btn"
            >
              <LiaShoppingBagSolid size={16} />
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
