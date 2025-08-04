import axios from "axios";
import {
  AlertCircle,
  ArrowLeft,
  DollarSign,
  Edit3,
  Euro,
  FileText,
  Image,
  Package,
  Save,
  Tag,
  Upload,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import "../components/AddItemForm.scss"; // Reuse the same styles
import { API_ENDPOINTS } from "../config/api";
import { useCurrency } from "../hooks/useCurrency";

const EditItem = () => {
  const { t } = useTranslation();
  const { primaryCurrency } = useCurrency();
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "clothing",
    image_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchingItem, setFetchingItem] = useState(true);
  const [error, setError] = useState("");

  // Fetch item details on component mount
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(API_ENDPOINTS.ITEM_DETAIL(id), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const item = response.data;
        setFormData({
          title: item.title || "",
          description: item.description || "",
          price: item.price || "",
          category: item.category || "clothing",
          image_url: item.image_url || "",
        });
      } catch (error) {
        console.error("Error fetching item:", error);
        setError("Failed to load item details");
        Swal.fire({
          title: t("common.error"),
          text: "Failed to load item details",
          icon: "error",
          confirmButtonText: t("common.ok"),
          confirmButtonColor: "#000",
        }).then(() => {
          navigate("/myitems");
        });
      } finally {
        setFetchingItem(false);
      }
    };

    if (id) {
      fetchItem();
    }
  }, [id, navigate, t]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCategoryChange = (value) => {
    setFormData({
      ...formData,
      category: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      // Include currency information with the price
      const itemData = {
        ...formData,
        currency: primaryCurrency,
        price: parseFloat(formData.price),
      };

      await axios.put(API_ENDPOINTS.ITEM_UPDATE(id), itemData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      Swal.fire({
        title: "Success!",
        text: "Item updated successfully!",
        icon: "success",
        confirmButtonText: t("common.ok"),
        confirmButtonColor: "#000",
      }).then(() => {
        navigate("/myitems");
      });
    } catch (error) {
      console.error("Error updating item:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Failed to update item";
      setError(errorMessage);
      Swal.fire({
        title: t("common.error"),
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Try Again",
        confirmButtonColor: "#000",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/myitems");
  };

  if (fetchingItem) {
    return (
      <div className="add-item-container">
        <div className="add-item-form">
          <div className="form-header">
            <div className="header-icon">
              <Edit3 size={32} />
            </div>
            <div className="header-content">
              <h2 className="form-title">Loading...</h2>
            </div>
          </div>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="add-item-container">
      <div className="add-item-form">
        {/* Header Section */}
        <div className="form-header">
          <button onClick={handleBack} className="back-button">
            <ArrowLeft size={24} />
          </button>
          <div className="header-icon">
            <Edit3 size={32} />
          </div>
          <div className="header-content">
            <h2 className="form-title">Edit Item</h2>
            <p className="form-subtitle">Update your listing details</p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="error-alert">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="item-form">
          {/* Title Field */}
          <div className="form-group">
            <label className="form-label flex items-center">
              <Tag size={18} />
              {t("addItemForm.title")}
            </label>
            <input
              className="form-input"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder={t("addItemForm.titlePlaceholder")}
            />
          </div>

          {/* Description Field */}
          <div className="form-group">
            <label className="form-label">
              <FileText size={18} />
              {t("addItemForm.description")}
            </label>
            <textarea
              className="form-textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder={t("addItemForm.descriptionPlaceholder")}
              rows={4}
            />
          </div>

          {/* Price and Category Row */}
          <div className="form-row">
            <div className="form-group half-width">
              <label className="form-label">
                {primaryCurrency === "EUR" ? (
                  <Euro size={18} />
                ) : (
                  <DollarSign size={18} />
                )}
                {t("addItemForm.price")} ({primaryCurrency})
              </label>
              <input
                className="form-input price-input"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder={t("addItemForm.pricePlaceholder")}
              />
            </div>

            <div className="form-group half-width">
              <label className="form-label">
                <Package size={18} />
                {t("addItemForm.category")}
              </label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="clothing">
                  👕 {t("addItemForm.categories.clothing")}
                </option>
                <option value="accessories">
                  💎 {t("addItemForm.categories.accessories")}
                </option>
                <option value="bags">
                  👜 {t("addItemForm.categories.bags")}
                </option>
                <option value="shoes">
                  👟 {t("addItemForm.categories.shoes")}
                </option>
                <option value="sunglasses">
                  🕶️ {t("addItemForm.categories.sunglasses")}
                </option>
              </select>
            </div>
          </div>

          {/* Image URL Field */}
          <div className="form-group">
            <label className="form-label">
              <Image size={16} />
              {t("addItemForm.imageUrl")}
            </label>
            <div className="image-input-container">
              <input
                className="form-input image-input"
                name="image_url"
                type="url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder={t("addItemForm.imageUrlPlaceholder")}
              />
              <div className="image-preview">
                {formData.image_url ? (
                  <img
                    src={formData.image_url}
                    alt="Item preview"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                ) : (
                  <div className="image-placeholder">
                    <Upload size={24} />
                    <span>Image Preview</span>
                  </div>
                )}
              </div>
            </div>
            <p className="field-hint">
              Update the image to refresh your listing
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`submit-button ${loading ? "loading" : ""}`}
          >
            {loading ? (
              <>
                <div className="loading-spinner"></div>
                Updating...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Changes
              </>
            )}
          </button>
        </form>

        {/* Footer Info */}
        <div className="form-footer">
          <p>Your changes will be saved and visible to buyers immediately.</p>
        </div>
      </div>
    </div>
  );
};

export default EditItem;
