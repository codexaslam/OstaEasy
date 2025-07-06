import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import "./PurchaseHistory.css";

const PurchaseHistory = () => {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      fetchPurchases();
    }
  }, [user]);

  const fetchPurchases = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8000/api/shop/purchases/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPurchases(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching purchases:", error);
      setError("Failed to load purchase history");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user) {
    return (
      <div className="purchase-history">
        <h2>Purchase History</h2>
        <p>Please log in to view your purchase history.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="purchase-history">
        <h2>Purchase History</h2>
        <p>Loading your purchases...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="purchase-history">
        <h2>Purchase History</h2>
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div className="purchase-history">
      <h2>Purchase History</h2>
      {purchases.length === 0 ? (
        <p>You haven't made any purchases yet.</p>
      ) : (
        <div className="purchases-grid">
          {purchases.map((purchase) => (
            <div key={purchase.id} className="purchase-card">
              <div className="purchase-header">
                <h3>{purchase.item.title}</h3>
                <span className="purchase-price">
                  ${purchase.purchase_price}
                </span>
              </div>

              {purchase.item.image_url && (
                <div className="purchase-image">
                  <img
                    src={purchase.item.image_url}
                    alt={purchase.item.title}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}

              <div className="purchase-details">
                <p className="purchase-description">
                  {purchase.item.description}
                </p>
                <p className="purchase-date">
                  Purchased: {formatDate(purchase.purchase_date)}
                </p>
                <p className="purchase-seller">
                  Seller: {purchase.item.seller.username}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;
