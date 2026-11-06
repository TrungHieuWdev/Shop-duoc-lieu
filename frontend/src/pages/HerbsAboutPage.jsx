import React from 'react';
import { Link } from 'react-router-dom';
import { NATURAL_HERBS } from '@/features/products/components/NaturalHerbsSlider';

export const HerbsAboutPage = () => {
  return (
    <div className="w-full max-w-[1536px] mx-auto px-3.5 sm:px-8 lg:px-12 xl:px-16 py-6 sm:py-12">
      {/* 1. HERO BANNER TRANG VỀ THẢO DƯỢC (PHONG CÁCH EDITORIAL B-ECO) */}
      <section className="mb-8 sm:mb-16 overflow-hidden rounded-2xl border border-border-herbal/70 bg-surface-container-low shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] items-stretch">
          {/* Cột chữ bên trái */}
          <div className="flex flex-col justify-center p-5 sm:p-10 lg:p-14">
            <span className="eco-rise text-[0.625rem] sm:text-xs font-semibold text-secondary uppercase tracking-[0.2em] sm:tracking-[0.25em] mb-1.5 sm:mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[0.875rem] sm:text-[1rem] text-[#8a7258]">spa</span>
              NGUỒN DƯỢC LIỆU BẢN ĐỊA • AN TOÀN LÀNH TÍNH
            </span>
            <h1 className="eco-rise-1 font-serif text-2xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight leading-tight mb-2 sm:mb-3">
              Về Thảo Dược
            </h1>
            <p className="eco-rise-2 font-serif text-sm sm:text-lg text-[#8a7258] font-medium mb-2 sm:mb-3">
              Tinh hoa cỏ cây thuần Việt — Phơi khô giữ trọn tinh dầu
            </p>
            <p className="eco-rise-2 text-xs sm:text-sm text-on-surface-variant max-w-[52ch] leading-relaxed mb-5 sm:mb-6">
              Tuyển chọn 7 vị thảo mộc xông tắm dân gian từ các vùng đất lành Việt Nam: Đinh lăng, Gừng sẻ, Lá trầu không, Ngải cứu, Sả chanh, Lá bưởi và Hoa hồng. Toàn bộ được phơi khô mộc mạc theo phương pháp thủ công, không hóa chất bảo quản, giữ trọn vẹn dược tính tự nhiên.
            </p>

            <div className="eco-rise-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              <Link
                to="/san-pham"
                className="w-full sm:w-auto text-center justify-center px-5 py-2.5 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold uppercase tracking-wider rounded-xl sm:rounded shadow-xs transition-all flex items-center"
              >
                Xem Sản Phẩm
              </Link>
              <Link
                to="/cach-dung"
                className="w-full sm:w-auto text-center justify-center px-5 py-2.5 bg-surface hover:bg-surface-container border border-border-herbal text-primary text-xs font-bold uppercase tracking-wider rounded-xl sm:rounded transition-all flex items-center"
              >
                Xem Cách Dùng
              </Link>
            </div>
          </div>

          {/* Cột ảnh bên phải */}
          <div className="eco-image-rise relative min-h-[220px] sm:min-h-[340px] bg-surface-container overflow-hidden">
            <img
              src="/images/products/bai-thuoc-7-vi.jpg"
              alt="7 Nia Thảo Mộc Phơi Khô"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-y-0 left-0 hidden lg:block w-32 bg-gradient-to-r from-surface-container-low to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent lg:hidden"></div>
          </div>
        </div>
      </section>

      {/* 2. KHÁM PHÁ CHI TIẾT 7 VỊ THẢO DƯỢC BẢN ĐỊA */}
      <section className="mb-14 sm:mb-20">
        <div className="scroll-reveal text-center max-w-xl mx-auto mb-8 sm:mb-12">
          <span className="text-[0.6875rem] sm:text-xs font-semibold text-secondary uppercase tracking-widest flex items-center justify-center gap-1.5 mb-1.5">
            <span className="material-symbols-outlined text-[1rem] text-[#8a7258]">local_florist</span>
            7 VỊ THẢO MỘC CỔ TRUYỀN
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-primary font-bold">
            Đặc Tính & Dược Liệu Từng Vị
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5">
            Mỗi loài thảo mộc đều mang một tính ấm, hương thơm và công dụng dưỡng sinh riêng biệt
          </p>
        </div>

        {/* Lưới 7 thẻ thảo mộc thiết kế tinh tế */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {NATURAL_HERBS.map((herb) => (
            <div
              key={herb.id}
              className="scroll-reveal bg-surface rounded-2xl border border-border-herbal/70 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group"
            >
              {/* Hình ảnh thảo dược */}
              <div className="relative aspect-[4/3] bg-surface-container-high overflow-hidden">
                <img
                  src={herb.image}
                  alt={herb.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute top-3 left-3 bg-surface/90 backdrop-blur-xs border border-border-herbal/60 rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                  {herb.method || 'Phơi khô'}
                </div>
              </div>

              {/* Thông tin & công dụng */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-serif text-lg font-bold text-primary mb-2 group-hover:text-secondary transition-colors">
                  {herb.name}
                </h3>

                <div className="h-[1px] bg-gradient-to-r from-border-herbal via-border-herbal/50 to-transparent my-1"></div>

                <div className="mt-2.5 mb-2 flex items-center gap-1 text-[11px] uppercase tracking-wider font-semibold text-secondary">
                  <span className="material-symbols-outlined text-[0.875rem] text-[#8a7258]">spa</span>
                  <span>Công dụng nổi bật</span>
                </div>

                <ul className="space-y-1.5 text-xs text-on-surface-variant flex-1 mb-4">
                  {herb.benefits.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-[#8a7258] font-bold shrink-0 mt-0.5">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={`/san-pham?keyword=${encodeURIComponent(herb.searchKeyword || herb.name)}`}
                  className="mt-auto inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-surface-container-low hover:bg-primary hover:text-on-primary text-primary text-xs font-semibold rounded-lg border border-border-herbal/60 transition-all text-center"
                >
                  <span>Xem sản phẩm chứa vị này</span>
                  <span className="material-symbols-outlined text-[1rem]">arrow_forward</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CAM KẾT CHẤT LƯỢNG NGÂN HÀ */}
      <section className="scroll-reveal bg-surface-container-low rounded-2xl border border-border-herbal/70 p-8 sm:p-12 mb-8">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-[0.6875rem] sm:text-xs font-semibold text-secondary uppercase tracking-widest block mb-2">
            TRIẾT LÝ TỰ NHIÊN
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-primary font-bold mb-4">
            Cam Kết Từ Từng Chiếc Lá Nhỏ
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-8">
            Chúng tôi tin rằng cơ thể con người luôn có khả năng tự chữa lành và phục hồi kỳ diệu khi được nâng niu bằng những ngọn cỏ, cành lá thảo mộc thuần khiết của quê hương.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="scroll-reveal bg-surface p-5 rounded-xl border border-border-herbal/60">
              <span className="material-symbols-outlined text-primary text-[2rem] mb-2">eco</span>
              <h4 className="font-serif text-sm font-bold text-primary mb-1">100% Tự Nhiên</h4>
              <p className="text-xs text-on-surface-variant">Không chất bảo quản, không hương liệu tổng hợp, an toàn cho cả phụ nữ sau sinh.</p>
            </div>

            <div className="scroll-reveal bg-surface p-5 rounded-xl border border-border-herbal/60">
              <span className="material-symbols-outlined text-primary text-[2rem] mb-2">wb_sunny</span>
              <h4 className="font-serif text-sm font-bold text-primary mb-1">Phơi Khô Tự Nhiên</h4>
              <p className="text-xs text-on-surface-variant">Đón nắng gió mộc mạc, giữ trọn vẹn màu sắc tự nhiên và túi tinh dầu quý giá.</p>
            </div>

            <div className="scroll-reveal bg-surface p-5 rounded-xl border border-border-herbal/60">
              <span className="material-symbols-outlined text-primary text-[2rem] mb-2">verified</span>
              <h4 className="font-serif text-sm font-bold text-primary mb-1">Dược Liệu Bản Địa</h4>
              <p className="text-xs text-on-surface-variant">Tuyển chọn từ nguồn thảo dược quen thuộc, lành tính trong dân gian Việt Nam.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HerbsAboutPage;

