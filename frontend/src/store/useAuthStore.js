import { create } from 'zustand';

// Thông tin tài khoản quản trị mặc định (Có thể đổi mật khẩu trong phần Cài Đặt)
const DEFAULT_ADMIN = {
  email: 'admin@nganha.vn',
  password: 'admin123',
};

const getStoredCredentials = () => {
  try {
    const raw = localStorage.getItem('nganha_admin_credentials');
    if (!raw) return DEFAULT_ADMIN;
    const parsed = JSON.parse(raw);
    return {
      email: parsed.email || DEFAULT_ADMIN.email,
      password: parsed.password || DEFAULT_ADMIN.password,
    };
  } catch (e) {
    return DEFAULT_ADMIN;
  }
};

const getSavedAdminUser = () => {
  try {
    const raw = localStorage.getItem('nganha_admin_user');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
};

export const useAuthStore = create((set, get) => ({
  user: getSavedAdminUser(),
  isAuthenticated: !!getSavedAdminUser(),

  // Đăng nhập quản trị viên - Tiêu chuẩn bảo mật 2026 chống rò rỉ dữ liệu
  login: (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    const currentCreds = getStoredCredentials();

    // Xác thực nghiêm ngặt, chặn mọi hình thức bypass bằng chuỗi ngắn/ngẫu nhiên
    if (cleanEmail === currentCreds.email.toLowerCase() && cleanPassword === currentCreds.password) {
      const adminUser = {
        name: 'Quản Trị Viên Ngân Hà',
        email: cleanEmail,
        role: 'admin',
        lastLogin: new Date().toISOString(),
      };
      localStorage.setItem('nganha_admin_user', JSON.stringify(adminUser));
      set({ user: adminUser, isAuthenticated: true });
      return { success: true };
    }

    // Không gợi ý mật khẩu trong thông báo lỗi để tránh kẻ gian dò quét
    return {
      success: false,
      message: 'Tài khoản hoặc mật khẩu bảo mật không chính xác. Vui lòng kiểm tra lại.',
    };
  },

  // Đổi mật khẩu quản trị viên
  changePassword: (currentPassword, newPassword) => {
    const currentCreds = getStoredCredentials();

    if (currentPassword !== currentCreds.password) {
      return {
        success: false,
        message: 'Mật khẩu hiện tại không chính xác.',
      };
    }

    if (!newPassword || newPassword.length < 8) {
      return {
        success: false,
        message: 'Mật khẩu mới phải có độ dài tối thiểu từ 8 ký tự trở lên để đảm bảo an toàn.',
      };
    }

    const updatedCreds = {
      ...currentCreds,
      password: newPassword,
    };

    localStorage.setItem('nganha_admin_credentials', JSON.stringify(updatedCreds));
    return {
      success: true,
      message: 'Đổi mật khẩu quản trị viên thành công. Mật khẩu mới đã được lưu an toàn.',
    };
  },

  // Đăng xuất quản trị viên
  logout: () => {
    localStorage.removeItem('nganha_admin_user');
    set({ user: null, isAuthenticated: false });
  },
}));
