# CẤU TRÚC THƯ MỤC FRONTEND (FRONTEND STRUCTURE)
## Dự án Website Thảo Mộc Thiên Nhiên (ReactJS 18 + Vite + Tailwind CSS)

---

### 1. Triết lý thiết kế Frontend
- **Feature-Based & Layered Structure:** Phân chia rõ ràng giữa tầng dùng chung (Shared Components, Utilities, Layouts) và tầng tính năng nghiệp vụ (Features).
- **Zero-Authentication / Guest First:** Không chứa bất kỳ thư mục quản trị (Admin), xác thực tài khoản (Auth/Login/Register) hay thông tin người dùng nội bộ nào.
- **Client State Optimization:** Giỏ hàng và tiến trình mua sắm được quản lý qua Zustand kết hợp tự động lưu `localStorage`.
- **Thiết kế hướng tự nhiên (Natural / Botanical Design):** Chuẩn bị sẵn token màu sắc (Earth tone, Sage Green, Warm Sand, Terracotta) và component trực quan.

---

### 2. Cây thư mục Frontend chi tiết

```text
frontend/
├── .env.example                     # File mẫu biến môi trường Frontend
├── index.html                       # HTML gốc của ứng dụng Single Page Application
├── package.json                     # Quản lý dependencies (React, Vite, Tailwind, Zustand...)
├── postcss.config.js                # Cấu hình PostCSS cho Tailwind CSS
├── tailwind.config.js               # Cấu hình theme màu thảo mộc, font chữ, container
├── vite.config.js                   # Cấu hình build Vite và alias đường dẫn (@/)
└── src/
    ├── main.jsx                     # Điểm khởi chạy React DOM, bọc Router & Global Providers
    ├── App.jsx                      # Component gốc thiết lập Routes và Toaster notification
    ├── index.css                    # CSS toàn cục, Tailwind directives (@tailwind base/components/utilities)
    │
    ├── assets/                      # Tài nguyên tĩnh
    │   ├── images/                  # Ảnh logo thương hiệu, banner thảo mộc, placeholder
    │   └── icons/                   # Custom SVG icons nếu có
    │
    ├── components/                  # Các UI Component dùng chung (Shared / Presentational)
    │   ├── common/                  # Component cơ bản
    │   │   ├── Button.jsx           # Nút bấm chuẩn với các biến thể (primary, secondary, outline)
    │   │   ├── Input.jsx            # Ô nhập liệu chuẩn hóa kèm nhãn và hiển thị lỗi
    │   │   ├── Badge.jsx            # Huy hiệu nhãn (ví dụ: '100% Tự nhiên', 'Thủ công')
    │   │   ├── Spinner.jsx          # Vòng quay loading khi tải dữ liệu
    │   │   └── Modal.jsx            # Cửa sổ thông báo / xác nhận dùng chung
    │   └── feedback/                # Thông báo tương tác
    │       ├── Toast.jsx            # Hiển thị thông báo nhanh (thêm giỏ hàng thành công...)
    │       └── EmptyState.jsx       # Giao diện khi danh sách trống hoặc giỏ hàng rỗng
    │
    ├── layouts/                     # Bố cục giao diện
    │   ├── MainLayout.jsx           # Layout chuẩn bao bọc Header, Main Content và Footer
    │   ├── Header.jsx               # Thanh điều hướng, tìm kiếm nhanh và nút xem giỏ hàng
    │   └── Footer.jsx               # Thông tin chân trang, cam kết chất lượng thảo mộc, liên hệ
    │
    ├── pages/                       # Các màn hình chính (Page views kết nối router)
    │   ├── HomePage.jsx             # Trang chủ: Banner, danh mục nổi bật, sản phẩm tiêu biểu
    │   ├── ProductsPage.jsx         # Trang danh sách sản phẩm: Bộ lọc danh mục, tìm kiếm, sắp xếp
    │   ├── ProductDetailPage.jsx   # Trang chi tiết sản phẩm: Thành phần, công dụng, chọn số lượng
    │   ├── CartPage.jsx             # Trang giỏ hàng: Danh sách món, điều chỉnh số lượng, tạm tính
    │   ├── CheckoutPage.jsx         # Trang nhập thông tin người nhận (Tên, SĐT, Địa chỉ)
    │   ├── PaymentPage.jsx          # Trang quét mã VietQR và kiểm tra trạng thái thanh toán tự động
    │   ├── OrderSuccessPage.jsx     # Trang thông báo đặt hàng và thanh toán thành công
    │   └── NotFoundPage.jsx         # Trang báo lỗi 404 khi sai đường dẫn
    │
    ├── features/                    # Các module tính năng nghiệp vụ cụ thể
    │   ├── products/                # Tính năng sản phẩm
    │   │   ├── components/
    │   │   │   ├── ProductCard.jsx       # Thẻ hiển thị sản phẩm trên danh sách
    │   │   │   ├── ProductGrid.jsx       # Lưới hiển thị danh sách sản phẩm
    │   │   │   ├── ProductFilter.jsx     # Bộ lọc theo danh mục, mức giá
    │   │   │   └── ProductSort.jsx       # Bộ chọn sắp xếp (giá tăng/giảm, mới nhất)
    │   │   └── hooks/
    │   │       ├── useProducts.js        # Hook lấy danh sách sản phẩm kèm filter/phân trang
    │   │       └── useProductDetail.js   # Hook lấy chi tiết 1 sản phẩm theo slug
    │   │
    │   ├── cart/                    # Tính năng giỏ hàng
    │   │   ├── components/
    │   │   │   ├── CartItem.jsx          # Dòng sản phẩm trong giỏ hàng
    │   │   │   └── CartSummary.jsx       # Bảng tổng kết số tiền tạm tính
    │   │   └── hooks/
    │   │       └── useCartActions.js     # Hook bổ trợ xử lý thêm/sửa/xóa sản phẩm
    │   │
    │   ├── checkout/                # Tính năng đặt hàng
    │   │   ├── components/
    │   │   │   ├── CheckoutForm.jsx      # Form thông tin người nhận (Validate dữ liệu)
    │   │   │   └── OrderReview.jsx       # Xem lại giỏ hàng trước khi xác nhận tạo đơn
    │   │   └── hooks/
    │   │       └── useCheckout.js        # Hook xử lý submit tạo đơn hàng
    │   │
    │   └── payment/                 # Tính năng thanh toán QR
    │       ├── components/
    │       │   ├── VietQRCode.jsx        # Hiển thị mã QR và nút lưu ảnh QR
    │       │   ├── BankInfoBox.jsx       # Khung thông tin: STK, Ngân hàng, Nội dung CK kèm nút copy
    │       │   └── PaymentStatusBadge.jsx# Hiển thị trạng thái (Đang chờ / Đã nhận tiền)
    │       └── hooks/
    │           └── usePaymentPolling.js  # Hook định kỳ 3 giây kiểm tra trạng thái đơn hàng
    │
    ├── store/                       # Quản lý State toàn cục (Zustand)
    │   └── useCartStore.js          # Store quản lý giỏ hàng: thêm, bớt, xóa, lưu localStorage
    │
    ├── services/                    # Tầng giao tiếp mạng (API Services với Axios)
    │   ├── api.js                   # Cấu hình Axios instance (baseURL, timeout, error interceptor)
    │   ├── productService.js        # Gọi API danh mục và sản phẩm
    │   ├── orderService.js          # Gọi API tạo đơn hàng, lấy thông tin đơn hàng
    │   └── paymentService.js        # Gọi API tạo mã thanh toán, kiểm tra trạng thái thanh toán
    │
    ├── routes/                      # Cấu hình định tuyến
    │   └── AppRoutes.jsx            # Khai báo các Route chuẩn của React Router DOM
    │
    ├── utils/                       # Các hàm trợ giúp dùng chung
    │   ├── formatCurrency.js        # Định dạng tiền tệ VND (ví dụ: 120.000 ₫)
    │   ├── formatDate.js            # Định dạng ngày giờ hiển thị
    │   ├── storage.js               # Helper an toàn khi đọc/ghi localStorage
    │   └── constants.js             # Hằng số (Phí ship mặc định, trạng thái đơn hàng...)
    │
    └── hooks/                       # Custom hooks dùng chung
        ├── useDebounce.js           # Hoãn thực thi khi người dùng gõ tìm kiếm
        └── useCopyToClipboard.js    # Hỗ trợ copy số tài khoản, mã đơn hàng nhanh
```

---

### 3. Nhiệm vụ của các file và thư mục trọng yếu

#### 3.1. Tầng Store (`src/store/useCartStore.js`)
- **Nhiệm vụ:**
  - Lưu giữ mảng `items`: `[{ id, name, slug, price, quantity, thumbnail_url }]`.
  - Cung cấp các hành động: `addItem(product, qty)`, `removeItem(productId)`, `updateQuantity(productId, qty)`, `clearCart()`.
  - Tự động tính toán tổng số lượng món (`totalItems`) và tổng số tiền hàng tạm tính (`subtotal`).
  - Sử dụng middleware `persist` của Zustand để tự động lưu vào `localStorage` của trình duyệt, dữ liệu không bị mất khi F5 hoặc tắt tab.

#### 3.2. Tầng Services (`src/services/`)
- `api.js`: Thiết lập Axios Client với `VITE_API_BASE_URL` từ file môi trường. Thiết lập timeout 15 giây và bắt lỗi mạng đồng nhất.
- `orderService.js`:
  ```javascript
  // Gửi thông tin giỏ hàng và thông tin khách lên server
  export const createOrder = async (orderPayload) => {
    const response = await api.post('/api/orders', orderPayload);
    return response.data;
  };
  ```
- `paymentService.js`:
  ```javascript
  // Polling trạng thái thanh toán
  export const checkPaymentStatus = async (orderCode, accessToken) => {
    const response = await api.get(`/api/payments/${orderCode}/status`, {
      params: { token: accessToken }
    });
    return response.data;
  };
  ```

#### 3.3. Tầng Hook Polling Thanh toán (`src/features/payment/hooks/usePaymentPolling.js`)
- Tự động kích hoạt khi vào màn hình `PaymentPage`.
- Cứ sau mỗi 3000ms (3 giây), gửi request đến endpoint `/api/payments/:orderCode/status?token=:accessToken`.
- Khi API trả về `payment_status === 'PAID'`, hook sẽ:
  1. Hủy chu kỳ lặp (clear interval).
  2. Xóa sạch giỏ hàng trong `useCartStore.getState().clearCart()`.
  3. Kích hoạt chuyển trang sang `/dat-hang-thanh-cong/:orderCode?token=:accessToken`.

#### 3.4. Tầng Layouts (`src/layouts/`)
- `MainLayout.jsx`: Cố định khung header tự nhiên, thanh thông báo freeship hoặc tiêu chí "Thảo mộc hái thủ công - Không hóa chất bảo quản", phần nội dung cuộn mượt và chân trang minh bạch nguồn gốc thảo mộc.

