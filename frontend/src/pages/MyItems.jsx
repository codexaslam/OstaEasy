import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AddItemForm from "../components/AddItemForm";
import ItemCard from "../components/ItemCard";
import { API_ENDPOINTS } from "../config/api";
import { useAuth } from "../contexts/AuthContext";

const MyItems = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [items, setItems] = useState({
    on_sale: [],
    sold: [],
    purchased: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("on_sale");

  useEffect(() => {
    if (user) {
      fetchMyItems();
    }
  }, [user]);

  const fetchMyItems = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.MY_ITEMS);
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemAdded = () => {
    fetchMyItems();
    setActiveTab("on_sale"); // Switch to on_sale tab after adding item
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!user) {
    return (
      <div className="my-items-container">
        <div className="auth-message">
          <h2>{t("common.pleaseLoginToViewCart")}</h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">{t("common.loading")}</div>;
  }

  const renderItems = (itemsList, type) => {
    if (itemsList.length === 0) {
      return (
        <div className="no-items">
          <p>{t("myItems.noItems")}</p>
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
        <h1>{t("myItems.myItems")}</h1>
        <div className="stats">
          <span>
            {t("itemCard.onSale")}: {items.on_sale.length}
          </span>
          <span>
            {t("myItems.sold")}: {items.sold.length}
          </span>
          <span>Purchased: {items.purchased.length}</span>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === "add_item" ? "active" : ""}`}
          onClick={() => setActiveTab("add_item")}
        >
          + {t("myItems.addNewItem") || "Add New Item"}
        </button>
        <button
          className={`tab ${activeTab === "on_sale" ? "active" : ""}`}
          onClick={() => setActiveTab("on_sale")}
        >
          {t("itemCard.onSale")} ({items.on_sale.length})
        </button>
        <button
          className={`tab ${activeTab === "sold" ? "active" : ""}`}
          onClick={() => setActiveTab("sold")}
        >
          {t("myItems.sold")} ({items.sold.length})
        </button>
        <button
          className={`tab ${activeTab === "purchased" ? "active" : ""}`}
          onClick={() => setActiveTab("purchased")}
        >
          Purchased ({items.purchased.length})
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "add_item" ? (
          <AddItemForm onItemAdded={handleItemAdded} />
        ) : (
          renderItems(items[activeTab], activeTab)
        )}
      </div>
    </div>
  );
};

export default MyItems;
