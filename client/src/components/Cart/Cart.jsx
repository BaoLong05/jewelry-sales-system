import { useState, useEffect } from "react";
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from "../../utils/helper";
import "./Cart.css";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ================= FETCH CART =================
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await getCart();
      if (res.success) {
        setCart(res.data);
        setError(null);
      } else {
        setError(res.message || "Không thể tải giỏ hàng");
      }
    } catch (err) {
      setError("Lỗi kết nối: " + err.message);
      console.error("Fetch cart error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= LOAD DATA =================
  useEffect(() => {
    fetchCart();
  }, []);

  // ================= ADD TO CART =================
  const handleAddToCart = async (productId, quantity = 1) => {
    try {
      const res = await addToCart({
        product_id: productId,
        quantity: quantity
      });
      if (res.success) {
        setCart(res.data);
        setError(null);
      } else {
        setError(res.message || "Không thể thêm sản phẩm");
      }
    } catch (err) {
      setError("Lỗi: " + err.message);
      console.error("Add to cart error:", err);
    }
  };

  // ================= UPDATE QUANTITY =================
  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      await handleRemoveFromCart(itemId);
      return;
    }

    try {
      const res = await updateCartItem(itemId, newQuantity);
      if (res.success) {
        setCart(res.data);
        setError(null);
      } else {
        setError(res.message || "Không thể cập nhật số lượng");
      }
    } catch (err) {
      setError("Lỗi: " + err.message);
      console.error("Update quantity error:", err);
    }
  };

  // ================= REMOVE FROM CART =================
  const handleRemoveFromCart = async (itemId) => {
    try {
      const res = await removeFromCart(itemId);
      if (res.success) {
        setCart(res.data);
        setError(null);
      } else {
        setError(res.message || "Không thể xóa sản phẩm");
      }
    } catch (err) {
      setError("Lỗi: " + err.message);
      console.error("Remove from cart error:", err);
    }
  };

  // ================= CLEAR CART =================
  const handleClearCart = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?")) {
      try {
        const res = await clearCart();
        if (res.success) {
          setCart(res.data);
          setError(null);
        } else {
          setError(res.message || "Không thể xóa giỏ hàng");
        }
      } catch (err) {
        setError("Lỗi: " + err.message);
        console.error("Clear cart error:", err);
      }
    }
  };

  // ================= FORMAT PRICE =================
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(price) || 0);
  };

  // ================= CALCULATE TOTAL =================
  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  // ================= GET PRODUCT IMAGE =================
  const getProductImage = (product) => {
    const images = product?.images || [];
    if (images.length > 0 && images[0]?.image_url) {
      return images[0].image_url;
    }
    return "/no-image.png";
  };

  // ================= RENDER =================
  return (
    <div className="cart-container">
      <div className="cart-wrapper">
        <h1 className="cart-title">GIỎ HÀNG CỦA BẠN</h1>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => setError(null)}>Đóng</button>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải giỏ hàng...</p>
          </div>
        )}

        {/* EMPTY CART */}
        {!loading && (!cart || !cart.items || cart.items.length === 0) && (
          <div className="empty-cart">
            <p className="empty-text">Giỏ hàng của bạn trống</p>
            <a href="/products" className="btn btn-primary">
              Tiếp tục mua sắm
            </a>
          </div>
        )}

        {/* CART CONTENT */}
        {!loading && cart && cart.items && cart.items.length > 0 && (
          <div className="cart-content">
            {/* CART ITEMS */}
            <div className="cart-items">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Giá</th>
                    <th>Số lượng</th>
                    <th>Tổng cộng</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.items.map((item) => (
                    <tr key={item.id} className="cart-item-row">
                      <td className="product-info">
                        <img
                          src={getProductImage(item.product)}
                          alt={item.product.name}
                          className="product-thumbnail"
                          onError={(e) => {
                            e.target.src = "/no-image.png";
                          }}
                        />
                        <div className="product-details">
                          <h4>{item.product.name}</h4>
                          <p className="product-meta">
                            {item.product.material} • {item.product.weight}g
                          </p>
                        </div>
                      </td>
                      <td className="price">
                        {formatPrice(item.product.price)}
                      </td>
                      <td className="quantity">
                        <div className="quantity-control">
                          <button
                            className="qty-btn"
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdateQuantity(item.id, parseInt(e.target.value))
                            }
                            className="qty-input"
                            min="1"
                          />
                          <button
                            className="qty-btn"
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="total">
                        {formatPrice(item.product.price * item.quantity)}
                      </td>
                      <td className="actions">
                        <button
                          className="btn-delete"
                          onClick={() => handleRemoveFromCart(item.id)}
                          title="Xóa khỏi giỏ hàng"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CART SUMMARY */}
            <div className="cart-summary">
              <div className="summary-box">
                <div className="summary-row">
                  <span className="label">Tổng sản phẩm:</span>
                  <span className="value">
                    {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
                <div className="summary-row">
                  <span className="label">Tổng tiền:</span>
                  <span className="value total-price">
                    {formatPrice(calculateTotal())}
                  </span>
                </div>
                <button className="btn btn-primary btn-checkout">
                  THANH TOÁN
                </button>
                <button
                  className="btn btn-outline btn-clear"
                  onClick={handleClearCart}
                >
                  XÓA GIỎ HÀNG
                </button>
                <a href="/products" className="btn btn-secondary">
                  TIẾP TỤC MUA SẮM
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
