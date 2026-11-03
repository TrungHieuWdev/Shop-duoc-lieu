# CẤU TRÚC THƯ MỤC VÀ MODULE BACKEND (BACKEND STRUCTURE)
## Dự án Website Thảo Mộc Thiên Nhiên (Node.js + Express.js + MySQL)

---

### 1. Kiến trúc phân lớp chuẩn (Layered Architecture)

Backend được tổ chức theo mô hình phân tách trách nhiệm chặt chẽ (Separation of Concerns):

```
HTTP Request
     ↓
[Middlewares] (Security, Rate Limit, CORS, Zod Request Validation)
     ↓
[Routes] (Định nghĩa URI & HTTP Method)
     ↓
[Controllers] (Tiếp nhận HTTP Request, trích xuất DTO, gọi Service, trả HTTP Response)
     ↓
[Services] (TRÁI TIM HỆ THỐNG - Xử lý nghiệp vụ, tính toán tiền, kiểm tra tồn kho, Webhook, Email)
     ↓
[Models] (Data Access Layer - Câu lệnh SQL thuần với mysql2/promise, quản lý Transactions)
     ↓
[MySQL Database] (Engine InnoDB)
```

---

### 2. Cây thư mục Backend chi tiết

```text
backend/
├── .env.example                     # Mẫu biến môi trường (Database, SePay, Mail, Port)
├── package.json                     # Quản lý dependencies (express, mysql2, zod, nodemailer...)
└── src/
    ├── app.js                       # Cấu hình Express app, gắn middlewares và routers
    ├── server.js                    # Khởi động server, kiểm tra kết nối DB, lắng nghe cổng PORT
    │
    ├── config/                      # Cấu hình hạ tầng và dịch vụ thứ 3
    │   ├── db.js                    # Khởi tạo mysql2/promise Connection Pool
    │   ├── mailer.js                # Cấu hình transporter Nodemailer (SMTP credentials)
    │   └── sepay.js                 # Cấu hình thông tin tích hợp SePay (Tài khoản nhận, QR format)
    │
    ├── routes/                      # Khai báo các API Endpoints
    │   ├── index.js                 # Gom toàn bộ các routers con gắn vào tiền tố /api
    │   ├── categoryRoutes.js        # GET /api/categories
    │   ├── productRoutes.js         # GET /api/products, GET /api/products/:slug
    │   ├── orderRoutes.js           # POST /api/orders, GET /api/orders/:orderCode
    │   ├── paymentRoutes.js         # POST /api/payments/create, GET /api/payments/:orderCode/status
    │   └── webhookRoutes.js         # POST /api/webhooks/sepay
    │
    ├── controllers/                 # Tiếp nhận request & trả response (KHÔNG chứa logic nghiệp vụ)
    │   ├── categoryController.js    # Điều phối danh mục
    │   ├── productController.js     # Điều phối sản phẩm, tìm kiếm, lọc
    │   ├── orderController.js       # Tiếp nhận tạo đơn, kiểm tra mã đơn
    │   ├── paymentController.js     # Xử lý sinh QR và kiểm tra trạng thái
    │   └── webhookController.js     # Nhận payload từ SePay và phản hồi 200 OK ngay cho SePay
    │
    ├── services/                    # Tầng nghiệp vụ cốt lõi (Business Logic Layer)
    │   ├── categoryService.js       # Nghiệp vụ lấy cây danh mục sản phẩm thảo dược
    │   ├── productService.js        # Tìm kiếm, lọc danh mục, kiểm tra tồn kho, lấy chi tiết
    │   ├── orderService.js          # Tính toán giá từ DB, tạo mã đơn, sinh access token, quản lý đơn
    │   ├── paymentService.js        # Tạo thông tin QR động SePay VietQR, kiểm tra trạng thái
    │   ├── webhookService.js        # Thẩm định Webhook SePay, chống trùng lặp, mở Transaction cập nhật
    │   └── emailService.js          # Soạn thảo template HTML và gửi email thông báo cho chủ shop
    │
    ├── models/                      # Tầng truy xuất dữ liệu (Data Access Object - DAO)
    │   ├── categoryModel.js         # Query bảng `categories`
    │   ├── productModel.js          # Query bảng `products`, `product_images`
    │   ├── orderModel.js            # Query/Insert bảng `orders`, `order_details` (hỗ trợ transaction)
    │   ├── paymentModel.js          # Query/Update bảng `payments`
    │   └── webhookEventModel.js     # Quản lý bảng `payment_webhook_events` (chốt chặn Idempotency)
    │
    ├── middlewares/                 # Các middleware tiền xử lý
    │   ├── validateMiddleware.js    # Middleware generic bọc Zod schema validation
    │   ├── sepayAuthMiddleware.js   # Kiểm tra Header Authorization: Apikey của SePay
    │   ├── rateLimiter.js           # Giới hạn tần suất gọi API (chống spam đơn, chống brute force)
    │   └── errorHandler.js          # Xử lý lỗi tập trung (Global error handler), chuẩn hóa JSON lỗi
    │
    ├── validators/                  # Schema định nghĩa kiểm tra tính hợp lệ dữ liệu (Zod)
    │   ├── orderValidator.js        # Validate payload tạo đơn (SĐT Việt Nam, địa chỉ, mảng items)
    │   ├── productValidator.js      # Validate query params (page, limit, category, sort)
    │   └── webhookValidator.js      # Validate cấu trúc payload SePay Webhook
    │
    └── utils/                       # Các hàm trợ giúp
        ├── generateCode.js          # Hàm sinh mã đơn hàng duy nhất (ví dụ: DH261102A1) & Token ngẫu nhiên
        ├── formatters.js            # Định dạng ngày tháng, tiền tệ trong email
        └── logger.js                # Ghi log có cấu trúc phục vụ debug Webhook và lỗi hệ thống
```

---

### 3. Trách nhiệm của 6 Module Nghiệp Vụ Cốt Lõi (Services Layer)

#### 3.1. `CategoryService`
- Lấy danh sách toàn bộ danh mục hoạt động (`is_active = TRUE`), sắp xếp theo thứ tự hiển thị `sort_order`.

#### 3.2. `ProductService`
- Lấy danh sách sản phẩm theo tiêu chí: từ khóa tìm kiếm (`keyword`), danh mục (`category_id` hoặc `category_slug`), sắp xếp theo giá (`price_asc`, `price_desc`, `newest`), phân trang (`page`, `limit`).
- Lấy chi tiết sản phẩm theo `slug`, kèm theo danh sách hình ảnh từ bảng `product_images`.
- Cung cấp hàm nghiệp vụ: `verifyStockAndGetProducts(items)` để lấy thông tin giá gốc từ database và kiểm tra tồn kho trước khi cho phép đặt hàng.

#### 3.3. `OrderService`
- **Quy tắc quan trọng:** Tuyệt đối không nhận giá tiền từ client gửi lên!
- Nhận danh sách sản phẩm `[{ product_id, quantity }]` và thông tin người nhận:
  1. Gọi `ProductService` truy vấn giá thực tế của từng sản phẩm trong database.
  2. Kiểm tra số lượng tồn kho: nếu `stock_quantity < quantity`, ném lỗi hết hàng.
  3. Tính toán: `subtotal_amount = SUM(price * quantity)`.
  4. Cộng phí vận chuyển `shipping_fee` (cấu hình mặc định hoặc miễn phí nếu đạt giá trị quy định).
  5. Tính tổng thanh toán: `total_amount = subtotal_amount + shipping_fee`.
  6. Sinh mã đơn hàng dạng ngắn gọn, dễ nhớ (VD: `DH` + 6 ký tự số ngẫu nhiên) và mã bí mật `access_token` (UUIDv4 hoặc 32 ký tự hex ngẫu nhiên).
  7. Mở Database Transaction ghi đồng thời vào bảng `orders`, `order_details`, `payments`.
  8. Trả về thông tin đơn hàng cùng thông tin thanh toán cho Controller.

#### 3.4. `PaymentService`
- Khởi tạo thông tin mã VietQR động dựa trên cấu hình ngân hàng của chủ shop:
  - Cú pháp VietQR URL:
    `https://vietqr.app/img?acc=${ACCOUNT}&bank=${BANK}&amount=${AMOUNT}&des=${TRANSFER_CONTENT}&template=compact`
  - Nội dung chuyển khoản duy nhất (`transfer_content`): Cố định tiền tố, ví dụ `DH100234` để SePay nhận diện chính xác.
- Truy vấn trạng thái thanh toán theo `order_code` và `access_token`.

#### 3.5. `WebhookService`
- **Nơi xử lý giao dịch tự động từ SePay:**
  1. Kiểm tra biến động tiền vào (`transferType === 'in'`).
  2. Kiểm tra tài khoản nhận (`accountNumber === process.env.SEPAY_ACCOUNT_NUMBER`).
  3. Lưu vết sự kiện vào bảng `payment_webhook_events`. Nếu `sepay_transaction_id` đã tồn tại, dừng ngay và trả về thành công (chống lặp).
  4. Trích xuất mã đơn hàng từ trường `code` hoặc từ trường `content` của SePay.
  5. Truy vấn đơn hàng trong MySQL kèm khóa bi quan (`SELECT ... FOR UPDATE`).
  6. Đối soát số tiền nhận được:
     - Nếu `transferAmount >= order.total_amount`: Cập nhật `orders.payment_status = 'PAID'`, `orders.order_status = 'PROCESSING'`, `payments.payment_status = 'PAID'`. Trừ tồn kho sản phẩm.
     - Nếu `transferAmount < order.total_amount`: Đánh dấu `payment_webhook_events.processing_status = 'UNDERPAID'` (Cần kiểm tra thủ công), không cập nhật đơn hàng thành `PAID`.
  7. Commit Database Transaction.
  8. Gọi bất đồng bộ `EmailService.sendOrderNotificationToAdmin(order.id)`.

#### 3.6. `EmailService`
- Khởi tạo transporter qua Nodemailer.
- Tạo mẫu email HTML chuyên nghiệp, trình bày trang nhã với tông màu thảo mộc:
  - Tiêu đề: `[ĐƠN HÀNG MỚI ĐÃ THANH TOÁN] - Mã đơn: #DH100234`
  - Thông tin khách hàng & Địa chỉ nhận hàng.
  - Bảng danh sách sản phẩm, số lượng, đơn giá, tổng tiền đã thanh toán qua ngân hàng.
  - Mã tham chiếu giao dịch ngân hàng (`referenceCode`).
- Đảm bảo cơ chế kiểm tra `is_admin_notified === FALSE` trước khi gửi, sau khi gửi thành công cập nhật `is_admin_notified = TRUE`.
- Xử lý lỗi an toàn: Bắt lỗi `try/catch`, nếu gửi mail lỗi thì ghi log vào `admin_notification_error` trong database, không làm gián đoạn trạng thái `PAID` của đơn hàng.

---

### 4. Quy ước chuẩn hóa Response & Error Handling

Toàn bộ các API đều trả về định dạng JSON thống nhất:

#### Thành công:
```json
{
  "success": true,
  "data": { ... },
  "message": "Thao tác thành công"
}
```

#### Thất bại:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dữ liệu gửi lên không hợp lệ",
    "details": [ ... ]
  }
}
```

