import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import "./Cart.css";
import StripeCheckout from "./StripeCheckout";

const Cart = ({ items, onUpdate, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [showStripeCheckout, setShowStripeCheckout] = useState(false);

  const handleRemoveItem = async (itemId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:8000/api/shop/cart/remove/${itemId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onUpdate();
      Swal.fire({
        title: "Item Removed",
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
        title: "Error!",
        text: "Failed to remove item from cart. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handlePayClick = async () => {
    setShowStripeCheckout(true);
  };

  const handleStripeSuccess = async (paymentIntent) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8000/api/shop/cart/pay/",
        { payment_intent_id: paymentIntent.id },
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
    }
  };

  const handleStripeCancel = () => {
    setShowStripeCheckout(false);
  };

  const totalAmount = items.reduce(
    (sum, cartItem) => sum + parseFloat(cartItem.item.price),
    0
  );

  return (
    <>
      <div className="cart-overlay">
        <div className="cart-modal">
          <div className="cart-header">
            <h2>Shopping Cart</h2>
            <button onClick={onClose} className="close-btn">
              ×
            </button>
          </div>

          <div className="cart-content">
            {items.length === 0 ? (
              <div className="empty-cart">
                <p>Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {items.map((cartItem) => (
                    <div key={cartItem.id} className="cart-item">
                      {cartItem.item.image_url && (
                        <div className="cart-item-image">
                          <img
                            src={cartItem.item.image_url}
                            alt={cartItem.item.title}
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        </div>
                      )}
                      <div className="item-info">
                        <h4>{cartItem.item.title}</h4>
                        <p className="item-seller">
                          Seller: {cartItem.item.seller.username}
                        </p>
                        <p className="item-price">${cartItem.item.price}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(cartItem.item.id)}
                        className="remove-btn"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div className="total-amount">
                    <strong>Total: ${totalAmount.toFixed(2)}</strong>
                  </div>
                  <button
                    onClick={handlePayClick}
                    disabled={loading || items.length === 0}
                    className="pay-btn"
                  >
                    {loading ? "Processing..." : "Secure Checkout"}
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
