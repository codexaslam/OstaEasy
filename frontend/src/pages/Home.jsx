import axios from "axios";
import { useEffect, useState } from "react";
import {
  LiaCheckDoubleSolid,
  LiaHeadsetSolid,
  LiaShippingFastSolid,
  LiaTruckSolid,
} from "react-icons/lia";
import { Link, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import AddItemForm from "../components/AddItemForm";
import Cart from "../components/Cart";
import ItemCard from "../components/ItemCard";
import { useAuth } from "../contexts/AuthContext";
import "./Home.css";

const Home = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const heroSlides = [
    {
      title: "Spring Clearance Event",
      subtitle: "Save Up to 70%",
      description:
        "Discover the latest trends and timeless pieces from our curated collection",
      buttonText: "Shop Now",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      title: "Summer Sale",
      subtitle: "Discount off 70%",
      description:
        "Time to refresh your wardrobe with our exclusive collection",
      buttonText: "Explore Collection",
      image:
        "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      title: "New Arrivals",
      subtitle: "Fresh Styles",
      description: "Shop the latest styles and stay ahead of the curve",
      buttonText: "View New",
      image:
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
  ];

  const categories = [
    {
      name: "Clothing",
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      link: "/category/clothing",
    },
    {
      name: "Accessories",
      image:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      link: "/category/accessories",
    },
    {
      name: "Bags",
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2127&q=80",
      link: "/category/bags",
    },
    {
      name: "Shoes",
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2012&q=80",
      link: "/category/shoes",
    },
    {
      name: "Sunglasses",
      image:
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
      link: "/category/sunglasses",
    },
  ];

  const testimonials = [
    {
      title: "Best Online Fashion Site",
      content:
        "I always find something stylish and affordable on this web fashion site. The quality is amazing and delivery is super fast!",
      author: "Robert Smith",
      location: "Customer from USA",
      rating: 5,
    },
    {
      title: "Great Selection and Quality",
      content:
        "I love the variety of styles and the high-quality clothing on this web fashion site. Every purchase has exceeded my expectations.",
      author: "Allen Lyn",
      location: "Customer from France",
      rating: 5,
    },
    {
      title: "Best Customer Service",
      content:
        "I finally found a web fashion site with stylish and flattering options in my size. The customer support team is incredibly helpful and responsive.",
      author: "Peter Rope",
      location: "Customer from USA",
      rating: 5,
    },
    {
      title: "Amazing Shopping Experience",
      content:
        "The quality is outstanding and the customer service is exceptional. I've recommended this site to all my friends and family.",
      author: "Hellen Ase",
      location: "Customer from Japan",
      rating: 5,
    },
    {
      title: "Perfect Fit Every Time",
      content:
        "The size guide is accurate and the clothes fit perfectly. I love how easy it is to find exactly what I'm looking for.",
      author: "Maria Garcia",
      location: "Customer from Spain",
      rating: 5,
    },
    {
      title: "Trendy and Affordable",
      content:
        "This site always has the latest trends at prices that won't break the bank. My wardrobe has never looked better!",
      author: "Emma Johnson",
      location: "Customer from UK",
      rating: 5,
    },
  ];

  useEffect(() => {
    const searchQuery = searchParams.get("search");
    fetchItems(searchQuery);
    if (user) {
      fetchCartItems();
    }
  }, [user, searchParams]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(testimonialInterval);
  }, [testimonials.length]);

  const fetchItems = async (search = "") => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8000/api/shop/items/${
          search ? `?search=${search}` : ""
        }`
      );
      setItems(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to load items. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/shop/cart/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const handleAddToCart = async (itemId) => {
    if (!user) {
      Swal.fire({
        title: "Login Required",
        text: "Please login to add items to cart",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/login";
        }
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:8000/api/shop/cart/add/${itemId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchCartItems();
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const handleItemAdded = () => {
    setShowAddForm(false);
    fetchItems();
    Swal.fire({
      title: "Success!",
      text: "Item added successfully!",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const featuredItems = items.slice(0, 8);
  const bestSellerItems = items.slice(8, 16);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero Slider */}
      <div className="hero-slider">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide ${index === currentSlide ? "active" : ""}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="hero-content">
              <h1 className="hero-title">{slide.title}</h1>
              <h2 className="hero-subtitle">{slide.subtitle}</h2>
              <p className="hero-description">{slide.description}</p>
              <button className="hero-btn">{slide.buttonText}</button>
            </div>
          </div>
        ))}

        <div className="hero-indicators">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2>SHOP BY CATEGORIES</h2>
          </div>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <Link key={index} to={category.link} className="category-card">
                <div className="category-image">
                  <img src={category.image} alt={category.name} />
                </div>
                <h3 className="category-name">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2>Discovery all new items</h2>
            <p>Best Seller</p>
          </div>
          <div className="products-grid">
            {featuredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onAddToCart={handleAddToCart}
                currentUser={user}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      {bestSellerItems.length > 0 && (
        <section className="bestsellers-section">
          <div className="container">
            <div className="section-header">
              <h2>Best Sellers</h2>
              <p>
                Shop the Latest Styles: Stay ahead of the curve with our newest
                arrivals
              </p>
            </div>
            <div className="products-grid">
              {bestSellerItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onAddToCart={handleAddToCart}
                  currentUser={user}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Shop the Look Section */}
      <section className="shop-look-section">
        <div className="container">
          <div className="section-header">
            <h2>Shop the look</h2>
            <p>
              Inspire and let yourself be inspired, from one unique fashion to
              another.
            </p>
          </div>
          <div className="lookbook-grid">
            <div className="lookbook-item">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Lookbook 1"
              />
            </div>
            <div className="lookbook-item">
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2128&q=80"
                alt="Lookbook 2"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Happy Clients Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>Happy Clients</h2>
            <p>Hear what they say about us</p>
          </div>
          <div className="testimonials-slider">
            <button
              className="testimonial-nav testimonial-prev"
              onClick={() =>
                setCurrentTestimonial(
                  currentTestimonial === 0
                    ? testimonials.length - 1
                    : currentTestimonial - 1
                )
              }
              aria-label="Previous testimonial"
            >
              ‹
            </button>
            <div
              className="testimonial-track"
              style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="testimonial-item">
                  <div className="testimonial-content">
                    <div className="testimonial-stars">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="star">
                          ★
                        </span>
                      ))}
                    </div>
                    <h3>{testimonial.title}</h3>
                    <p>"{testimonial.content}"</p>
                    <div className="testimonial-author">
                      <strong>{testimonial.author}</strong>
                      <span>{testimonial.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="testimonial-nav testimonial-next"
              onClick={() =>
                setCurrentTestimonial(
                  currentTestimonial === testimonials.length - 1
                    ? 0
                    : currentTestimonial + 1
                )
              }
              aria-label="Next testimonial"
            >
              ›
            </button>
            <div className="testimonial-indicators">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${
                    index === currentTestimonial ? "active" : ""
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="brands-section">
        <div className="container">
          <div className="brands-slider">
            <div className="brand-item">
              <img
                src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/nike.svg"
                alt="Nike"
              />
            </div>
            <div className="brand-item">
              <img
                src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/adidas.svg"
                alt="Adidas"
              />
            </div>
            <div className="brand-item">
              <img
                src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/zara.svg"
                alt="Zara"
              />
            </div>
            <div className="brand-item">
              <img
                src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/hm.svg"
                alt="H&M"
              />
            </div>
            <div className="brand-item">
              <img
                src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/uniqlo.svg"
                alt="Uniqlo"
              />
            </div>
            <div className="brand-item">
              <img
                src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/gucci.svg"
                alt="Gucci"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Shop Gram Section */}
      <section className="shop-gram-section">
        <div className="container">
          <div className="section-header">
            <h2>Shop Gram</h2>
            <p>
              Inspire and let yourself be inspired, from one unique fashion to
              another.
            </p>
          </div>
          <div className="instagram-grid">
            <div className="instagram-item">
              <img
                src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Instagram 1"
              />
            </div>
            <div className="instagram-item">
              <img
                src="https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
                alt="Instagram 2"
              />
            </div>
            <div className="instagram-item">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Instagram 3"
              />
            </div>
            <div className="instagram-item">
              <img
                src="https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80"
                alt="Instagram 4"
              />
            </div>
            <div className="instagram-item">
              <img
                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Instagram 5"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">
                <LiaShippingFastSolid size={40} />
              </div>
              <h3>Free Shipping</h3>
              <p>Free shipping over order $120</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <LiaTruckSolid size={40} />
              </div>
              <h3>Flexible Payment</h3>
              <p>Pay with Multiple Credit Cards</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <LiaCheckDoubleSolid size={40} />
              </div>
              <h3>14 Day Returns</h3>
              <p>Within 30 days for an exchange</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <LiaHeadsetSolid size={40} />
              </div>
              <h3>Premium Support</h3>
              <p>Outstanding premium support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2>Sign Up for Email</h2>
            <p>
              Sign up to get first dibs on new arrivals, sales, exclusive
              content, events and more!
            </p>
            <form className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-btn">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Search Results or Admin Actions */}
      {(searchParams.get("search") || user) && (
        <section className="admin-section">
          <div className="container">
            {searchParams.get("search") && (
              <div className="search-results-header">
                <h2>Search Results</h2>
                <p>Search results for: "{searchParams.get("search")}"</p>
              </div>
            )}

            {user && (
              <div className="user-actions">
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="action-button primary"
                >
                  {showAddForm ? "Cancel" : "Add New Item"}
                </button>
                <button
                  onClick={() => setShowCart(!showCart)}
                  className="action-button secondary"
                >
                  View Cart ({cartItems.length})
                </button>
              </div>
            )}

            {showAddForm && (
              <div className="add-item-section">
                <AddItemForm onItemAdded={handleItemAdded} />
              </div>
            )}

            {showCart && (
              <div className="cart-section">
                <Cart
                  items={cartItems}
                  onUpdate={fetchCartItems}
                  onClose={() => setShowCart(false)}
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* All Products Section */}
      {searchParams.get("search") && (
        <section className="all-products-section">
          <div className="container">
            <div className="products-grid">
              {items.length === 0 ? (
                <div className="no-items">
                  <h3>No products found</h3>
                  <p>
                    Try adjusting your search or check back later for new items!
                  </p>
                </div>
              ) : (
                items.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onAddToCart={handleAddToCart}
                    currentUser={user}
                  />
                ))
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
