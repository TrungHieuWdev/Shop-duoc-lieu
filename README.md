# Ngân Hà Shop (`NganHashop`)

Hệ thống thương mại điện tử bán lẻ thảo dược bản địa phơi khô (bài thuốc xông tắm 7 vị & dược liệu lẻ). Kiến trúc tách biệt Frontend SPA và Backend REST API, tích hợp thanh toán chuyển khoản VietQR (SePay Webhook) và thông báo đơn hàng qua SMTP.
# Demo
https://nganhashop.pages.dev/
---

## Tech Stack

| Layer | Công nghệ | Chi tiết |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite 5, Tailwind CSS 3.4 | SPA, code-splitting theo route, Zustand 5 state management |
| **Backend** | Node.js (ESM), Express 4 | REST API, `helmet`, `express-rate-limit`, `zod` validation |
| **Database** | MySQL 8 (`mysql2/promise`) | Connection pool, transaction cho đơn hàng & đối soát thanh toán |
| **Payment** | VietQR + SePay Webhook | Tạo mã QR động theo mã đơn, tự động gạch nợ qua webhook |
| **Mail** | Nodemailer (Gmail SMTP) | Gửi phiếu đóng gói đơn hàng kèm cơ chế chống trùng lặp (idempotency lock 60s) |

---

## Cấu trúc thư mục

```text
NganHashop/
├── frontend/                   # React 18 + Vite client (port 5173)
│   ├── public/                 # Static assets (images, favicon)
│   └── src/
│       ├── components/         # UI dùng chung (ErrorBoundary, NetworkBanner, ScrollToTop)
│       ├── features/           # Module theo domain (products/ProductCard)
│       ├── layouts/            # MainLayout, Header, Footer
│       ├── pages/              # Các trang chính + lazy-loaded checkout/admin routes
│       ├── routes/             # Định tuyến tập trung (AppRoutes)
│       ├── services/           # Axios client & API wrappers
│       ├── store/              # Zustand stores (useCartStore, useAdminStore, useAuthStore)
│       └── utils/              # Format tiền tệ, VietQR builder, hiệu ứng giỏ hàng, gửi thông báo
├── backend/                    # Express REST API server (port 5000)
│   └── src/
│       ├── config/             # Kết nối MySQL pool, biến môi trường, SePay config
│       ├── controllers/        # Xử lý request cho Product, Category, Order, Webhook
│       ├── middlewares/        # Auth guard, error handler, rate limiter, validator
│       ├── models/             # Truy vấn SQL (Product, Category, Order, PaymentTransaction)
│       ├── routes/             # Khai báo endpoint (/api/v1/...)
│       └── services/           # Business logic (order, payment, sepay, emailService)
├── database/                   # SQL khởi tạo bảng và dữ liệu mẫu
│   ├── schema.sql
│   └── seed.sql
└── docs/                       # Tài liệu thiết kế DB, API spec và luồng thanh toán
```

---

## Cài đặt & Chạy môi trường Local

### Yêu cầu hệ thống
- **Node.js** >= 20.x
- **MySQL** >= 8.0 (tùy chọn nếu chạy đầy đủ Backend DB; Frontend có sẵn dữ liệu fallback trên `localStorage` để chạy độc lập)

### 1. Khởi tạo Database
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p herbal_shop < database/seed.sql
```

### 2. Chạy Backend (`port 5000`)
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Các biến môi trường quan trọng trong `backend/.env`:
```ini
PORT=5000
CORS_ORIGIN=http://localhost:5173

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=herbal_shop

# SMTP gửi thông báo đơn hàng về Gmail chủ shop
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_char_gmail_app_password
STORE_OWNER_EMAIL=owner_email@gmail.com

# SePay Webhook & VietQR
SEPAY_WEBHOOK_API_KEY=your_webhook_secret
SEPAY_BANK_CODE=MB
SEPAY_ACCOUNT_NUMBER=0983124567
SEPAY_ACCOUNT_NAME=TIEM THAO MOC NGAN HA
```

### 3. Chạy Frontend (`port 5173`)
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Build bản production:
```bash
cd frontend
npm run build
npm run preview
```

---

## Luồng nghiệp vụ chính

### 1. Đặt hàng & Thanh toán
- Khách thêm sản phẩm vào giỏ (`useCartStore` đồng bộ `localStorage` dưới key `nganha_herbal_cart`).
- Tại trang `/dat-hang`, hệ thống kiểm tra tồn kho và hỗ trợ 2 phương thức:
  - **COD (`COD`)**: Tạo đơn ở trạng thái `PENDING`, chuyển thẳng tới `/dat-hang-thanh-cong/:orderCode`.
  - **Chuyển khoản VietQR (`BANK_TRANSFER`)**: Tạo mã QR động (`img.vietqr.io`) gắn sẵn số tiền và nội dung chuyển khoản chứa mã đơn (`NH...`).
- Khi SePay bắn webhook về `POST /api/v1/webhooks/sepay`, Backend đối chiếu số tiền + mã đơn trong giao dịch, cập nhật `payment_status = PAID` và `order_status = CONFIRMED`.

### 2. Thông báo đơn hàng qua Email (`emailService.js`)
- Mỗi khi phát sinh đơn hàng mới, hệ thống gửi email HTML thông báo đơn hàng về địa chỉ cấu hình tại `STORE_OWNER_EMAIL` (hoặc email cài đặt trong trang Admin).
- Cơ chế chống gửi trùng (`recentSentOrderEmails` Map với TTL 60 giây tại Backend kết hợp `notifiedOrderCodes` tại Frontend) đảm bảo mỗi mã đơn chỉ gửi đúng 1 email duy nhất.
- Hỗ trợ hiển thị trực tiếp trong hộp thư đến kể cả khi `SMTP_USER` và `STORE_OWNER_EMAIL` dùng chung một tài khoản Gmail.

### 3. Quản trị nội bộ (`/admin`)
- Chức năng:
  - Quản lý danh mục dược liệu, giá bán, quy cách đóng gói.
  - Tạo phiếu kiểm kho (`KK...`), cân bằng tồn kho tự động và theo dõi lịch sử chênh lệch.
  - Quản lý trạng thái đơn hàng (`PENDING` -> `CONFIRMED` -> `SHIPPING` -> `COMPLETED` / `CANCELLED`).
  - Cấu hình tài khoản nhận tiền VietQR, ngưỡng miễn phí vận chuyển và email nhận thông báo đơn.

---

## API Endpoints chính

| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| `GET` | `/api/v1/products` | Danh sách sản phẩm (hỗ trợ lọc theo category, keyword) |
| `GET` | `/api/v1/products/:slug` | Chi tiết sản phẩm theo slug |
| `POST` | `/api/v1/orders` | Tạo đơn hàng mới + kích hoạt gửi email thông báo |
| `POST` | `/api/v1/orders/notify-email` | Gửi email thông báo đơn hàng từ trình duyệt về SMTP |
| `GET` | `/api/v1/orders/:orderCode/payment-status` | Kiểm tra trạng thái thanh toán của đơn hàng (polling) |
| `POST` | `/api/v1/webhooks/sepay` | Nhận dữ liệu giao dịch ngân hàng real-time từ SePay |

