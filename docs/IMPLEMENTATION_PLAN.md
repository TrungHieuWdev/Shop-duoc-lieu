# KẾ HOẠCH TRIỂN KHAI DỰ ÁN (IMPLEMENTATION PLAN)
## Lộ Trình Phát Triển Hệ Thống Thương Mại Điện Tử Thảo Mộc Thiên Nhiên

---

### 1. Tổng quan lộ trình triển khai 6 giai đoạn

Dự án được phân kỳ thành 6 giai đoạn rõ ràng, bảo đảm nguyên tắc kiểm thử đến đâu chắc chắn đến đó trước khi tích hợp hệ thống:

```
[Giai đoạn 1: Hạ tầng & Database]
             ↓
[Giai đoạn 2: Backend Core & Catalog API]
             ↓
[Giai đoạn 3: Order Engine, SePay & Email]
             ↓
[Giai đoạn 4: Frontend SPA & Cart]
             ↓
[Giai đoạn 5: Kiểm thử tích hợp E2E]
             ↓
[Giai đoạn 6: Đóng gói & Triển khai thực tế]
```

---

### 2. Chi tiết từng giai đoạn thực hiện

#### Giai đoạn 1: Khởi tạo Môi trường & Cơ sở Dữ liệu (Database Setup)
- **Mục tiêu:** Hoàn thiện môi trường phát triển và cấu trúc dữ liệu MySQL vững chắc.
- **Các đầu việc chính:**
  1. Cài đặt MySQL 8.x trên máy chủ/môi trường phát triển cục bộ.
  2. Thực thi file `database/schema.sql` để tạo cơ sở dữ liệu `herbal_shop` và 7 bảng dữ liệu.
  3. Thực thi file `database/seed.sql` để nạp danh mục và 8 sản phẩm thảo mộc mẫu.
  4. Kiểm tra các ràng buộc Foreign Key, Unique Indexes và hiệu năng câu lệnh SELECT cơ bản.
- **Tiêu chí nghiệm thu (DoD):**
  - Database khởi tạo thành công không có lỗi syntax.
  - Các bảng có đầy đủ quan hệ và dữ liệu mẫu hiển thị chính xác bảng mã `utf8mb4`.

---

#### Giai đoạn 2: Phát triển Backend Core & API Catalog Sản phẩm
- **Mục tiêu:** Xây dựng khung ứng dụng Express.js và các API đọc dữ liệu sản phẩm, danh mục.
- **Các đầu việc chính:**
  1. Khởi tạo `backend/package.json`, cài đặt các thư viện: `express`, `mysql2`, `dotenv`, `cors`, `helmet`, `express-rate-limit`, `zod`, `nodemailer`.
  2. Tạo module `config/db.js` với MySQL Connection Pool (`mysql2/promise`).
  3. Cấu hình middleware bảo mật: Helmet, CORS whitelist, Rate limiter, Error handler tập trung.
  4. Xây dựng tầng Model: `categoryModel.js`, `productModel.js`.
  5. Xây dựng tầng Service: `categoryService.js`, `productService.js`.
  6. Xây dựng tầng Controller và Router:
     - `GET /api/categories`
     - `GET /api/products` (Hỗ trợ keyword, filter category, sort, phân trang)
     - `GET /api/products/:slug`
  7. Viết Zod validator cho query params.
- **Tiêu chí nghiệm thu (DoD):**
  - Các API trả về JSON chuẩn hóa theo đúng tài liệu `API_SPECIFICATION.md`.
  - Phân trang, sắp xếp giá và tìm kiếm hoạt động chính xác.

---

#### Giai đoạn 3: Xử lý Đơn hàng, Tích hợp SePay Webhook & Email Service
- **Mục tiêu:** Hoàn thiện toàn bộ logic nghiệp vụ then chốt về tiền tệ và giao dịch.
- **Các đầu việc chính:**
  1. Xây dựng `orderService.js`:
     - Nhận payload giỏ hàng từ client.
     - Lấy giá gốc từ DB, kiểm tra số lượng tồn kho.
     - Tính tổng tiền và sinh mã đơn hàng `DHxxxxxx`, mã bảo mật `access_token`.
     - Sử dụng Transaction ghi vào `orders`, `order_details`, `payments`.
  2. Xây dựng `paymentService.js`:
     - Tạo link ảnh mã VietQR động theo chuẩn VietQR/SePay:
       `https://vietqr.app/img?acc=...&bank=...&amount=...&des=...&template=compact`
     - Endpoint kiểm tra trạng thái thanh toán `GET /api/payments/:orderCode/status?token=...`.
  3. Xây dựng `webhookService.js`:
     - Middleware xác thực header `Authorization: Apikey <KEY>`.
     - Chống trùng lặp giao dịch (Idempotency) dựa trên `payment_webhook_events.sepay_transaction_id`.
     - Mở Transaction đối soát số tiền nhận được và cập nhật đơn hàng thành `PAID`.
     - Trừ tồn kho sản phẩm tương ứng.
  4. Xây dựng `emailService.js`:
     - Cấu hình SMTP qua Nodemailer (Gmail App Password).
     - Soạn template HTML chi tiết đơn hàng cho chủ shop.
     - Gọi gửi mail sau khi DB commit; ghi log `admin_notification_error` nếu gặp sự cố mạng.
- **Tiêu chí nghiệm thu (DoD):**
  - Đơn hàng tính đúng tiền, không bị client thao túng giá.
  - Webhook SePay phản hồi `< 1 giây` với HTTP 200 `{ "success": true }`.
  - Email chỉ gửi 1 lần duy nhất cho mỗi đơn hàng đã thanh toán thành công.

---

#### Giai đoạn 4: Phát triển Giao diện Khách hàng (Frontend SPA)
- **Mục tiêu:** Xây dựng giao diện mua sắm mượt mà với ReactJS 18, Vite và Tailwind CSS theo phong cách thiên nhiên (Earthy / Natural).
- **Các đầu việc chính:**
  1. Khởi tạo `frontend/package.json` với Vite, Tailwind CSS, Lucide React, Axios, React Router DOM, Zustand.
  2. Cấu hình bảng màu thảo mộc trong `tailwind.config.js` (xanh sage `#1a382b`, be ấm `#faf9f6`, đất nung `#c87d55`).
  3. Xây dựng `useCartStore.js` với Zustand + `localStorage` persistence.
  4. Xây dựng Layout: `Header.jsx` (thanh điều hướng, giỏ hàng), `Footer.jsx` (cam kết thảo dược sạch).
  5. Phát triển các màn hình:
     - `HomePage.jsx`: Banner mộc mạc, danh mục nổi bật, sản phẩm bán chạy.
     - `ProductsPage.jsx`: Lưới sản phẩm, bộ lọc danh mục, tìm kiếm, sắp xếp.
     - `ProductDetailPage.jsx`: Thông tin thành phần, cách dùng xông/tắm, chọn số lượng mua.
     - `CartPage.jsx`: Xem giỏ, tăng giảm số lượng, xem tạm tính.
     - `CheckoutPage.jsx`: Form người nhận (Tên, SĐT, Địa chỉ) kèm kiểm tra định dạng dữ liệu.
     - `PaymentPage.jsx`: Hiển thị mã VietQR động, số tiền, nội dung chuyển khoản, nút copy số tài khoản, hook tự động Polling mỗi 3 giây.
     - `OrderSuccessPage.jsx`: Thông báo thanh toán thành công, hiển thị tóm tắt đơn hàng.
- **Tiêu chí nghiệm thu (DoD):**
  - Giao diện đáp ứng mượt mà trên cả Mobile và Desktop.
  - Giỏ hàng lưu trữ bền vững trong trình duyệt.
  - Khi khách thanh toán trên điện thoại, màn hình máy tính tự động nhảy sang trang Thành công sau vài giây mà không cần bấm F5.

---

#### Giai đoạn 5: Kiểm thử Tích hợp Đầu-Cuối (End-to-End Testing)
- **Mục tiêu:** Kiểm thử thực tế các luồng mua hàng và xử lý trường hợp lỗi biên.
- **Kịch bản kiểm thử (Test Scenarios):**
  1. **Happy Path:** Khách chọn 2 sản phẩm → Đặt hàng → Quét mã QR chuyển khoản đúng số tiền → Backend nhận webhook SePay → Cập nhật `PAID` → Frontend tự nhảy sang Đặt hàng thành công → Chủ shop nhận email thông báo đầy đủ chi tiết.
  2. **Chống trùng lặp (Idempotency Test):** Bắn lại cùng 1 webhook SePay 3 lần liên tiếp → Backend chỉ cập nhật 1 lần, chỉ trừ kho 1 lần, chỉ gửi 1 email duy nhất.
  3. **Khách chuyển thiếu tiền:** Giả lập webhook gửi số tiền nhỏ hơn giá trị đơn → Hệ thống chuyển trạng thái `UNDERPAID`, không cập nhật đơn thành `PAID`, không gửi mail cho chủ shop.
  4. **Khách đặt nhiều đơn cùng lúc:** Giả lập đặt đồng thời sản phẩm chỉ còn 1 cái trong kho → 1 đơn thành công, đơn thứ hai nhận thông báo hết hàng (`409 Conflict`).
  5. **Mất kết nối SMTP:** Tắt mạng email → Đơn hàng vẫn được đánh dấu `PAID`, không làm khách hàng bị kẹt màn hình thanh toán.

---

#### Giai đoạn 6: Đóng gói & Sẵn sàng Triển khai Thực tế (Production Readiness)
- **Mục tiêu:** Đưa hệ thống lên môi trường Internet ổn định, an toàn và dễ vận hành.
- **Các đầu việc chính:**
  1. Build Frontend thành các file tĩnh (`dist`) tối ưu dung lượng.
  2. Cấu hình biến môi trường production (`.env`).
  3. Cài đặt SSL/HTTPS (Let's Encrypt) cho domain (bắt buộc đối với Webhook SePay).
  4. Cấu hình Webhook URL chính thức trên Dashboard SePay: `https://yourdomain.com/api/webhooks/sepay`.
  5. Thiết lập tiến trình chạy nền Backend bằng PM2 (`pm2 start src/server.js --name herbal-backend`).
  6. Thiết lập sao lưu định kỳ (cron backup) cho Database MySQL.

---

### 3. Ma trận Phân bổ Rủi ro và Giải pháp

| Rủi ro kỹ thuật | Mức độ ảnh hưởng | Giải pháp kiểm soát |
| :--- | :---: | :--- |
| **Mạng SePay Webhook bị trễ hoặc rớt gói tin** | Trung bình | Frontend hỗ trợ nút *"Tôi đã chuyển khoản"* hoặc cơ chế Polling chờ tối đa 10 phút trước khi hiển thị hướng dẫn liên hệ hotline. |
| **Khách hàng chuyển khoản quên ghi mã đơn** | Thấp | Dữ liệu giao dịch vẫn được lưu trong `payment_webhook_events` ở trạng thái `UNMATCHED`. Chủ shop có thể đối chiếu sao kê tài khoản ngân hàng và cập nhật đơn thủ công. |
| **Sự cố gửi Email SMTP Gmail bị khóa App Password** | Trung bình | Toàn bộ thông tin đơn hàng đã lưu an toàn trong MySQL. Lỗi gửi mail được ghi nhận vào `admin_notification_error` để chủ shop có thể xem lại hoặc gửi lại. |
| **Khách hàng thao túng giá từ trình duyệt** | Cao | Backend hoàn toàn bỏ qua giá gửi từ client, chỉ lấy giá niêm yết từ bảng `products` trong database. |

