import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Tự động cuộn trang về đầu khi chuyển trang trong toàn bộ ứng dụng,
 * hoặc cuộn chính xác đến vị trí phần tử có id khớp với hash (#quy-trinh, #huong-dan...)
 */
export const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace('#', '');
      let attempts = 0;
      const maxAttempts = 15;

      const scrollToTarget = () => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else if (attempts < maxAttempts) {
          attempts += 1;
          setTimeout(scrollToTarget, 80);
        }
      };

      // Đợi ngắn để DOM component kịp render trước khi cuộn
      const timer = setTimeout(scrollToTarget, 60);
      return () => clearTimeout(timer);
    } else {
      // Khi chuyển trang (không có hash), cuộn ngay lên đầu trang
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};
