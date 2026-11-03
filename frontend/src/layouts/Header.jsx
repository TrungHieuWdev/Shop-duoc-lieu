import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCartStore } from '@/store/useCartStore';

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [searchTerm, setSearchTerm] = useState('');
  const [activeNav, setActiveNav] = useState('home');

  // Tự động nhận diện tab active dựa theo URL
  useEffect(() => {
    if (location.pathname.startsWith('/san-pham')) {
      setActiveNav('san-pham');
    } else if (location.pathname === '/') {
      if (location.hash === '#quy-trinh') {
        setActiveNav('quy-trinh');
      } else if (location.hash === '#huong-dan') {
        setActiveNav('huong-dan');
      } else {
        setActiveNav('home');
      }
    } else {
      setActiveNav('');
    }
  }, [location.pathname, location.hash]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/san-pham?keyword=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleHomeClick = () => {
    setActiveNav('home');
    if (location.pathname === '/') {
      window.history.pushState(null, '', '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavAnchor = (e, targetId) => {
    e.preventDefault();
    setActiveNav(targetId);
    if (location.pathname !== '/') {
      navigate(`/#${targetId}`);
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.history.pushState(null, '', `/#${targetId}`);
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Chỉ item active mới có gạch chân xanh đậm. Item inactive chỉ đổi màu chữ khi hover, KHÔNG hiện vạch mờ.
  const getLinkClasses = (isActive) => {
    return isActive
      ? 'text-primary font-semibold border-b-2 border-primary pb-1 transition-colors whitespace-nowrap'
      : 'text-on-surface-variant hover:text-primary transition-colors py-1 border-b-2 border-transparent whitespace-nowrap';
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-surface/95 backdrop-blur-md border-b border-border-herbal">
      <div className="h-20 max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 flex items-center justify-between gap-4 xl:gap-8">
        {/* Brand Logo & Title */}
        <Link
          to="/"
          onClick={handleHomeClick}
          className="flex items-center gap-3 shrink-0"
        >
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary-fixed shadow-sm shrink-0">
            <span className="material-symbols-outlined text-[1.5rem]">spa</span>
          </div>
          <div className="flex flex-col whitespace-nowrap">
            <span className="font-serif text-lg md:text-xl font-bold text-primary tracking-tight">
              NgânHàshop
            </span>
            <span className="text-[0.6875rem] font-semibold text-secondary tracking-widest uppercase">
              Đơn giản, tinh tế, an lành
            </span>
          </div>
        </Link>

        {/* Navigation Links with Clean Single Active State */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-8 text-body-sm font-medium shrink-0">
          <Link
            to="/"
            onClick={handleHomeClick}
            className={getLinkClasses(activeNav === 'home')}
          >
            Trang chủ
          </Link>
          <Link
            to="/san-pham"
            onClick={() => setActiveNav('san-pham')}
            className={getLinkClasses(activeNav === 'san-pham')}
          >
            Sản phẩm
          </Link>
          <a
            href="/#quy-trinh"
            onClick={(e) => handleNavAnchor(e, 'quy-trinh')}
            className={getLinkClasses(activeNav === 'quy-trinh')}
          >
            Quy trình sấy lạnh
          </a>
          <a
            href="/#huong-dan"
            onClick={(e) => handleNavAnchor(e, 'huong-dan')}
            className={getLinkClasses(activeNav === 'huong-dan')}
          >
            Cách nấu xông tắm
          </a>
        </nav>

        {/* Right Controls: Search, Hotline, Cart */}
        <div className="flex items-center gap-3 xl:gap-4 shrink-0">
          {/* Quick Search */}
          <form onSubmit={handleSearch} className="relative hidden sm:block w-40 xl:w-56">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[1.125rem]">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm thảo mộc..."
              className="w-full pl-9 pr-3 py-1.5 bg-surface-container-low border border-border-herbal rounded text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
            />
          </form>

          {/* Hotline */}
          <a
            href="tel:19006826"
            className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded border border-border-herbal bg-surface-container-lowest text-primary hover:bg-surface-container transition-colors shadow-sm shrink-0 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[1rem] text-tertiary-container">
              call
            </span>
            <span className="text-xs font-semibold tracking-wider">1900 6826</span>
          </a>

          {/* Cart Icon with Dynamic Badge */}
          <Link
            to="/gio-hang"
            aria-label="Giỏ hàng"
            className="relative p-2 rounded hover:bg-surface-container-low transition-colors text-primary shrink-0"
          >
            <span className="material-symbols-outlined text-[1.75rem]">shopping_bag</span>
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center min-w-[1.25rem] h-[1.25rem] px-1 text-[0.6875rem] font-bold text-on-tertiary bg-tertiary-container rounded-full shadow-sm animate-pulse">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

