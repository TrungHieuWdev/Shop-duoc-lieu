# Hướng Dẫn Kích Hoạt Bảo Mật 4 Lớp Cho Ngân Hà Shop (2026)

Hệ thống đã được tách làm **2 ứng dụng độc lập hoàn toàn**:
- `frontend/` — Web bán hàng công khai (`nganhashop.pages.dev`): **Đã xóa sạch** route `/admin`, trang đăng nhập và thông tin quản trị.
- `admin/` — Cổng quản trị độc lập (deploy sang 1 project Cloudflare Pages riêng, ví dụ `nganha-admin.pages.dev`, chạy local ở port `5174`).
- `supabase/schema.sql` — Database PostgreSQL chung, phân quyền RLS và hàm chống sửa giá.

---

## Lớp 3 & 4: Khởi Tạo Database + Phân Quyền RLS + Chống Sửa Giá F12 (Supabase)
1. Tạo 1 project miễn phí tại [supabase.com](https://supabase.com).
2. Vào **SQL Editor -> New query**, dán toàn bộ nội dung file `supabase/schema.sql` rồi bấm **Run**.
3. Tạo tài khoản Admin:
   - Vào **Authentication -> Users -> Add user -> Create new user** (nhập email & mật khẩu mạnh của chủ shop).
   - Copy **User UID** vừa tạo, mở lại **SQL Editor** chạy lệnh cấp quyền Admin:
     ```sql
     INSERT INTO public.admin_users (user_id, email)
     VALUES ('DÁN-USER-UID-VÀO-ĐÂY', 'email-admin-cua-ban@gmail.com');
     ```
4. Vào **Project Settings -> API**, copy `Project URL` và `anon public` key.
5. Thêm 2 biến môi trường này vào **cả 2 project** trên **Cloudflare Pages -> Settings -> Environment variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

---

## Lớp 2: Xác Thực Thật & Khóa Chống Dò Mật Khẩu + 2FA
- Trang `admin/` sử dụng **Supabase Auth** thật (không lưu mật khẩu trong mã nguồn).
- Tự động khóa tạm 5 phút nếu nhập sai quá 5 lần liên tiếp + bẫy Honeypot chống bot.
- Để bật **2FA (Google Authenticator / Authy)**:
  - Trong **Supabase Dashboard -> Authentication -> Multi-Factor Authentication**, bật **TOTP (App Authenticator)**.
  - Khi đăng nhập `admin/`, nếu tài khoản đã kích hoạt TOTP, hệ thống tự động yêu cầu nhập mã 6 số mỗi lần đăng nhập.

---

## Lớp 1: Khóa Cổng Ở Tầng Mạng Bằng Cloudflare Zero Trust Access (Miễn Phí)
1. Deploy thư mục `admin/` lên một Cloudflare Pages project riêng (Root directory: `admin`, Build command: `npm run build`, Output directory: `dist`).
2. Vào **Cloudflare Dashboard -> Zero Trust -> Access -> Applications -> Add an application -> Self-hosted**.
3. Đặt Domain là tên miền trang Admin mới tạo (ví dụ `nganha-admin.pages.dev`).
4. Tạo Policy **Allow**:
   - **Selector:** `Emails`
   - **Value:** Điền duy nhất **email Gmail của bạn**.
5. Lưu lại: Từ giờ **mọi người lạ trên Internet** dù có link Admin cũng bị Cloudflare chặn ngay từ ngoài cửa (không tải được cả trang đăng nhập), chỉ ai nhập đúng mã OTP gửi về Gmail của bạn mới vào được!

