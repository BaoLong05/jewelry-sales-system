import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  useEffect(() => {
    // Animation for decorative elements
    const interval = setInterval(() => {
      const jewels = document.querySelectorAll('.jewel');
      jewels.forEach((jewel, index) => {
        setTimeout(() => {
          jewel.style.animation = 'none';
          jewel.offsetHeight; // Trigger reflow
          jewel.style.animation = 'jewelSpark 3s ease-in-out infinite';
        }, index * 200);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="notfound-container">
      {/* Background Pattern */}
      <div className="notfound-pattern">
        <div className="pattern-grid"></div>
        <div className="pattern-dots"></div>
      </div>

      {/* Floating Jewels */}
      <div className="floating-jewels">
        <div className="jewel jewel-1">💎</div>
        <div className="jewel jewel-2">👑</div>
        <div className="jewel jewel-3">💍</div>
        <div className="jewel jewel-4">✨</div>
        <div className="jewel jewel-5">📿</div>
        <div className="jewel jewel-6">💫</div>
      </div>

      {/* Main Content */}
      <div className="notfound-content">
        {/* Elegant divider */}
        <div className="notfound-divider">
          <span className="divider-line"></span>
          <span className="divider-icon">👑</span>
          <span className="divider-line"></span>
        </div>

        {/* Error Code */}
        <div className="error-code">
          <span className="code-4">4</span>
          <span className="code-0">0</span>
          <span className="code-4">4</span>
        </div>

        {/* Error Message */}
        <h1 className="error-title">TRANG KHÔNG TỒN TẠI</h1>
        
        <div className="error-description">
          <p>
            Có vẻ như viên kim cương quý giá bạn đang tìm kiếm 
            đã thất lạc trong kho báu của chúng tôi.
          </p>
          <p className="elegant-text">
            Đừng lo lắng, hãy để các chuyên gia của chúng tôi 
            giúp bạn tìm thấy kiệt tác hoàn hảo.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="notfound-actions">
          <Link to="/" className="action-btn primary">
            <span className="btn-icon">👑</span>
            <span className="btn-text">VỀ TRANG CHỦ</span>
          </Link>
          
          <Link to="/collections" className="action-btn secondary">
            <span className="btn-icon">💎</span>
            <span className="btn-text">KHÁM PHÁ BỘ SƯU TẬP</span>
          </Link>
        </div>

        {/* Contact Options */}
        <div className="contact-options">
          <p className="contact-text">Hoặc liên hệ với chúng tôi:</p>
          <div className="contact-links">
            <a href="tel:19001234" className="contact-link">
              <span className="contact-icon">📞</span>
              <span>1900 1234</span>
            </a>
            <span className="contact-separator">|</span>
            <a href="mailto:concierge@jewelrystore.com" className="contact-link">
              <span className="contact-icon">✉️</span>
              <span>concierge@jewelrystore.com</span>
            </a>
          </div>
        </div>

        {/* Decorative bottom line */}
        <div className="notfound-decoration">
          <div className="decoration-line"></div>
          <div className="decoration-diamonds">
            <span>💎</span>
            <span>💎</span>
            <span>💎</span>
          </div>
          <div className="decoration-line"></div>
        </div>
      </div>

      {/* Back to Home Floating Button (for mobile) */}
      <Link to="/" className="mobile-home-btn">
        <span className="btn-icon">👑</span>
        <span>Trang chủ</span>
      </Link>
    </div>
  );
};

export default NotFound;