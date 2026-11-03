import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Tự động cuộn trang mượt mà khi chuyển trang trong toàn bộ ứng dụng,
 * và đặc biệt: khi loading / reload lại trang (F5) thì luôn tự động cuộn về đỉnh Trang chủ.
 */
export const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const isInitialLoad = useRef(true);

  useEffect(() => {
    // 1. Khi F5 / reload lại trang: luôn cuộn về đầu Trang chủ
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      if (pathname === '/' && hash) {
        navigate('/', { replace: true });
      }
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
      const timer = setTimeout(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      }, 100);
      return () => clearTimeout(timer);
    }

    // 2. Khi người dùng thao tác click vào các mục có hash (#san-pham, #quy-trinh, #huong-dan)
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
  }, [pathname, hash, navigate]);

  return null;
};
