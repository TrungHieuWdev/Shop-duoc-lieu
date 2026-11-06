import React from 'react';
import { Link } from 'react-router-dom';

export const UsageGuidePage = () => {
  return (
    <div className="w-full max-w-[1536px] mx-auto px-3.5 sm:px-8 lg:px-12 xl:px-16 py-6 sm:py-12">
      {/* 1. HERO BANNER TRANG CÁCH DÙNG (B-ECO EDITORIAL STYLE) */}
      <section className="mb-8 sm:mb-16 overflow-hidden rounded-2xl border border-border-herbal/70 bg-surface-container-low shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] items-stretch">
          {/* Cột chữ bên trái */}
          <div className="flex flex-col justify-center p-5 sm:p-10 lg:p-14">
            <span className="eco-rise text-[0.625rem] sm:text-xs font-semibold text-secondary uppercase tracking-[0.2em] sm:tracking-[0.25em] mb-1.5 sm:mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[0.875rem] sm:text-[1rem] text-[#8a7258]">menu_book</span>
              CẨM NANG DÂN GIAN • HƯỚNG DẪN CHI TIẾT
            </span>
            <h1 className="eco-rise-1 font-serif text-2xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight leading-tight mb-2 sm:mb-3">
              Cách Dùng Thảo Mộc
            </h1>
            <p className="eco-rise-2 font-serif text-sm sm:text-lg text-[#8a7258] font-medium mb-2 sm:mb-3">
              Phương pháp nấu nước xông tắm, dưỡng sinh &amp; phục hồi cơ thể tại nhà
            </p>
            <p className="eco-rise-2 text-xs sm:text-sm text-on-surface-variant max-w-[52ch] leading-relaxed mb-5 sm:mb-6">
              Nấu nước tắm thảo mộc là nét văn hóa dưỡng sinh cổ truyền của người Việt. Chỉ cần vài bước đơn giản, bạn có thể tự tay chuẩn bị một nồi nước thơm ấm nồng, xua tan mệt mỏi và làm ấm kinh lạc cho cả gia đình.
            </p>

            <div className="eco-rise-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              <Link
                to="/san-pham/bai-thuoc-xong-tam-tong-hop-7-vi-thao-duoc"
                className="w-full sm:w-auto text-center justify-center px-5 py-2.5 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold uppercase tracking-wider rounded-xl sm:rounded shadow-xs transition-all flex items-center"
              >
                Mua Bài Thuốc 7 Vị (50k)
              </Link>
              <Link
                to="/ve-thao-duoc"
                className="w-full sm:w-auto text-center justify-center px-5 py-2.5 bg-surface hover:bg-surface-container border border-border-herbal text-primary text-xs font-bold uppercase tracking-wider rounded-xl sm:rounded transition-all flex items-center"
              >
                Về Thảo Dược
              </Link>
            </div>
          </div>

          {/* Cột ảnh bên phải */}
          <div className="eco-image-rise relative min-h-[220px] sm:min-h-[340px] bg-surface-container overflow-hidden">
            <img
              src="/images/products/bai-thuoc-7-vi.jpg"
              alt="Chuẩn bị nấu nước tắm thảo mộc"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-y-0 left-0 hidden lg:block w-32 bg-gradient-to-r from-surface-container-low to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent lg:hidden"></div>
          </div>
        </div>
      </section>

      {/* 2. QUY TRÌNH 5 BƯỚC NẤU NƯỚC TẮM THẢO MỘC */}
      <section className="mb-14 sm:mb-20">
        <div className="scroll-reveal text-center max-w-xl mx-auto mb-8 sm:mb-12">
          <span className="text-[0.6875rem] sm:text-xs font-semibold text-secondary uppercase tracking-widest flex items-center justify-center gap-1.5 mb-1.5">
            <span className="material-symbols-outlined text-[1rem] text-[#8a7258]">bathtub</span>
            PHƯƠNG PHÁP NẤU NƯỚC TẮM DÂN GIAN
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-primary font-bold">
            <span className="font-sans">1.</span> Nấu Nước Tắm
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5">
            Áp dụng cho bài thuốc tổng hợp 7 vị và các loại thảo dược phơi khô bản địa
          </p>
        </div>

        {/* 5 Thẻ bước quy trình */}
        <div className="scroll-reveal bg-surface rounded-none border border-border-herbal p-6 sm:p-8 lg:p-10 shadow-xs mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5">
            {/* Bước 1 */}
            <div className="scroll-reveal bg-surface-container-lowest rounded-none p-5 border border-border-herbal/60 flex flex-col hover:border-primary transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <span className="font-sans text-2xl font-bold text-tertiary tabular-nums">01</span>
                <div className="w-10 h-10 rounded-none bg-surface-container flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[1.25rem]">inventory_2</span>
                </div>
              </div>
              <h4 className="font-serif text-sm sm:text-base font-bold text-primary mb-1.5">
                Chuẩn bị thảo mộc
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Chuẩn bị 1 gói thảo mộc. Rửa sơ bụi nhẹ qua nước sạch trước khi cho vào nồi.
              </p>
            </div>

            {/* Bước 2 */}
            <div className="scroll-reveal bg-surface-container-lowest rounded-none p-5 border border-border-herbal/60 flex flex-col hover:border-primary transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <span className="font-sans text-2xl font-bold text-tertiary tabular-nums">02</span>
                <div className="w-10 h-10 rounded-none bg-surface-container flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[1.25rem]">water_drop</span>
                </div>
              </div>
              <h4 className="font-serif text-sm sm:text-base font-bold text-primary mb-1.5">
                Thêm nước vào nồi
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Cho vào nồi cùng khoảng 3–5 lít nước để ngập đều toàn bộ thảo mộc.
              </p>
            </div>

            {/* Bước 3 */}
            <div className="scroll-reveal bg-surface-container-lowest rounded-none p-5 border border-border-herbal/60 flex flex-col hover:border-primary transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <span className="font-sans text-2xl font-bold text-tertiary tabular-nums">03</span>
                <div className="w-10 h-10 rounded-none bg-surface-container flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[1.25rem]">mode_heat</span>
                </div>
              </div>
              <h4 className="font-serif text-sm sm:text-base font-bold text-primary mb-1.5">
                Đun sôi & nhỏ lửa
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Đun sôi, hạ nhỏ lửa khoảng 30–45 phút để dược chất và tinh dầu tỏa đều.
              </p>
            </div>

            {/* Bước 4 */}
            <div className="scroll-reveal bg-surface-container-lowest rounded-none p-5 border border-border-herbal/60 flex flex-col hover:border-primary transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <span className="font-sans text-2xl font-bold text-tertiary tabular-nums">04</span>
                <div className="w-10 h-10 rounded-none bg-surface-container flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[1.25rem]">filter_alt</span>
                </div>
              </div>
              <h4 className="font-serif text-sm sm:text-base font-bold text-primary mb-1.5">
                Lọc nước cốt
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Lọc lấy nước cốt, pha thêm nước sạch đến lượng và độ đậm nhạt mong muốn.
              </p>
            </div>

            {/* Bước 5 */}
            <div className="scroll-reveal bg-surface-container-lowest rounded-none p-5 border border-border-herbal/60 flex flex-col hover:border-primary transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <span className="font-sans text-2xl font-bold text-tertiary tabular-nums">05</span>
                <div className="w-10 h-10 rounded-none bg-surface-container flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[1.25rem]">thermostat</span>
                </div>
              </div>
              <h4 className="font-serif text-sm sm:text-base font-bold text-primary mb-1.5">
                Kiểm tra nhiệt độ
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Kiểm tra nhiệt độ, sử dụng khi nước còn ấm vừa phải (khoảng 38°C – 40°C).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CÁC CÁCH ỨNG DỤNG KHÁC (XÔNG HƠI, TẮM SAU SINH, NGÂM CHÂN) */}
      <section className="mb-14 sm:mb-20">
        <div className="scroll-reveal text-center max-w-xl mx-auto mb-8 sm:mb-12">
          <span className="text-[0.6875rem] sm:text-xs font-semibold text-secondary uppercase tracking-widest flex items-center justify-center gap-1.5 mb-1.5">
            <span className="material-symbols-outlined text-[1rem] text-[#8a7258]">self_improvement</span>
            ĐA DẠNG MỤC ĐÍCH SỬ DỤNG
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-primary font-bold">
            Ứng Dụng Trong Cuộc Sống
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="scroll-reveal bg-surface rounded-none border border-border-herbal/70 p-6 sm:p-8 flex flex-col">
            <div className="w-12 h-12 rounded-none bg-secondary-container text-on-secondary-container flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[1.75rem]">air</span>
            </div>
            <h3 className="font-serif text-lg font-bold text-primary mb-2">Xông Hơi Giải Cảm</h3>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-4">
              Đặt nồi nước vừa đun sôi ở nơi kín gió, dùng chăn mỏng trùm kín người và hé vung nồi từ từ để hơi thảo mộc tỏa lên. Xông trong 10–15 phút giúp toát mồ hôi và nhẹ nhõm đầu óc.
            </p>
            <span className="text-xs text-[#8a7258] font-semibold mt-auto">Khuyên dùng: Gừng, Lá sả, Lá bưởi</span>
          </div>

          <div className="scroll-reveal bg-surface rounded-none border border-border-herbal/70 p-6 sm:p-8 flex flex-col">
            <div className="w-12 h-12 rounded-none bg-secondary-container text-on-secondary-container flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[1.75rem]">family_restroom</span>
            </div>
            <h3 className="font-serif text-lg font-bold text-primary mb-2">Tắm Xông Cho Mẹ Sau Sinh</h3>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-4">
              Dùng nước thảo mộc ấm dội nhanh hoặc lau người trong phòng kín gió. Hỗ trợ mẹ bỉm giữ ấm kinh lạc, đẩy phong hàn, khử mùi cơ thể và giúp cơ thể mau hồi phục sức khỏe.
            </p>
            <span className="text-xs text-[#8a7258] font-semibold mt-auto">Khuyên dùng: Bài thuốc tổng hợp 7 vị, Lá trầu, Đinh lăng</span>
          </div>

          <div className="scroll-reveal bg-surface rounded-none border border-border-herbal/70 p-6 sm:p-8 flex flex-col">
            <div className="w-12 h-12 rounded-none bg-secondary-container text-on-secondary-container flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[1.75rem]">footprint</span>
            </div>
            <h3 className="font-serif text-lg font-bold text-primary mb-2">Ngâm Chân Buổi Tối</h3>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-4">
              Rót nước ấm thảo mộc vào chậu ngập mắt cá chân. Ngâm từ 15–20 phút trước khi đi ngủ, kết hợp xoa bóp nhẹ lòng bàn chân để kích hoạt tuần hoàn máu và ngủ sâu giấc.
            </p>
            <span className="text-xs text-[#8a7258] font-semibold mt-auto">Khuyên dùng: Gừng phơi khô, Ngải cứu, Lá sả</span>
          </div>
        </div>
      </section>

      {/* 4. MẸO NHỎ DÂN GIAN & LƯU Ý AN TOÀN */}
      <section className="scroll-reveal bg-surface-container-low rounded-none border border-border-herbal/70 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-none bg-primary text-on-primary flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[1.25rem]">spa</span>
          </div>
          <div>
            <h4 className="font-serif text-base font-bold text-primary mb-1">Mẹo Nhỏ Dân Gian</h4>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Tắm xông luôn thực hiện trong phòng kín gió. Sau khi tắm lau khô người ngay và giữ ấm cơ thể. Có thể tận dụng bã thảo mộc còn ấm để chườm lên vùng vai gáy hoặc lưng giảm nhức mỏi.
            </p>
          </div>
        </div>

        <Link
          to="/san-pham"
          className="px-6 py-3 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold uppercase tracking-wider rounded-none shrink-0 transition-all shadow-xs"
        >
          Mua Thảo Mộc Ngay
        </Link>
      </section>
    </div>
  );
};

export default UsageGuidePage;
