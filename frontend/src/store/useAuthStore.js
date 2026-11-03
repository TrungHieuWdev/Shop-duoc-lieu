import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('nganha_admin_user') || 'null'),
  isAuthenticated: !!localStorage.getItem('nganha_admin_user'),

  // Đăng nhập quản trị viên
  login: (email, password) => {
    // Tài khoản mẫu chuẩn: admin@nganha.vn / admin123 (hoặc bất kỳ thông tin nào user nhập nếu test nhanh)
    if (
      (email === 'admin@nganha.vn' && password === 'admin123') ||
      (email.trim() && password.trim() && password.length >= 6)
    ) {
      const adminUser = {
        name: 'Quản Trị Viên Ngân Hà',
        email: email.trim(),
        role: 'admin',
        lastLogin: new Date().toISOString(),
      };
      localStorage.setItem('nganha_admin_user', JSON.stringify(adminUser));
      set({ user: adminUser, isAuthenticated: true });
      return { success: true };
    }
    return {
      success: false,
      message: 'Email hoặc mật khẩu không chính xác (Thử: admin@nganha.vn / admin123)',
    };
  },

  // Đăng xuất quản trị viên
  logout: () => {
    localStorage.removeItem('nganha_admin_user');
    set({ user: null, isAuthenticated: false });
  },
}));

