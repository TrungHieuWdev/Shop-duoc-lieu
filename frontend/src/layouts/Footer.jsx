import React from 'react';
import { Link } from 'react-router-dom';
import { BrandLogoIcon } from '@/components/common/BrandLogoIcon';

export const Footer = () => {
  return (
    <footer className="w-full bg-surface-container-low border-t border-border-herbal mt-10 sm:mt-16 lg:mt-24">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-10 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-8">
          {/* Cột 1: Thông điệp thương hiệu */}
          <div className="flex flex-col gap-3.5 sm:gap-4">
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2">
                <BrandLogoIcon className="w-6 h-6 sm:w-7 sm:h-7 text-[#5c5d53] shrink-0" />
                <span className="font-sans italic text-lg sm:text-xl tracking-tight leading-none">
                  <span className="font-extrabold text-primary">NgânHà</span>
                  <span className="font-normal text-secondary">shop</span>
                </span>
              </div>
              <span className="mt-1.5 text-[0.625rem] font-semibold text-secondary tracking-widest uppercase leading-none">
                Đơn giản, tinh tế, an lành
              </span>
            </div>
            <p className="text-xs sm:text-body-sm text-on-surface-variant leading-relaxed">
              Giữ vẹn nguyên hồn thảo mộc bản địa Việt Nam. Thuần khiết, mộc mạc và an tâm cho sức khỏe gia đình bạn.
            </p>
          </div>

          {/* Cột 2: Cam kết tự nhiên */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <h4 className="font-serif text-base sm:text-lg font-bold text-primary">Cam Kết Tự Nhiên</h4>
            <ul className="flex flex-col gap-2 sm:gap-2.5 text-xs sm:text-body-sm text-on-surface-variant">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-secondary text-[1rem] mt-0.5">eco</span>
                <span>100% thảo mộc bản địa Việt Nam</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-secondary text-[1rem] mt-0.5">spa</span>
                <span>Không hương liệu nhân tạo độc hại</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-secondary text-[1rem] mt-0.5">verified</span>
                <span>Không chất bảo quản công nghiệp</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-secondary text-[1rem] mt-0.5">wb_sunny</span>
                <span>Phơi khô tự nhiên giữ trọn tinh dầu</span>
              </li>
            </ul>
          </div>

          {/* Cột 3: Vùng dược liệu & Liên hệ */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <h4 className="font-serif text-base sm:text-lg font-bold text-primary">Liên Hệ & Cửa Hàng</h4>
            <ul className="flex flex-col gap-2 sm:gap-2.5 text-xs sm:text-body-sm text-on-surface-variant">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-[1.125rem] mt-0.5">location_on</span>
                <span>Dược liệu bản địa thu hái từ các vùng đất lành Việt Nam</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[1.125rem]">call</span>
                <span>Hotline: 1900 6826 / 0987 654 321</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[1.125rem]">mail</span>
                <span>lienhe@nganhashop.vn</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[1.125rem]">schedule</span>
                <span>Thứ 2 - Chủ Nhật: 08:00 - 20:30</span>
              </li>
            </ul>
          </div>

          {/* Cột 4: Liên kết nhanh theo 4 trang điều hướng */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <h4 className="font-serif text-base sm:text-lg font-bold text-primary">Liên Kết Nhanh</h4>
            <ul className="flex flex-col gap-1.5 sm:gap-2 text-xs sm:text-body-sm text-on-surface-variant">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/san-pham" className="hover:text-primary transition-colors">
                  Sản phẩm thảo mộc
                </Link>
              </li>
              <li>
                <Link to="/ve-thao-duoc" className="hover:text-primary transition-colors">
                  Về thảo dược bản địa
                </Link>
              </li>
              <li>
                <Link to="/cach-dung" className="hover:text-primary transition-colors">
                  Cách dùng & nấu nước tắm
                </Link>
              </li>
              <li>
                <Link to="/san-pham/bai-thuoc-xong-tam-tong-hop-7-vi-thao-duoc" className="hover:text-primary transition-colors font-semibold text-primary">
                  Bài thuốc 7 vị (50.000đ)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Chân trang bản quyền */}
        <div className="border-t border-border-herbal mt-8 sm:mt-12 pt-5 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-xs sm:text-body-sm text-on-surface-variant text-center sm:text-left">
            © 2026 Ngân Hà Thảo Mộc. Tinh hoa dược liệu bản địa phơi khô tự nhiên.
          </p>
          <div className="flex items-center flex-wrap justify-center gap-3 sm:gap-6 text-[0.6875rem] sm:text-[0.75rem] font-semibold text-secondary uppercase tracking-wider sm:tracking-widest">
            <span>Thuần Lành</span>
            <span>•</span>
            <span>Tâm An</span>
            <span>•</span>
            <span>Bền Vững</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

