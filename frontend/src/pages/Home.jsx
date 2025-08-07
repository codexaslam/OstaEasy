import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  LiaCheckDoubleSolid,
  LiaHeadsetSolid,
  LiaShippingFastSolid,
  LiaTruckSolid,
} from "react-icons/lia";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import AddItemForm from "../components/AddItemForm";
import Cart from "../components/Cart";
import ItemCard from "../components/ItemCard";
import Pagination from "../components/Pagination";
import { API_ENDPOINTS } from "../config/api";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../hooks/useCart";
// import styles from "./Home.module.scss"; // TODO: Convert Home component to use CSS modules

const Home = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { addToCart, cartItems, fetchCartItems } = useCart();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Pagination states
  const [featuredPage, setFeaturedPage] = useState(1);
  const [bestSellersPage, setBestSellersPage] = useState(1);
  const [featuredItems, setFeaturedItems] = useState({
    results: [],
    count: 0,
    next: null,
    previous: null,
  });
  const [bestSellerItems, setBestSellerItems] = useState({
    results: [],
    count: 0,
    next: null,
    previous: null,
  });
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const [bestSellersLoading, setBestSellersLoading] = useState(false);

  const heroSlides = [
    {
      title: t("hero.springEvent"),
      subtitle: t("hero.saveUp"),
      description: t("hero.discover"),
      buttonText: t("hero.shopNow"),
      action: "scroll",
      target: "categories-section", // Scroll to categories section
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      title: t("hero.summerSale"),
      subtitle: t("hero.discountOff"),
      description: t("hero.refreshWardrobe"),
      buttonText: t("hero.exploreCollection"),
      action: "navigate",
      target: "/category/clothing", // Navigate to clothing category
      image:
        "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      title: t("hero.newArrivals"),
      subtitle: t("hero.freshStyles"),
      description: t("hero.shopLatest"),
      buttonText: t("hero.viewNew"),
      action: "scroll",
      target: "bestsellers-section", // Scroll to bestsellers section
      image:
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
  ];

  const categories = [
    {
      name: t("categories.clothing"),
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      link: "/category/clothing",
    },
    {
      name: t("categories.accessories"),
      image:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      link: "/category/accessories",
    },
    {
      name: t("categories.bags"),
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2127&q=80",
      link: "/category/bags",
    },
    {
      name: t("categories.shoes"),
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2012&q=80",
      link: "/category/shoes",
    },
    {
      name: t("categories.sunglasses"),
      image:
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
      link: "/category/sunglasses",
    },
  ];

  const testimonials = [
    {
      title: t("testimonials.bestOnlineFashionSite"),
      content: t("testimonials.bestOnlineReview"),
      author: "Robert Smith",
      location: t("testimonials.customerFromUSA"),
      rating: 5,
    },
    {
      title: t("testimonials.greatSelection"),
      content: t("testimonials.greatSelectionReview"),
      author: "Allen Lyn",
      location: t("testimonials.customerFromFrance"),
      rating: 5,
    },
    {
      title: t("testimonials.bestCustomerService"),
      content: t("testimonials.bestCustomerServiceReview"),
      author: "Peter Rope",
      location: t("testimonials.customerFromUSA"),
      rating: 5,
    },
    {
      title: t("testimonials.amazingShoppingExperience"),
      content: t("testimonials.amazingShoppingReview"),
      author: "Hellen Ase",
      location: t("testimonials.customerFromJapan"),
      rating: 5,
    },
    {
      title: t("testimonials.perfectFitEveryTime"),
      content: t("testimonials.perfectFitReview"),
      author: "Maria Garcia",
      location: t("testimonials.customerFromSpain"),
      rating: 5,
    },
    {
      title: t("testimonials.trendyAndAffordable"),
      content: t("testimonials.trendyAndAffordableReview"),
      author: "Emma Johnson",
      location: t("testimonials.customerFromUK"),
      rating: 5,
    },
  ];

  // Handle hero button clicks
  const handleHeroButtonClick = (slide) => {
    if (slide.action === "scroll" && slide.target) {
      const targetElement = document.querySelector(`.${slide.target}`);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } else if (slide.action === "navigate" && slide.target) {
      navigate(slide.target);
    }
  };

  useEffect(() => {
    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      fetchItems(searchQuery);
    } else {
      // Load initial data for homepage sections
      fetchFeaturedItems(1);
      fetchBestSellers(1);
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
        `${API_ENDPOINTS.ITEMS}${search ? `?search=${search}` : ""}`
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

  const fetchFeaturedItems = async (page = 1) => {
    try {
      setFeaturedLoading(true);
      const response = await axios.get(
        `${API_ENDPOINTS.ITEMS}?page=${page}&ordering=-created_at&section=featured`
      );
      setFeaturedItems(response.data);
      setFeaturedPage(page);
    } catch (error) {
      console.error("Error fetching featured items:", error);
    } finally {
      setFeaturedLoading(false);
    }
  };

  const fetchBestSellers = async (page = 1) => {
    try {
      setBestSellersLoading(true);
      const response = await axios.get(
        `${API_ENDPOINTS.ITEMS}?page=${page}&ordering=-price&section=bestsellers`
      );
      setBestSellerItems(response.data);
      setBestSellersPage(page);
    } catch (error) {
      console.error("Error fetching best sellers:", error);
    } finally {
      setBestSellersLoading(false);
    }
  };

  // Separate handlers for pagination to prevent interference
  const handleFeaturedPageChange = (page) => {
    fetchFeaturedItems(page);
  };

  const handleBestSellersPageChange = (page) => {
    fetchBestSellers(page);
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
        confirmButtonColor: "#000",
        cancelButtonColor: "#666",
        background: "#fff",
        color: "#000",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/login";
        }
      });
      return;
    }

    try {
      await addToCart(itemId);
      Swal.fire({
        title: "Success!",
        text: "Item added to cart successfully!",
        icon: "success",
        confirmButtonText: "Continue Shopping",
        confirmButtonColor: "#000",
        background: "#fff",
        color: "#000",
        timer: 2000,
        showConfirmButton: false,
      });
      return Promise.resolve();
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.error || "Failed to add item to cart",
        icon: "error",
        confirmButtonText: "Try Again",
        confirmButtonColor: "#000",
        background: "#fff",
        color: "#000",
      });
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

  if (loading && searchParams.get("search")) {
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
              <button
                className="hero-btn"
                onClick={() => handleHeroButtonClick(slide)}
              >
                {slide.buttonText}
              </button>
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
            <p>Explore our latest arrivals</p>
            <Link to="/category/all?sort=newest" className="view-all-link">
              View All New Items →
            </Link>
          </div>

          {featuredLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading featured items...</p>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {featuredItems.results?.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onAddToCart={handleAddToCart}
                    currentUser={user}
                  />
                ))}
              </div>

              {featuredItems.count > 20 && (
                <Pagination
                  currentPage={featuredPage}
                  totalPages={Math.ceil(featuredItems.count / 20)}
                  onPageChange={handleFeaturedPageChange}
                  totalItems={featuredItems.count}
                  itemsPerPage={20}
                />
              )}
            </>
          )}
        </div>
      </section>

      {/* Best Sellers */}
      {!searchParams.get("search") && (
        <section className="bestsellers-section">
          <div className="container">
            <div className="section-header">
              <h2>Best Sellers</h2>
              <p>
                Shop the Latest Styles: Stay ahead of the curve with our newest
                arrivals
              </p>
              <Link to="/category/all?sort=popular" className="view-all-link">
                View All Best Sellers →
              </Link>
            </div>

            {bestSellersLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading best sellers...</p>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {bestSellerItems.results?.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      onAddToCart={handleAddToCart}
                      currentUser={user}
                    />
                  ))}
                </div>

                {bestSellerItems.count > 20 && (
                  <Pagination
                    currentPage={bestSellersPage}
                    totalPages={Math.ceil(bestSellerItems.count / 20)}
                    onPageChange={handleBestSellersPageChange}
                    totalItems={bestSellerItems.count}
                    itemsPerPage={20}
                  />
                )}
              </>
            )}
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
