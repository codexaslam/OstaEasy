import axios from "axios";
import { useEffect, useState } from "react";
import EditItemForm from "../components/EditItemForm";
import ItemCard from "../components/ItemCard";
import { useAuth } from "../contexts/AuthContext";
import "./MyItems.css";

const MyItems = () => {
  const { user } = useAuth();
  const [items, setItems] = useState({
    on_sale: [],
    sold: [],
    purchased: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("on_sale");
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    if (user) {
      fetchMyItems();
    }
  }, [user]);

  const fetchMyItems = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/shop/my-items/"
      );
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemUpdated = () => {
    setEditingItem(null);
    fetchMyItems();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!user) {
    return (
      <div className="my-items-container">
        <div className="auth-message">
          <h2>Please login to view your items</h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading your items...</div>;
  }

  const renderItems = (itemsList, type) => {
    if (itemsList.length === 0) {
      return (
        <div className="no-items">
          <p>No items in this category</p>
        </div>
      );
    }

    return (
      <div className="items-grid">
        {itemsList.map((item) => (
          <div key={item.id} className="my-item-wrapper">
            <ItemCard
              item={item}
              currentUser={user}
              onAddToCart={() => {}} // Disable add to cart for own items
              isMyItem={type === "on_sale"}
              onEditPrice={type === "on_sale" ? setEditingItem : null}
            />

            {/* Additional info specific to MyItems */}
            <div className="my-item-details">
              <div className="item-meta">
                <span className="item-date">
                  Added: {formatDate(item.date_added)}
                </span>
                {item.date_sold && (
                  <span className="item-date">
                    Sold: {formatDate(item.date_sold)}
                  </span>
                )}
                {item.buyer && (
                  <span className="item-buyer-seller">
                    {type === "purchased" ? "Seller" : "Buyer"}:{" "}
                    {type === "purchased"
                      ? item.seller.username
                      : item.buyer.username}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="my-items-container">
      <div className="my-items-header">
        <h1>My Items</h1>
        <div className="stats">
          <span>On Sale: {items.on_sale.length}</span>
          <span>Sold: {items.sold.length}</span>
          <span>Purchased: {items.purchased.length}</span>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === "on_sale" ? "active" : ""}`}
          onClick={() => setActiveTab("on_sale")}
        >
          On Sale ({items.on_sale.length})
        </button>
        <button
          className={`tab ${activeTab === "sold" ? "active" : ""}`}
          onClick={() => setActiveTab("sold")}
        >
          Sold ({items.sold.length})
        </button>
        <button
          className={`tab ${activeTab === "purchased" ? "active" : ""}`}
          onClick={() => setActiveTab("purchased")}
        >
          Purchased ({items.purchased.length})
        </button>
      </div>

      <div className="tab-content">
        {renderItems(items[activeTab], activeTab)}
      </div>

      {editingItem && (
        <EditItemForm
          item={editingItem}
          onItemUpdated={handleItemUpdated}
          onCancel={() => setEditingItem(null)}
        />
      )}
    </div>
  );
};

export default MyItems;
