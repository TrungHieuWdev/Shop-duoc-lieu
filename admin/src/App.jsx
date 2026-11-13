import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLoginPage } from '@/pages/AdminLoginPage';
import { AdminDashboardPage } from '@/pages/AdminDashboardPage';
import { useAuthStore } from '@/store/useAuthStore';
import { useAdminStore } from '@/store/useAdminStore';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#fbf9f2] p-6">
          <div className="max-w-lg w-full bg-white border border-red-300 p-6 shadow-md space-y-3">
            <h2 className="text-base font-bold text-red-700">Lỗi hiển thị trang Quản trị</h2>
            <pre className="text-xs bg-red-50 p-3 overflow-auto text-red-900 border border-red-200 whitespace-pre-wrap">
              {this.state.error?.message || String(this.state.error)}
            </pre>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#14261a] text-white text-xs font-bold cursor-pointer"
            >
              Tải lại trang
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export const App = () => {
  const initSession = useAuthStore((s) => s.initSession);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hydrateFromSupabase = useAdminStore((s) => s.hydrateFromSupabase);

  useEffect(() => {
    initSession();
  }, [initSession]);

  useEffect(() => {
    if (!isAuthenticated) return;

    hydrateFromSupabase();

    // Lắng nghe đơn hàng mới realtime từ Supabase + tự động làm mới mỗi 15s
    let channel = null;
    if (isSupabaseConfigured && supabase) {
      channel = supabase
        .channel('admin-orders-sync')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'orders' },
          () => {
            hydrateFromSupabase();
          }
        )
        .subscribe();
    }

    const pollTimer = setInterval(() => {
      hydrateFromSupabase();
    }, 15000);

    const handleFocus = () => {
      hydrateFromSupabase();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
      clearInterval(pollTimer);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isAuthenticated, hydrateFromSupabase]);

  return (
    <AdminErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AdminDashboardPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/login" element={<AdminLoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AdminErrorBoundary>
  );
};

export default App;

