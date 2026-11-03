import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { HomePage } from '@/pages/HomePage';
import { ProductsPage } from '@/pages/ProductsPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { HerbsAboutPage } from '@/pages/HerbsAboutPage';
import { UsageGuidePage } from '@/pages/UsageGuidePage';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { PaymentPage } from '@/pages/PaymentPage';
import { OrderSuccessPage } from '@/pages/OrderSuccessPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { OfflineScreen } from '@/components/common/OfflineScreen';
import { LoadingScreen } from '@/components/common/LoadingScreen';

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
