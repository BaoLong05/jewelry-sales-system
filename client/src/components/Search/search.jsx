import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Search.css";

const Search = ({ isOpen, onClose }) => {
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

  // Simulate search results (you'll replace with actual API call)
  const handleSearch = async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Replace with your actual API call
      // const response = await searchProducts(term);
      // setSearchResults(response.data);

      // Simulated results for demo
      setTimeout(() => {
        const mockResults = [
          {
            id: 1,
            name: "Nhẫn kim cương Solitaire",
            category: "Nhẫn",
            price: "125,000,000₫",
            image: "💍",
            url: "/product/1"
          },
          {
            id: 2,
            name: "Dây chuyền vàng hồng",
            category: "Dây chuyền",
            price: "45,000,000₫",
            image: "📿",
            url: "/product/2"
          },
          {
            id: 3,
            name: "Bông tai ngọc trai",
            category: "Bông tai",
            price: "28,000,000₫",
            image: "💎",
            url: "/product/3"
          },
          {
            id: 4,
            name: "Đồng hồ Tourbillon",
            category: "Đồng hồ",
            price: "1,250,000,000₫",
            image: "⌚",
            url: "/product/4"
          }
        ].filter(item => 
          item.name.toLowerCase().includes(term.toLowerCase()) ||
          item.category.toLowerCase().includes(term.toLowerCase())
        );

        setSearchResults(mockResults);
        setIsLoading(false);

        // Save to recent searches
        if (term.trim() && !recentSearches.includes(term)) {
          setRecentSearches(prev => [term, ...prev].slice(0, 5));
        }
      }, 500);
    } catch (error) {
      console.error("Search error:", error);
      setIsLoading(false);
    }
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
    // TODO: Navigate to search results page
    console.log("View all results for:", searchTerm);
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
                    <span className="result-icon">{product.image}</span>
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