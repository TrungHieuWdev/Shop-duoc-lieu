import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { HomePage } from '@/pages/HomePage';
import { ProductsPage } from '@/pages/ProductsPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { PaymentPage } from '@/pages/PaymentPage';
import { OrderSuccessPage } from '@/pages/OrderSuccessPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="san-pham" element={<ProductsPage />} />
        <Route path="san-pham/:slug" element={<ProductDetailPage />} />
        <Route path="gio-hang" element={<CartPage />} />
        <Route path="dat-hang" element={<CheckoutPage />} />
        <Route path="thanh-toan/:orderCode" element={<PaymentPage />} />
        <Route path="dat-hang-thanh-cong/:orderCode" element={<OrderSuccessPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

