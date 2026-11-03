import { useState, useEffect, useCallback } from 'react';

/**
 * Hook giám sát trạng thái mạng Internet chuẩn Web 2026.
 * Kết hợp sự kiện native window `online`/`offline`, `navigator.onLine`
 * và cơ chế kiểm tra chủ động (active connectivity ping).
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [isReconnected, setIsReconnected] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // Hàm chủ động kiểm tra kết nối thực tế tới server
  const checkConnection = useCallback(async () => {
    setIsChecking(true);
    try {
      // Gửi HEAD request với timestamp để tránh browser cache
      const response = await fetch(`/index.html?_t=${Date.now()}`, {
        method: 'HEAD',
        cache: 'no-store',
      });
      const online = response.ok;
      setIsOnline(online);
      return online;
    } catch {
      // Nếu fetch lỗi hoàn toàn -> thực sự mất mạng
      setIsOnline(false);
      return false;
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    let reconnectedTimer = null;

    const handleOnline = () => {
      setIsOnline(true);
      // Kích hoạt trạng thái vừa khôi phục kết nối để hiển thị thông báo mừng
      setIsReconnected(true);
      if (reconnectedTimer) clearTimeout(reconnectedTimer);
      reconnectedTimer = setTimeout(() => {
        setIsReconnected(false);
      }, 4000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (reconnectedTimer) clearTimeout(reconnectedTimer);
    };
  }, []);

  return {
    isOnline,
    isReconnected,
    isChecking,
    checkConnection,
  };
};

export default useNetworkStatus;

