# THIẾT KẾ KIẾN TRÚC HỆ THỐNG (SYSTEM ARCHITECTURE)
## Website Thương Mại Điện Tử Sản Phẩm Thảo Mộc Thiên Nhiên

---

### 1. Kiến trúc tổng thể (High-Level Architecture)

Hệ thống được thiết kế theo kiến trúc Client - Server tách rời (Decoupled Client-Server Architecture) với mô hình phân lớp chuẩn (Layered Architecture).

```mermaid
flowchart TB
    subgraph CLIENT_TIER["Tầng Client (Trình duyệt Người dùng)"]
        SPA["ReactJS 18 SPA (Vite + Tailwind CSS)\n- Hiển thị Catalog Thảo Mộc\n- Giỏ hàng (Zustand / LocalStorage)\n- Giao diện Đặt hàng & VietQR"]
    end

    subgraph API_TIER["Tầng Ứng dụng Backend (Node.js & Express.js)"]
        direction TB
        MW["Security Middlewares\n(Helmet, CORS, Rate Limit, Zod Validator)"]
        ROUTERS["Express API Routers\n(/api/products, /api/orders, /api/payments, /api/webhooks)"]
        CONTROLLERS["Controllers Layer\n(Request Parsing & HTTP Response)"]
        SERVICES["Services Layer (Business Logic Core)\n- ProductService\n- OrderService\n- PaymentService\n- WebhookService\n- EmailService"]
        MODELS["Models Layer (mysql2/promise Data Access)\n- Prepared Statements & Transactions"]
        
        MW --> ROUTERS --> CONTROLLERS --> SERVICES --> MODELS
    end

    subgraph DATA_TIER["Tầng Cơ sở Dữ liệu (Database Tier)"]
        MYSQL[("MySQL 8.x (InnoDB)\n- Database: herbal_shop\n- Charset: utf8mb4\n- ACID Transactions & Strict Foreign Keys")]
    end

    subgraph EXTERNAL_SERVICES["Dịch vụ Bên ngoài (External Integrations)"]
        SEPAY["SePay Payment Gateway\n- Nhận diện biến động tài khoản ngân hàng\n- Gửi Webhook tự động"]
        VIETQR["VietQR Service (vietqr.app)\n- Sinh ảnh mã QR chuẩn NAPAS"]
        SMTP["SMTP Server (Gmail/Nodemailer)\n- Gửi email thông báo đơn hàng"]
    end

    %% Tương tác
    SPA -- "1. REST API (JSON / HTTPS)" --> MW
    MODELS -- "2. SQL Query / Connection Pool" --> MYSQL
    
    SPA -. "3. Nhúng URL hiển thị ảnh QR" .-> VIETQR
    SEPAY -- "4. POST /api/webhooks/sepay\n(Kèm Header Apikey)" --> MW
    SERVICES -- "5. Kích hoạt gửi email sau khi DB commit" --> SMTP
    SMTP -- "6. Gửi thư thông báo đơn mới" --> SHOP_OWNER[("Chủ Cửa Hàng\n(Nhận email trên Smartphone)")]
```

---

### 2. Trách nhiệm của các thành phần trong hệ thống

#### 2.1. Tầng Client (Frontend - ReactJS)
- **Nhiệm vụ:**
  - Cung cấp trải nghiệm mua sắm mượt mà, thân thiện với người dùng tìm kiếm sản phẩm thảo dược và chăm sóc tự nhiên.
  - Quản lý trạng thái giỏ hàng độc lập tại client thông qua `localStorage` (khách hàng không cần đăng nhập).
  - Thu thập thông tin giao hàng (Họ tên, SĐT, Địa chỉ) và gửi yêu cầu tạo đơn hàng lên Backend.
  - Hiển thị mã thanh toán VietQR động cho khách hàng quét mã trên ứng dụng ngân hàng.
  - Thực hiện kiểm tra định kỳ (Polling với khoảng thời gian hợp lý, ví dụ mỗi 3-5 giây) trạng thái đơn hàng bằng API an toàn.
- **Ràng buộc an toàn:**
  - ⚠️ **Frontend tuyệt đối không có quyền tự quyết định trạng thái thanh toán.**
  - Không gửi số tiền cần thanh toán lên backend để xác nhận; toàn bộ giá sản phẩm và tổng tiền bắt buộc phải do Backend thẩm định và tính toán lại từ cơ sở dữ liệu.

#### 2.2. Tầng Ứng dụng (Backend - Express.js)
- **Nhiệm vụ:**
  - Đóng vai trò là **Nguồn sự thật duy nhất (Single Source of Truth)** cho toàn bộ nghiệp vụ.
  - Kiểm tra và xác thực dữ liệu đầu vào (Zod Schema Validation).
  - Khởi tạo mã đơn hàng duy nhất (`order_code`) và mã token truy cập ngẫu nhiên bí mật (`access_token`) để chống việc đoán mã đơn hàng.
  - Sinh URL ảnh VietQR động với nội dung chuyển khoản đặc thù.
  - Tiếp nhận và xác thực Webhook từ SePay.
  - Quản lý Database Transaction khi đối soát và cập nhật thanh toán.
  - Kích hoạt dịch vụ gửi email thông báo sau khi đơn hàng chuyển sang trạng thái đã thanh toán (`PAID`).
- **Ràng buộc an toàn:**
  - Tất cả các thao tác cập nhật tiền tệ và tồn kho bắt buộc phải nằm trong Database Transaction (`START TRANSACTION ... COMMIT / ROLLBACK`).
  - Webhook chỉ được chấp nhận nếu vượt qua bước kiểm tra API Key (`Authorization: Apikey ...`).

#### 2.3. Tầng Dữ liệu (Database - MySQL 8.x)
- Sử dụng Storage Engine **InnoDB** với hỗ trợ Transaction ACID toàn vẹn.
- Bảng `payment_webhook_events` đóng vai trò chốt chặn chống trùng lặp giao dịch (Idempotency Lock) nhờ chỉ mục `UNIQUE(sepay_transaction_id)`.
- Lưu trữ lịch sử giao dịch thanh toán và đơn hàng rõ ràng, tách biệt giữa trạng thái thanh toán (`payment_status`) và trạng thái xử lý đơn hàng (`order_status`).

#### 2.4. Các Dịch vụ Bên ngoài (External Services)
- **SePay:** Lắng nghe biến động số dư tài khoản ngân hàng của chủ shop qua SMS/App ngân hàng và gửi Webhook theo thời gian thực (Real-time).
- **VietQR:** Cung cấp định dạng ảnh QR chuyển khoản tức thì theo chuẩn ngân hàng Việt Nam.
- **Nodemailer / SMTP:** Chịu trách nhiệm chuyển phát email thông báo đơn hàng kèm đầy đủ chi tiết sản phẩm tới chủ shop.

---

### 3. Sơ đồ tuần tự các luồng xử lý chính (Sequence Diagrams)

#### 3.1. Luồng Đặt hàng và Hiển thị QR Thanh toán

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Khách Hàng
    participant FE as Frontend (ReactJS)
    participant BE as Backend (Express API)
    participant DB as MySQL Database
    participant VQR as Dịch vụ VietQR

    Customer->>FE: Bấm "Đặt hàng" (Gửi kèm giỏ hàng + thông tin nhận hàng)
    FE->>BE: POST /api/orders (items, customer_name, phone, address, note)
    
    Note over BE: 1. Validate Zod Schema<br/>2. Lấy giá từ DB & tính subtotal<br/>3. Kiểm tra tồn kho sản phẩm
    
    BE->>DB: START TRANSACTION
    BE->>DB: INSERT INTO orders (order_code, access_token, total_amount, status='PENDING_PAYMENT')
    BE->>DB: INSERT INTO order_details (order_id, product_id, price, quantity, ...)
    BE->>DB: INSERT INTO payments (order_id, amount, status='PENDING', transfer_content)
    BE->>DB: COMMIT
    
    BE-->>FE: 201 Created { order_code, access_token, total_amount, qr_url, transfer_content }
    FE->>FE: Chuyển hướng sang trang /thanh-toan/:orderCode?token=:accessToken
    FE->>VQR: Tải hình ảnh mã VietQR (theo qr_url nhận từ backend)
    FE-->>Customer: Hiển thị mã QR, Số tiền chính xác, Nội dung chuyển khoản duy nhất
    
    loop Polling kiểm tra trạng thái (mỗi 3 giây)
        FE->>BE: GET /api/payments/:orderCode/status?token=:accessToken
        BE->>DB: SELECT payment_status FROM orders WHERE order_code=? AND access_token=?
        DB-->>BE: Trả về trạng thái hiện tại (PENDING)
        BE-->>FE: { payment_status: 'PENDING' }
    end
```

---

#### 3.2. Luồng Tiếp nhận Webhook SePay, Xác thực & Gửi Email Chủ Cửa Hàng

```mermaid
sequenceDiagram
    autonumber
    actor Bank as Ngân hàng của Khách
    participant SePay as SePay Gateway
    participant BE as Backend Webhook Handler
    participant DB as MySQL Database
    participant Mailer as Nodemailer (Email Service)
    actor Owner as Chủ Cửa Hàng (Phone)

    Customer->>Bank: Quét QR & Thực hiện chuyển khoản
    Bank->>SePay: Biến động số dư tài khoản chủ shop
    SePay->>BE: POST /api/webhooks/sepay (Headers: Authorization: Apikey SECRET_KEY)
    
    Note over BE: BƯỚC 1: XÁC THỰC BẢO MẬT<br/>- Kiểm tra Header Authorization<br/>- Kiểm tra transferType == 'in'<br/>- Kiểm tra accountNumber đúng tài khoản shop
    
    Note over BE: BƯỚC 2: CHỐNG TRÙNG LẶP<br/>- Kiểm tra sepay_transaction_id trong bảng payment_webhook_events
    
    BE->>DB: START TRANSACTION
    BE->>DB: INSERT INTO payment_webhook_events (sepay_transaction_id, ...)
    alt Giao dịch đã tồn tại (Duplicate)
        BE->>DB: ROLLBACK
        BE-->>SePay: 200 OK { success: true, message: 'Already processed' }
    else Giao dịch mới
        Note over BE: BƯỚC 3: ĐỐI SOÁT ĐƠN HÀNG<br/>- Tìm mã đơn trong transfer_content<br/>- So khớp số tiền transferAmount >= order.total_amount
        
        alt Đơn hàng hợp lệ & Đủ tiền
            BE->>DB: UPDATE payments SET status='PAID', sepay_transaction_id=?, paid_at=NOW()
            BE->>DB: UPDATE orders SET payment_status='PAID', order_status='PROCESSING'
            BE->>DB: UPDATE products SET stock_quantity = stock_quantity - quantity
            BE->>DB: COMMIT
            
            BE-->>SePay: 200 OK { success: true }
            
            Note over BE: BƯỚC 4: GỬI THÔNG BÁO CHO CHỦ SHOP<br/>(Chạy sau khi DB Commit thành công)
            BE->>Mailer: sendNewOrderNotification(orderData, paymentData)
            Mailer->>Owner: Gửi email chi tiết đơn hàng đến hộp thư chủ cửa hàng
            BE->>DB: UPDATE orders SET is_admin_notified=TRUE, admin_notified_at=NOW()
            
        else Số tiền không khớp hoặc Không tìm thấy đơn hàng
            BE->>DB: UPDATE payment_webhook_events SET processing_status='NEEDS_MANUAL_CHECK'
            BE->>DB: COMMIT
            BE-->>SePay: 200 OK { success: true, message: 'Flagged for manual review' }
        end
    end
```

---

### 4. 4 Nguyên tắc bảo mật cốt lõi của hệ thống

1. **Frontend không bao giờ được tự xác nhận thanh toán:**
   - Trạng thái `PAID` chỉ được kích hoạt bởi Webhook từ SePay sau khi đi qua chuỗi kiểm tra đa lớp ở Backend.
   - Frontend chỉ gửi request truy vấn trạng thái (Read-only polling) kèm theo `access_token` để biết khi nào cần điều hướng khách hàng sang màn hình thành công.
2. **Backend là nơi duy nhất xử lý và xác nhận giao dịch (Single Source of Truth):**
   - Giá trị đơn hàng, phí vận chuyển, tồn kho được tính toán và khóa lại ngay tại thời điểm tạo đơn trong bảng `orders` và `order_details`.
3. **Webhook bắt buộc phải xác thực nguồn gửi:**
   - Mọi request gửi đến `/api/webhooks/sepay` không có header `Authorization: Apikey <SEPAY_WEBHOOK_API_KEY>` hoặc sai khóa sẽ bị từ chối ngay lập tức bằng mã lỗi `401 Unauthorized`.
4. **Email thông báo chỉ được kích hoạt sau khi dữ liệu được Commit thành công:**
   - Nếu việc ghi dữ liệu vào MySQL gặp sự cố và bị `ROLLBACK`, email tuyệt đối không được phát đi, tránh trường hợp chủ shop nhận được thông báo ảo khi tiền chưa vào tài khoản hoặc dữ liệu đơn bị lỗi.

