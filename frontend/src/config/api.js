// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: `${API_BASE_URL}/api/users/token`,
  SIGNUP: `${API_BASE_URL}/api/users/signup`,
  PROFILE: `${API_BASE_URL}/api/users/profile`,

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
};
