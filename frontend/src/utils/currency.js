// Currency utilities for EUR/USD conversion
// For production, you would use a real exchange rate API

const EXCHANGE_RATES = {
  EUR_TO_USD: 1.08, // 1 EUR = 1.08 USD (approximate)
  USD_TO_EUR: 0.93, // 1 USD = 0.93 EUR (approximate)
};

// Format price with currency symbol
export const formatPrice = (price, currency = "EUR") => {
  const numericPrice = parseFloat(price);

  // Handle NaN or invalid prices
  if (isNaN(numericPrice)) {
    return currency === "EUR" ? "€0.00" : currency === "USD" ? "$0.00" : "0.00";
  }

  if (currency === "EUR") {
    return `€${numericPrice.toFixed(2)}`;
  } else if (currency === "USD") {
    return `$${numericPrice.toFixed(2)}`;
  }

  return `${numericPrice.toFixed(2)} ${currency}`;
};

// Convert price between currencies
export const convertPrice = (price, fromCurrency, toCurrency) => {
  const numericPrice = parseFloat(price);

  // Handle NaN or invalid prices
  if (isNaN(numericPrice)) {
    return 0;
  }

  if (fromCurrency === toCurrency) {
    return numericPrice;
  }

  if (fromCurrency === "EUR" && toCurrency === "USD") {
    return numericPrice * EXCHANGE_RATES.EUR_TO_USD;
  }

  if (fromCurrency === "USD" && toCurrency === "EUR") {
    return numericPrice * EXCHANGE_RATES.USD_TO_EUR;
  }

  return numericPrice;
};

// Format price in both currencies (EUR primary, USD secondary)
export const formatDualCurrency = (price, primaryCurrency = "EUR") => {
  const numericPrice = parseFloat(price);

  // Handle NaN or invalid prices
  if (isNaN(numericPrice)) {
    return {
      primary: primaryCurrency === "EUR" ? "€0.00" : "$0.00",
      secondary: primaryCurrency === "EUR" ? "$0.00" : "€0.00",
    };
  }

  if (primaryCurrency === "EUR") {
    const eurPrice = formatPrice(numericPrice, "EUR");
    const usdPrice = formatPrice(
      convertPrice(numericPrice, "EUR", "USD"),
      "USD"
    );
    return {
      primary: eurPrice,
      secondary: usdPrice,
      primaryCurrency: "EUR",
      secondaryCurrency: "USD",
    };
  } else {
    const usdPrice = formatPrice(numericPrice, "USD");
    const eurPrice = formatPrice(
      convertPrice(numericPrice, "USD", "EUR"),
      "EUR"
    );
    return {
      primary: usdPrice,
      secondary: eurPrice,
      primaryCurrency: "USD",
      secondaryCurrency: "EUR",
    };
  }
};

// Get currency symbol
export const getCurrencySymbol = (currency) => {
  const symbols = {
    EUR: "€",
    USD: "$",
    SEK: "kr", // Swedish Krona
    NOK: "kr", // Norwegian Krone
  };

  return symbols[currency] || currency;
};

// List of supported currencies for EU market
export const SUPPORTED_CURRENCIES = [
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", flag: "🇸🇪" },
];

export default {
  formatPrice,
  convertPrice,
  formatDualCurrency,
  getCurrencySymbol,
  SUPPORTED_CURRENCIES,
  EXCHANGE_RATES,
};
