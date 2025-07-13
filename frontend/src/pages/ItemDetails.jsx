import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import PriceDisplay from "../components/PriceDisplay";
import { API_ENDPOINTS } from "../config/api";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../hooks/useCart";

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.ITEM_DETAIL(id));
        setItem(response.data);
      } catch (error) {
        console.error("Error fetching item:", error);
        setError("Item not found");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to add items to cart",
        icon: "info",
        confirmButtonText: "Login",
        confirmButtonColor: "#000",
        background: "#fff",
        color: "#000",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart(item.id);
      Swal.fire({
        title: "Success!",
        text: "Item added to cart successfully!",
        icon: "success",
        confirmButtonText: "Continue Shopping",
        confirmButtonColor: "#000",
        background: "#fff",
        color: "#000",
        showClass: {
          popup: "animate__animated animate__fadeInUp animate__faster",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutDown animate__faster",
        },
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.error || "Failed to add item to cart",
        icon: "error",
        confirmButtonText: "Try Again",
        confirmButtonColor: "#000",
        background: "#fff",
        color: "#000",
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBackToShop = () => {
    navigate("/");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return <div className="item-details-loading">Loading item details...</div>;
  }

  if (error) {
    return (
      <div className="item-details-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={handleBackToShop} className="back-btn">
          Back to Shop
        </button>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="item-details-error">
        <h2>Item not found</h2>
        <button onClick={handleBackToShop} className="back-btn">
          Back to Shop
        </button>
      </div>
    );
  }

  const canAddToCart =
    user && user.id !== item.seller.id && item.status === "on_sale";
  const isOwner = user && user.id === item.seller.id;

  return (
    <div className="item-details">
      <div className="item-details-container">
        <button onClick={handleBackToShop} className="back-btn">
          ← Back to Shop
        </button>

        <div className="item-details-content">
          <div className="item-image-section">
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.title}
                className="item-details-image"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className="item-details-image-placeholder"
              style={{
                display: item.image_url ? "none" : "flex",
              }}
            >
              <span>No Image Available</span>
            </div>
          </div>

          <div className="item-info-section">
            <div className="item-header">
              <h1 className="item-title">{item.title}</h1>
              <div className="item-price-section">
                <PriceDisplay
                  price={item.price}
                  size="extra-large"
                  className="item-price"
                  vertical={true}
                />
                <span className={`item-status ${item.status}`}>
                  {item.status === "on_sale" ? "Available" : "Sold"}
                </span>
              </div>
            </div>

            <div className="item-description">
              <h3>Description</h3>
              <p>{item.description}</p>
            </div>

            <div className="item-seller-info">
              <h3>Seller Information</h3>
              <div className="seller-details">
                <span className="seller-name">
                  <strong>Seller:</strong> {item.seller.username}
                </span>
                <span className="seller-email">
                  <strong>Email:</strong> {item.seller.email}
                </span>
                <span className="item-date">
                  <strong>Listed:</strong> {formatDate(item.date_added)}
                </span>
                {item.date_sold && (
                  <span className="sold-date">
                    <strong>Sold:</strong> {formatDate(item.date_sold)}
                  </span>
                )}
              </div>
            </div>

            <div className="item-actions">
              {canAddToCart && (
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="add-to-cart-btn-details"
                >
                  {addingToCart ? "Adding..." : "Add to Cart"}
                </button>
              )}
              {isOwner && (
                <div className="owner-info">
                  <span className="own-item-badge">This is your item</span>
                </div>
              )}
              {!user && (
                <div className="login-prompt">
                  <p>Please log in to purchase this item</p>
                  <button
                    onClick={() => navigate("/login")}
                    className="login-btn"
                  >
                    Login
                  </button>
                </div>
              )}
              {item.status === "sold" && (
                <div className="sold-info">
                  <span className="sold-badge">This item has been sold</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
