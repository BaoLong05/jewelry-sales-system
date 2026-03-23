import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getCategories,
  BASE_URL 
} from "../../utils/adminHelper";
import "./AdminProducts.css";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    material: "",
    weight: "",
    category_id: "",
    images: []
  });
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const fetchProducts = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const params = { page };
      if (search) {
        params.search = search;
      }
      const res = await getProducts(params);
      if (res.success) {
        setProducts(res.data.data);
        setPagination({
          current_page: res.data.current_page,
          last_page: res.data.last_page,
          total: res.data.total
        });
      }
    } catch (error) {
      toast.error("Không thể tải sản phẩm");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      if (res.success) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set new timeout for debounced search
    const timeout = setTimeout(() => {
      fetchProducts(1, term);
    }, 500); // 500ms delay
    
    setSearchTimeout(timeout);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'images') {
          formData.images.forEach((file, index) => {
            formDataToSend.append(`images[${index}]`, file);
          });
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      let res;
      if (editingProduct) {
        res = await updateProduct(editingProduct.id, formDataToSend);
        if (res.success) {
          toast.success("Cập nhật sản phẩm thành công");
        }
      } else {
        res = await createProduct(formDataToSend);
        if (res.success) {
          toast.success("Thêm sản phẩm thành công");
        }
      }
      
      setShowModal(false);
      setEditingProduct(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        material: "",
        weight: "",
        category_id: "",
        images: []
      });
      fetchProducts(1, searchTerm);
    } catch (error) {
      toast.error(editingProduct ? "Cập nhật thất bại" : "Thêm sản phẩm thất bại");
      console.error(error);
    }
  };

  const handleDelete = async (product) => {
    if (window.confirm(`Bạn có chắc muốn xóa sản phẩm "${product.name}"?`)) {
      try {
        const res = await deleteProduct(product.id);
        if (res.success) {
          toast.success("Xóa sản phẩm thành công");
          fetchProducts(1, searchTerm);
        }
      } catch (error) {
        toast.error("Xóa sản phẩm thất bại");
        console.error(error);
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      material: product.material,
      weight: product.weight,
      category_id: product.category_id,
      images: []
    });
    setShowModal(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(price);
  };

  const getProductImage = (product) => {
    if (product.images && product.images.length > 0 && product.images[0]?.image_url) {
      return `${BASE_URL}/storage/${product.images[0].image_url}`;
    }
    return "/no-image.png";
  };

  return (
    <div className="admin-products">
      <div className="admin-header">
        <h1>Quản lý sản phẩm</h1>
        <button className="btn btn-primary" onClick={() => {
          setEditingProduct(null);
          setFormData({
            name: "",
            description: "",
            price: "",
            stock: "",
            material: "",
            weight: "",
            category_id: "",
            images: []
          });
          setShowModal(true);
        }}>
          + Thêm sản phẩm
        </button>
      </div>

      {loading ? (
        <div className="products-loading">
          <div className="loading-spinner"></div>
          <p>Đang tải sản phẩm...</p>
        </div>
      ) : (
        <>
          {/* Search Bar - Always visible */}
          <div className="search-container">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder=" Tìm kiếm sản phẩm theo tên..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
              {searchTerm && (
                <button 
                  className="clear-search"
                  onClick={() => {
                    setSearchTerm("");
                    fetchProducts(1, "");
                  }}
                  title="Xóa tìm kiếm"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {products.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📦</span>
              <h3>{searchTerm ? `Không tìm thấy sản phẩm "${searchTerm}"` : "Chưa có sản phẩm"}</h3>
              <p>{searchTerm ? "Hãy thử từ khóa khác hoặc thêm sản phẩm mới" : "Hãy thêm sản phẩm đầu tiên vào hệ thống"}</p>
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                + Thêm sản phẩm
              </button>
            </div>
          ) : (
            <>
              <div className="products-table-container">
                <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Hình ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Giá</th>
                  <th>Tồn kho</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>#{product.id}</td>
                    <td>
                      <img 
                        src={getProductImage(product)} 
                        alt={product.name}
                        className="product-thumbnail"
                      />
                    </td>
                    <td className="product-name-cell">
                      <strong>{product.name}</strong>
                      <p className="product-material">{product.material} • {product.weight}g</p>
                    </td>
                    <td>
                      {product.category?.name ? (
                        <span className="category-badge">{product.category.name}</span>
                      ) : (
                        <span className="category-badge">Không có</span>
                      )}
                    </td>
                    <td className="price-cell">{formatPrice(product.price)}</td>
                    <td>
                      <span className={`stock-badge ${product.stock > 50 ? 'normal' : product.stock > 10 ? 'low' : product.stock > 0 ? 'critical' : 'out'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button 
                        className="action-btn edit"
                        onClick={() => handleEdit(product)}
                        title="Sửa"
                      >
                        ✏️
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => handleDelete(product)}
                        title="Xóa"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
              </div>

              {/* Pagination */}
              {pagination.last_page > 1 && (
                <div className="products-pagination">
                  <div className="pagination-info">
                    Hiển thị {(pagination.current_page - 1) * 20 + 1} - {Math.min(pagination.current_page * 20, pagination.total)} trong {pagination.total} sản phẩm
                  </div>
                  <div className="pagination-buttons">
                    <button
                      className="pagination-btn"
                      disabled={pagination.current_page === 1}
                      onClick={() => fetchProducts(pagination.current_page - 1, searchTerm)}
                    >
                      ‹ Trước
                    </button>
                    {[...Array(pagination.last_page)].map((_, i) => (
                      <button
                        key={i + 1}
                        className={`pagination-btn ${pagination.current_page === i + 1 ? 'active' : ''}`}
                        onClick={() => fetchProducts(i + 1, searchTerm)}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      className="pagination-btn"
                      disabled={pagination.current_page === pagination.last_page}
                      onClick={() => fetchProducts(pagination.current_page + 1, searchTerm)}
                    >
                      Sau ›
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Modal Add/Edit Product */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-section">
                <div className="form-section-title">📋 Thông tin cơ bản</div>
                
                <div className="form-group">
                  <label>Tên sản phẩm <span className="required">*</span></label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Nhập tên sản phẩm"
                  />
                </div>

                <div className="form-group">
                  <label>Mô tả</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Nhập mô tả sản phẩm"
                  />
                </div>
              </div>

              <div className="form-section">
                <div className="form-section-title">💰 Giá và kho hang</div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Giá (VND) <span className="required">*</span></label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div className="form-group">
                    <label>Tồn kho <span className="required">*</span></label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="form-section-title">✨ Chi tiết sản phẩm</div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Chất liệu</label>
                    <input
                      type="text"
                      name="material"
                      value={formData.material}
                      onChange={handleInputChange}
                      placeholder="VD: Vàng 18k"
                    />
                  </div>

                  <div className="form-group">
                    <label>Cân nặng (gram)</label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Danh mục <span className="required">*</span></label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-section">
                <div className="form-section-title">📸 Hình ảnh</div>
                
                <div className="image-upload-area">
                  <input
                    type="file"
                    id="imageInput"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="imageInput" style={{ cursor: 'pointer' }}>
                    <span className="image-upload-icon">🖼️</span>
                    <p>Nhấp để chọn hình ảnh hoặc kéo thả</p>
                    <small>PNG, JPG, GIF tối đa 5MB</small>
                  </label>
                </div>

                {formData.images && formData.images.length > 0 && (
                  <div className="image-preview-grid" style={{ marginTop: '15px' }}>
                    {Array.from(formData.images).map((file, index) => (
                      <div key={index} className="image-preview">
                        <img src={URL.createObjectURL(file)} alt={`preview-${index}`} />
                        <button
                          type="button"
                          className="remove-image"
                          onClick={() => {
                            const newImages = Array.from(formData.images);
                            newImages.splice(index, 1);
                            setFormData({ ...formData, images: newImages });
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;