import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";
import { addRegister } from "../../utils/helper";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    acceptTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // change input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  // validate frontend
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = "Vui lòng nhập họ tên";
    } else if (formData.name.length < 2) {
      newErrors.name = "Họ tên phải có ít nhất 2 ký tự";
    }

    if (!formData.email) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Vui lòng đồng ý điều khoản";
    }

    return newErrors;
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      Object.values(newErrors).forEach((msg) => {
        toast.error(msg);
      });

      return;
    }

    setIsLoading(true);

    try {
      const response = await addRegister({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      toast.success(response.message);
      navigate("/login");

    } catch (error) {
      if (error.response && error.response.data.errors) {
        const apiErrors = error.response.data.errors;
        const formattedErrors = {};

        Object.keys(apiErrors).forEach((key) => {
          formattedErrors[key] = apiErrors[key][0];
          toast.error(apiErrors[key][0]);
        });

        setErrors(formattedErrors);
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-wrapper">
        {/* LEFT - Brand Section with full features */}
        <div className="register-brand">
          <div className="brand-content">
            <div className="brand-logo">
              <span className="logo-icon">✨</span>
              <span className="logo-text">JewelryStore</span>
            </div>

            <h1 className="brand-title">Tinh hoa trang sức Việt</h1>

            <p className="brand-description">
              Khám phá bộ sưu tập trang sức cao cấp, được chế tác tinh xảo từ những nghệ nhân hàng đầu.
            </p>

            {/* Brand Features - Thêm vào để đẹp hơn */}
            <div className="brand-features">
              <div className="feature-item">
                <span className="feature-icon">💎</span>
                <span>Kim cương kiểm định GIA</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✨</span>
                <span>Bảo hành trọn đời</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎁</span>
                <span>Miễn phí vận chuyển toàn quốc</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT - Form Section */}
        <div className="register-form-wrapper">
          <div className="register-form-container">
            <div className="register-header">
              <h2>Tạo tài khoản</h2>
              <p>Đăng ký để nhận ưu đãi đặc biệt dành cho thành viên mới</p>
            </div>

            <form onSubmit={handleSubmit} className="register-form">
              {/* NAME FIELD - with input-container for focus effect */}
              <div className="form-field">
                <label>Họ và tên</label>
                <div className="input-container">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nhập họ và tên của bạn"
                    className={errors.name ? "error" : ""}
                  />
                  <span className="input-focus-border"></span>
                </div>
                {errors.name && (
                  <span className="field-error">{errors.name}</span>
                )}
              </div>

              {/* EMAIL FIELD - with input-container for focus effect */}
              <div className="form-field">
                <label>Email</label>
                <div className="input-container">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    className={errors.email ? "error" : ""}
                  />
                  <span className="input-focus-border"></span>
                </div>
                {errors.email && (
                  <span className="field-error">{errors.email}</span>
                )}
              </div>

              {/* PASSWORD FIELD - with proper toggle button styling */}
              <div className="form-field">
                <label>Mật khẩu</label>
                <div className="input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Tối thiểu 6 ký tự"
                    className={errors.password ? "error" : ""}
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
                {errors.password && (
                  <span className="field-error">{errors.password}</span>
                )}
              </div>

              {/* TERMS FIELD - with custom checkbox */}
              <div className="form-field terms-field">
                <label className="terms-checkbox">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-label">
                    Tôi đồng ý với <Link to="/terms">Điều khoản dịch vụ</Link> và <Link to="/privacy">Chính sách bảo mật</Link>
                  </span>
                </label>
                {errors.acceptTerms && (
                  <span className="field-error">{errors.acceptTerms}</span>
                )}
              </div>

              {/* SUBMIT BUTTON - with loading state */}
              <button
                type="submit"
                disabled={isLoading}
                className="register-submit-btn"
              >
                {isLoading ? (
                  <span className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                ) : (
                  "Đăng ký"
                )}
              </button>
            </form>

            {/* FOOTER - Login link */}
            <div className="register-footer">
              <p>
                Đã có tài khoản?{" "}
                <Link to="/login">Đăng nhập</Link>
              </p>
            </div>

            {/* SOCIAL REGISTER - Thêm vào để đẹp hơn */}
            <div className="social-register">
              <div className="social-divider">
                <span>Hoặc đăng ký với</span>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;