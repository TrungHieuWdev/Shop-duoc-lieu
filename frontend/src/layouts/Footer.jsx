import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="w-full bg-surface-container-low border-t border-border-herbal mt-16 lg:mt-24">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Cột 1: Thông điệp thương hiệu */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold text-primary">MỘC NHIÊN THẢO</span>
              <span className="text-[0.6875rem] font-semibold text-secondary tracking-widest uppercase">
                Thảo Mộc Bản Địa Việt
              </span>
            </div>
            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              Giữ vẹn nguyên hồn thảo mộc bản địa Việt Nam. Thuần khiết, mộc mạc và an tâm cho sức khỏe gia đình bạn.
            </p>
            <div className="flex flex-col gap-1 pt-2">
              <span className="text-[0.75rem] font-semibold text-tertiary uppercase tracking-wider">
                Chứng Nhận Dược Liệu
              </span>
              <p className="text-body-sm text-on-surface-variant">
                Dược liệu sấy lạnh kiểm định chất lượng an toàn, không pha trộn tạp chất.
              </p>
            </div>
          </div>

          {/* Cột 2: Cam kết tự nhiên */}
          <div className="flex flex-col gap-4">
            <h4 className="font-serif text-lg font-bold text-primary">Cam Kết Tự Nhiên</h4>
            <ul className="flex flex-col gap-2.5 text-body-sm text-on-surface-variant">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-secondary text-[1rem] mt-0.5">eco</span>
                <span>100% thảo mộc bản địa vùng cao</span>
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
                <span className="material-symbols-outlined text-secondary text-[1rem] mt-0.5">local_florist</span>
                <span>Quy trình sấy lạnh đối lưu 35°C</span>
              </li>
            </ul>
          </div>

          {/* Cột 3: Vùng dược liệu & Liên hệ */}
          <div className="flex flex-col gap-4">
            <h4 className="font-serif text-lg font-bold text-primary">Liên Hệ & Vùng Dược Liệu</h4>
            <ul className="flex flex-col gap-2.5 text-body-sm text-on-surface-variant">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-[1.125rem] mt-0.5">location_on</span>
                <span>Vườn dược liệu Ba Vì (Hà Nội) & dãy Tây Bắc</span>
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

          {/* Cột 4: Danh mục sản phẩm */}
          <div className="flex flex-col gap-4">
            <h4 className="font-serif text-lg font-bold text-primary">Dòng Sản Phẩm</h4>
            <ul className="flex flex-col gap-2 text-body-sm text-on-surface-variant">
              <li>
                <Link to="/san-pham?category=thao-moc-xong-tam" className="hover:text-primary transition-colors">
                  Thảo Mộc Xông Tắm Sau Sinh
                </Link>
              </li>
              <li>
                <Link to="/san-pham?category=muoi-ngam-chan-duoc-lieu" className="hover:text-primary transition-colors">
                  Muối Ngâm Chân Thảo Dược
                </Link>
              </li>
              <li>
                <Link to="/san-pham?category=cham-soc-toc-tu-nhien" className="hover:text-primary transition-colors">
                  Cao Bồ Kết & Dưỡng Tóc Vỏ Bưởi
                </Link>
              </li>
              <li>
                <Link to="/san-pham?category=xa-bong-sinh-duoc" className="hover:text-primary transition-colors">
                  Xà Bông Nghệ & Khổ Qua Sinh Dược
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Chân trang bản quyền */}
        <div className="border-t border-border-herbal mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-body-sm text-on-surface-variant text-center sm:text-left">
            © 2026 Mộc Nhiên Thảo (NganHa Shop). Tinh hoa thảo mộc bản địa Việt Nam.
          </p>
          <div className="flex items-center gap-6 text-[0.75rem] font-semibold text-secondary uppercase tracking-widest">
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

