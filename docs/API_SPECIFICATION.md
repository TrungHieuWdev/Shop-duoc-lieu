# ĐẶC TẢ KỸ THUẬT REST API (API SPECIFICATION)
## Hệ Thống Thương Mại Điện Tử Sản Phẩm Thảo Mộc Thiên Nhiên

---

### 1. Nguyên tắc thiết kế chung

1. **Chuẩn kiến trúc RESTful:**
   - Sử dụng các HTTP Method chuẩn: `GET` (đọc dữ liệu), `POST` (tạo mới tài nguyên hoặc kích hoạt tác vụ).
   - Định dạng trao đổi dữ liệu: `application/json` (Encoding: `UTF-8`).
2. **Cấu trúc Response chuẩn hóa:**
   - **Thành công (2xx):**
     ```json
     {
       "success": true,
       "data": { ... },
       "message": "Thông điệp thành công (nếu cần)"
     }
     ```
   - **Lỗi (4xx, 5xx):**
     ```json
     {
       "success": false,
       "error": {
         "code": "TÊN_MÃ_LỖI",
         "message": "Thông báo thân thiện với người dùng",
         "details": [] 
       }
     }
     ```
3. **Bảo mật truy cập thông tin đơn hàng:**
   - Vì hệ thống không bắt buộc đăng nhập (Guest Checkout), để bảo vệ sự riêng tư của khách hàng, mọi API đọc trạng thái hoặc xem chi tiết đơn hàng (`GET /api/payments/:orderCode/status`, `GET /api/orders/:orderCode`) **bắt buộc** phải truyền kèm query param `token=<access_token>`. Nếu token không khớp với bản ghi trong Database, trả về `403 Forbidden` hoặc `404 Not Found`.

---

### 2. Danh mục các API Endpoints

| STT | Phương thức | Đường dẫn Endpoint | Mục đích | Quyền truy cập |
| :---: | :---: | :--- | :--- | :--- |
| 1 | `GET` | `/api/categories` | Lấy danh sách danh mục thảo mộc đang hoạt động | Công khai |
| 2 | `GET` | `/api/products` | Lấy danh sách sản phẩm (tìm kiếm, lọc, phân trang) | Công khai |
| 3 | `GET` | `/api/products/:slug` | Lấy thông tin chi tiết một sản phẩm theo slug | Công khai |
| 4 | `POST` | `/api/orders` | Khởi tạo đơn hàng mới và tính toán giá trị | Khách mua hàng |
| 5 | `POST` | `/api/payments/create` | Tạo hoặc lấy lại thông tin mã VietQR chuyển khoản | Khách mua hàng |
| 6 | `GET` | `/api/payments/:orderCode/status` | Polling kiểm tra trạng thái thanh toán đơn hàng | Khách mua hàng (Kèm token) |
| 7 | `GET` | `/api/orders/:orderCode` | Lấy chi tiết đơn hàng hiển thị trang Đặt hàng thành công | Khách mua hàng (Kèm token) |
| 8 | `POST` | `/api/webhooks/sepay` | Tiếp nhận và đối soát thanh toán tự động từ SePay | SePay Server (Kèm API Key) |

---

### 3. Chi tiết từng API Endpoint

#### 3.1. `GET /api/categories`
- **Mục đích:** Lấy toàn bộ danh mục sản phẩm đang mở bán (`is_active = TRUE`), sắp xếp theo `sort_order`.
- **Query Parameters:** Không có.
- **Request Body:** Không có.
- **HTTP Status:** `200 OK`.
- **Response thành công:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "name": "Thảo Mộc Xông Tắm",
        "slug": "thao-moc-xong-tam",
        "description": "Các loại thảo mộc khô dùng để xông hơi, nấu nước tắm thư giãn...",
        "sort_order": 1
      },
      {
        "id": 2,
        "name": "Muối Ngâm Chân Dược Liệu",
        "slug": "muoi-ngam-chan-duoc-lieu",
        "description": "Muối khoáng kết hợp thảo mộc sấy lạnh giúp thư giãn đôi bàn chân...",
        "sort_order": 2
      }
    ]
  }
  ```

---

#### 3.2. `GET /api/products`
- **Mục đích:** Tìm kiếm, phân loại và phân trang danh sách sản phẩm thảo mộc.
- **Query Parameters:**
  - `keyword` *(string, optional)*: Từ khóa tìm kiếm theo tên sản phẩm.
  - `category_slug` *(string, optional)*: Lọc theo đường dẫn danh mục.
  - `sort` *(string, optional)*: `newest` (mới nhất - mặc định), `price_asc` (giá tăng dần), `price_desc` (giá giảm dần).
  - `page` *(number, optional, default: 1)*: Trang hiện tại.
  - `limit` *(number, optional, default: 12)*: Số sản phẩm trên mỗi trang.
- **HTTP Status:** `200 OK`.
- **Response thành công:**
  ```json
  {
    "success": true,
    "data": {
      "items": [
        {
          "id": 1,
          "name": "Túi Thảo Mộc Tắm Sau Sinh Cổ Truyền (10 túi lọc)",
          "slug": "tui-thao-moc-tam-sau-sinh-co-truyen-10-tui-loc",
          "sku": "TM-TAMSINH-10",
          "summary": "Công thức thảo mộc vùng cao giúp làm ấm cơ thể...",
          "price": 185000,
          "original_price": 220000,
          "unit": "Hộp 10 túi lọc",
          "stock_quantity": 50,
          "is_featured": true,
          "thumbnail_url": "/images/products/tam-sau-sinh-thumb.jpg",
          "category": {
            "id": 1,
            "name": "Thảo Mộc Xông Tắm",
            "slug": "thao-moc-xong-tam"
          }
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 12,
        "total_items": 8,
        "total_pages": 1
      }
    }
  }
  ```

---

#### 3.3. `GET /api/products/:slug`
- **Mục đích:** Lấy thông tin chi tiết một sản phẩm theo slug để hiển thị trang ProductDetail.
- **URL Parameters:** `slug` (string, required).
- **HTTP Status:** `200 OK` (Thành công), `404 Not Found` (Không tìm thấy).
- **Response thành công:**
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "name": "Túi Thảo Mộc Tắm Sau Sinh Cổ Truyền (10 túi lọc)",
      "slug": "tui-thao-moc-tam-sau-sinh-co-truyen-10-tui-loc",
      "sku": "TM-TAMSINH-10",
      "summary": "Công thức thảo mộc vùng cao giúp làm ấm cơ thể...",
      "description": "Sản phẩm được thu hái từ các loại thảo dược bản địa sấy khô tự nhiên...",
      "usage_instructions": "Cho 1 túi lọc vào nồi chứa 3-5 lít nước sôi...",
      "ingredients": "Lá bưởi, sả chanh, hương nhu tía, ngải cứu, gừng gió, kinh giới...",
      "price": 185000,
      "original_price": 220000,
      "stock_quantity": 50,
      "unit": "Hộp 10 túi lọc",
      "category": {
        "id": 1,
        "name": "Thảo Mộc Xông Tắm",
        "slug": "thao-moc-xong-tam"
      },
      "images": [
        {
          "id": 1,
          "image_url": "/images/products/tam-sau-sinh-thumb.jpg",
          "alt_text": "Hộp thảo mộc xông tắm sau sinh",
          "is_thumbnail": true
        },
        {
          "id": 2,
          "image_url": "/images/products/tam-sau-sinh-detail.jpg",
          "alt_text": "Túi lọc thảo mộc sấy khô nguyên chất",
          "is_thumbnail": false
        }
      ]
    }
  }
  ```

---

#### 3.4. `POST /api/orders`
- **Mục đích:** Đặt hàng không cần tài khoản (Guest Checkout).
- **Nguyên tắc an toàn:**
  - Client chỉ gửi `product_id` và `quantity`. **Backend tự query giá niêm yết từ DB**, kiểm tra tồn kho và tự tính tổng số tiền.
  - Phí vận chuyển được Backend tính tự động theo chính sách cấu hình (ví dụ: mặc định 30.000đ, miễn phí nếu đơn >= 350.000đ).
- **Request Body (JSON):**
  ```json
  {
    "customer_name": "Nguyễn Thị Hoa",
    "customer_phone": "0987654321",
    "customer_email": "hoa.nguyen@gmail.com",
    "customer_address": "Số 45 Ngõ 12 Đường Cây Trâm, Phường 8, Gò Vấp, TP.HCM",
    "customer_note": "Giao hàng giờ hành chính giúp mình",
    "items": [
      {
        "product_id": 1,
        "quantity": 2
      },
      {
        "product_id": 3,
        "quantity": 1
      }
    ]
  }
  ```
- **HTTP Status:** `201 Created` (Thành công), `400 Bad Request` (Dữ liệu không hợp lệ), `409 Conflict` (Sản phẩm hết hàng hoặc tồn kho không đủ).
- **Response thành công:**
  ```json
  {
    "success": true,
    "data": {
      "order_code": "DH100234",
      "access_token": "a4f89d34b8c9472e9123847acdf981e2",
      "subtotal_amount": 490000,
      "shipping_fee": 0,
      "total_amount": 490000,
      "payment": {
        "payment_method": "BANK_TRANSFER_QR",
        "payment_status": "PENDING",
        "amount": 490000,
        "transfer_content": "DH100234",
        "bank_name": "Vietcombank",
        "bank_account": "1017588888",
        "account_name": "TIEM THAO MOC NGAN HA",
        "qr_code_url": "https://vietqr.app/img?acc=1017588888&bank=Vietcombank&amount=490000&des=DH100234&template=compact"
      }
    },
    "message": "Đơn hàng đã được khởi tạo thành công"
  }
  ```

---

#### 3.5. `POST /api/payments/create`
- **Mục đích:** Lấy lại thông tin mã QR chuyển khoản khi khách hàng truy cập lại trang thanh toán hoặc tải lại trang.
- **Request Body:**
  ```json
  {
    "order_code": "DH100234",
    "access_token": "a4f89d34b8c9472e9123847acdf981e2"
  }
  ```
- **HTTP Status:** `200 OK`, `403 Forbidden` (Sai token), `404 Not Found`.
- **Response thành công:**
  ```json
  {
    "success": true,
    "data": {
      "order_code": "DH100234",
      "amount": 490000,
      "transfer_content": "DH100234",
      "bank_name": "Vietcombank",
      "bank_account": "1017588888",
      "account_name": "TIEM THAO MOC NGAN HA",
      "qr_code_url": "https://vietqr.app/img?acc=1017588888&bank=Vietcombank&amount=490000&des=DH100234&template=compact",
      "payment_status": "PENDING"
    }
  }
  ```

---

#### 3.6. `GET /api/payments/:orderCode/status`
- **Mục đích:** Frontend gọi định kỳ (Polling mỗi 3 giây) để kiểm tra trạng thái thanh toán của đơn hàng.
- **URL Parameters:** `orderCode` (string, required).
- **Query Parameters:** `token` (string, required - chính là `access_token`).
- **HTTP Status:** `200 OK`, `403 Forbidden` (Token không hợp lệ), `404 Not Found`.
- **Response thành công (Khi đang chờ chuyển khoản):**
  ```json
  {
    "success": true,
    "data": {
      "order_code": "DH100234",
      "payment_status": "PENDING",
      "order_status": "PENDING_PAYMENT",
      "paid_at": null
    }
  }
  ```
- **Response thành công (Sau khi SePay Webhook đã xác nhận tiền vào):**
  ```json
  {
    "success": true,
    "data": {
      "order_code": "DH100234",
      "payment_status": "PAID",
      "order_status": "PROCESSING",
      "paid_at": "2026-11-02T16:45:10.000Z"
    }
  }
  ```

---

#### 3.7. `GET /api/orders/:orderCode`
- **Mục đích:** Xem đầy đủ thông tin đơn hàng trên trang Hoàn tất đơn hàng (`OrderSuccessPage`).
- **URL Parameters:** `orderCode` (string, required).
- **Query Parameters:** `token` (string, required - chính là `access_token`).
- **HTTP Status:** `200 OK`, `403 Forbidden`, `404 Not Found`.
- **Response thành công:**
  ```json
  {
    "success": true,
    "data": {
      "order_code": "DH100234",
      "customer_name": "Nguyễn Thị Hoa",
      "customer_phone": "0987654321",
      "customer_email": "hoa.nguyen@gmail.com",
      "customer_address": "Số 45 Ngõ 12 Đường Cây Trâm, Phường 8, Gò Vấp, TP.HCM",
      "customer_note": "Giao hàng giờ hành chính giúp mình",
      "subtotal_amount": 490000,
      "shipping_fee": 0,
      "total_amount": 490000,
      "payment_status": "PAID",
      "order_status": "PROCESSING",
      "created_at": "2026-11-02T16:40:00.000Z",
      "items": [
        {
          "product_name": "Túi Thảo Mộc Tắm Sau Sinh Cổ Truyền (10 túi lọc)",
          "product_sku": "TM-TAMSINH-10",
          "unit_price": 185000,
          "quantity": 2,
          "line_total": 370000
        },
        {
          "product_name": "Muối Khoáng Ngâm Chân Thảo Mộc Hoa Hồi & Quế Chi (500g)",
          "product_sku": "NC-HOI-QUE-500",
          "unit_price": 120000,
          "quantity": 1,
          "line_total": 120000
        }
      ]
    }
  }
  ```

---

#### 3.8. `POST /api/webhooks/sepay`
- **Mục đích:** Tiếp nhận thông báo biến động số dư tài khoản ngân hàng từ cổng SePay khi khách quét QR thanh toán.
- **Quyền & Xác thực bắt buộc:**
  - Request Headers phải chứa:
    ```http
    Authorization: Apikey <SEPAY_WEBHOOK_API_KEY>
    Content-Type: application/json
    ```
- **SePay Request Body (Chuẩn chính thức SePay):**
  ```json
  {
    "id": 92704,
    "gateway": "Vietcombank",
    "transactionDate": "2026-11-02 23:45:10",
    "accountNumber": "1017588888",
    "subAccount": "",
    "code": "DH100234",
    "content": "DH100234 chuyen tien mua thao moc",
    "transferType": "in",
    "description": "NGUYEN THI HOA chuyen tien",
    "transferAmount": 490000,
    "accumulated": 105490000,
    "referenceCode": "FT261102987123"
  }
  ```
- **Quy trình xử lý tại Backend:**
  1. Kiểm tra header `Authorization`. Nếu không khớp, trả về `401 Unauthorized` ngay.
  2. Bỏ qua nếu `transferType !== 'in'` (trả về 200 `{ "success": true, "message": "Ignored outgoing transfer" }`).
  3. Kiểm tra số tài khoản nhận `accountNumber === process.env.SEPAY_ACCOUNT_NUMBER`.
  4. Kiểm tra `id` (SePay Transaction ID) trong bảng `payment_webhook_events`. Nếu đã tồn tại, trả về ngay:
     ```json
     { "success": true, "message": "Transaction already processed" }
     ```
  5. Mở Database Transaction:
     - Thêm bản ghi mới vào `payment_webhook_events`.
     - Tìm kiếm mã đơn hàng trong `code` hoặc dùng Regular Expression trích xuất mã đơn từ `content`.
     - Tìm bản ghi `orders` và `payments` tương ứng.
     - So khớp số tiền: nếu `transferAmount >= order.total_amount`:
       - Cập nhật `payments.payment_status = 'PAID'`, `payments.sepay_transaction_id = 92704`, `payments.paid_at = NOW()`.
       - Cập nhật `orders.payment_status = 'PAID'`, `orders.order_status = 'PROCESSING'`.
       - Trừ số lượng tồn kho tương ứng của các sản phẩm trong đơn.
       - Commit Transaction.
       - Trả về mã HTTP `200 OK` cho SePay trong vòng < 3 giây:
         ```json
         { "success": true }
         ```
       - Gọi hàm gửi email bất đồng bộ: `EmailService.sendOrderNotificationToAdmin(order.id)`.
     - Nếu `transferAmount < order.total_amount` (Khách chuyển thiếu tiền):
       - Cập nhật `payments.payment_status = 'UNDERPAID'`.
       - Cập nhật `payment_webhook_events.processing_status = 'UNDERPAID'`.
       - Commit Transaction và trả về `200 OK` (để SePay không retry), đồng thời ghi log cảnh báo đối soát thủ công.

---

### 4. Bảng mã lỗi hệ thống (Standard Error Codes)

| Mã lỗi (`code`) | HTTP Status | Diễn giải |
| :--- | :---: | :--- |
| `VALIDATION_ERROR` | 400 | Dữ liệu đầu vào không thỏa mãn schema Zod |
| `UNAUTHORIZED` | 401 | Thiếu hoặc sai SePay API Key |
| `FORBIDDEN` | 403 | Sai mã truy cập ngẫu nhiên (`access_token`) của đơn hàng |
| `NOT_FOUND` | 404 | Không tìm thấy danh mục, sản phẩm hoặc mã đơn hàng |
| `OUT_OF_STOCK` | 409 | Sản phẩm đã hết hàng hoặc số lượng mua vượt quá tồn kho |
| `RATE_LIMIT_EXCEEDED` | 429 | Gọi API quá số lần cho phép trong một khoảng thời gian |
| `INTERNAL_SERVER_ERROR`| 500 | Lỗi máy chủ nội bộ hoặc mất kết nối cơ sở dữ liệu |

