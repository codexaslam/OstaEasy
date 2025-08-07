import axios from "axios";
import {
  AlertCircle,
  DollarSign,
  Euro,
  FileText,
  Image,
  Package,
  Plus,
  Tag,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { API_ENDPOINTS } from "../config/api";
import { useCurrency } from "../hooks/useCurrency";
import "./AddItemForm.scss";

const AddItemForm = ({ onItemAdded }) => {
  const { t } = useTranslation();
  const { primaryCurrency } = useCurrency();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "clothing",
    image_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        currency: primaryCurrency, // Add currency info
        price: parseFloat(formData.price), // Ensure price is a number
      };

      await axios.post(API_ENDPOINTS.ITEM_CREATE, itemData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFormData({
        title: "",
        description: "",
        price: "",
        category: "clothing",
        image_url: "",
      });
      onItemAdded();
      Swal.fire({
        title: t("addItemForm.success.itemAdded"),
        text: t("addItemForm.success.itemAddedDesc"),
        icon: "success",
        confirmButtonText: t("common.ok"),
        confirmButtonColor: "#000",
        background: "#fff",
        color: "#000",
      });
    } catch (error) {
      setError(
        error.response?.data?.error || t("addItemForm.error.failedToAdd")
      );
      Swal.fire({
        title: t("common.error"),
        text: error.response?.data?.error || t("addItemForm.error.failedToAdd"),
        icon: "error",
        confirmButtonText: t("addItemForm.error.tryAgain"),
        confirmButtonColor: "#000",
        background: "#fff",
        color: "#000",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-item-container">
      <div className="add-item-form">
        {/* Header Section */}
        <div className="form-header">
          <div className="header-icon">
            <Package size={32} />
          </div>
          <div className="header-content">
            <h2 className="form-title">{t("addItemForm.addNewItem")}</h2>
            <p className="form-subtitle">{t("addItemForm.createListing")}</p>
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
                    alt={t("addItemForm.imagePreview")}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                ) : (
                  <div className="image-placeholder">
                    <Upload size={24} />
                    <span>{t("addItemForm.imagePreview")}</span>
                  </div>
                )}
              </div>
            </div>
            <p className="field-hint">
              Add a high-quality image to attract more buyers
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
                {t("addItemForm.adding")}
              </>
            ) : (
              <>
                <Plus size={20} />
                {t("addItemForm.addItem")}
              </>
            )}
          </button>
        </form>

        {/* Footer Info */}
        <div className="form-footer">
          <p>{t("addItemForm.footer.note")}</p>
        </div>
      </div>
    </div>
  );
};

export default AddItemForm;
