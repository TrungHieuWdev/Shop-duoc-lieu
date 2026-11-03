import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

export const AdminAuthModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, login, logout } = useAuthStore();

  const [email, setEmail] = useState('admin@nganha.vn');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const res = login(email, password);
      setIsLoading(false);
      if (res.success) {
        onClose();
        navigate('/admin');
      } else {
        setErrorMsg(res.message);
      }
    }, 350);
  };

  const handleQuickFill = () => {
    setEmail('admin@nganha.vn');
    setPassword('admin123');
    setErrorMsg('');
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#fbf9f2] rounded-2xl border border-border-herbal shadow-2xl p-6 sm:p-8 text-on-surface overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-outline hover:text-primary rounded-full hover:bg-surface-container transition-colors"
          aria-label="Đóng"
        >
          <span className="material-symbols-outlined text-[1.25rem]">close</span>
        </button>

        {isAuthenticated ? (
          /* Trạng thái: Đã đăng nhập quản trị viên */
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center text-primary mb-4">
              <span className="material-symbols-outlined text-[2rem]">admin_panel_settings</span>
            </div>

            <span className="text-[0.6875rem] font-bold text-secondary uppercase tracking-[0.25em] mb-1">
              HỆ THỐNG QUẢN TRỊ
            </span>
            <h3 className="font-serif text-2xl font-bold text-primary mb-1">
              {user?.name || 'Quản Trị Viên'}
            </h3>
            <p className="text-xs text-on-surface-variant mb-6">{user?.email}</p>

            {/* Các lối tắt quản trị */}
            <div className="w-full space-y-2.5 mb-6">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate('/admin');
                }}
                className="w-full py-3 px-4 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-base">dashboard</span>
                <span>Bảng Điều Khiển Quản Trị</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate('/san-pham');
                }}
                className="w-full py-2.5 px-4 bg-surface hover:bg-surface-container border border-border-herbal text-primary font-medium text-xs tracking-wider rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">inventory_2</span>
                <span>Xem Kho Thảo Mộc</span>
              </button>
            </div>

            {/* Đăng xuất */}
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[1rem]">logout</span>
              <span>Đăng xuất khỏi phiên quản trị</span>
            </button>
          </div>
        ) : (
          /* Trạng thái: Chưa đăng nhập - Form đăng nhập Quản Trị */
          <div>
            {/* Tiêu đề & Logo */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#14261a] text-[#cbb07c] flex items-center justify-center mb-3 shadow-sm">
                <span className="material-symbols-outlined text-[1.75rem]">admin_panel_settings</span>
              </div>
              <span className="text-[0.6875rem] font-bold text-[#8a7258] uppercase tracking-[0.25em] block mb-1">
                TIỆM THẢO MỘC NGÂN HÀ
              </span>
              <h3 className="font-serif text-2xl font-bold text-primary">
                Đăng Nhập Quản Trị
              </h3>
              <p className="text-xs text-on-surface-variant mt-1">
                Khu vực dành riêng cho chủ tiệm & quản trị viên
              </p>
            </div>

            {/* Thông báo lỗi nếu có */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-[1.125rem] shrink-0">error</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form đăng nhập */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-primary mb-1">
                  Email / Tên đăng nhập
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
                    className="w-full pl-9 pr-3 py-2 bg-surface-container-low border border-border-herbal rounded-lg text-xs text-on-surface focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-1">
                  Mật khẩu quản trị
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
                    className="w-full pl-9 pr-10 py-2 bg-surface-container-low border border-border-herbal rounded-lg text-xs text-on-surface focus:outline-none focus:border-primary transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    <span className="material-symbols-outlined text-[1.125rem]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Nút bấm tự điền tài khoản mẫu tiện lợi */}
              <button
                type="button"
                onClick={handleQuickFill}
                className="w-full py-1.5 px-2 bg-surface hover:bg-surface-container-high border border-dashed border-[#cbb07c] text-[#8a7258] text-[11px] rounded-md transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[0.875rem]">auto_fix_high</span>
                <span>Điền nhanh tài khoản mẫu (admin@nganha.vn / admin123)</span>
              </button>

              {/* Nút gửi */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#cbb07c] hover:bg-[#dfc492] text-[#14261a] font-bold text-xs uppercase tracking-widest rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#14261a] border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang xác thực...</span>
                  </>
                ) : (
                  <>
                    <span>ĐĂNG NHẬP HỆ THỐNG</span>
                    <span className="material-symbols-outlined text-base">login</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

