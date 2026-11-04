import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { BrandLogoIcon } from '@/components/common/BrandLogoIcon';

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, login, logout } = useAuthStore();

  const [email, setEmail] = useState('admin@nganha.vn');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const res = login(email, password);
      setIsLoading(false);
      if (res.success) {
        navigate('/admin');
      } else {
        setErrorMsg(res.message);
      }
    }, 400);
  };

  const handleQuickFill = () => {
    setEmail('admin@nganha.vn');
    setPassword('admin123');
    setErrorMsg('');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center py-8 sm:py-16 px-3.5 sm:px-6 lg:px-8 bg-[#f7f5ee]/70">
      <div className="w-full max-w-md">
        {/* Khối bảo mật nội bộ */}
        <div className="bg-[#faf8f3] rounded-2xl border border-[#ded7ca] shadow-xl p-4 sm:p-9 text-on-surface eco-rise-1 relative overflow-hidden">
          {/* Vạch nhận diện nội bộ trên cùng */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#14261a] via-[#8a7258] to-[#cbb07c]" />

          {/* Huy hiệu Cổng Nội Bộ */}
          <div className="flex items-center justify-between gap-2 mb-5 sm:mb-6 pb-3 sm:pb-4 border-b border-[#eae4d9]">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#14261a]/8 text-[#14261a] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[13px] text-[#8a7258]">shield</span>
              <span>Cổng Quản Trị Nội Bộ</span>
            </div>
            <span className="text-[10px] font-semibold text-[#8a7258] bg-[#f0ece2] px-2 py-0.5 rounded">
              Chỉ Nội Bộ Tiệm
            </span>
          </div>

          {/* Header trung tâm */}
          <div className="text-center mb-6 sm:mb-7 eco-rise-2">
            <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-2xl bg-[#14261a] text-[#cbb07c] flex items-center justify-center mb-2.5 sm:mb-3 shadow-md border border-[#cbb07c]/30">
              <span className="material-symbols-outlined text-[1.625rem] sm:text-[1.875rem]">admin_panel_settings</span>
            </div>
            <span className="text-[9px] sm:text-[10px] font-bold text-[#8a7258] uppercase tracking-[0.2em] sm:tracking-[0.22em] block mb-1">
              TIỆM THẢO MỘC NGÂN HÀ
            </span>
            <h1 className="font-serif text-xl sm:text-3xl font-bold text-primary tracking-tight">
              Đăng Nhập Quản Trị
            </h1>
            <p className="text-[11px] sm:text-xs text-on-surface-variant mt-1 sm:mt-1.5 leading-relaxed">
              Khu vực dành riêng cho Quản trị viên, Thủ kho &amp; Vận hành đơn hàng
            </p>
          </div>

          {/* Cảnh báo an ninh nội bộ */}
          <div className="mb-5 sm:mb-6 p-2.5 sm:p-3 rounded-xl bg-[#f4efe4] border border-[#e2dacf] text-[#554d42] text-[10px] sm:text-[11px] leading-relaxed flex items-start gap-2">
            <span className="material-symbols-outlined text-[#8a7258] text-[15px] sm:text-[16px] shrink-0 mt-0.5">
              lock
            </span>
            <span>
              <strong>Lưu ý bảo mật:</strong> Hệ thống tự động ghi nhận nhật ký phiên làm việc và địa chỉ IP. Vui lòng không chia sẻ tài khoản cho bên thứ ba.
            </span>
          </div>

          {isAuthenticated ? (
            /* TRẠNG THÁI: ĐÃ ĐĂNG NHẬP */
            <div className="space-y-4 sm:space-y-5 text-center eco-rise-3">
              <div className="p-3.5 sm:p-4 rounded-xl bg-green-50/80 border border-green-200 text-green-900">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-green-100 mx-auto flex items-center justify-center text-green-700 mb-1.5 sm:mb-2">
                  <span className="material-symbols-outlined text-lg sm:text-xl">check_circle</span>
                </div>
                <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-green-800 mb-0.5">
                  Phiên làm việc nội bộ đang mở
                </p>
                <p className="text-xs sm:text-sm font-bold text-primary">{user?.name || 'Quản Trị Viên'}</p>
                <p className="text-[11px] sm:text-xs text-on-surface-variant font-mono">{user?.email}</p>
              </div>

              <div className="space-y-2 sm:space-y-2.5">
                <button
                  type="button"
                  onClick={() => navigate('/admin')}
                  className="w-full py-3 px-4 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98"
                >
                  <span className="material-symbols-outlined text-base">dashboard</span>
                  <span>Truy Cập Bảng Điều Khiển Quản Trị</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-2.5 px-4 bg-surface hover:bg-red-50 text-red-700 hover:text-red-800 border border-red-200 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <span className="material-symbols-outlined text-sm">logout</span>
                  <span>Đăng Xuất Tài Khoản Này</span>
                </button>
              </div>
            </div>
          ) : (
            /* TRẠNG THÁI: CHƯA ĐĂNG NHẬP - FORM NHẬP */
            <div className="eco-rise-3">
              {errorMsg && (
                <div className="mb-4 p-2.5 sm:p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-fadeIn">
                  <span className="material-symbols-outlined text-[1.125rem] shrink-0">error</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">
                    Email / Tên tài khoản nội bộ <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[1.125rem]">
                      mail
                    </span>
                    <input
                      type="text"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@nganha.vn"
                      className="w-full pl-9 pr-3 py-2.5 bg-surface-container-low border border-border-herbal rounded-xl text-base sm:text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 bg-surface-container-low border border-border-herbal rounded-xl text-base sm:text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
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

                {/* Nút bấm tự điền tài khoản mẫu tiện lợi cho quản trị viên */}
                <button
                  type="button"
                  onClick={handleQuickFill}
                  className="w-full py-2 px-2.5 bg-[#f3efe5] hover:bg-[#ebe5d6] border border-dashed border-[#cbb07c] text-[#8a7258] text-[10px] sm:text-[11px] font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[0.875rem] text-[#cbb07c]">auto_fix_high</span>
                  <span>Điền nhanh: admin@nganha.vn / admin123</span>
                </button>

                {/* Nút đăng nhập */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-[#cbb07c] hover:bg-[#dfc492] text-[#14261a] font-bold text-xs uppercase tracking-widest rounded-xl shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1 active:scale-98"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#14261a] border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang xác thực thông tin...</span>
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
            <p className="text-[9px] sm:text-[10px] text-outline">
              Bản quyền nội bộ © 2026 Tiệm Thảo Mộc Ngân Hà. Mọi quyền được bảo lưu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

