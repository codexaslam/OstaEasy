import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import CheckoutForm from "./CheckoutForm";
import "./StripeCheckout.css";

// Make sure to replace with your actual publishable key
const stripePromise = loadStripe("pk_test_TLpdfZUwuHdj5TjQb7tGIaKp"); // Demo key for testing

const StripeCheckout = ({ items, total, onSuccess, onCancel }) => {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          "http://localhost:8000/api/shop/create-payment-intent/",
          {
            amount: Math.round(total * 100), // Convert to cents
            currency: "usd",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setClientSecret(response.data.client_secret);
        setLoading(false);
      } catch (error) {
        console.error("Error creating payment intent:", error);
        setLoading(false);
        Swal.fire({
          title: "Error!",
          text: "Failed to initialize payment. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    createPaymentIntent();
  }, [total]);

  const appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#0070f3",
      colorBackground: "#ffffff",
      colorText: "#1a1a1a",
      colorDanger: "#df1b41",
      fontFamily: "system-ui, -apple-system, sans-serif",
      spacingUnit: "6px",
      borderRadius: "6px",
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  if (loading) {
    return (
      <div className="stripe-checkout">
        <div className="checkout-header">
          <h2>Processing...</h2>
          <button onClick={onCancel} className="close-btn">
            ×
          </button>
        </div>
        <div className="checkout-loading">
          <div className="loading-spinner"></div>
          <p>Setting up secure payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="stripe-checkout">
      <div className="checkout-header">
        <h2>Secure Checkout</h2>
        <button onClick={onCancel} className="close-btn">
          ×
        </button>
      </div>

      <div className="checkout-content">
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-items">
            {items.map((item) => (
              <div key={item.id} className="summary-item">
                <div className="item-details">
                  <span className="item-name">{item.item.title}</span>
                  <span className="item-quantity">Qty: {item.quantity}</span>
                </div>
                <span className="item-price">
                  ${(item.item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="summary-total">
            <span>Total: ${total.toFixed(2)}</span>
          </div>
        </div>

        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm onSuccess={onSuccess} onCancel={onCancel} />
          </Elements>
        )}
      </div>
    </div>
  );
};

export default StripeCheckout;
