import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export const MainLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Header />
      <main className="flex-1 pt-16 md:pt-20">
        <div key={location.pathname} className="animate-page-enter">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

