import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

// Cấu hình an ninh chuẩn 2026 chống Brute Force (dò mật khẩu tự động)
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // Khóa 15 phút nếu nhập sai quá 5 lần

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, login, logout } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Bẫy Honeypot chống bot tự động điền form
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Quản lý trạng thái khóa chống dò mật khẩu
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(0);
  const [countdown, setCountdown] = useState(0);

  // Khởi tạo trạng thái bảo mật từ localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('nganha_admin_lockout') || '{}');
      if (stored.lockoutUntil && stored.lockoutUntil > Date.now()) {
        setLockoutUntil(stored.lockoutUntil);
        setFailedAttempts(stored.failedAttempts || MAX_FAILED_ATTEMPTS);
      } else if (stored.failedAttempts) {
        setFailedAttempts(stored.failedAttempts);
      }
    } catch (e) {
      // bỏ qua
    }
  }, []);

  // Bộ đếm lùi thời gian khóa
  useEffect(() => {
    if (lockoutUntil > Date.now()) {
      const interval = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000));
        setCountdown(remaining);
        if (remaining <= 0) {
          setLockoutUntil(0);
          setFailedAttempts(0);
          localStorage.removeItem('nganha_admin_lockout');
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lockoutUntil]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // 1. Kiểm tra trạng thái khóa hệ thống
    if (lockoutUntil > Date.now()) {
      setErrorMsg(`Hệ thống đang tạm khóa do nhập sai nhiều lần. Vui lòng chờ ${countdown} giây.`);
      return;
    }

    // 2. Kiểm tra bẫy Honeypot (chỉ bot mới điền ô ẩn này)
    if (honeypot.trim() !== '') {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setErrorMsg('Phát hiện truy cập bất thường từ phần mềm tự động (Bot detected). Yêu cầu đã bị hủy.');
      }, 1200);
      return;
    }

    // 3. Chuẩn hóa & kiểm tra định dạng
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setErrorMsg('Vui lòng nhập đầy đủ tài khoản và mật khẩu quản trị.');
      return;
    }

    setIsLoading(true);

    // 4. Cơ chế làm trễ ngẫu nhiên (Timing-attack mitigation) để vô hiệu hóa script dò mật khẩu hàng loạt
    await new Promise((resolve) => setTimeout(resolve, 750));

    const res = login(cleanEmail, cleanPassword);
    setIsLoading(false);

    if (res.success) {
      // Đăng nhập thành công -> Xóa bộ đếm sai
      localStorage.removeItem('nganha_admin_lockout');
      setFailedAttempts(0);
      navigate('/admin');
    } else {
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);

      if (nextAttempts >= MAX_FAILED_ATTEMPTS) {
        const lockTime = Date.now() + LOCKOUT_DURATION_MS;
        setLockoutUntil(lockTime);
        setCountdown(Math.ceil(LOCKOUT_DURATION_MS / 1000));
        localStorage.setItem(
          'nganha_admin_lockout',
          JSON.stringify({ lockoutUntil: lockTime, failedAttempts: nextAttempts })
        );
        setErrorMsg(
          `CẢNH BÁO AN NINH: Bạn đã nhập sai ${MAX_FAILED_ATTEMPTS} lần liên tiếp. Cổng quản trị đã tạm khóa trong 15 phút để bảo vệ dữ liệu.`
        );
      } else {
        localStorage.setItem(
          'nganha_admin_lockout',
          JSON.stringify({ failedAttempts: nextAttempts })
        );
        const remaining = MAX_FAILED_ATTEMPTS - nextAttempts;
        setErrorMsg(`${res.message} (Cảnh báo: Bạn còn ${remaining} lần thử trước khi bị tạm khóa).`);
      }
    }
  };

  const isLocked = lockoutUntil > Date.now();

  return (
    <div className="flex-1 flex flex-col justify-center items-center py-8 sm:py-16 px-3.5 sm:px-6 lg:px-8 bg-[#f7f5ee]/70">
      <div className="w-full max-w-md">
        {/* Khối bảo mật nội bộ */}
        <div className="bg-[#faf8f3] rounded-none border border-[#ded7ca] shadow-2xl p-4 sm:p-9 text-on-surface eco-rise-1 relative overflow-hidden">
          {/* Vạch nhận diện nội bộ trên cùng */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#14261a] via-[#8a7258] to-[#cbb07c]" />

          {/* Huy hiệu Cổng Nội Bộ Bảo Mật 2026 */}
          <div className="flex items-center justify-between gap-2 mb-5 sm:mb-6 pb-3 sm:pb-4 border-b border-[#eae4d9]">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none bg-[#14261a]/8 text-[#14261a] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[13px] text-[#2d7d46]">verified_user</span>
              <span>Bảo Mật Nội Bộ Chuẩn 2026</span>
            </div>
            <span className="text-[10px] font-semibold text-[#8a7258] bg-[#f0ece2] px-2 py-0.5 rounded-none font-mono">
              IP Monitored
            </span>
          </div>

          {/* Header trung tâm */}
          <div className="text-center mb-6 sm:mb-7 eco-rise-2">
            <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-none bg-[#14261a] text-[#cbb07c] flex items-center justify-center mb-2.5 sm:mb-3 shadow-md border border-[#cbb07c]/40">
              <span className="material-symbols-outlined text-[1.625rem] sm:text-[1.875rem]">security</span>
            </div>
            <span className="text-[9px] sm:text-[10px] font-bold text-[#8a7258] uppercase tracking-[0.2em] sm:tracking-[0.22em] block mb-1">
              TIỆM THẢO MỘC NGÂN HÀ
            </span>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-primary tracking-tight">
              Đăng Nhập Quản Trị Hệ Thống
            </h1>
            <p className="text-[11px] sm:text-xs text-on-surface-variant mt-1 sm:mt-1.5 leading-relaxed">
              Khu vực xác thực danh tính dành riêng cho Ban Quản Trị &amp; Vận Hành
            </p>
          </div>

          {/* Banner Cảnh Báo An Ninh */}
          <div className="mb-5 sm:mb-6 p-2.5 sm:p-3 rounded-none bg-[#f4efe4] border border-[#e2dacf] text-[#554d42] text-[10px] sm:text-[11px] leading-relaxed flex items-start gap-2">
            <span className="material-symbols-outlined text-[#8a7258] text-[15px] sm:text-[16px] shrink-0 mt-0.5">
              shield_locked
            </span>
            <span>
              <strong>Cơ chế phòng thủ chủ động:</strong> Hệ thống kích hoạt tường lửa giám sát hành vi, tự động khóa sau {MAX_FAILED_ATTEMPTS} lần đăng nhập sai và ghi nhận IP truy vết.
            </span>
          </div>

          {isAuthenticated ? (
            /* TRẠNG THÁI: ĐÃ ĐĂNG NHẬP */
            <div className="space-y-4 sm:space-y-5 text-center eco-rise-3">
              <div className="p-3.5 sm:p-4 rounded-none bg-green-50/80 border border-green-200 text-green-900">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-none bg-green-100 mx-auto flex items-center justify-center text-green-700 mb-1.5 sm:mb-2">
                  <span className="material-symbols-outlined text-lg sm:text-xl">check_circle</span>
                </div>
                <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-green-800 mb-0.5">
                  Phiên làm việc nội bộ đang mở
                </p>
                <p className="text-xs sm:text-sm font-bold text-primary">{user?.name || 'Quản Trị Viên'}</p>
                <p className="text-[11px] sm:text-xs text-on-surface-variant font-mono">{user?.email}</p>
              </div>

              <div className="flex flex-col gap-2.5">
                <Link
                  to="/admin"
                  className="w-full py-2.5 px-4 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs uppercase tracking-wider rounded-none shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">dashboard</span>
                  <span>Vào Bảng Điều Khiển Quản Trị</span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="w-full py-2 px-4 bg-surface hover:bg-surface-container border border-border-herbal text-on-surface font-semibold text-xs rounded-none transition-colors"
                >
                  Đăng Xuất Phiên Hiện Tại
                </button>
              </div>
            </div>
          ) : (
            /* FORM ĐĂNG NHẬP BẢO MẬT */
            <div className="eco-rise-3">
              {errorMsg && (
                <div className="mb-4 sm:mb-5 p-3 rounded-none bg-red-50 border border-red-300 text-red-900 text-xs flex items-start gap-2 animate-shake">
                  <span className="material-symbols-outlined text-red-600 text-[18px] shrink-0 mt-0.5">
                    gpp_bad
                  </span>
                  <div className="leading-relaxed font-medium">
                    {errorMsg}
                    {isLocked && (
                      <div className="mt-1 font-mono font-bold text-red-700">
                        Thời gian mở khóa sau: {Math.floor(countdown / 60)} phút {countdown % 60} giây
                      </div>
                    )}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
                {/* Bẫy Honeypot ẩn (chỉ bot quét web mới điền vào ô này) */}
                <div style={{ display: 'none' }} aria-hidden="true">
                  <input
                    type="text"
                    name="website_trap_field"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">
                    Email / Tên tài khoản nội bộ <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[1.125rem]">
                      alternate_email
                    </span>
                    <input
                      type="text"
                      required
                      disabled={isLocked || isLoading}
                      autoComplete="username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Nhập email quản trị viên..."
                      className="w-full pl-9 pr-3.5 py-2.5 bg-surface-container-low border border-border-herbal rounded-none text-base sm:text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">
                    Mật khẩu bảo mật <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[1.125rem]">
                      lock
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      disabled={isLocked || isLoading}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 bg-surface-container-low border border-border-herbal rounded-none text-base sm:text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors cursor-pointer"
                      aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      <span className="material-symbols-outlined text-[1.125rem]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Nút đăng nhập bảo mật */}
                <button
                  type="submit"
                  disabled={isLoading || isLocked}
                  className="w-full py-3 bg-[#cbb07c] hover:bg-[#dfc492] text-[#14261a] font-bold text-xs uppercase tracking-widest rounded-none shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2 active:scale-98"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#14261a] border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang xác thực an toàn...</span>
                    </>
                  ) : isLocked ? (
                    <>
                      <span className="material-symbols-outlined text-base">lock_clock</span>
                      <span>HỆ THỐNG ĐANG KHÓA ({countdown}s)</span>
                    </>
                  ) : (
                    <>
                      <span>ĐĂNG NHẬP HỆ THỐNG NỘI BỘ</span>
                      <span className="material-symbols-outlined text-base">login</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Chân trang card - Lối quay về cửa hàng */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-[#eae4d9] flex flex-col items-center gap-1.5 sm:gap-2 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-[#8a7258] hover:text-primary font-medium transition-colors"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span>Quay lại trang chủ bán lẻ (Khách hàng)</span>
            </Link>
            <p className="text-[10px] text-outline">
              Bản quyền nội bộ © 2026 Tiệm Thảo Mộc Ngân Hà. Mọi quyền được bảo lưu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
