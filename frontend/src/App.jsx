import React, { Suspense, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { ScrollToTop } from './components/common/ScrollToTop';
import { NetworkBanner } from './components/common/NetworkBanner';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LoadingScreen } from './components/common/LoadingScreen';
import { useAdminStore } from './store/useAdminStore';

export const App = () => {
  const hydratePublicData = useAdminStore((s) => s.hydratePublicData);

  useEffect(() => {
    hydratePublicData?.();
  }, [hydratePublicData]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        {/* Banner phát hiện mạng Internet real-time */}
        <NetworkBanner />
        {/* Tự động cuộn trang lên đầu khi chuyển route hoặc tải lại */}
        <ScrollToTop />
        {/* Suspense bao bọc các tuyến đường với hiệu ứng tải thảo mộc */}
        <Suspense fallback={<LoadingScreen fullScreen />}>
          <AppRoutes />
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
