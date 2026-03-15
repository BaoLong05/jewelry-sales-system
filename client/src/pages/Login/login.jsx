import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./login.css";
import { toast } from "react-toastify";
import { loginUser } from "../../utils/helper";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // handle input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await loginUser({
        email: formData.email,
        password: formData.password
      });

      toast.success(res.message);
      console.log("User:", res.data);
      
      // TODO: Xử lý lưu token, chuyển hướng, v.v.

    } catch (error) {
      if (error.response) {
        const data = error.response.data;
        console.log("Server error:", data);

        if (data.errors) {
          Object.values(data.errors).forEach((err) => {
            toast.error(err[0]);
          });
        } else {
          toast.error(data.message || "Đăng nhập thất bại");
        }
      } else {
        toast.error("Lỗi kết nối server");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* LEFT - Brand Section with full features */}
        <div className="login-brand">
          <div className="brand-content">
            <div className="brand-logo">
              <span className="logo-icon">👑</span>
              <span className="logo-text">JewelryStore</span>
            </div>

            <h1 className="brand-title">Chào mừng trở lại</h1>

            <p className="brand-description">
              Đăng nhập để khám phá bộ sưu tập trang sức cao cấp, 
              được chế tác tinh xảo dành riêng cho bạn.
            </p>

            {/* Brand Features */}
            <div className="brand-features">
              <div className="feature-item">
                <span className="feature-icon">💎</span>
                <span>Kim cương kiểm định GIA</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✨</span>
                <span>Thiết kế độc quyền</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎁</span>
                <span>Quà tặng cao cấp</span>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="brand-decoration">
              <div className="decoration-circle"></div>
              <div className="decoration-line"></div>
            </div>
          </div>
        </div>

        {/* RIGHT - Login Form */}
        <div className="login-form-wrapper">
          <div className="login-form-container">
            <div className="login-header">
              <h2>Đăng nhập</h2>
              <p>Vui lòng đăng nhập để tiếp tục</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="form-field">
                <label>Email</label>
                <div className="input-container">
                  <span className="input-icon">📧</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <span className="input-focus-border"></span>
                </div>
              </div>

              {/* Password Field */}
              <div className="form-field">
                <label>Mật khẩu</label>
                <div className="input-container">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Nhập mật khẩu"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁️' : '👁️'}
                  </button>
                  <span className="input-focus-border"></span>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="form-options">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    name="remember" 
                    checked={formData.remember}
                    onChange={handleChange}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-text">Ghi nhớ đăng nhập</span>
                </label>

                <Link to="/forgot-password" className="forgot-link">
                  Quên mật khẩu?
                </Link>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="login-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                ) : (
                  "Đăng nhập"
                )}
              </button>
            </form>

            {/* Register Link */}
            <div className="login-footer">
              <p>
                Chưa có tài khoản?{" "}
                <Link to="/register">Đăng ký ngay</Link>
              </p>
            </div>

            {/* Social Login */}
            <div className="social-login">
              <div className="social-divider">
                <span>Hoặc đăng nhập với</span>
              </div>
              <div className="social-buttons">
                <button className="social-btn google">
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span>Google</span>
                </button>
                <button className="social-btn facebook">
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
                  </svg>
                  <span>Facebook</span>
                </button>
              </div>
            </div>

            {/* Note */}
            <p className="login-note">
              *Đăng nhập để nhận ưu đãi đặc biệt dành cho thành viên
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;