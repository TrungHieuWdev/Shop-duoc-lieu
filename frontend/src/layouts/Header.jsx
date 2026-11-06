import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { BrandLogoIcon } from '@/components/common/BrandLogoIcon';

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const cartBounceTick = useCartStore((state) => state.cartBounceTick);
  const { user, isAuthenticated } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCartBouncing, setIsCartBouncing] = useState(false);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

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

  // Đóng ô tìm kiếm khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    if (searchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchOpen]);

  // Tự động nhận diện tab active dựa theo URL và đóng mobile menu khi chuyển trang
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);

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
      setSearchOpen(false);
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
      <div className="relative h-16 md:h-20 max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 flex items-center justify-between gap-4">
        {/* Khối Trái: Logo + Tên thương hiệu trên cùng 1 hàng, Slogan xếp ngay bên dưới */}
        <Link
          to="/"
          onClick={handleHomeClick}
          className="flex flex-col items-start shrink-0 group whitespace-nowrap z-10"
        >
          <div className="flex items-center gap-2">
            <BrandLogoIcon className="w-6 h-6 sm:w-7 sm:h-7 text-[#5c5d53] group-hover:text-primary transition-all shrink-0" />
            <span className="font-serif text-base sm:text-lg md:text-xl font-bold text-primary tracking-tight leading-none">
              NgânHàshop
            </span>
          </div>
          <span className="mt-1.5 text-[0.625rem] sm:text-[0.6875rem] font-semibold text-secondary tracking-widest uppercase leading-none">
            Đơn giản, tinh tế, an lành
          </span>
        </Link>

        {/* Khối Giữa: Navigation Links cố định chính giữa tuyệt đối (không bao giờ bị xê dịch khi mở ô tìm kiếm) */}
        <nav className="hidden lg:flex items-center justify-center gap-6 xl:gap-9 text-body-sm font-medium shrink-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2 z-10">
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

        {/* Khối Phải: Ô Tìm kiếm tự co giãn mượt mà, Admin, Giỏ hàng + Số lượng ngang hàng, Menu Mobile */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-2.5 shrink-0 z-10">
          {/* Ô Tìm kiếm tự co giãn (Expandable Search Form) */}
          <div ref={searchContainerRef} className="relative flex items-center">
            <form
              onSubmit={handleSearch}
              className={`flex items-center rounded-full overflow-hidden transition-all duration-300 ease-out ${
                searchOpen
                  ? 'w-44 sm:w-52 xl:w-60 h-9 px-3 bg-surface-container-low border border-border-herbal shadow-xs'
                  : 'w-9 h-9 px-0 bg-transparent border border-transparent hover:bg-surface-container-low justify-center'
              }`}
            >
              <button
                type={searchOpen && searchTerm.trim() ? 'submit' : 'button'}
                onClick={() => {
                  if (!searchOpen) {
                    setSearchOpen(true);
                  }
                }}
                aria-label="Tìm kiếm thảo mộc"
                title="Tìm kiếm thảo mộc"
                className={`flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
                  searchOpen ? 'text-outline hover:text-primary mr-1.5' : 'w-9 h-9 text-primary'
                }`}
              >
                <span
                  className={`material-symbols-outlined transition-all duration-200 ${
                    searchOpen ? 'text-[1.125rem]' : 'text-[1.375rem] sm:text-[1.5rem]'
                  }`}
                >
                  search
                </span>
              </button>

              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Escape' && setSearchOpen(false)}
                placeholder="Tìm thảo mộc..."
                tabIndex={searchOpen ? 0 : -1}
                className={`bg-transparent text-body-sm text-on-surface placeholder:text-outline focus:outline-none transition-all duration-300 ${
                  searchOpen ? 'w-full opacity-100' : 'w-0 opacity-0 pointer-events-none'
                }`}
              />

              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSearchOpen(false);
                }}
                tabIndex={searchOpen ? 0 : -1}
                aria-label="Đóng tìm kiếm"
                className={`text-outline hover:text-primary flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer ${
                  searchOpen ? 'w-5 h-5 ml-1 opacity-100' : 'w-0 h-0 opacity-0 pointer-events-none overflow-hidden'
                }`}
              >
                <span className="material-symbols-outlined text-[1rem]">close</span>
              </button>
            </form>
          </div>

          {/* Cổng Quản Trị Nội Bộ (Trang đăng nhập / quản trị admin) */}
          <Link
            to={isAuthenticated ? '/admin' : '/admin/login'}
            aria-label="Cổng quản trị nội bộ"
            className="relative p-1.5 rounded-full hover:bg-surface-container-low transition-colors text-primary flex items-center justify-center shrink-0 group cursor-pointer"
            title={isAuthenticated ? `Quản trị viên: ${user?.name || user?.email}` : 'Cổng Đăng Nhập Quản Trị Nội Bộ'}
          >
            <span className="material-symbols-outlined text-[1.375rem] sm:text-[1.5rem] group-hover:text-[#8a7258] transition-colors">
              {isAuthenticated ? 'admin_panel_settings' : 'person'}
            </span>
            {isAuthenticated && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-green-600 rounded-full ring-2 ring-surface shadow-xs" />
            )}
          </Link>

          {/* Giỏ hàng: Icon túi xách + Badge số lượng nằm ngang bên phải như ảnh mẫu */}
          <Link
            to="/gio-hang"
            id="header-cart-btn"
            data-cart-btn
            aria-label="Giỏ hàng"
            className={`relative flex items-center gap-2 px-1.5 py-1.5 rounded-full hover:bg-surface-container-low transition-colors text-primary shrink-0 ${
              isCartBouncing ? 'animate-cart-shake' : ''
            }`}
          >
            {/* Vòng sóng ánh vàng B ECO lan tỏa khi sản phẩm rơi vào giỏ */}
            {isCartBouncing && (
              <span className="absolute inset-0 m-auto w-8 h-8 rounded-full border-2 border-[#cbb07c] animate-cart-ripple pointer-events-none" />
            )}
            <span
              className={`material-symbols-outlined text-[1.375rem] sm:text-[1.5rem] transition-colors ${
                isCartBouncing ? 'text-[#b89667]' : ''
              }`}
            >
              shopping_bag
            </span>
            {totalItems > 0 && (
              <span
                key={`badge-${totalItems}-${cartBounceTick}`}
                className={`flex items-center justify-center min-w-[1.5rem] h-[1.5rem] px-1.5 text-[0.75rem] font-bold text-on-tertiary bg-tertiary-container rounded-full shadow-sm tabular-nums ${
                  isCartBouncing ? 'animate-badge-pop' : ''
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
            className="lg:hidden p-1.5 text-primary hover:bg-surface-container rounded transition-colors focus:outline-none shrink-0"
            aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
          >
            <span className="material-symbols-outlined text-[1.625rem]">
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

            {/* Mục tài khoản quản trị trong Drawer Mobile - dẫn đến trang riêng */}
            <Link
              to={isAuthenticated ? '/admin' : '/admin/login'}
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 pt-3 border-t border-border-herbal px-3 py-2.5 rounded font-medium text-body-sm transition-colors flex items-center justify-between text-on-surface hover:bg-surface-container w-full"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[1.25rem] text-[#8a7258]">
                  {isAuthenticated ? 'admin_panel_settings' : 'lock_person'}
                </span>
                <span>{isAuthenticated ? 'Bảng Điều Khiển Quản Trị' : 'Cổng Quản Trị Nội Bộ'}</span>
              </div>
              {isAuthenticated ? (
                <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full">
                  Admin
                </span>
              ) : (
                <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
                  Nội bộ
                </span>
              )}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

