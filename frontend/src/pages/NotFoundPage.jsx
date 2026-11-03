import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BotanicalDivider } from '@/components/common/BotanicalDivider';
import { BotanicalWatermark } from '@/components/common/BotanicalWatermark';

export const NotFoundPage = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/san-pham?keyword=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate('/san-pham');
    }
  };

  const quickLinks = [
    { name: 'Thảo mộc xông tắm', icon: 'spa', to: '/san-pham?category=thao-moc-xong-tam' },
    { name: 'Gội đầu bồ kết', icon: 'shower', to: '/san-pham?category=cham-soc-toc-tu-nhien' },
    { name: 'Muối ngâm chân', icon: 'self_improvement', to: '/san-pham?category=muoi-ngam-chan-duoc-lieu' },
    { name: 'Xà bông sinh dược', icon: 'clean_hands', to: '/san-pham?category=xa-bong-sinh-duoc' },
  ];

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24 overflow-hidden bg-surface">
      {/* Hình mờ thảo mộc trang trí góc dưới bên phải */}
      <BotanicalWatermark className="bottom-0 right-0 max-w-[280px] sm:max-w-[400px] pointer-events-none opacity-40" />

      <div className="max-w-2xl w-full mx-auto text-center relative z-10">
        {/* Số 404 lớn cách điệu nghệ thuật Thảo Mộc */}
        <div className="relative inline-flex items-center justify-center mb-2 select-none">
          <div className="font-serif text-8xl sm:text-9xl lg:text-[11rem] font-bold tracking-tighter text-primary/90 flex items-center justify-center leading-none">
            <span>4</span>
            <div className="relative inline-flex items-center justify-center mx-1 sm:mx-2">
              <span className="text-secondary">0</span>
              {/* Cành lá thảo mộc mọc vươn lên từ số 0 */}
              <span className="material-symbols-outlined absolute -top-4 sm:-top-6 text-2xl sm:text-4xl text-[#8a7258] animate-bounce-gentle">
                potted_plant
              </span>
            </div>
            <span>4</span>
          </div>
        </div>

        {/* Nhãn phụ phong cách Dược Thảo */}
        <p className="text-xs sm:text-sm uppercase tracking-widest text-[#8a7258] font-semibold mb-3">
          LỐI RẼ CHƯA CÓ TRÊN BẢN ĐỒ DƯỢC THẢO
        </p>

        {/* Tiêu đề chính */}
        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-3">
          Trang Không Tồn Tại Hoặc Đã Lạc Hướng
        </h1>

        {/* Lời nhắn gửi an lành */}
        <p className="text-body-sm sm:text-body-md text-on-surface-variant max-w-lg mx-auto mb-6 leading-relaxed">
          Đường dẫn bạn truy cập có thể đã được thay đổi hoặc sản phẩm thảo mộc đã chuyển sang ngăn lưu trữ khác. Đừng lo lắng, hãy cùng Ngân Hà tìm lại lối về nhé.
        </p>

        {/* Đường kẻ thảo mộc uốn lượn */}
        <div className="flex justify-center my-4">
          <BotanicalDivider />
        </div>

        {/* Hộp tìm kiếm tức thì ngay trên trang 404 (Chuẩn UX 2026) */}
        <form
          onSubmit={handleSearch}
          className="max-w-md mx-auto my-6 flex items-center bg-surface-container-low border border-border-herbal rounded-full p-1.5 shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all"
        >
          <span className="material-symbols-outlined text-outline pl-3 pr-2 text-[1.25rem]">
            search
          </span>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm kiếm vị thảo mộc bạn cần..."
            className="flex-1 bg-transparent py-1.5 text-body-sm text-on-surface placeholder:text-outline focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary text-xs sm:text-sm font-medium rounded-full transition-colors cursor-pointer shrink-0"
          >
            Tìm kiếm
          </button>
        </form>

        {/* Gợi ý lối tắt sản phẩm nhanh */}
        <div className="my-6">
          <p className="text-xs text-on-surface-variant/80 mb-3 font-medium">
            Hoặc khám phá nhanh các bộ sưu tập thảo mộc được yêu thích:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto">
            {quickLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-lowest hover:bg-surface-container border border-border-herbal rounded-full text-xs sm:text-sm text-primary hover:text-primary-container transition-all hover:-translate-y-0.5 shadow-2xs"
              >
                <span className="material-symbols-outlined text-[1rem] text-[#8a7258]">
                  {link.icon}
                </span>
                <span>{link.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Cụm nút điều hướng chính */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-8 mb-8">
          <Link
            to="/"
            className="w-full sm:w-auto px-7 py-3 bg-primary hover:bg-primary-container text-on-primary font-medium rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 group"
          >
            <span className="material-symbols-outlined text-[1.25rem] group-hover:-translate-x-0.5 transition-transform">
              home
            </span>
            <span>Về Trang Chủ</span>
          </Link>

          <Link
            to="/san-pham"
            className="w-full sm:w-auto px-7 py-3 bg-surface-container-lowest hover:bg-surface-container border border-border-herbal text-primary font-medium rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 group"
          >
            <span className="material-symbols-outlined text-[1.25rem] text-[#54634c] group-hover:scale-110 transition-transform">
              storefront
            </span>
            <span>Xem Tất Cả Sản Phẩm</span>
          </Link>
        </div>

        {/* Thẻ liên hệ hotline hỗ trợ */}
        <div className="pt-6 border-t border-border-herbal/60 text-xs text-on-surface-variant flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <span className="flex items-center gap-1 text-[#8a7258]">
            <span className="material-symbols-outlined text-[1rem]">support_agent</span>
            Cần tìm dược liệu đặc thù?
          </span>
          <a
            href="tel:19006826"
            className="text-primary font-semibold hover:underline flex items-center gap-1"
          >
            Hotline: 1900 6826
          </a>
          <span className="text-outline hidden sm:inline">•</span>
          <span className="text-on-surface-variant/70">8:00 - 21:00 hàng ngày</span>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
