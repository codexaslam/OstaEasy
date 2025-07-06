import axios from "axios";
import { useEffect, useState } from "react";
import {
  LiaHeart,
  LiaSearchSolid,
  LiaShoppingBagSolid,
  LiaSignOutAltSolid,
  LiaUserAltSolid,
} from "react-icons/lia";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../contexts/AuthContext";
import Cart from "./Cart";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Fetch cart items when user is logged in
  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      setCartItems([]);
      setCartCount(0);
    }
  }, [user]);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/shop/cart/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(response.data);
      setCartCount(response.data.length);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setCartItems([]);
      setCartCount(0);
    }
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    if (!user) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to view your cart",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#000",
        cancelButtonColor: "#666",
        confirmButtonText: "Login",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }
    setShowCart(true);
  };

  const handleCloseCart = () => {
    setShowCart(false);
  };

  const handleCartUpdate = () => {
    fetchCartItems();
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#000",
      cancelButtonColor: "#666",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/");
      }
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <nav className="navbar">
      {/* Top Header Bar */}
      <div className="navbar__top-bar">
        <div className="navbar__container">
          <div className="navbar__top-bar-content">
            <div className="navbar__top-bar-left">
              <span>Free shipping over $120</span>
              <span className="navbar__divider">|</span>
              <span>Support 24/7</span>
            </div>
            <div className="navbar__top-bar-right">
              <span>USD $</span>
              <span className="navbar__divider">|</span>
              <span>English</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="navbar__main">
        <div className="navbar__container">
          <div className="navbar__content">
            <Link to="/" className="navbar__logo">
              <span className="logo-text">OSTAEASY</span>
            </Link>

            <div className="navbar__nav">
              <Link to="/" className="navbar__nav-link">
                Shop
              </Link>
              <Link to="/about" className="navbar__nav-link">
                About
              </Link>
              <Link to="/contact" className="navbar__nav-link">
                Contact
              </Link>
              {user && (
                <>
                  <Link to="/myitems" className="navbar__nav-link">
                    My Items
                  </Link>
                  <Link to="/purchases" className="navbar__nav-link">
                    Orders
                  </Link>
                </>
              )}
            </div>

            <div className="navbar__actions">
              <form onSubmit={handleSearch} className="navbar__search">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit">
                  <LiaSearchSolid size={20} />
                </button>
              </form>

              {user ? (
                <div className="navbar__user-menu">
                  <Link to="/account" className="navbar__action-btn">
                    <LiaUserAltSolid size={20} />
                  </Link>

                  <button className="navbar__action-btn">
                    <LiaHeart size={20} />
                  </button>

                  <button
                    onClick={handleCartClick}
                    className="navbar__action-btn navbar__action-btn--cart"
                    data-count={cartCount}
                  >
                    <LiaShoppingBagSolid size={20} />
                  </button>

                  <button onClick={handleLogout} className="navbar__action-btn">
                    <LiaSignOutAltSolid size={20} />
                  </button>
                </div>
              ) : (
                <div className="navbar__guest-menu">
                  <Link to="/login" className="navbar__action-btn">
                    <LiaUserAltSolid size={20} />
                  </Link>

                  <button className="navbar__action-btn">
                    <LiaHeart size={20} />
                  </button>

                  <button
                    onClick={handleCartClick}
                    className="navbar__action-btn navbar__action-btn--cart"
                    data-count={cartCount}
                  >
                    <LiaShoppingBagSolid size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cart Modal */}
      {showCart && (
        <Cart
          items={cartItems}
          onUpdate={handleCartUpdate}
          onClose={handleCloseCart}
        />
      )}
    </nav>
  );
};

export default Navbar;
