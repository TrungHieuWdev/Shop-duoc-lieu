import React, { Suspense, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { ScrollToTop } from './components/common/ScrollToTop';
import { NetworkBanner } from './components/common/NetworkBanner';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LoadingScreen } from './components/common/LoadingScreen';
import { useAdminStore } from './store/useAdminStore';
import { supabase, isSupabaseConfigured } from './lib/supabase';

export const App = () => {
  const hydratePublicData = useAdminStore((s) => s.hydratePublicData);

  useEffect(() => {
    hydratePublicData?.();

    let channel = null;
    if (isSupabaseConfigured && supabase) {
      channel = supabase
        .channel('public-shop-sync')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'shop_settings' },
          () => hydratePublicData?.()
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'products' },
          () => hydratePublicData?.()
        )
        .subscribe();
    }

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        hydratePublicData?.();
      }
    };
    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);

    return () => {
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
    };
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
