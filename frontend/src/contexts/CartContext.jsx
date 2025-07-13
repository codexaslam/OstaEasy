import axios from "axios";
import { createContext, useCallback, useEffect, useState } from "react";
import { API_ENDPOINTS } from "../config/api";
import { useAuth } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCartItems = useCallback(async () => {
    if (!user) {
      setCartItems([]);
      setCartCount(0);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_ENDPOINTS.CART, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Handle both paginated (with 'results') and non-paginated responses
      const cartData = response.data.results || response.data;
      const safeCartData = Array.isArray(cartData) ? cartData : [];

      setCartItems(safeCartData);
      setCartCount(safeCartData.length);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setCartItems([]);
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch cart items when user changes
  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const addToCart = async (itemId) => {
    if (!user) throw new Error("User must be logged in to add items to cart");

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        API_ENDPOINTS.CART_ADD(itemId),
        { quantity: 1 }, // Include quantity in the request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh cart items after adding
      await fetchCartItems();
      return true;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };

  const removeFromCart = async (itemId) => {
    if (!user)
      throw new Error("User must be logged in to remove items from cart");

    try {
      const token = localStorage.getItem("token");
      await axios.delete(API_ENDPOINTS.CART_REMOVE(itemId), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh cart items after removing
      await fetchCartItems();
      return true;
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  };

  const updateCartItemQuantity = async (itemId, quantity) => {
    if (!user) throw new Error("User must be logged in to update cart");

    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        API_ENDPOINTS.CART_UPDATE(itemId),
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh cart items after updating
      await fetchCartItems();
      return true;
    } catch (error) {
      console.error("Error updating cart item:", error);
      throw error;
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(API_ENDPOINTS.CART_CLEAR, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCartItems([]);
      setCartCount(0);
      return true;
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  };

  const value = {
    cartItems,
    cartCount,
    loading,
    fetchCartItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
