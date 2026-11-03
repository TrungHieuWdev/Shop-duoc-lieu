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
    // 1. Khi F5 / reload lại trang: luôn đặt ngay về đầu Trang chủ, không tạo độ trễ cuộn
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      if (pathname === '/' && hash) {
        navigate('/', { replace: true });
      }
      window.scrollTo(0, 0);
      return;
    }

    // 2. Khi người dùng thao tác click vào các mục có hash (#san-pham, #quy-trinh) trong cùng trang
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
      // Khi chuyển sang trang mới, đặt ngay đỉnh trang tức thì để trang mới hiển thị tự nhiên, không bị giật cuộn
      window.scrollTo(0, 0);
    }
  }, [pathname, hash, navigate]);

  return null;
};
