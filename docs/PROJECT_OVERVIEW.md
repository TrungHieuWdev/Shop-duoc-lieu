# TỔNG QUAN DỰ ÁN (PROJECT OVERVIEW)
## Website Thương Mại Điện Tử Sản Phẩm Thảo Mộc Thiên Nhiên (NganHa Shop)

---

### 1. Giới thiệu dự án
Dự án xây dựng nền tảng thương mại điện tử chuyên cung cấp các sản phẩm thảo mộc nấu tắm, lá xông thảo dược, muối ngâm chân và các sản phẩm chăm sóc cơ thể có nguồn gốc 100% tự nhiên.

Hệ thống được thiết kế theo triết lý **Lean Architecture (Kiến trúc tinh gọn)**, tối ưu cho mô hình kinh doanh bán lẻ quy mô vừa và nhỏ (D2C - Direct to Consumer). Mục tiêu chính là mang lại trải nghiệm mua hàng tức thì, trực quan, không rào cản cho khách hàng và tự động hóa toàn bộ quy trình tiếp nhận thanh toán ngân hàng cho chủ cửa hàng.

---

### 2. Mô hình hoạt động nghiệp vụ

Hệ thống vận hành theo quy trình khép kín 12 bước:

```
[Khách hàng duyệt web] 
       ↓ 
[Chọn sản phẩm thảo mộc & Thêm vào giỏ hàng] 
       ↓ 
[Nhập thông tin người nhận (Tên, SĐT, Địa chỉ)] 
       ↓ 
[Xác nhận đặt hàng] 
       ↓ 
[Backend thẩm định giá/tồn kho & Tạo đơn hàng MySQL] 
       ↓ 
[Hệ thống hiển thị mã VietQR động theo đơn hàng] 
       ↓ 
[Khách hàng quét mã QR chuyển khoản ngân hàng] 
       ↓ 
[SePay nhận diện biến động số dư tài khoản] 
       ↓ 
[SePay bắn Webhook xác thực đến Backend] 
       ↓ 
[Backend đối soát giao dịch, cập nhật đơn hàng thành PAID] 
       ↓ 
[Nodemailer tự động gửi email thông báo đơn mới đến Chủ shop] 
       ↓ 
[Chủ shop nhận thông báo trên điện thoại, đóng gói & giao hàng]
```

---

### 3. Phạm vi hệ thống (System Scope)

#### 3.1. Các tính năng NẰM TRONG phạm vi (In-Scope):
1. **Catalog Sản phẩm:**
   - Xem danh mục sản phẩm thảo mộc (Lá tắm thảo mộc, Túi xông giải cảm, Muối ngâm chân, Xà bông sinh dược, Cao gội đầu tự nhiên...).
   - Xem chi tiết sản phẩm: công dụng dưỡng sinh, thành phần thảo mộc tự nhiên, hướng dẫn nấu/sử dụng, hình ảnh, quy cách đóng gói và giá bán.
   - Tìm kiếm sản phẩm theo từ khóa, lọc theo danh mục, sắp xếp giá, phân trang.
2. **Giỏ hàng & Đặt hàng không cần tài khoản (Guest Checkout):**
   - Lưu trữ giỏ hàng an toàn tại trình duyệt (`localStorage`).
   - Khách hàng không cần đăng ký hay đăng nhập tài khoản.
   - Thu thập thông tin giao hàng tối giản: Họ tên, Số điện thoại, Địa chỉ giao hàng, Ghi chú đơn hàng.
3. **Thanh toán tự động qua SePay VietQR:**
   - Tạo mã VietQR động chuẩn NAPAS chứa sẵn thông tin: Số tài khoản, Ngân hàng, Số tiền chính xác và Nội dung chuyển khoản duy nhất gắn liền với mã đơn hàng.
   - Trang thanh toán có cơ chế tự động kiểm tra trạng thái thanh toán định kỳ (Polling) an toàn bằng mã truy cập ngẫu nhiên (`access_token`).
   - Tự động chuyển hướng sang trang Hoàn tất đơn hàng khi thanh toán thành công.
4. **Xử lý Webhook & Bảo mật giao dịch:**
   - Tiếp nhận Webhook từ SePay với xác thực khóa API bí mật (`Authorization: Apikey ...`).
   - Kiểm tra chống trùng lặp giao dịch (Idempotency), chống xử lý lại giao dịch đã ghi nhận.
   - Đối soát tự động số tiền thực nhận với giá trị đơn hàng.
   - Cơ chế Transaction ACID trong MySQL đảm bảo tính nhất quán dữ liệu.
5. **Thông báo đơn hàng tự động cho chủ cửa hàng:**
   - Gửi email chi tiết đơn hàng (Thông tin khách, địa chỉ, danh sách món, số tiền, mã giao dịch ngân hàng) qua Nodemailer đến hộp thư của chủ cửa hàng ngay sau khi thanh toán được ghi nhận.

#### 3.2. Các tính năng KHÔNG THUỘC phạm vi (Out-of-Scope giai đoạn này):
- ❌ Không xây dựng giao diện Quản trị viên (Admin Dashboard) trên website. Dữ liệu sản phẩm được quản lý trực tiếp qua Database/SQL migrations.
- ❌ Không có hệ thống Đăng nhập / Đăng ký / Quản lý tài khoản khách hàng.
- ❌ Không có hệ thống tích điểm thưởng, mã voucher giảm giá phức tạp.
- ❌ Không tích hợp trực tiếp API các hãng vận chuyển (GHTK, GHN, ViettelPost...). Chủ shop sử dụng ứng dụng vận chuyển độc lập sau khi nhận email.
- ❌ Không tích hợp Chatbot AI hay livechat nội bộ trên website.
- ❌ Không hỗ trợ thanh toán qua Cổng thẻ tín dụng quốc tế (Visa/Mastercard) hay Cổng ví điện tử bên thứ ba phức tạp ngoài hình thức chuyển khoản VietQR qua SePay.

---

### 4. Công nghệ sử dụng và lý do lựa chọn

| Thành phần | Công nghệ lựa chọn | Lý do lựa chọn kỹ thuật |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 + Vite | Tốc độ build cực nhanh (ES modules), tối ưu hiệu suất render, hệ sinh thái component phong phú. |
| **Styling** | Tailwind CSS | Utility-first CSS, thiết kế giao diện mang phong cách mộc mạc, tự nhiên (Earthy / Zen / Botanical) nhanh chóng, bundle nhẹ. |
| **Routing** | React Router DOM v6 | Quản lý định tuyến SPA mượt mà, hỗ trợ dynamic route cho chi tiết sản phẩm và theo dõi đơn hàng. |
| **State Management** | Zustand | Nhẹ hơn Redux rất nhiều (chỉ ~1KB), cú pháp đơn giản, tối ưu cho việc đồng bộ giỏ hàng với `localStorage`. |
| **Icons** | Lucide React | Bộ icon hiện đại, tối giản, hiển thị sắc nét và hỗ trợ tree-shaking tốt. |
| **HTTP Client** | Axios | Hỗ trợ interceptors, xử lý timeout, tự động parse JSON và xử lý lỗi đồng nhất. |
| **Backend Runtime** | Node.js (LTS) | Non-blocking I/O, hiệu năng xử lý request đồng thời cao, phù hợp kiến trúc RESTful API và nhận Webhook. |
| **Backend Framework** | Express.js | Framework kinh điển, linh hoạt, cấu trúc phân lớp rõ ràng, dễ dàng tích hợp middleware. |
| **Database Driver** | `mysql2/promise` | Hỗ trợ chuẩn kết nối bất đồng bộ (async/await), Connection Pool hiệu quả, Prepared Statements chống SQL Injection. |
| **Validation** | Zod | Kiểm tra tính hợp lệ của dữ liệu đầu vào (Payload validation) chặt chẽ, type-safe, thông báo lỗi chuẩn hóa. |
| **Bảo mật Backend** | Helmet, express-rate-limit, CORS | Bảo vệ chống các lỗ hổng web phổ biến (XSS, Clickjacking, DoS/Brute Force brute checking). |
| **Mailing** | Nodemailer | Thư viện gửi email qua SMTP (Gmail App Password hoặc dịch vụ SMTP chuyên dụng) ổn định, dễ cấu hình template HTML. |
| **Cơ sở dữ liệu** | MySQL 8.x (InnoDB) | Đảm bảo tính toàn vẹn dữ liệu (ACID Transactions), hỗ trợ khóa ngoại, chỉ mục (Index) tìm kiếm tối ưu. |
| **Cổng nhận diện thanh toán** | SePay Webhook + VietQR | Giải pháp nhận diện chuyển khoản ngân hàng Việt Nam tự động, chi phí thấp, tiện lợi cho khách hàng quét mã VietQR. |

---

### 5. Mục tiêu phi chức năng (Non-Functional Requirements)
1. **Tính tin cậy & Toàn vẹn (Reliability & Consistency):** Đơn hàng và trạng thái tiền bạc không bao giờ bị ghi nhận sai. Sử dụng cơ chế Transaction để rollback khi có sự cố.
2. **Khả năng chống lặp (Idempotency):** Webhook từ SePay có thể gửi lại nhiều lần (do timeout mạng), hệ thống phải đảm bảo 1 giao dịch ngân hàng chỉ kích hoạt thanh toán và gửi 1 email duy nhất.
3. **Bảo mật (Security):** Tuyệt đối không phơi bày Secret Key, API Key lên mã nguồn. Không cho phép client thao túng đơn giá hoặc tự ý đánh dấu đã thanh toán.
4. **Dễ bảo trì (Maintainability):** Phân chia tầng (Layered Architecture): Route → Controller → Service → Model rõ ràng.

