import React, { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

const SubPageFallback = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center py-20 opacity-80">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    <span className="mt-3 text-xs text-secondary font-medium tracking-wider">Đang tải...</span>
  </div>
);

export const MainLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Header />
      <main className="flex-1 pt-16 md:pt-20 min-h-[calc(100vh-12rem)] flex flex-col">
        <div key={location.pathname} className="flex-1 flex flex-col">
          <Suspense fallback={<SubPageFallback />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
};

