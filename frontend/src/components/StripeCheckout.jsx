import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { API_ENDPOINTS, ENV } from "../config/api";
import { useCurrency } from "../hooks/useCurrency";
import CheckoutForm from "./CheckoutForm";
import styles from "./StripeCheckout.module.scss";

// Get Stripe publishable key from environment variables
const stripePromise = loadStripe(
  ENV.STRIPE_PUBLISHABLE_KEY || "pk_test_demo_key"
);

const StripeCheckout = ({ items, total, onSuccess, onCancel }) => {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const { primaryCurrency } = useCurrency();

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          API_ENDPOINTS.CREATE_PAYMENT_INTENT,
          {
            amount: Math.round(total * 100), // Convert to cents
            currency: primaryCurrency.toLowerCase(), // Use user's preferred currency
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
        }).then(() => {
          onCancel(); // This will reset the Cart loading state
        });
      }
    };

    createPaymentIntent();
  }, [total, primaryCurrency, onSuccess, onCancel]);

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
      <div className={styles.stripeCheckoutOverlay}>
        <div className={styles.stripeCheckout}>
          <div className={styles.checkoutHeader}>
            <h2>Processing...</h2>
            <button onClick={onCancel} className={styles.closeBtn}>
              ×
            </button>
          </div>
          <div className={styles.checkoutLoading}>
            <div className={styles.loadingSpinner}></div>
            <p>Setting up secure payment...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.stripeCheckoutOverlay}>
      <div className={styles.stripeCheckout}>
        <div className={styles.checkoutHeader}>
          <h2>Secure Checkout</h2>
          <button onClick={onCancel} className={styles.closeBtn}>
            ×
          </button>
        </div>

        <div className={styles.checkoutContent}>
          <div className={styles.orderSummary}>
            <h3>
              Order Summary ({items.length} item{items.length !== 1 ? "s" : ""})
            </h3>
            <div className={styles.summaryItems}>
              {items.map((item, index) => (
                <div key={item.id || index} className={styles.summaryItem}>
                  <div className={styles.itemDetails}>
                    <span className={styles.itemName}>
                      {item.item?.title || "Unknown Item"}
                    </span>
                  </div>
                  <span className={styles.itemPrice}>
                    $
                    {((item.item?.price || 0) * (item.quantity || 1)).toFixed(
                      2
                    )}
                  </span>
                </div>
              ))}
            </div>
            <div className={styles.summaryTotal}>
              <span>Total: ${(total || 0).toFixed(2)}</span>
            </div>
          </div>

          {clientSecret && (
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm onSuccess={onSuccess} onCancel={onCancel} />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
};

export default StripeCheckout;
