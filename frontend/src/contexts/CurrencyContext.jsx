import { createContext, useEffect, useState } from "react";

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  // Default to EUR for EU market (Finland, Sweden)
  const [primaryCurrency, setPrimaryCurrency] = useState("EUR");
  const [showDualCurrency, setShowDualCurrency] = useState(true);

  // Load currency preference from localStorage
  useEffect(() => {
    const savedCurrency = localStorage.getItem("preferredCurrency");
    if (savedCurrency) {
      setPrimaryCurrency(savedCurrency);
    }

    const savedDualSetting = localStorage.getItem("showDualCurrency");
    if (savedDualSetting !== null) {
      setShowDualCurrency(JSON.parse(savedDualSetting));
    }
  }, []);

  // Save currency preference to localStorage
  const updatePrimaryCurrency = (currency) => {
    setPrimaryCurrency(currency);
    localStorage.setItem("preferredCurrency", currency);
  };

  const toggleDualCurrency = () => {
    const newSetting = !showDualCurrency;
    setShowDualCurrency(newSetting);
    localStorage.setItem("showDualCurrency", JSON.stringify(newSetting));
  };

  const value = {
    primaryCurrency,
    setPrimaryCurrency: updatePrimaryCurrency,
    showDualCurrency,
    toggleDualCurrency,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyContext;
