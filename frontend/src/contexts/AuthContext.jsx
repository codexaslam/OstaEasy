import axios from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { API_ENDPOINTS } from "../config/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.PROFILE);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, [fetchUser]);

  const login = async (username, password) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/users/token",
        {
          username,
          password,
        }
      );

      const { access } = response.data;
      localStorage.setItem("token", access);
      axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;

      await fetchUser();
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Login failed",
      };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/users/signup",
        userData
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Signup error:", error);
      return {
        success: false,
        error: error.response?.data || "Signup failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const changePassword = async (oldPassword, newPassword) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/users/change-password",
        {
          old_password: oldPassword,
          new_password: newPassword,
        }
      );
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Password change failed",
      };
    }
  };

  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
