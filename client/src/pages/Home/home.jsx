import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/header";
import Footer from "../../components/Footer/footer";
import "./home.css";
import { getProducts, BASE_URL, addToCart } from "../../utils/helper";

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 20,
  });

  // ================= FETCH PRODUCTS =================
  const fetchProducts = async (page = 1, search = "") => {
    try {
      setLoading(true);

      const res = await getProducts({ page, search });

      if (res?.success) {
        const productList = res.data.data || [];

        setProducts(productList);

        setPagination({
          current_page: res.data.current_page || 1,
          last_page: res.data.last_page || 1,
          total: res.data.total || 0,
          per_page: res.data.per_page || 20,
        });

        setError(null);
      } else {
        setError("Không thể tải sản phẩm");
        toast.error("Không thể tải sản phẩm");
      }
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra khi tải sản phẩm");
      toast.error("Có lỗi xảy ra khi tải sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  // ================= LOAD DATA =================
  useEffect(() => {
    fetchProducts();
  }, []);

  // ================= SCROLL ANIMATION =================
  useEffect(() => {
    if (products.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".animate-on-scroll");

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [products]);

  // ================= PAGINATION =================
  const handlePageChange = (page) => {
    fetchProducts(page, searchValue);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ================= SEARCH =================
  const handleSearch = (searchTerm) => {
    setSearchValue(searchTerm);
    fetchProducts(1, searchTerm);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts(1, searchValue);
  };

  // ================= ADD TO CART =================
  const handleAddToCart = async (product) => {
    try {
      const res = await addToCart({
        product_id: product.id,
        quantity: 1
      });
      
      if (res.success) {
        toast.success(`✓ Đã thêm ${product.name} vào giỏ hàng`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error(res.message || "Không thể thêm sản phẩm", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.error("❌ Vui lòng đăng nhập để thêm sản phẩm", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Add to cart error:", err);
    }
  };

  // ================= VIEW PRODUCT DETAIL =================
  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  // ================= PRICE FORMAT =================
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(price) || 0);
  };

  // ================= PRODUCT IMAGE =================
  const getProductImage = (product) => {
    const images = product?.images || [];

    if (images.length > 0 && images[0]?.image_url) {
      return `${BASE_URL}/storage/${images[0].image_url}`;
    }

    return "/no-image.png";
  };

  return (
    <div className="luxury-home">
      <Header onSearch={handleSearch} />

      <main>
        {/* HERO */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              L'ÉCLAT <span className="gold-text">DU SOLEIL</span>
            </h1>

            <p className="hero-description">
              Ánh sáng mặt trời được chế tác thành những viên kim cương hoàn hảo.
            </p>

            <a href="#products" className="btn btn-outline">
              KHÁM PHÁ NGAY
            </a>
          </div>
        </section>

        {/* PRODUCTS */}
        <section id="products" className="products-section">
          <div className="container">
            <div className="section-header">
              <span className="section-subtitle">TÁC PHẨM NỔI BẬT</span>

              <h2 className="section-title">
                KIỆT TÁC <span className="gold-text">CHẾ TÁC</span>
              </h2>

              <p className="section-description">
                {pagination.total > 0
                  ? `Hiển thị ${products.length} trên tổng số ${pagination.total} sản phẩm`
                  : "Khám phá bộ sưu tập độc đáo của chúng tôi"}
              </p>
            </div>

            {/* LOADING */}
            {loading && (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Đang tải sản phẩm...</p>
              </div>
            )}

            {/* ERROR */}
            {error && (
              <div className="error-container">
                <p>{error}</p>
                <button
                  className="btn btn-outline"
                  onClick={() => fetchProducts()}
                >
                  Thử lại
                </button>
              </div>
            )}

            {/* EMPTY */}
            {!loading && !error && products.length === 0 && (
              <div className="empty-state">
                <span className="empty-icon">📦</span>
                <h3>Không có sản phẩm</h3>
                <p>Hãy thử tìm kiếm với từ khóa khác</p>
              </div>
            )}

            {/* PRODUCTS GRID */}
            {!loading && !error && products.length > 0 && (
              <>
                <div className="products-grid">
                  {products.map((product, index) => {
                    const image = getProductImage(product);

                    return (
                      <div
                        key={product.id}
                        className="product-card animate-on-scroll"
                        style={{ animationDelay: `${index * 0.1}s` }}
                        onClick={() => handleViewProduct(product.id)}
                      >
                        {product.stock < 5 && product.stock > 0 && (
                          <div className="product-badge">SẮP HẾT</div>
                        )}

                        {Number(product.price) > 100000000 && (
                          <div className="product-badge gold">CAO CẤP</div>
                        )}

                        <div className="product-image">
                          <img
                            src={image}
                            alt={product.name}
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src = "/no-image.png";
                            }}
                          />
                          <div className="product-overlay"></div>
                          <div className="product-actions">
                            <button 
                              className="product-action"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(product);
                              }}
                              aria-label="Thêm vào giỏ hàng"
                            >
                              🛒
                            </button>
                            <button 
                              className="product-action"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewProduct(product.id);
                              }}
                              aria-label="Xem nhanh"
                            >
                              👁
                            </button>
                          </div>
                        </div>

                        <div className="product-info">
                          <h3 className="product-name">
                            {product.name || "Unnamed Product"}
                          </h3>

                          <p className="product-category">
                            {product.material || "Unknown"} •{" "}
                            {product.weight || 0}g
                          </p>

                          <div className="product-price">
                            <span className="current-price">
                              {formatPrice(product.price)}
                            </span>
                          </div>

                          <button
                            className="product-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product);
                            }}
                          >
                            THÊM VÀO GIỎ
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* PAGINATION */}
                {pagination.last_page > 1 && (
                  <div className="pagination">
                    <button
                      disabled={pagination.current_page === 1}
                      onClick={() =>
                        handlePageChange(pagination.current_page - 1)
                      }
                    >
                      ‹ Prev
                    </button>

                    {[...Array(pagination.last_page)].map((_, i) => {
                      const page = i + 1;
                      
                      // Show limited page numbers with ellipsis
                      if (
                        page === 1 ||
                        page === pagination.last_page ||
                        (page >= pagination.current_page - 2 && 
                         page <= pagination.current_page + 2)
                      ) {
                        return (
                          <button
                            key={page}
                            className={
                              pagination.current_page === page ? "active" : ""
                            }
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        );
                      } else if (
                        page === pagination.current_page - 3 ||
                        page === pagination.current_page + 3
                      ) {
                        return <span key={page} className="pagination-ellipsis">...</span>;
                      }
                      return null;
                    })}

                    <button
                      disabled={
                        pagination.current_page === pagination.last_page
                      }
                      onClick={() =>
                        handlePageChange(pagination.current_page + 1)
                      }
                    >
                      Next ›
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;