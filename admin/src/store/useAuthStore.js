import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const LOCKOUT_KEY = 'nganha_admin_login_guard';
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 5 * 60 * 1000; // Khóa tạm 5 phút nếu nhập sai 5 lần liên tiếp

const getLockoutState = () => {
  try {
    const raw = localStorage.getItem(LOCKOUT_KEY);
    return raw ? JSON.parse(raw) : { count: 0, lockedUntil: 0 };
  } catch {
    return { count: 0, lockedUntil: 0 };
  }
};

const recordFailedAttempt = () => {
  const state = getLockoutState();
  const nextCount = (state.count || 0) + 1;
  const lockedUntil = nextCount >= MAX_ATTEMPTS ? Date.now() + LOCKOUT_MS : 0;
  const next = { count: nextCount, lockedUntil };
  try {
    localStorage.setItem(LOCKOUT_KEY, JSON.stringify(next));
  } catch {}
  return next;
};

const clearLockout = () => {
  try {
    localStorage.removeItem(LOCKOUT_KEY);
  } catch {}
};

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isInitializing: true,
  mfaRequired: false,
  mfaFactorId: null,
  mfaChallengeId: null,

  initSession: async () => {
    if (!isSupabaseConfigured || !supabase) {
      set({ user: null, isAuthenticated: false, isInitializing: false });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        set({ user: null, isAuthenticated: false, isInitializing: false });
        return;
      }

      // Kiểm tra user có trong bảng admin_users không (Lớp 3 RLS)
      const { data: adminRow, error: adminErr } = await supabase
        .from('admin_users')
        .select('user_id, email')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (adminErr || !adminRow) {
        await supabase.auth.signOut();
        set({ user: null, isAuthenticated: false, isInitializing: false });
        return;
      }

      // Kiểm tra trạng thái AAL (2FA) nếu tài khoản đã bật MFA
      const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aalData && aalData.nextLevel === 'aal2' && aalData.currentLevel !== 'aal2') {
        const { data: factors } = await supabase.auth.mfa.listFactors();
        const verifiedTotp = factors?.totp?.find((f) => f.status === 'verified');
        if (verifiedTotp) {
          const { data: challenge } = await supabase.auth.mfa.challenge({ factorId: verifiedTotp.id });
          set({
            user: null,
            isAuthenticated: false,
            isInitializing: false,
            mfaRequired: true,
            mfaFactorId: verifiedTotp.id,
            mfaChallengeId: challenge?.id || null,
          });
          return;
        }
      }

      set({
        user: {
          id: session.user.id,
          name: 'Quản Trị Viên Ngân Hà',
          email: session.user.email,
          role: 'admin',
        },
        isAuthenticated: true,
        isInitializing: false,
        mfaRequired: false,
      });
    } catch {
      set({ user: null, isAuthenticated: false, isInitializing: false });
    }
  },

  login: async (email, password) => {
    const guard = getLockoutState();
    if (guard.lockedUntil && Date.now() < guard.lockedUntil) {
      const mins = Math.ceil((guard.lockedUntil - Date.now()) / 60000);
      return {
        success: false,
        message: `Tài khoản tạm khóa ${mins} phút do nhập sai quá ${MAX_ATTEMPTS} lần.`,
      };
    }

    if (!isSupabaseConfigured || !supabase) {
      return {
        success: false,
        message:
          'Hệ thống bảo mật chưa kết nối Supabase Auth (thiếu VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). Vui lòng cấu hình theo file SECURITY_4_LAYERS_GUIDE.md.',
      };
    }

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();
    if (!cleanEmail || !cleanPassword) {
      return { success: false, message: 'Vui lòng nhập đầy đủ Email và Mật khẩu.' };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanPassword,
    });

    if (error || !data?.user) {
      const nextGuard = recordFailedAttempt();
      const remaining = Math.max(0, MAX_ATTEMPTS - nextGuard.count);
      return {
        success: false,
        message:
          remaining > 0
            ? `Email hoặc mật khẩu không chính xác (còn ${remaining} lần thử).`
            : 'Đã nhập sai quá nhiều lần. Cổng đăng nhập tạm khóa 5 phút.',
      };
    }

    // Kiểm tra quyền trong bảng admin_users
    const { data: adminRow, error: adminErr } = await supabase
      .from('admin_users')
      .select('user_id, email')
      .eq('user_id', data.user.id)
      .maybeSingle();

    if (adminErr || !adminRow) {
      await supabase.auth.signOut();
      return {
        success: false,
        message: 'Tài khoản này không có quyền Quản trị viên.',
      };
    }

    clearLockout();

    // Kiểm tra nếu đã bật 2FA (TOTP)
    const { data: factors } = await supabase.auth.mfa.listFactors();
    const verifiedTotp = factors?.totp?.find((f) => f.status === 'verified');
    if (verifiedTotp) {
      const { data: challenge, error: chalErr } = await supabase.auth.mfa.challenge({
        factorId: verifiedTotp.id,
      });
      if (chalErr) {
        return { success: false, message: 'Không thể khởi tạo phiên xác thực 2FA.' };
      }
      set({
        mfaRequired: true,
        mfaFactorId: verifiedTotp.id,
        mfaChallengeId: challenge.id,
        isAuthenticated: false,
      });
      return { success: false, mfaRequired: true, message: 'Vui lòng nhập mã 2FA (6 số).' };
    }

    const adminUser = {
      id: data.user.id,
      name: 'Quản Trị Viên Ngân Hà',
      email: data.user.email,
      role: 'admin',
      lastLogin: new Date().toISOString(),
    };
    set({ user: adminUser, isAuthenticated: true, mfaRequired: false });
    return { success: true };
  },

  verifyMfa: async (code) => {
    const { mfaFactorId, mfaChallengeId } = get();
    if (!supabase || !mfaFactorId || !mfaChallengeId) {
      return { success: false, message: 'Phiên xác thực 2FA không hợp lệ.' };
    }

    const { data, error } = await supabase.auth.mfa.verify({
      factorId: mfaFactorId,
      challengeId: mfaChallengeId,
      code: String(code || '').trim(),
    });

    if (error) {
      return { success: false, message: 'Mã xác thực 2FA không đúng hoặc đã hết hạn.' };
    }

    const { data: { user } } = await supabase.auth.getUser();
    set({
      user: {
        id: user?.id,
        name: 'Quản Trị Viên Ngân Hà',
        email: user?.email,
        role: 'admin',
        lastLogin: new Date().toISOString(),
      },
      isAuthenticated: true,
      mfaRequired: false,
      mfaFactorId: null,
      mfaChallengeId: null,
    });
    return { success: true, data };
  },

  changePassword: async (_currentPassword, newPassword) => {
    if (!supabase) {
      return { success: false, message: 'Chưa kết nối Supabase Auth.' };
    }
    if (!newPassword || newPassword.length < 10) {
      return {
        success: false,
        message: 'Mật khẩu mới phải từ 10 ký tự trở lên để đảm bảo an toàn.',
      };
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      return { success: false, message: error.message || 'Không thể đổi mật khẩu.' };
    }
    return { success: true, message: 'Đã cập nhật mật khẩu Admin mới trên Supabase Auth.' };
  },

  logout: async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    set({
      user: null,
      isAuthenticated: false,
      mfaRequired: false,
      mfaFactorId: null,
      mfaChallengeId: null,
    });
  },
}));

