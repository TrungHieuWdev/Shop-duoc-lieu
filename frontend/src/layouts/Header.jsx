import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCartStore } from '@/store/useCartStore';

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [searchTerm, setSearchTerm] = useState('');
  const [activeNav, setActiveNav] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Tự động nhận diện tab active dựa theo URL và đóng mobile menu khi chuyển trang
  useEffect(() => {
    setMobileMenuOpen(false);
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

  const handleHomeClick = (e) => {
    setActiveNav('home');
    if (location.pathname === '/' && !location.hash) {
      if (e) e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (e) e.preventDefault();
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleProductsClick = (e) => {
    setActiveNav('san-pham');
    if (location.pathname === '/san-pham') {
      if (e) e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (e) e.preventDefault();
      navigate('/san-pham');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavAnchor = (e, targetId) => {
    if (e) e.preventDefault();
    setActiveNav(targetId);
    if (location.pathname === '/') {
      window.history.pushState(null, '', `/#${targetId}`);
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${targetId}`);
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
      <div className="h-16 md:h-20 max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 flex items-center justify-between gap-3 sm:gap-4 xl:gap-8">
        {/* Brand Logo & Title */}
        <Link
          to="/"
          onClick={handleHomeClick}
          className="flex items-center gap-2.5 sm:gap-3 shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary-container flex items-center justify-center text-primary-fixed shadow-sm shrink-0">
            <span className="material-symbols-outlined text-[1.375rem] sm:text-[1.5rem]">spa</span>
          </div>
          <div className="flex flex-col whitespace-nowrap">
            <span className="font-serif text-base sm:text-lg md:text-xl font-bold text-primary tracking-tight">
              NgânHàshop
            </span>
            <span className="text-[0.625rem] sm:text-[0.6875rem] font-semibold text-secondary tracking-widest uppercase">
              Đơn giản, tinh tế, an lành
            </span>
          </div>
        </Link>

        {/* Navigation Links with Clean Single Active State (Desktop >= lg) */}
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
            onClick={handleProductsClick}
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

        {/* Right Controls: Search, Hotline, Cart, Mobile/Tablet Menu */}
        <div className="flex items-center gap-2 sm:gap-3 xl:gap-4 shrink-0">
          {/* Quick Search on Tablet & Desktop */}
          <form onSubmit={handleSearch} className="relative hidden md:block w-36 lg:w-44 xl:w-56">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[1.125rem]">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm thảo mộc..."
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
            <span className="material-symbols-outlined text-[1.625rem] sm:text-[1.75rem]">shopping_bag</span>
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center min-w-[1.25rem] h-[1.25rem] px-1 text-[0.6875rem] font-bold text-on-tertiary bg-tertiary-container rounded-full shadow-sm animate-pulse">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Mobile / Tablet Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-primary hover:bg-surface-container rounded transition-colors focus:outline-none shrink-0"
            aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
          >
            <span className="material-symbols-outlined text-[1.75rem]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Navigation Drawer (< lg) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface/98 backdrop-blur-md border-t border-border-herbal px-4 sm:px-8 py-4 flex flex-col gap-3 shadow-lg animate-fadeIn">
          {/* Quick Search on Mobile Phones */}
          <form onSubmit={(e) => { handleSearch(e); setMobileMenuOpen(false); }} className="relative block md:hidden w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[1.125rem]">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm thảo mộc..."
              className="w-full pl-9 pr-3 py-2 bg-surface-container-low border border-border-herbal rounded text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
            />
          </form>

          {/* Nav Links */}
          <nav className="flex flex-col gap-1">
            <Link
              to="/"
              onClick={(e) => { handleHomeClick(e); setMobileMenuOpen(false); }}
              className={`px-3 py-2.5 rounded font-medium text-body-sm transition-colors flex items-center justify-between ${
                activeNav === 'home'
                  ? 'bg-primary-container text-primary font-bold'
                  : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              <span>Trang chủ</span>
              {activeNav === 'home' && <span className="material-symbols-outlined text-sm">check</span>}
            </Link>
            <Link
              to="/san-pham"
              onClick={(e) => { handleProductsClick(e); setMobileMenuOpen(false); }}
              className={`px-3 py-2.5 rounded font-medium text-body-sm transition-colors flex items-center justify-between ${
                activeNav === 'san-pham'
                  ? 'bg-primary-container text-primary font-bold'
                  : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              <span>Sản phẩm</span>
              {activeNav === 'san-pham' && <span className="material-symbols-outlined text-sm">check</span>}
            </Link>
            <a
              href="/#quy-trinh"
              onClick={(e) => { handleNavAnchor(e, 'quy-trinh'); setMobileMenuOpen(false); }}
              className={`px-3 py-2.5 rounded font-medium text-body-sm transition-colors flex items-center justify-between ${
                activeNav === 'quy-trinh'
                  ? 'bg-primary-container text-primary font-bold'
                  : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              <span>Quy trình sấy lạnh</span>
              {activeNav === 'quy-trinh' && <span className="material-symbols-outlined text-sm">check</span>}
            </a>
            <a
              href="/#huong-dan"
              onClick={(e) => { handleNavAnchor(e, 'huong-dan'); setMobileMenuOpen(false); }}
              className={`px-3 py-2.5 rounded font-medium text-body-sm transition-colors flex items-center justify-between ${
                activeNav === 'huong-dan'
                  ? 'bg-primary-container text-primary font-bold'
                  : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              <span>Cách nấu xông tắm</span>
              {activeNav === 'huong-dan' && <span className="material-symbols-outlined text-sm">check</span>}
            </a>
          </nav>

          {/* Hotline in Drawer */}
          <div className="pt-3 border-t border-border-herbal flex items-center justify-between">
            <a
              href="tel:19006826"
              className="flex items-center gap-2 text-primary font-semibold text-body-sm"
            >
              <span className="material-symbols-outlined text-[1.125rem] text-tertiary-container">
                call
              </span>
              <span>Hotline tư vấn: 1900 6826</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

