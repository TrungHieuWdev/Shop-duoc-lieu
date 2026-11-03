# PHÂN TÍCH VÀ ĐIỀU CHỈNH GIAO DIỆN STITCH PHÙ HỢP VỚI HỆ THỐNG
## Thiết kế: "Mộc Nhiên Thảo - Trang Chủ" (Stitch Screen ID: `78eadef696a443d0954596868596b7cf`)

---

### 1. Đánh giá phong cách giao diện (Design System & Aesthetics)

Bản thiết kế từ Stitch mang phong cách **"Archival Botanical / Zen Apothecary" (Hiệu thuốc thảo mộc dưỡng sinh truyền thống)**, rất phù hợp với sản phẩm thảo mộc nấu tắm và chăm sóc tự nhiên của cửa hàng.

#### 1.1. Bảng màu chuẩn hóa (Color Palette)
- **Primary (`#1F3627`):** Xanh rêu đậm rừng sâu – Đại diện cho thảo mộc nguyên bản, lá cây rừng, mang lại cảm giác bình an, vững chãi và đáng tin cậy. Dùng cho tiêu đề lớn, thanh điều hướng chính, logo.
- **Secondary (`#54634C`):** Xanh xám lá cây – Dùng cho nhãn phụ, icon cam kết, phân loại sản phẩm.
- **Tertiary / Accent (`#6B3B22` / `#50250E`):** Nâu đất nung / vỏ quế ấm – Dùng làm điểm nhấn tương tác: Nút bấm "+ Giỏ Hàng", huy hiệu "Bán chạy", nút "Đặt hàng".
- **Surface / Background (`#FBF9F2`):** Màu giấy mộc / sợi linen dệt thô – Tạo cảm giác mềm dịu cho mắt, ấm cúng và thuần khiết.
- **Surface Container (`#F0EEE7` / `#F6F4ED`):** Tông màu nền phân đoạn nội dung, các khối quy trình sấy lạnh và hướng dẫn xông tắm.
- **Borders & Outlines (`#D8C9AA` / `#C2C8C1`):** Viền mảnh 1px màu sợi đũi cói, phân tách tinh tế các thẻ sản phẩm mà không cần đổ bóng đậm.

#### 1.2. Typography tiêu chuẩn
- **Headlines (Tiêu đề):** `Noto Serif` (kết hợp `EB Garamond`) – Nét chữ có chân thanh thoát, đậm nét văn hóa Đông y cổ truyền, tạo cảm xúc thư thái và trang nhã.
- **Body & Controls (Nội dung & Nút bấm):** `Be Vietnam Pro` – Phông chữ sans-serif hiện đại, tối ưu hóa hiển thị tiếng Việt, rõ ràng ở mọi kích thước chữ nhỏ (0.75rem - 1rem).

---

### 2. Bảng so sánh và Chọn lọc nghiệp vụ (Gap Analysis & Adaptation)

| Thành phần trên Stitch UI | Hiện trạng trong thiết kế mẫu | Điều chỉnh cho phù hợp nghiệp vụ NganHa Shop | Lý do điều chỉnh |
| :--- | :--- | :--- | :--- |
| **Giỏ hàng & Thêm món** | Dùng hàm JS thao tác DOM tĩnh `addToCart()` và hiển thị Toast tạm thời, không lưu trữ. | Tích hợp trực tiếp vào **Zustand Store (`useCartStore`)**, tự động đồng bộ hóa với **`localStorage`**. | Đảm bảo khách hàng F5 hoặc chuyển trang vẫn giữ nguyên danh sách hàng trong giỏ. |
| **Số lượng giỏ hàng trên Header** | Cố định số "2" dạng hardcoded HTML. | Liên kết reactive với `totalItems` trong Zustand Store. | Phản ánh đúng số lượng mặt hàng thực tế khách đã chọn. |
| **Nút Đặt hàng / Thanh toán** | Chưa có luồng Checkout và trang VietQR. | Giữ nguyên style nút màu nâu đất nung `#6B3B22`, khi bấm giỏ hàng sẽ dẫn đến trang `/thanh-toan` và `/thanh-toan-qr`. | Hoàn thiện luồng mua hàng Guest Checkout và thanh toán SePay. |
| **Danh mục sản phẩm** | 4 mục: Nấu tắm, Gội đầu, Ngâm chân, Combo. | Khớp với 4 danh mục trong Database MySQL: `Thảo Mộc Xông Tắm`, `Muối Ngâm Chân Dược Liệu`, `Chăm Sóc Tóc Tự Nhiên`, `Xà Bông Sinh Dược`. | Đồng bộ hóa dữ liệu từ API Backend `/api/categories`. |
| **Sản phẩm hiển thị** | Dữ liệu cứng tĩnh. | Lấy động từ REST API `/api/products` (kèm fallback dữ liệu ban đầu). | Đảm bảo giá tiền, tình trạng tồn kho và hình ảnh luôn là dữ liệu thật từ MySQL. |
| **Đăng nhập / Tài khoản** | Trên UI không có nút đăng nhập (rất phù hợp!). | **Giữ nguyên:** Tuyệt đối không bổ sung form đăng nhập/đăng ký. Khách hàng chỉ cần nhập Tên + SĐT + Địa chỉ để nhận hàng. | Trải nghiệm mua sắm không rào cản (Zero-Barrier Guest Checkout). |
| **Tìm kiếm thảo mộc** | Ô input tìm kiếm trên thanh Header. | Bắt sự kiện gõ phím kèm custom hook `useDebounce`, chuyển hướng hoặc lọc sản phẩm tại trang `/san-pham?keyword=...`. | Tạo trải nghiệm tìm kiếm nhanh chóng, mượt mà. |
| **Các khối nội dung giá trị** | Khối 4 bước sấy lạnh đối lưu 35°C & 3 bước ủ thảo mộc nấu nước xông tắm. | **Giữ nguyên 100%:** Đây là điểm nhấn nội dung tuyệt vời giúp gia tăng niềm tin chất lượng cho khách hàng. | Giữ trọn vẹn bản sắc mộc mạc và phong cách của bản thiết kế. |

---

### 3. Cấu trúc Component React được tái thiết kế theo Stitch Style

1. **`Header.jsx`:**
   - Logo thương hiệu "MỘC NHIÊN THẢO - Thảo Mộc Bản Địa".
   - Menu điều hướng: Trang chủ (`/`), Sản phẩm (`/san-pham`), Câu chuyện (`#cau-chuyen`), Hướng dẫn (`#huong-dan`).
   - Ô tìm kiếm nhanh với icon kính lúp.
   - Hotline hỗ trợ: `1900 6826` / `0987 654 321`.
   - Nút Giỏ hàng với icon túi xách thảo mộc (`shopping_bag`), badge số lượng động màu nâu đất nung.
2. **`HeroSection.jsx`:**
   - Tiêu đề mộc mạc phong cách Serif: *"Chạm vào thiên nhiên – Chăm sóc cơ thể theo cách mộc mạc"*.
   - Khung hình ảnh dược liệu ban mai sắc nét.
   - Nút kêu gọi hành động (CTA) đưa khách đến thẳng danh sách sản phẩm.
3. **`CategorySection.jsx`:**
   - Thẻ danh mục với ảnh minh họa nồi xông, thảo dược gội bồ kết, xô gỗ ngâm chân.
   - Click chọn danh mục sẽ lọc danh sách sản phẩm tương ứng.
4. **`FeaturedProducts.jsx`:**
   - Lưới sản phẩm responsive (1 cột Mobile, 2 cột Tablet, 4 cột Desktop).
   - Thẻ sản phẩm chuẩn với ảnh tỉ lệ 1:1, nhãn "Bán chạy", giá tiền VND định dạng chuẩn.
   - Nút "+ Giỏ Hàng" bấm có phản hồi haptic và Toast thông báo dịu mắt.
5. **`HerbalProcessSection.jsx`:**
   - 4 bước thu hái, khử khuẩn ozone, sấy lạnh 35°C, đóng gói màng kraft zip.
6. **`UsageGuideSection.jsx`:**
   - 3 bước hướng dẫn chuẩn bị mộc mạc (Ủ túi thảo mộc → Chiết xuất tinh chất → Pha ấm & tận hưởng).
7. **`Footer.jsx`:**
   - Cam kết 100% thảo mộc tự nhiên, minh bạch nguồn gốc vườn dược liệu, chân trang với triết lý: "Thuần Lành - Tâm An - Bền Vững".

