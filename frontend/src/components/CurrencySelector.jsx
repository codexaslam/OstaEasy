import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCurrency } from "../hooks/useCurrency";
import { SUPPORTED_CURRENCIES } from "../utils/currency";
import "./CurrencySelector.scss";

const CurrencySelector = ({ compact = false }) => {
  const { t } = useTranslation();
  const {
    primaryCurrency,
    setPrimaryCurrency,
    showDualCurrency,
    toggleDualCurrency,
  } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const currentCurrency = SUPPORTED_CURRENCIES.find(
    (c) => c.code === primaryCurrency
  );

  const handleCurrencyChange = (currencyCode) => {
    setPrimaryCurrency(currencyCode);
    setIsOpen(false);
  };

  if (compact) {
    return (
      <div
        className="currency-selector currency-selector--compact"
        ref={dropdownRef}
      >
        <button
          className="currency-selector__trigger"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="currency-flag">{currentCurrency?.flag}</span>
          <span className="currency-code">{currentCurrency?.symbol}</span>
        </button>

        {isOpen && (
          <div className="currency-selector__dropdown">
            {SUPPORTED_CURRENCIES.map((currency) => (
              <button
                key={currency.code}
                onClick={() => handleCurrencyChange(currency.code)}
                className={`currency-option ${
                  currency.code === primaryCurrency
                    ? "currency-option--active"
                    : ""
                }`}
              >
                <span className="currency-flag">{currency.flag}</span>
                <span className="currency-info">
                  <span className="currency-code">{currency.code}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="currency-selector">
      <h4 className="currency-selector__title">
        {t("currency.title", "Currency Preferences")}
      </h4>

      <div className="currency-selector__section">
        <label className="currency-selector__label">
          {t("currency.primaryCurrency", "Primary Currency")}
        </label>
        <div className="currency-options">
          {SUPPORTED_CURRENCIES.map((currency) => (
            <button
              key={currency.code}
              onClick={() => handleCurrencyChange(currency.code)}
              className={`currency-option ${
                currency.code === primaryCurrency
                  ? "currency-option--active"
                  : ""
              }`}
            >
              <span className="currency-flag">{currency.flag}</span>
              <span className="currency-info">
                <span className="currency-code">{currency.code}</span>
                <span className="currency-name">{currency.name}</span>
              </span>
              <span className="currency-symbol">{currency.symbol}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="currency-selector__section">
        <label className="currency-selector__checkbox">
          <input
            type="checkbox"
            checked={showDualCurrency}
            onChange={toggleDualCurrency}
          />
          <span className="checkmark"></span>
          <span className="label-text">
            {t(
              "currency.showBothCurrencies",
              "Show prices in both EUR and USD"
            )}
          </span>
        </label>
        <p className="currency-selector__description">
          {t(
            "currency.dualCurrencyDescription",
            "When enabled, prices will be displayed in your primary currency with the equivalent amount in the other currency."
          )}
        </p>
      </div>
    </div>
  );
};

export default CurrencySelector;
