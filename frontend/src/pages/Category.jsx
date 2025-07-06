import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import {
  LiaFilterSolid,
  LiaThLargeSolid,
  LiaThListSolid,
} from "react-icons/lia";
import { useParams, useSearchParams } from "react-router-dom";
import ItemCard from "../components/ItemCard";
import { useAuth } from "../contexts/AuthContext";

const Category = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [gridColumns, setGridColumns] = useState(4); // Default to 4 columns
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);

  const categories = {
    clothing: {
      name: "Clothing",
      description: "Discover our latest fashion trends and timeless pieces",
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
    },
    accessories: {
      name: "Accessories",
      description:
        "Complete your look with our stunning accessories collection",
      image:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    bags: {
      name: "Bags",
      description: "Functional and stylish bags for every occasion",
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2127&q=80",
    },
    shoes: {
      name: "Shoes",
      description: "Step out in style with our footwear collection",
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2012&q=80",
    },
    sunglasses: {
      name: "Sunglasses",
      description: "Protect your eyes with our stylish sunglasses",
      image:
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
    },
  };

  const currentCategory = categories[category] || {
    name: "All Products",
    description: "Explore our complete collection",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  };

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const categoryParam =
        category && category !== "all" ? `?category=${category}` : "";
      const response = await axios.get(
        `http://localhost:8000/api/shop/items/${categoryParam}`
      );
      const categoryItems = response.data.results || response.data;
      setItems(categoryItems);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  }, [category]);

  const applyFilters = useCallback(() => {
    let filtered = [...items];

    // Apply search filter
    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply price filter
    filtered = filtered.filter(
      (item) => item.price >= priceRange[0] && item.price <= priceRange[1]
    );

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "newest":
      default:
        filtered.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        break;
    }

    setFilteredItems(filtered);
  }, [items, sortBy, priceRange, searchParams]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleAddToCart = async (itemId) => {
    try {
      await axios.post(
        "http://localhost:8000/api/shop/cart/add/",
        { item_id: itemId, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="category-page">
        <div className="category-page__loading">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="category-page">
      {/* Category Header */}
      <div className="category-page__header">
        <div className="category-page__header-bg">
          <img src={currentCategory.image} alt={currentCategory.name} />
          <div className="category-page__header-overlay"></div>
        </div>
        <div className="category-page__header-content">
          <div className="category-page__container">
            <h1 className="category-page__title">{currentCategory.name}</h1>
            <p className="category-page__description">
              {currentCategory.description}
            </p>
            <div className="category-page__breadcrumb">
              <span>Home</span>
              <span className="category-page__breadcrumb-separator">/</span>
              <span>Shop</span>
              <span className="category-page__breadcrumb-separator">/</span>
              <span>{currentCategory.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="category-page__content">
        <div className="category-page__container">
          {/* Toolbar */}
          <div className="category-page__toolbar">
            <div className="category-page__toolbar-left">
              <button
                className={`category-page__filter-toggle ${
                  showFilters ? "active" : ""
                }`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <LiaFilterSolid size={16} />
                Filter
              </button>
              <span className="category-page__results-count">
                {filteredItems.length} products found
              </span>
            </div>
            <div className="category-page__toolbar-right">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="category-page__sort-select"
              >
                <option value="newest">Sort by: Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>

              {/* Grid Column Options */}
              {viewMode === "grid" && (
                <div className="category-page__grid-options">
                  {[1, 2, 3, 4, 5, 6].map((cols) => (
                    <button
                      key={cols}
                      className={`category-page__grid-btn ${
                        gridColumns === cols ? "active" : ""
                      }`}
                      onClick={() => setGridColumns(cols)}
                      title={`${cols} column${cols > 1 ? "s" : ""}`}
                    >
                      <div className="category-page__grid-icon">
                        {/* Create a 2x3 grid pattern that shows the selected number of columns */}
                        {Array.from({ length: 6 }, (_, i) => {
                          const col = i % 3;
                          const isActive = col < cols;
                          return (
                            <div
                              key={i}
                              className={`category-page__grid-dot ${
                                isActive ? "active" : ""
                              }`}
                            />
                          );
                        })}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <div className="category-page__view-toggle">
                <button
                  className={`category-page__view-btn ${
                    viewMode === "grid" ? "active" : ""
                  }`}
                  onClick={() => setViewMode("grid")}
                >
                  <LiaThLargeSolid size={16} />
                </button>
                <button
                  className={`category-page__view-btn ${
                    viewMode === "list" ? "active" : ""
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  <LiaThListSolid size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="category-page__layout">
            {/* Sidebar Filters */}
            {showFilters && (
              <div className="category-page__sidebar">
                <div className="category-page__filter-section">
                  <h3 className="category-page__filter-title">Price Range</h3>
                  <div className="category-page__price-filter">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([parseInt(e.target.value), priceRange[1]])
                      }
                      className="category-page__price-slider"
                    />
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="category-page__price-slider"
                    />
                    <div className="category-page__price-values">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div className="category-page__main">
              {filteredItems.length === 0 ? (
                <div className="category-page__empty">
                  <h3>No products found</h3>
                  <p>Try adjusting your filters or search terms</p>
                </div>
              ) : (
                <div
                  className={`category-page__products ${
                    viewMode === "list" ? "category-page__products--list" : ""
                  } ${
                    gridColumns === 1 && viewMode === "grid"
                      ? "category-page__products--single"
                      : ""
                  }`}
                  style={
                    viewMode === "grid"
                      ? {
                          "--grid-columns": gridColumns,
                          gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
                        }
                      : {}
                  }
                >
                  {filteredItems.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      onAddToCart={handleAddToCart}
                      currentUser={user}
                      showDescription={gridColumns === 1 && viewMode === "grid"}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
