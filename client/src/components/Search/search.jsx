import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getProducts, BASE_URL } from "../../utils/helper";
import "./Search.css";

const Search = ({ isOpen, onClose, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches, setPopularSearches] = useState([
    "Nhẫn kim cương",
    "Dây chuyền vàng",
    "Bông tai ngọc trai",
    "Đồng hồ vàng hồng",
    "Trang sức cưới"
  ]);
  
  const searchInputRef = useRef(null);
  const searchRef = useRef(null);

  // Focus input when search opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 300);
    }
  }, [isOpen]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  // Handle search with real API
  const handleSearch = async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);

    try {
      // Use real API call
      const response = await getProducts({ search: term, page: 1, per_page: 5 });

      if (response.success) {
        const products = response.data.data || [];
        const formattedResults = products.map(product => ({
          id: product.id,
          name: product.name,
          category: product.material || "Trang sức",
          price: formatPrice(product.price),
          image: getProductImage(product),
          url: `/product/${product.id}`
        }));

        setSearchResults(formattedResults);
      } else {
        setSearchResults([]);
      }

      // Save to recent searches
      if (term.trim() && !recentSearches.includes(term)) {
        setRecentSearches(prev => [term, ...prev].slice(0, 5));
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(price) || 0);
  };

  // Get product image
  const getProductImage = (product) => {
    const images = product?.images || [];
    if (images.length > 0 && images[0]?.image_url) {
      return `${BASE_URL}/storage/${images[0].image_url}`;
    }
    return "/no-image.png";
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
  };

  const handleViewAllResults = () => {
    if (onSearch && searchTerm.trim()) {
      onSearch(searchTerm);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="search-overlay">
      <div className="search-container" ref={searchRef}>
        {/* Search Header */}
        <div className="search-header">
          <div className="search-title">
            <span className="title-icon">🔍</span>
            <h3>Tìm kiếm sản phẩm</h3>
          </div>
          <button className="search-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Search Input */}
        <div className="search-input-wrapper">
          <span className="search-input-icon">🔍</span>
          <input
            ref={searchInputRef}
            type="text"
            className="search-input"
            placeholder="Tìm kiếm nhẫn, dây chuyền, đồng hồ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="search-clear"
              onClick={() => setSearchTerm("")}
            >
              ✕
            </button>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="search-loading">
            <div className="loading-spinner"></div>
            <p>Đang tìm kiếm...</p>
          </div>
        )}

        {/* Search Results */}
        {!isLoading && searchTerm && searchResults.length > 0 && (
          <div className="search-results">
            <div className="results-header">
              <span className="results-count">{searchResults.length} kết quả</span>
            </div>
            <div className="results-list">
              {searchResults.map(product => (
                <Link 
                  key={product.id} 
                  to={product.url}
                  className="result-item"
                  onClick={onClose}
                >
                  <div className="result-image">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = "/no-image.png";
                      }}
                    />
                  </div>
                  <div className="result-info">
                    <h4 className="result-name">{product.name}</h4>
                    <p className="result-category">{product.category}</p>
                    <span className="result-price">{product.price}</span>
                  </div>
                </Link>
              ))}
            </div>
            
            {searchResults.length > 0 && (
              <button 
                className="view-all-results"
                onClick={handleViewAllResults}
              >
                Xem tất cả kết quả
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </button>
            )}
          </div>
        )}

        {/* No Results */}
        {!isLoading && searchTerm && searchResults.length === 0 && (
          <div className="no-results">
            <span className="no-results-icon">💎</span>
            <p>Không tìm thấy sản phẩm phù hợp</p>
            <span className="no-results-suggestion">Hãy thử tìm kiếm với từ khóa khác</span>
          </div>
        )}

        {/* Suggestions - Show when no search term */}
        {!searchTerm && (
          <div className="search-suggestions">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="suggestion-section">
                <h4 className="suggestion-title">
                  <span className="suggestion-icon">🕒</span>
                  Tìm kiếm gần đây
                </h4>
                <div className="suggestion-tags">
                  {recentSearches.map((term, index) => (
                    <button
                      key={index}
                      className="suggestion-tag"
                      onClick={() => handleSuggestionClick(term)}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            <div className="suggestion-section">
              <h4 className="suggestion-title">
                <span className="suggestion-icon">🔥</span>
                Tìm kiếm phổ biến
              </h4>
              <div className="suggestion-tags">
                {popularSearches.map((term, index) => (
                  <button
                    key={index}
                    className="suggestion-tag"
                    onClick={() => handleSuggestionClick(term)}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="suggestion-section">
              <h4 className="suggestion-title">
                <span className="suggestion-icon">📋</span>
                Danh mục
              </h4>
              <div className="category-grid">
                <Link to="/collections/rings" className="category-item" onClick={onClose}>
                  <span className="category-icon">💍</span>
                  <span>Nhẫn</span>
                </Link>
                <Link to="/collections/necklaces" className="category-item" onClick={onClose}>
                  <span className="category-icon">📿</span>
                  <span>Dây chuyền</span>
                </Link>
                <Link to="/collections/earrings" className="category-item" onClick={onClose}>
                  <span className="category-icon">💎</span>
                  <span>Bông tai</span>
                </Link>
                <Link to="/collections/watches" className="category-item" onClick={onClose}>
                  <span className="category-icon">⌚</span>
                  <span>Đồng hồ</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Decorative Elements */}
        <div className="search-decoration">
          <div className="decoration-diamond"></div>
          <div className="decoration-diamond"></div>
          <div className="decoration-diamond"></div>
        </div>
      </div>
    </div>
  );
};

export default Search; 