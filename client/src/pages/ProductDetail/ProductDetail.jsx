import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../../components/Header/header";
import Footer from "../../components/Footer/footer";
import { getProductById, getRelatedProducts, addToCart, BASE_URL } from "../../utils/helper";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProductDetail();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      const res = await getProductById(id);
      
      if (res.success) {
        setProduct(res.data);
        setSelectedImage(0);
        setQuantity(1);
        
        // Fetch related products
        if (res.data.category_id) {
          const relatedRes = await getRelatedProducts(res.data.category_id, id);
          if (relatedRes.success) {
            setRelatedProducts(relatedRes.data);
          }
        }
        setError(null);
      } else {
        setError(res.message || "Không thể tải thông tin sản phẩm");
        toast.error("Không thể tải thông tin sản phẩm");
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Có lỗi xảy ra khi tải sản phẩm");
      toast.error("Có lỗi xảy ra khi tải sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    if (product && newQuantity > product.stock) {
      toast.warning(`Chỉ còn ${product.stock} sản phẩm trong kho`);
      return;
    }
    setQuantity(newQuantity);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      setAddingToCart(true);
      const res = await addToCart({
        product_id: product.id,
        quantity: quantity
      });
      
      if (res.success) {
        toast.success(`✓ Đã thêm ${quantity} ${product.name} vào giỏ hàng`, {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error(res.message || "Không thể thêm sản phẩm");
      }
    } catch (err) {
      toast.error("❌ Vui lòng đăng nhập để thêm sản phẩm");
      console.error("Add to cart error:", err);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate("/cart");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(price);
  };

  const getProductImage = (imageUrl) => {
    if (imageUrl) {
      return `${BASE_URL}/storage/${imageUrl}`;
    }
    return "/no-image.png";
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="product-detail-loading">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin sản phẩm...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <div className="product-detail-error">
          <span className="error-icon">💎</span>
          <h2>Không tìm thấy sản phẩm</h2>
          <p>{error || "Sản phẩm bạn tìm kiếm không tồn tại hoặc đã bị xóa."}</p>
          <Link to="/collections" className="btn btn-primary">
            Quay lại cửa hàng
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const images = product.images || [];
  const mainImage = images.length > 0 ? getProductImage(images[selectedImage]?.image_url) : "/no-image.png";

  return (
    <div className="product-detail-container">
      <Header />
      
      <main className="product-detail-main">
        <div className="container">
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span className="separator">/</span>
            <Link to="/collections">Sản phẩm</Link>
            <span className="separator">/</span>
            <span className="current">{product.name}</span>
          </div>

          {/* Product Detail */}
          <div className="product-detail-grid">
            {/* Product Images */}
            <div className="product-images-section">
              <div className="main-image">
                <img src={mainImage} alt={product.name} />
              </div>
              {images.length > 1 && (
                <div className="thumbnail-list">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img src={getProductImage(img.image_url)} alt={`${product.name} ${index + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="product-info-section">
              <div className="product-category-badge">
                {product.category?.name || "Trang sức"}
              </div>
              <h1 className="product-name">{product.name}</h1>
              
              <div className="product-meta">
                <div className="product-sku">
                  <span>Mã sản phẩm:</span> #{product.id}
                </div>
                <div className="product-stock">
                  <span>Tình trạng:</span>
                  {product.stock > 0 ? (
                    <span className="in-stock">
                      ✓ Còn hàng ({product.stock} sản phẩm)
                    </span>
                  ) : (
                    <span className="out-stock">✗ Hết hàng</span>
                  )}
                </div>
              </div>

              <div className="product-price">
                <span className="price-label">Giá:</span>
                <span className="price-value">{formatPrice(product.price)}</span>
              </div>

              <div className="product-description">
                <h3>Mô tả sản phẩm</h3>
                <p>{product.description || "Chưa có mô tả cho sản phẩm này."}</p>
              </div>

              <div className="product-details">
                <h3>Thông tin chi tiết</h3>
                <ul className="details-list">
                  <li>
                    <span className="detail-label">Chất liệu:</span>
                    <span className="detail-value">{product.material || "Vàng 18K"}</span>
                  </li>
                  <li>
                    <span className="detail-label">Trọng lượng:</span>
                    <span className="detail-value">{product.weight || 0}g</span>
                  </li>
                  <li>
                    <span className="detail-label">Bảo hành:</span>
                    <span className="detail-value">Trọn đời</span>
                  </li>
                  <li>
                    <span className="detail-label">Nguồn gốc:</span>
                    <span className="detail-value">Ý, Pháp</span>
                  </li>
                </ul>
              </div>

              {/* Quantity Selector */}
              <div className="product-quantity">
                <h3>Số lượng</h3>
                <div className="quantity-selector">
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="quantity-value">{quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={product.stock <= quantity}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="product-actions">
                <button
                  className="btn-add-to-cart"
                  onClick={handleAddToCart}
                  disabled={addingToCart || product.stock === 0}
                >
                  {addingToCart ? (
                    <span className="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </span>
                  ) : (
                    <>
                      🛒 THÊM VÀO GIỎ
                    </>
                  )}
                </button>
                <button
                  className="btn-buy-now"
                  onClick={handleBuyNow}
                  disabled={addingToCart || product.stock === 0}
                >
                  💎 MUA NGAY
                </button>
              </div>

              {/* Delivery Info */}
              <div className="delivery-info">
                <div className="delivery-item">
                  <span className="delivery-icon">🚚</span>
                  <div>
                    <strong>Miễn phí vận chuyển</strong>
                    <p>Cho đơn hàng từ 100,000,000đ</p>
                  </div>
                </div>
                <div className="delivery-item">
                  <span className="delivery-icon">💎</span>
                  <div>
                    <strong>Bảo hành trọn đời</strong>
                    <p>Bảo dưỡng và đánh bóng miễn phí</p>
                  </div>
                </div>
                <div className="delivery-item">
                  <span className="delivery-icon">🎁</span>
                  <div>
                    <strong>Quà tặng cao cấp</strong>
                    <p>Hộp đựng và thiệp chúc mừng</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="related-products-section">
              <div className="section-header">
                <h2>Sản phẩm liên quan</h2>
                <p>Có thể bạn cũng thích</p>
              </div>
              <div className="related-products-grid">
                {relatedProducts.map((related) => (
                  <div key={related.id} className="related-product-card">
                    <Link to={`/product/${related.id}`} className="related-product-link">
                      <div className="related-product-image">
                        <img
                          src={related.images?.[0]?.image_url ? getProductImage(related.images[0].image_url) : "/no-image.png"}
                          alt={related.name}
                          onError={(e) => e.target.src = "/no-image.png"}
                        />
                      </div>
                      <div className="related-product-info">
                        <h3 className="related-product-name">{related.name}</h3>
                        <p className="related-product-meta">{related.material} • {related.weight}g</p>
                        <div className="related-product-price">{formatPrice(related.price)}</div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;