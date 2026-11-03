import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { AdminAuthModal } from '@/components/common/AdminAuthModal';
import { BrandLogoIcon } from '@/components/common/BrandLogoIcon';

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const cartBounceTick = useCartStore((state) => state.cartBounceTick);
  const { user, isAuthenticated } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeNav, setActiveNav] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCartBouncing, setIsCartBouncing] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Hiệu ứng giỏ hàng rung lên 1 nhịp khi có món hàng rơi vào giỏ
  useEffect(() => {
    if (cartBounceTick > 0) {
      setIsCartBouncing(true);
      const timer = setTimeout(() => {
        setIsCartBouncing(false);
      }, 620);
      return () => clearTimeout(timer);
    }
  }, [cartBounceTick]);

  // Tự động nhận diện tab active dựa theo URL và đóng mobile menu khi chuyển trang
  useEffect(() => {
    setMobileMenuOpen(false);

    if (location.pathname === '/san-pham') {
      setActiveNav('san-pham');
    } else if (location.pathname === '/ve-thao-duoc') {
      setActiveNav('ve-thao-duoc');
    } else if (
      location.pathname === '/cach-dung' ||
      location.pathname === '/huong-dan-su-dung' ||
      location.pathname === '/huong-dan'
    ) {
      setActiveNav('cach-dung');
    } else if (location.pathname === '/') {
      setActiveNav('home');
    } else {
      setActiveNav('');
    }
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/san-pham?keyword=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleHomeClick = (e) => {
    setActiveNav('home');
    if (location.pathname === '/') {
      if (e) e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Chỉ item active mới có gạch chân xanh đậm. Item inactive chỉ đổi màu chữ khi hover, KHÔNG hiện vạch mờ.
  const getLinkClasses = (isActive) => {
    return isActive
      ? 'text-primary font-bold border-b-2 border-primary pb-1 transition-all whitespace-nowrap active:scale-95'
      : 'text-on-surface-variant hover:text-primary transition-all py-1 border-b-2 border-transparent whitespace-nowrap active:scale-95';
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-surface/95 backdrop-blur-md border-b border-border-herbal">
      <div className="h-16 md:h-20 max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 flex items-center justify-between gap-3 sm:gap-4 xl:gap-8">
        {/* Brand Logo & Title */}
        <Link
          to="/"
          onClick={handleHomeClick}
          className="flex items-center gap-2.5 sm:gap-3 shrink-0 group"
        >
          <BrandLogoIcon className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-[#5c5d53] group-hover:text-primary transition-all shrink-0" />
          <div className="flex flex-col whitespace-nowrap">
            <span className="font-serif text-base sm:text-lg md:text-xl font-bold text-primary tracking-tight">
              NgânHàshop
            </span>
            <span className="text-[0.625rem] sm:text-[0.6875rem] font-semibold text-secondary tracking-widest uppercase">
              Đơn giản, tinh tế, an lành
            </span>
          </div>
        </Link>

        {/* Navigation Links with 4 Distinct Routes (Desktop >= lg) */}
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
            className={getLinkClasses(activeNav === 'san-pham')}
          >
            Sản phẩm
          </Link>
          <Link
            to="/ve-thao-duoc"
            className={getLinkClasses(activeNav === 've-thao-duoc')}
          >
            Về thảo dược
          </Link>
          <Link
            to="/cach-dung"
            className={getLinkClasses(activeNav === 'cach-dung')}
          >
            Cách dùng
          </Link>
        </nav>

        {/* Right Controls: Search, Cart, Mobile/Tablet Menu */}
        <div className="flex items-center gap-2 sm:gap-3 xl:gap-4 shrink-0">
          {/* Quick Search on Tablet & Desktop */}
          <form onSubmit={handleSearch} className="relative hidden md:block w-40 lg:w-52 xl:w-64">
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

          {/* Account / Admin Login Icon (Phong cách B-ECO) */}
          <button
            type="button"
            onClick={() => setAuthModalOpen(true)}
            aria-label="Tài khoản quản trị"
            className="relative p-2 rounded hover:bg-surface-container-low transition-colors text-primary shrink-0 group cursor-pointer"
            title={isAuthenticated ? `Quản trị viên: ${user?.name || user?.email}` : 'Đăng nhập Quản trị viên'}
          >
            <span className="material-symbols-outlined text-[1.625rem] sm:text-[1.75rem] group-hover:text-[#8a7258] transition-colors">
              {isAuthenticated ? 'admin_panel_settings' : 'person'}
            </span>
            {isAuthenticated && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-600 rounded-full ring-2 ring-surface shadow-xs" />
            )}
          </button>

          {/* Cart Icon with Dynamic Badge & Shake Animation */}
          <Link
            to="/gio-hang"
            id="header-cart-btn"
            data-cart-btn
            aria-label="Giỏ hàng"
            className={`relative p-2 rounded hover:bg-surface-container-low transition-colors text-primary shrink-0 ${
              isCartBouncing ? 'animate-cart-shake' : ''
            }`}
          >
            {/* Vòng sóng ánh vàng B ECO lan tỏa khi sản phẩm rơi vào giỏ */}
            {isCartBouncing && (
              <span className="absolute inset-0 m-auto w-8 h-8 rounded-full border-2 border-[#cbb07c] animate-cart-ripple pointer-events-none" />
            )}
            <span
              className={`material-symbols-outlined text-[1.625rem] sm:text-[1.75rem] transition-colors ${
                isCartBouncing ? 'text-[#b89667]' : ''
              }`}
            >
              shopping_bag
            </span>
            {totalItems > 0 && (
              <span
                key={`badge-${totalItems}-${cartBounceTick}`}
                className={`absolute top-1 right-1 flex items-center justify-center min-w-[1.25rem] h-[1.25rem] px-1 text-[0.6875rem] font-bold text-on-tertiary bg-tertiary-container rounded-full shadow-sm ${
                  isCartBouncing ? 'animate-badge-pop' : 'animate-pulse'
                }`}
              >
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
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2.5 rounded font-medium text-body-sm transition-colors flex items-center justify-between ${
                activeNav === 'san-pham'
                  ? 'bg-primary-container text-primary font-bold'
                  : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              <span>Sản phẩm</span>
              {activeNav === 'san-pham' && <span className="material-symbols-outlined text-sm">check</span>}
            </Link>
            <Link
              to="/ve-thao-duoc"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2.5 rounded font-medium text-body-sm transition-colors flex items-center justify-between ${
                activeNav === 've-thao-duoc'
                  ? 'bg-primary-container text-primary font-bold'
                  : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              <span>Về thảo dược</span>
              {activeNav === 've-thao-duoc' && <span className="material-symbols-outlined text-sm">check</span>}
            </Link>
            <Link
              to="/cach-dung"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2.5 rounded font-medium text-body-sm transition-colors flex items-center justify-between ${
                activeNav === 'cach-dung'
                  ? 'bg-primary-container text-primary font-bold'
                  : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              <span>Cách dùng</span>
              {activeNav === 'cach-dung' && <span className="material-symbols-outlined text-sm">check</span>}
            </Link>

            {/* Mục tài khoản quản trị trong Drawer Mobile */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setAuthModalOpen(true);
              }}
              className="mt-2 pt-3 border-t border-border-herbal px-3 py-2.5 rounded font-medium text-body-sm transition-colors flex items-center justify-between text-on-surface hover:bg-surface-container text-left w-full cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[1.25rem] text-[#8a7258]">
                  {isAuthenticated ? 'admin_panel_settings' : 'person'}
                </span>
                <span>{isAuthenticated ? 'Tài khoản Quản trị' : 'Đăng nhập Quản trị'}</span>
              </div>
              {isAuthenticated && (
                <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full">
                  Admin
                </span>
              )}
            </button>
          </nav>
        </div>
      )}

      {/* Modal Đăng nhập & Quản lý phiên Quản Trị Viên */}
      <AdminAuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </header>
  );
};

