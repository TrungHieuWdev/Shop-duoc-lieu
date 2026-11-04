import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
// 4 trang chính trên thanh điều hướng tải trực tiếp để chuyển trang tức thì, tự nhiên, không bị giật layout
import { HomePage } from '@/pages/HomePage';
import { ProductsPage } from '@/pages/ProductsPage';
import { HerbsAboutPage } from '@/pages/HerbsAboutPage';
import { UsageGuidePage } from '@/pages/UsageGuidePage';
import { OfflineScreen } from '@/components/common/OfflineScreen';
import { LoadingScreen } from '@/components/common/LoadingScreen';

// Các trang nhánh mua hàng & thanh toán được tải theo nhu cầu (On-Demand)
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })));
const CartPage = lazy(() => import('@/pages/CartPage').then(m => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const PaymentPage = lazy(() => import('@/pages/PaymentPage').then(m => ({ default: m.PaymentPage })));
const OrderSuccessPage = lazy(() => import('@/pages/OrderSuccessPage').then(m => ({ default: m.OrderSuccessPage })));
const AdminDashboardPage = lazy(() => import('@/pages/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const AdminLoginPage = lazy(() => import('@/pages/AdminLoginPage').then(m => ({ default: m.AdminLoginPage })));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="san-pham" element={<ProductsPage />} />
        <Route path="san-pham/:slug" element={<ProductDetailPage />} />
        <Route path="ve-thao-duoc" element={<HerbsAboutPage />} />
        <Route path="cach-dung" element={<UsageGuidePage />} />
        <Route path="huong-dan-su-dung" element={<UsageGuidePage />} />
        <Route path="huong-dan" element={<UsageGuidePage />} />
        <Route path="gio-hang" element={<CartPage />} />
        <Route path="dat-hang" element={<CheckoutPage />} />
        <Route path="thanh-toan/:orderCode" element={<PaymentPage />} />
        <Route path="dat-hang-thanh-cong/:orderCode" element={<OrderSuccessPage />} />
        <Route path="admin" element={<AdminDashboardPage />} />
        <Route path="admin/login" element={<AdminLoginPage />} />
        <Route path="admin/dang-nhap" element={<AdminLoginPage />} />
        <Route path="quan-tri/dang-nhap" element={<AdminLoginPage />} />

        {/* Tuyến đường trực quan để kiểm tra màn hình Offline & Loading */}
        <Route path="mat-ket-noi" element={<OfflineScreen />} />
        <Route path="offline" element={<OfflineScreen />} />
        <Route
          path="loading"
          element={
            <div className="py-20 flex justify-center">
              <LoadingScreen fullScreen={false} />
            </div>
          }
        />

        {/* Tuyến đường bắt tất cả lỗi 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
