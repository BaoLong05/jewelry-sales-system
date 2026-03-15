import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="luxury-footer">
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col brand-col">
              <div className="footer-logo">
                <span className="logo-icon">👑</span>
                <span className="logo-text">JEWELRYSTORE</span>
              </div>
              <p className="footer-description">
                Maison de Haute Joaillerie depuis 1885. 
                Chế tác những giấc mơ thành kiệt tác vĩnh cửu.
              </p>
              <div className="footer-social">
                <a href="#" className="social-link" aria-label="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M3 16V8C3 5.23858 5.23858 3 8 3H16C18.7614 3 21 5.23858 21 8V16C21 18.7614 18.7614 21 16 21H8C5.23858 21 3 18.7614 3 16Z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M17.5 6.5H17.51" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </a>
                <a href="#" className="social-link" aria-label="Facebook">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                <a href="#" className="social-link" aria-label="Pinterest">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M8 21L16 3M6 9H18M9 3L3 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="footer-col">
              <h4 className="footer-title">KHÁM PHÁ</h4>
              <ul className="footer-links">
                <li><Link to="/collections">Bộ sưu tập</Link></li>
                <li><Link to="/high-jewelry">High Jewelry</Link></li>
                <li><Link to="/bridal">Trang sức cưới</Link></li>
                <li><Link to="/watches">Đồng hồ</Link></li>
                <li><Link to="/gifts">Quà tặng</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-title">DỊCH VỤ</h4>
              <ul className="footer-links">
                <li><Link to="/bespoke">Bespoke</Link></li>
                <li><Link to="/appointment">Đặt hẹn</Link></li>
                <li><Link to="/care">Bảo dưỡng</Link></li>
                <li><Link to="/certificate">Kiểm định GIA</Link></li>
                <li><Link to="/private-shopping">Mua sắm riêng tư</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-title">LIÊN HỆ</h4>
              <ul className="footer-contact">
                <li>123 Đồng Khởi, Quận 1</li>
                <li>Thành phố Hồ Chí Minh</li>
                <li>+84 28 1234 5678</li>
                <li>concierge@jewelrystore.com</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p className="copyright">© 2024 JEWELRYSTORE. All rights reserved.</p>
            <div className="footer-bottom-links">
              <Link to="/privacy">Chính sách bảo mật</Link>
              <Link to="/terms">Điều khoản sử dụng</Link>
              <Link to="/cookies">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;