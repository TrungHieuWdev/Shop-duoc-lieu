import React, { Suspense, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

const SubPageFallback = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center py-20 opacity-80">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    <span className="mt-3 text-xs text-secondary font-medium tracking-wider">Đang tải...</span>
  </div>
);

export const MainLayout = () => {
  const location = useLocation();
  const layoutRef = useRef(null);

  // Hệ thống Scroll-Reveal tự động kích hoạt hiệu ứng nổi chữ & bố cục khi khách hàng lướt xuống (chuẩn B ECO)
  useEffect(() => {
    const rootEl = layoutRef.current;
    if (!rootEl || typeof window === 'undefined') {
      return;
    }

    // Dùng WeakSet riêng cho từng vòng đời observer (tránh lỗi StrictMode / chuyển trang làm kẹt trạng thái ẩn)
    const observedElements = new WeakSet();

    const revealElement = (el) => {
      el.classList.add('is-visible');
    };

    // Kiểm tra trực tiếp bằng tọa độ khung nhìn (đảm bảo luôn hiện ngay cả khi vừa F5 hoặc cuộn nhanh)
    const checkElementsInViewport = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const pending = rootEl.querySelectorAll('.scroll-reveal:not(.is-visible)');
      pending.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= vh - 24 && rect.bottom >= 0) {
          revealElement(el);
        }
      });
    };

    const observer =
      'IntersectionObserver' in window
        ? new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  revealElement(entry.target);
                  observer.unobserve(entry.target);
                }
              });
            },
            {
              threshold: 0.08,
              rootMargin: '0px 0px -24px 0px',
            }
          )
        : null;

    const registerRevealElements = () => {
      const elements = rootEl.querySelectorAll('.scroll-reveal:not(.is-visible)');
      elements.forEach((el) => {
        if (!observedElements.has(el)) {
          observedElements.add(el);
          // Tính độ trễ so le (stagger delay) cho các thẻ nằm cùng hàng trong lưới (grid/flex)
          const parent = el.parentElement;
          if (parent) {
            const siblings = Array.from(parent.children).filter((child) =>
              child.classList.contains('scroll-reveal')
            );
            if (siblings.length > 1) {
              const idx = siblings.indexOf(el);
              const staggerMs = (idx % 4) * 80;
              el.style.setProperty('--reveal-delay', `${staggerMs}ms`);
            }
          }
          if (observer) {
            observer.observe(el);
          } else {
            revealElement(el);
          }
        }
      });
      checkElementsInViewport();
    };

    registerRevealElements();
    const rafId = window.requestAnimationFrame(checkElementsInViewport);

    window.addEventListener('scroll', checkElementsInViewport, { passive: true });
    window.addEventListener('resize', checkElementsInViewport, { passive: true });

    const mutationObserver = new MutationObserver(() => {
      registerRevealElements();
    });

    mutationObserver.observe(rootEl, {
      childList: true,
      subtree: true,
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', checkElementsInViewport);
      window.removeEventListener('resize', checkElementsInViewport);
      if (observer) observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [location.pathname]);

  return (
    <div ref={layoutRef} className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Header />
      <main className="flex-1 w-full pt-16 md:pt-20 min-h-[calc(100vh-12rem)] flex flex-col">
        <div key={location.pathname} className="flex-1 w-full">
          <Suspense fallback={<SubPageFallback />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
};

