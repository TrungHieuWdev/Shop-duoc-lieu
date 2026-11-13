import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLoginPage } from '@/pages/AdminLoginPage';
import { AdminDashboardPage } from '@/pages/AdminDashboardPage';
import { useAuthStore } from '@/store/useAuthStore';
import { useAdminStore } from '@/store/useAdminStore';

export const App = () => {
  const initSession = useAuthStore((s) => s.initSession);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hydrateFromSupabase = useAdminStore((s) => s.hydrateFromSupabase);

  useEffect(() => {
    initSession();
  }, [initSession]);

  useEffect(() => {
    if (isAuthenticated) {
      hydrateFromSupabase();
    }
  }, [isAuthenticated, hydrateFromSupabase]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminDashboardPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/login" element={<AdminLoginPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

