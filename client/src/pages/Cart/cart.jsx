import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../../components/Header/header";
import Footer from "../../components/Footer/footer";
import "./cart.css";
import { getCart, updateCartItem, removeFromCart, clearCart, BASE_URL } from "../../utils/helper";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState(null);

  // Cart totals
  const [totals, setTotals] = useState({
    subtotal: 0,
    discount: 0,
    shipping: 0,
    total: 0
  });

  // Fetch cart data
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await getCart();
      
      if (response.success) {
        const items = response.data.items || [];
        // Flatten product data for easier access in JSX
        const flattenedItems = items.map(item => ({
          id: item.id,
          cart_id: item.cart_id,
          product_id: item.product_id,
          quantity: item.quantity,
          name: item.product?.name || "Unknown",
          price: item.product?.price || 0,
          material: item.product?.material || "Unknown",
          weight: item.product?.weight || 0,
          images: item.product?.images || [],
          stock: item.product?.stock || 0
        }));
        setCartItems(flattenedItems);
        calculateTotals(flattenedItems, 0);
        setError(null);
      } else {
        setError(response.message || "Không thể tải giỏ hàng");
        toast.error(response.message || "Không thể tải giỏ hàng");
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError("Lỗi: Vui lòng đăng nhập để xem giỏ hàng");
      toast.error("Vui lòng đăng nhập để xem giỏ hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Calculate totals
  const calculateTotals = (items, discount = 0) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 100000000 ? 0 : 30000; // Free shipping over 100,000,000 VND
    const total = subtotal - discount + shipping;
    
    setTotals({
      subtotal,
      discount,
      shipping,
      total
    });
  };

  // Update quantity
  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      await handleRemoveItem(itemId);
      return;
    }
    
    try {
      setUpdatingItemId(itemId);
      const response = await updateCartItem(itemId, newQuantity);
      
      if (response.success) {
        const items = response.data.items || [];
        const flattenedItems = items.map(item => ({
          id: item.id,
          cart_id: item.cart_id,
          product_id: item.product_id,
          quantity: item.quantity,
          name: item.product?.name || "Unknown",
          price: item.product?.price || 0,
          material: item.product?.material || "Unknown",
          weight: item.product?.weight || 0,
          images: item.product?.images || [],
          stock: item.product?.stock || 0
        }));
        setCartItems(flattenedItems);
        calculateTotals(flattenedItems, couponDiscount);
        toast.success("Đã cập nhật số lượng", {
          position: "top-right",
          autoClose: 2000,
        });
        setError(null);
      } else {
        setError(response.message || "Không thể cập nhật số lượng");
        toast.error(response.message || "Không thể cập nhật số lượng");
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
      toast.error("Lỗi cập nhật số lượng");
    } finally {
      setUpdatingItemId(null);
    }
  };

  // Remove item from cart
  const handleRemoveItem = async (itemId) => {
    try {
      const response = await removeFromCart(itemId);
      
      if (response.success) {
        const items = response.data.items || [];
        const flattenedItems = items.map(item => ({
          id: item.id,
          cart_id: item.cart_id,
          product_id: item.product_id,
          quantity: item.quantity,
          name: item.product?.name || "Unknown",
          price: item.product?.price || 0,
          material: item.product?.material || "Unknown",
          weight: item.product?.weight || 0,
          images: item.product?.images || [],
          stock: item.product?.stock || 0
        }));
        setCartItems(flattenedItems);
        calculateTotals(flattenedItems, couponDiscount);
        toast.success("Đã xóa sản phẩm khỏi giỏ hàng", {
          position: "top-right",
          autoClose: 2000,
        });
        setError(null);
      } else {
        setError(response.message || "Không thể xóa sản phẩm");
        toast.error(response.message || "Không thể xóa sản phẩm");
      }
    } catch (err) {
      console.error("Error removing item:", err);
      toast.error("Lỗi xóa sản phẩm");
    }
  };

  // Apply coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.warning("Vui lòng nhập mã giảm giá", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    
    try {
      setApplyingCoupon(true);
      // TODO: Implement coupon API when available
      
      // Mock coupon validation
      setTimeout(() => {
        if (couponCode.toUpperCase() === "JEWELRY20") {
          const discountAmount = totals.subtotal * 0.2;
          setCouponDiscount(discountAmount);
          setCouponApplied(true);
          calculateTotals(cartItems, discountAmount);
          toast.success(`✓ Áp dụng thành công! Giảm ${new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND"
          }).format(discountAmount)}`, {
            position: "top-right",
            autoClose: 3000,
          });
          setError(null);
        } else if (couponCode.toUpperCase() === "FREESHIP") {
          setCouponDiscount(0);
          setCouponApplied(true);
          calculateTotals(cartItems, 0);
          toast.success("✓ Áp dụng thành công! Miễn phí vận chuyển", {
            position: "top-right",
            autoClose: 3000,
          });
          setError(null);
        } else {
          toast.error("Mã giảm giá không hợp lệ", {
            position: "top-right",
            autoClose: 2000,
          });
          setCouponDiscount(0);
          setCouponApplied(false);
          calculateTotals(cartItems, 0);
        }
        setApplyingCoupon(false);
      }, 500);
      
    } catch (err) {
      console.error("Error applying coupon:", err);
      toast.error("Mã giảm giá không hợp lệ");
      setApplyingCoupon(false);
    }
  };

  // Remove coupon
  const handleRemoveCoupon = () => {
    setCouponCode("");
    setCouponDiscount(0);
    setCouponApplied(false);
    calculateTotals(cartItems, 0);
    toast.info("Đã hủy mã giảm giá", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  // Clear cart
  const handleClearCart = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?")) {
      return;
    }
    
    try {
      const response = await clearCart();
      
      if (response.success) {
        setCartItems([]);
        calculateTotals([], 0);
        setCouponCode("");
        setCouponDiscount(0);
        setCouponApplied(false);
        toast.success("Đã xóa toàn bộ giỏ hàng", {
          position: "top-right",
          autoClose: 2000,
        });
        setError(null);
      } else {
        toast.error(response.message || "Không thể xóa giỏ hàng");
      }
    } catch (err) {
      console.error("Error clearing cart:", err);
      toast.error("Lỗi xóa giỏ hàng");
    }
  };

  // Proceed to checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.warning("Giỏ hàng trống, vui lòng thêm sản phẩm", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }
    navigate("/checkout");
  };

  // Continue shopping
  const handleContinueShopping = () => {
    navigate("/collections");
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(price);
  };

  // Get product image
  const getProductImage = (item) => {
    if (item.images && item.images.length > 0 && item.images[0]?.image_url) {
      return `${BASE_URL}/storage/${item.images[0].image_url}`;
    }
    return "/no-image.png";
  };

  return (
    <div className="cart-container">
      <Header />
      
      <main className="cart-main">
        <div className="container">
          {/* Page Header */}
          <div className="cart-header">
            <h1 className="cart-title">GIỎ HÀNG</h1>
            <p className="cart-subtitle">
              {cartItems.length > 0 
                ? `Bạn đang có ${cartItems.length} sản phẩm trong giỏ hàng`
                : "Giỏ hàng của bạn đang trống"}
            </p>
          </div>

          {loading ? (
            <div className="cart-loading">
              <div className="loading-spinner"></div>
              <p>Đang tải giỏ hàng...</p>
            </div>
          ) : error ? (
            <div className="cart-error">
              <span className="error-icon">⚠️</span>
              <p>{error}</p>
              <button className="btn btn-outline" onClick={fetchCart}>
                Thử lại
              </button>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="cart-empty">
              <span className="empty-icon">🛒</span>
              <h3>Giỏ hàng của bạn đang trống</h3>
              <p>Hãy khám phá những kiệt tác trang sức cao cấp của chúng tôi</p>
              <button className="btn btn-primary" onClick={handleContinueShopping}>
                TIẾP TỤC MUA SẮM
              </button>
            </div>
          ) : (
            <div className="cart-content">
              <div className="cart-items-section">
                {/* Cart Items Header */}
                <div className="cart-items-header">
                  <div className="col-product">Sản phẩm</div>
                  <div className="col-price">Đơn giá</div>
                  <div className="col-quantity">Số lượng</div>
                  <div className="col-total">Thành tiền</div>
                  <div className="col-action"></div>
                </div>

                {/* Cart Items */}
                <div className="cart-items-list">
                  {cartItems.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="item-product">
                        <div className="item-image">
                          <img
                            src={getProductImage(item)}
                            alt={item.name}
                            onError={(e) => {
                              e.target.src = "/no-image.png";
                            }}
                          />
                        </div>
                        <div className="item-info">
                          <h3 className="item-name">{item.name}</h3>
                          <p className="item-meta">
                            {item.material} • {item.weight}g
                          </p>
                        </div>
                      </div>
                      
                      <div className="item-price">
                        {formatPrice(item.price)}
                      </div>
                      
                      <div className="item-quantity">
                        <button
                          className="quantity-btn"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={updatingItemId === item.id || item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="quantity-value">
                          {updatingItemId === item.id ? "..." : item.quantity}
                        </span>
                        <button
                          className="quantity-btn"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={updatingItemId === item.id || item.quantity >= item.stock}
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="item-total">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                      
                      <div className="item-action">
                        <button
                          className="remove-btn"
                          onClick={() => handleRemoveItem(item.id)}
                          aria-label="Xóa sản phẩm"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Summary */}
              <div className="cart-summary-section">
                <div className="summary-card">
                  <h3 className="summary-title">TÓM TẮT ĐƠN HÀNG</h3>
                  
                  <div className="summary-row">
                    <span>Tạm tính</span>
                    <span>{formatPrice(totals.subtotal)}</span>
                  </div>
                  
                  {totals.discount > 0 && (
                    <div className="summary-row discount">
                      <span>Giảm giá</span>
                      <span>- {formatPrice(totals.discount)}</span>
                    </div>
                  )}
                  
                  <div className="summary-row">
                    <span>Phí vận chuyển</span>
                    <span>
                      {totals.shipping === 0 ? "Miễn phí" : formatPrice(totals.shipping)}
                    </span>
                  </div>
                  
                  <div className="summary-divider"></div>
                  
                  <div className="summary-row total">
                    <span>Tổng cộng</span>
                    <span>{formatPrice(totals.total)}</span>
                  </div>
                  
                  {/* Coupon Section */}
                  <div className="coupon-section">
                    <input
                      type="text"
                      className="coupon-input"
                      placeholder="Mã giảm giá (JEWELRY20, FREESHIP)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={couponApplied}
                    />
                    {!couponApplied ? (
                      <button
                        className="coupon-btn"
                        onClick={handleApplyCoupon}
                        disabled={applyingCoupon || !couponCode.trim()}
                      >
                        {applyingCoupon ? "Đang áp dụng..." : "Áp dụng"}
                      </button>
                    ) : (
                      <button
                        className="coupon-remove"
                        onClick={handleRemoveCoupon}
                      >
                        Hủy mã
                      </button>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="summary-actions">
                    <button
                      className="checkout-btn"
                      onClick={handleCheckout}
                      disabled={cartItems.length === 0}
                    >
                      TIẾN HÀNH THANH TOÁN
                    </button>
                    <button
                      className="continue-shopping-btn"
                      onClick={handleContinueShopping}
                    >
                      TIẾP TỤC MUA SẮM
                    </button>
                    <button
                      className="clear-cart-btn"
                      onClick={handleClearCart}
                      disabled={cartItems.length === 0}
                      title="Xóa toàn bộ giỏ hàng"
                    >
                      🗑️ XÓA GIỎ HÀNG
                    </button>
                  </div>
                  
                  {/* Payment Methods */}
                  <div className="payment-methods">
                    <p>Chấp nhận thanh toán</p>
                    <div className="payment-icons">
                      <span>💳</span>
                      <span>💵</span>
                      <span>🏦</span>
                      <span>📱</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;