import axios from "axios";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { API_ENDPOINTS } from "../config/api";
import styles from "./Cart.module.scss";
import PriceDisplay from "./PriceDisplay";
import StripeCheckout from "./StripeCheckout";

const Cart = ({ items, onUpdate, onClose }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [showStripeCheckout, setShowStripeCheckout] = useState(false);

  // Debug logging
  console.log("Cart component received items:", items);
  console.log("Items type:", typeof items);
  console.log("Is array?", Array.isArray(items));

  const handleRemoveItem = async (itemId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(API_ENDPOINTS.CART_REMOVE(itemId), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onUpdate();
      Swal.fire({
        title: t("cart.itemRemoved"),
        text: "Item has been removed from your cart.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      Swal.fire({
        title: t("common.error"),
        text: t("cart.failedToRemove"),
        icon: "error",
        confirmButtonText: t("common.ok"),
      });
    }
  };

  const handlePayClick = async () => {
    try {
      setLoading(true);
      setShowStripeCheckout(true);
    } catch (error) {
      console.error("Error initiating checkout:", error);
      setLoading(false);
      Swal.fire({
        title: "Error!",
        text: "Failed to start checkout process. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleStripeSuccess = async (paymentIntent) => {
    try {
      const token = localStorage.getItem("token");

      // Handle mock payment (no paymentIntent provided) or real payment
      const paymentIntentId = paymentIntent?.id || "mock_payment_intent_id";

      console.log("Processing payment with ID:", paymentIntentId);

      await axios.post(
        API_ENDPOINTS.CART_PAY,
        { payment_intent_id: paymentIntentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        title: "Purchase Successful!",
        text: "Your order has been placed successfully!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        onUpdate();
        onClose();
      });
    } catch (error) {
      console.error("Error finalizing purchase:", error);
      Swal.fire({
        title: "Error!",
        text: "Payment was successful but there was an issue finalizing your order. Please contact support.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setShowStripeCheckout(false);
      setLoading(false);
    }
  };

  const handleStripeCancel = () => {
    setShowStripeCheckout(false);
    setLoading(false);
  };

  // Ensure items is always an array
  const safeItems = Array.isArray(items) ? items : [];

  const totalAmount = safeItems.reduce((sum, cartItem) => {
    const price = parseFloat(cartItem.item?.price || 0);
    return sum + (isNaN(price) ? 0 : price);
  }, 0);

  return (
    <>
      <div className={styles.cartOverlay}>
        <div className={styles.cartModal}>
          <div className={styles.header}>
            <h2>{t("cart.shoppingCart")}</h2>
            <button onClick={onClose} className={styles.closeBtn}>
              ×
            </button>
          </div>

          <div className={styles.content}>
            {safeItems.length === 0 ? (
              <div className={styles.emptyMessage}>
                <p>{t("cart.emptyCart")}</p>
              </div>
            ) : (
              <>
                <div className={styles.itemsList}>
                  {safeItems.map((cartItem) => (
                    <div key={cartItem.id} className={styles.cartItem}>
                      {cartItem.item.image_url && (
                        <div className={styles.itemImagePlaceholder}>
                          <img
                            src={cartItem.item.image_url}
                            alt={cartItem.item.title}
                            className={styles.itemImage}
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        </div>
                      )}
                      <div className={styles.itemInfo}>
                        <h4 className={styles.itemTitle}>
                          {cartItem.item.title}
                        </h4>
                        <p className={styles.itemSeller}>
                          Seller: {cartItem.item.seller.username}
                        </p>
                        <PriceDisplay
                          price={cartItem.item.price}
                          size="medium"
                          className="price-display--cart"
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveItem(cartItem.item.id)}
                        className={styles.removeBtn}
                      >
                        {t("cart.remove")}
                      </button>
                    </div>
                  ))}
                </div>

                <div className={styles.footer}>
                  <div className={styles.total}>
                    <span>{t("cart.total")}: </span>
                    <PriceDisplay
                      price={totalAmount}
                      size="large"
                      className="price-display--cart"
                    />
                  </div>
                  <button
                    onClick={handlePayClick}
                    disabled={loading || safeItems.length === 0}
                    className={styles.payBtn}
                  >
                    {loading
                      ? t("checkout.processing")
                      : t("cart.proceedToCheckout")}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {showStripeCheckout && (
        <StripeCheckout
          items={items}
          total={totalAmount}
          onSuccess={handleStripeSuccess}
          onCancel={handleStripeCancel}
        />
      )}
    </>
  );
};

export default Cart;
