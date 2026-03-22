# 📋 Tài Liệu Giỏ Hàng (Shopping Cart)

## 🎯 Tổng Quan

Hệ thống giỏ hàng bao gồm:
- ✅ Thêm sản phẩm vào giỏ hàng
- ✅ Xóa sản phẩm khỏi giỏ hàng  
- ✅ Cập nhật số lượng sản phẩm
- ✅ Xem chi tiết giỏ hàng
- ✅ Xóa toàn bộ giỏ hàng

## 🏗️ Cấu Trúc Mô Hình Cơ Sở Dữ Liệu

### 1. **Bảng `carts`**
```sql
- id (Primary Key)
- user_id (Foreign Key → users)
- created_at
- updated_at
```

### 2. **Bảng `cart_items`**
```sql
- id (Primary Key)
- cart_id (Foreign Key → carts)
- product_id (Foreign Key → products)
- quantity (số lượng)
- created_at
- updated_at
```

---

## 🛠️ Backend API Endpoints

### **Xây dựng:** PHPLaravel | **Xác thực:** Sanctum

Tất cả các endpoint giỏ hàng yêu cầu xác thực (`auth:sanctum`)

---

### **1️⃣ Lấy Giỏ Hàng**
```http
GET /api/cart
```
📍 **Bảo vệ:** ✅ Yes (auth:sanctum)

**Phản Hồi:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "items": [
      {
        "id": 1,
        "cart_id": 1,
        "product_id": 1,
        "quantity": 2,
        "product": {
          "id": 1,
          "name": "Vòng tay vàng",
          "price": 500000,
          "material": "Vàng 18K",
          "weight": 5,
          "images": [...]
        }
      }
    ]
  }
}
```

---

### **2️⃣ Thêm Sản Phẩm Vào Giỏ Hàng**
```http
POST /api/cart/add
Content-Type: application/json

{
  "product_id": 1,
  "quantity": 2
}
```
📍 **Bảo vệ:** ✅ Yes (auth:sanctum)

**Phản Hồi Thành Công:**
```json
{
  "success": true,
  "message": "Product added to cart",
  "data": { ...cart_data }
}
```

**Lỗi - Không Đủ Kho:**
```json
{
  "success": false,
  "message": "Not enough stock available"
}
```

---

### **3️⃣ Cập Nhật Số Lượng Sản Phẩm**
```http
PUT /api/cart/items/{itemId}
Content-Type: application/json

{
  "quantity": 5
}
```
📍 **Bảo vệ:** ✅ Yes (auth:sanctum)

**Phản Hồi:**
```json
{
  "success": true,
  "message": "Cart item updated",
  "data": { ...cart_data }
}
```

---

### **4️⃣ Xóa Sản Phẩm Khỏi Giỏ Hàng**
```http
DELETE /api/cart/items/{itemId}
```
📍 **Bảo vệ:** ✅ Yes (auth:sanctum)

**Phản Hồi:**
```json
{
  "success": true,
  "message": "Product removed from cart",
  "data": { ...cart_data }
}
```

---

### **5️⃣ Xóa Toàn Bộ Giỏ Hàng**
```http
POST /api/cart/clear
```
📍 **Bảo vệ:** ✅ Yes (auth:sanctum)

**Phản Hồi:**
```json
{
  "success": true,
  "message": "Cart cleared",
  "data": { "items": [] }
}
```

---

## 💻 Frontend API Calls (helper.js)

### **Tạo trong `src/utils/helper.js`**

```javascript
// 1. Lấy giỏ hàng
export const getCart = async () => {
  const res = await axios.get(apiUrl("cart"));
  return res.data;
};

// 2. Thêm sản phẩm vào giỏ hàng
export const addToCart = async (data) => {
  const res = await axios.post(apiUrl("cart/add"), data);
  return res.data;
};

// 3. Cập nhật số lượng
export const updateCartItem = async (itemId, quantity) => {
  const res = await axios.put(apiUrl(`cart/items/${itemId}`), { quantity });
  return res.data;
};

// 4. Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (itemId) => {
  const res = await axios.delete(apiUrl(`cart/items/${itemId}`));
  return res.data;
};

// 5. Xóa toàn bộ giỏ hàng
export const clearCart = async () => {
  const res = await axios.post(apiUrl("cart/clear"));
  return res.data;
};
```

---

## 📱 React Component - Cart.jsx

### **Vị Trí:** `src/components/Cart/Cart.jsx`

### **Tính Năng:**
- 📊 Hiển thị danh sách sản phẩm trong giỏ hàng
- ➕➖ Tăng/Giảm số lượng sản phẩm
- 🗑️ Xóa sản phẩm
- 💰 Tính tổng giá tiền
- 🧹 Xóa giỏ hàng

### **Cách Sử Dụng:**
```jsx
import Cart from "./components/Cart/Cart";

// Thêm vào Route
<Route path="/cart" element={<Cart />} />
```

---

## 🔌 Tích Hợp vào Home Page

### **Cập nhật `src/pages/Home/home.jsx`**

```jsx
import { getProducts, addToCart } from "../../utils/helper";

// Thêm handler
const handleAddToCart = async (product) => {
  try {
    const res = await addToCart({
      product_id: product.id,
      quantity: 1
    });
    if (res.success) {
      alert("✓ Đã thêm sản phẩm vào giỏ hàng");
    } else {
      alert("✗ " + (res.message || "Không thể thêm sản phẩm"));
    }
  } catch (err) {
    alert("✗ Lỗi: Vui lòng đăng nhập để thêm sản phẩm");
  }
};

// Gọi trong click button
<button
  className="product-btn"
  onClick={() => handleAddToCart(product)}
>
  THÊM VÀO GIỎ
</button>
```

---

## 🚀 Hướng Dẫn Triển Khai

### **Backend:**

1. **Tạo Models:**
   - `app/Models/Cart.php`
   - `app/Models/CartItem.php`

2. **Tạo Controller:**
   - `app/Http/Controllers/Api/CartsController.php`

3. **Cập nhật Routes:**
   - `routes/api.php` - Thêm cart routes

4. **Chạy Migrations:**
   ```bash
   php artisan migrate
   ```

### **Frontend:**

1. **Cập nhật helper.js:**
   - Thêm 5 hàm API call

2. **Tạo/Cập nhật Component:**
   - `src/components/Cart/Cart.jsx`
   - `src/components/Cart/Cart.css`

3. **Cập nhật Home Page:**
   - `src/pages/Home/home.jsx`

4. **Thêm Route:**
   ```jsx
   import Cart from "./components/Cart/Cart";
   
   <Route path="/cart" element={<Cart />} />
   ```

---

## ⚠️ Lưu Ý

### **Authentication (Xác thực)**
- ✅ Tất cả cart endpoints yêu cầu user đăng nhập
- ✅ Sử dụng token Sanctum tự động qua axios interceptor
- ⚠️ Nếu user chưa đăng nhập, sẽ nhận lỗi 401

### **Stock Validation (Kiểm Tra Kho)**
- ✅ Backend kiểm tra stock trước khi thêm/cập nhật
- ⚠️ Nếu không đủ kho, sẽ reject request

### **Security (Bảo Mật)**
- ✅ Người dùng chỉ có thể truy cập giỏ hàng của mình
- ✅ CSRF protection tự động qua Sanctum
- ✅ CORS được cấu hình

---

## 🧪 Ví Dụ Thực Tế

### **Thêm Sản Phẩm:**
```javascript
const res = await addToCart({
  product_id: 5,
  quantity: 2
});
// Kết quả: Sản phẩm ID=5 với số lượng 2 được thêm vào giỏ
```

### **Cập Nhật Số Lượng:**
```javascript
const res = await updateCartItem(itemId, 5);
// Cập nhật cart item có ID = itemId, số lượng = 5
```

### **Xóa Sản Phẩm:**
```javascript
const res = await removeFromCart(itemId);
// Xóa cart item có ID = itemId
```

---

## 📝 Checklist Triển Khai

- [ ] Tạo Cart model
- [ ] Tạo CartItem model  
- [ ] Tạo CartsController
- [ ] Cập nhật api.php routes
- [ ] Chạy database migrations
- [ ] Thêm cart API functions vào helper.js
- [ ] Tạo Cart component
- [ ] Cập nhật home.jsx với addToCart
- [ ] Thêm Cart route vào router
- [ ] Test thêm sản phẩm
- [ ] Test cập nhật số lượng
- [ ] Test xóa sản phẩm
- [ ] Test authentication
- [ ] Test stock validation

---

## 🆘 Troubleshooting

| Vấn Đề | Giải Pháp |
|--------|----------|
| 401 Unauthorized | Kiểm tra user đăng nhập, token hợp lệ |
| Product not found | Kiểm tra product_id chính xác |
| Not enough stock | Kiểm tra số lượng có sẵn trong kho |
| CSRF token error | Lấy CSRF cookie trước khi request |
| Cart empty | Có thể user chưa thêm sản phẩm nào |

---

**✨ Hoàn Tất! Giỏ hàng đã sẵn sàng sử dụng.**
