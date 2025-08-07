import { useCurrency } from "../hooks/useCurrency";
import { formatDualCurrency } from "../utils/currency";
import "./PriceDisplay.scss";

const PriceDisplay = ({
  price,
  size = "medium",
  showSecondary = null,
  className = "",
  vertical = false,
}) => {
  const { primaryCurrency, showDualCurrency } = useCurrency();

  // Allow component-level override of dual currency display
  const shouldShowSecondary =
    showSecondary !== null ? showSecondary : showDualCurrency;

  const priceData = formatDualCurrency(price, primaryCurrency);

  const sizeClass = `price-display--${size}`;
  const layoutClass = vertical
    ? "price-display--vertical"
    : "price-display--horizontal";

  if (!shouldShowSecondary) {
    return (
      <span className={`price-display ${sizeClass} ${className}`}>
        {priceData.primary}
      </span>
    );
  }

  return (
    <div
      className={`price-display price-display--dual ${sizeClass} ${layoutClass} ${className}`}
    >
      <span className="price-display__primary">{priceData.primary}</span>
      <span className="price-display__secondary">≈ {priceData.secondary}</span>
    </div>
  );
};

export default PriceDisplay;
