// API Configuration with Environment Detection
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;
const environment =
  import.meta.env.VITE_ENVIRONMENT ||
  (isDevelopment ? "development" : "production");

// Determine API Base URL with fallback logic
const getApiBaseUrl = () => {
  // First, check for explicit environment variable
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // Auto-detect based on current environment
  if (isDevelopment) {
    return "http://localhost:8000";
  } else {
    return "https://ostaeasy.onrender.com";
  }
};

export const API_BASE_URL = getApiBaseUrl();

// Log environment info in development
if (isDevelopment && import.meta.env.VITE_DEBUG === "true") {
  console.log("🔧 Environment Info:", {
    mode: import.meta.env.MODE,
    isDevelopment,
    isProduction,
    environment,
    apiBaseUrl: API_BASE_URL,
    viteApiUrl: import.meta.env.VITE_API_BASE_URL,
  });
}

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: `${API_BASE_URL}/api/users/token`,
  SIGNUP: `${API_BASE_URL}/api/users/signup`,
  PROFILE: `${API_BASE_URL}/api/users/profile`,
  CHANGE_PASSWORD: `${API_BASE_URL}/api/users/change-password`,

  // Shop
  ITEMS: `${API_BASE_URL}/api/shop/items/`,
  ITEM_DETAIL: (id) => `${API_BASE_URL}/api/shop/items/${id}/`,
  ITEM_CREATE: `${API_BASE_URL}/api/shop/items/create/`,
  ITEM_UPDATE: (id) => `${API_BASE_URL}/api/shop/items/${id}/update/`,
  MY_ITEMS: `${API_BASE_URL}/api/shop/my-items/`,
  CART: `${API_BASE_URL}/api/shop/cart/`,
  CART_ADD: (itemId) => `${API_BASE_URL}/api/shop/cart/add/${itemId}/`,
  CART_REMOVE: (itemId) => `${API_BASE_URL}/api/shop/cart/remove/${itemId}/`,
  CART_PAY: `${API_BASE_URL}/api/shop/cart/pay/`,
  PURCHASES: `${API_BASE_URL}/api/shop/purchases/`,

  // Payment
  CREATE_PAYMENT_INTENT: `${API_BASE_URL}/api/shop/create-payment-intent/`,

  // Analytics/Dashboard
  ANALYTICS_OVERVIEW: `${API_BASE_URL}/api/analytics/overview/`,
  ANALYTICS_SALES: `${API_BASE_URL}/api/analytics/sales/`,
  ANALYTICS_USERS: `${API_BASE_URL}/api/analytics/users/`,
};

// Environment variables
export const ENV = {
  API_BASE_URL,
  STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  DEBUG: import.meta.env.VITE_DEBUG === "true",
  ENVIRONMENT: environment,
  IS_DEVELOPMENT: isDevelopment,
  IS_PRODUCTION: isProduction,
  MODE: import.meta.env.MODE,
};
