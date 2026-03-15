import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Search from "../Search/search";
import "./Header.css";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when window resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 992) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className={`luxury-header ${isScrolled ? 'scrolled' : ''}`}>
        {/* Header Top */}
        <div className="header-top">
          <div className="header-contact">
            <span className="contact-item">
              <span className="contact-icon">📞</span>
              <a href="tel:19001234">123456789</a>
            </span>
            <span className="contact-item">
              <span className="contact-icon">✉️</span>
              <a href="mailto:concierge@jewelrystore.com">jewelrystore@gmail.com</a>
            </span>
          </div>
          <div className="header-currency">
            <select className="currency-select">
              <option value="VND">VND - ₫</option>
              <option value="USD">USD - $</option>
              <option value="EUR">EUR - €</option>
            </select>
          </div>
        </div>

        {/* Header Main */}
        <div className="header-main">
          {/* Logo */}
          <div className="logo-container">
            <Link to="/" className="logo" onClick={() => setIsMenuOpen(false)}>
              <span className="logo-icon">👑</span>
              <span className="logo-text">
                <span className="logo-line">JEWELRY</span>
                <span className="logo-line gold">STORE</span>
              </span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className={`mobile-menu-toggle ${isMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Navigation */}
          <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
            <Link 
              to="/" 
              className="nav-link active" 
              onClick={() => setIsMenuOpen(false)}
            >
              TRANG CHỦ
            </Link>
            <Link 
              to="/collections" 
              className="nav-link" 
              onClick={() => setIsMenuOpen(false)}
            >
              BỘ SƯU TẬP
            </Link>
            <Link 
              to="/high-jewelry" 
              className="nav-link" 
              onClick={() => setIsMenuOpen(false)}
            >
              HIGH JEWELRY
            </Link>
            <Link 
              to="/bridal" 
              className="nav-link" 
              onClick={() => setIsMenuOpen(false)}
            >
              TRANG SỨC CƯỚI
            </Link>
            <Link 
              to="/gifts" 
              className="nav-link" 
              onClick={() => setIsMenuOpen(false)}
            >
              QUÀ TẶNG
            </Link>
            <Link 
              to="/maison" 
              className="nav-link" 
              onClick={() => setIsMenuOpen(false)}
            >
              THƯƠNG HIỆU
            </Link>

            {/* Mobile Contact Info */}
            <div className="mobile-contact">
              <div className="mobile-contact-item">
                <span className="contact-icon">📞</span>
                <a href="tel:19001234">1900 1234</a>
              </div>
              <div className="mobile-contact-item">
                <span className="contact-icon">✉️</span>
                <a href="mailto:concierge@jewelrystore.com">concierge@jewelrystore.com</a>
              </div>
            </div>

            {/* Mobile Currency Selector */}
            <div className="mobile-currency">
              <select className="currency-select">
                <option value="VND">VND - ₫</option>
                <option value="USD">USD - $</option>
                <option value="EUR">EUR - €</option>
              </select>
            </div>
          </nav>

          {/* Header Actions */}
          <div className="header-actions">
            <button 
              className="action-btn search-toggle" 
              aria-label="Tìm kiếm"
              onClick={() => setIsSearchOpen(true)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            
            <button className="action-btn account-btn" aria-label="Tài khoản">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            
            <button className="action-btn cart-btn" aria-label="Giỏ hàng">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M16 21C16.5523 21 17 20.5523 17 20C17 19.4477 16.5523 19 16 19C15.4477 19 15 19.4477 15 20C15 20.5523 15.4477 21 16 21Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M6 21C6.55228 21 7 20.5523 7 20C7 19.4477 6.55228 19 6 19C5.44772 19 5 19.4477 5 20C5 20.5523 5.44772 21 6 21Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M2 3H5L7.5 15H18L21 6H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="cart-count">0</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="mobile-overlay" onClick={() => setIsMenuOpen(false)}></div>
        )}
      </header>

      {/* Search Component */}
      <Search 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};

export default Header;