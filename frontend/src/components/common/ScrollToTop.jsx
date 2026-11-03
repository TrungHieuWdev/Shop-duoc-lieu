import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Tự động cuộn trang mượt mà khi chuyển trang trong toàn bộ ứng dụng,
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
          setTimeout(scrollToTarget, 60);
        }
      };

      const timer = setTimeout(scrollToTarget, 50);
      return () => clearTimeout(timer);
    } else {
      // Khi chuyển trang bình thường (không có hash), cuộn mượt về đầu trang
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
  }, [pathname, hash]);

  return null;
};
