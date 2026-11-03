import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '@/features/products/components/ProductCard';
import { NaturalHerbsSlider } from '@/features/products/components/NaturalHerbsSlider';
import { BotanicalDivider } from '@/components/common/BotanicalDivider';
import { BotanicalWatermark } from '@/components/common/BotanicalWatermark';

// Dữ liệu mẫu đồng bộ với danh mục thảo mộc phơi khô thực tế của shop
const FEATURED_PRODUCTS = [
  {
    id: 1,
    name: 'Bài Thuốc Xông Tắm Tổng Hợp 7 Vị Thảo Dược (Phơi Khô)',
    slug: 'bai-thuoc-xong-tam-tong-hop-7-vi-thao-duoc',
    category_name: 'Bài Thuốc Xông Tắm',
    unit: 'Gói 1 nồi xông (150g)',
    price: 50000,
    original_price: 65000,
    is_featured: true,
    thumbnail_url: '/images/products/bai-thuoc-7-vi.jpg',
  },
  {
    id: 2,
    name: 'Lá Đinh Lăng Phơi Khô',
    slug: 'la-dinh-lang-phoi-kho-200g',
    category_name: 'Dược Liệu Lẻ',
    unit: 'Túi zip 200g',
    price: 50000,
    original_price: 65000,
    is_featured: true,
    thumbnail_url: '/images/herbs/dinh-lang.jpg',
  },
  {
    id: 3,
    name: 'Gừng Phơi Khô (Gừng Sẻ Thái Lát)',
    slug: 'gung-se-phoi-kho-thai-lat-200g',
    category_name: 'Dược Liệu Lẻ',
    unit: 'Túi zip 200g',
    price: 40000,
    original_price: 50000,
    is_featured: true,
    thumbnail_url: '/images/herbs/gung-kho.jpg',
  },
  {
    id: 4,
    name: 'Lá Sả Phơi Khô (Cắt Khúc)',
    slug: 'la-sa-phoi-kho-thai-khuc-200g',
    category_name: 'Dược Liệu Lẻ',
    unit: 'Túi zip 200g',
    price: 30000,
    original_price: 40000,
    is_featured: true,
    thumbnail_url: '/images/herbs/sa-chanh.jpg',
  },
  {
    id: 5,
    name: 'Lá Trầu Không Phơi Khô',
    slug: 'la-trau-khong-phoi-kho-150g',
    category_name: 'Dược Liệu Lẻ',
    unit: 'Túi zip 150g',
    price: 45000,
    original_price: 55000,
    is_featured: true,
    thumbnail_url: '/images/herbs/la-trau-khong.jpg',
  },
  {
    id: 6,
    name: 'Lá Ngải Cứu Nếp Phơi Khô',
    slug: 'la-ngai-cuu-nep-phoi-kho-200g',
    category_name: 'Dược Liệu Lẻ',
    unit: 'Túi zip 200g',
    price: 35000,
    original_price: 45000,
    is_featured: true,
    thumbnail_url: '/images/herbs/ngai-cuu.jpg',
  },
  {
    id: 7,
    name: 'Lá Bưởi Phơi Khô',
    slug: 'la-buoi-phoi-kho-thom-150g',
    category_name: 'Dược Liệu Lẻ',
    unit: 'Túi zip 150g',
    price: 35000,
    original_price: 45000,
    is_featured: true,
    thumbnail_url: '/images/herbs/la-buoi.jpg',
  },
  {
    id: 8,
    name: 'Hoa Hồng Phơi Khô (Nụ & Cánh)',
    slug: 'hoa-hong-phoi-kho-100g',
    category_name: 'Dược Liệu Lẻ',
    unit: 'Túi zip 100g',
    price: 55000,
    original_price: 70000,
    is_featured: true,
    thumbnail_url: '/images/herbs/hoa-hong.jpg',
  },
];

export const HomePage = () => {
  const [toastMessage, setToastMessage] = useState(null);
  const [heroBgType, setHeroBgType] = useState('cinematic'); // 'cinematic' (B ECO style) | 'authentic' (ảnh thật 7 nia)

  const handleAddToCartSuccess = (product) => {
    setToastMessage({
      title: 'Đã thêm vào giỏ hàng',
      desc: product.name,
    });
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div className="flex flex-col">
      {/* 1. HERO SECTION - PHONG CÁCH CINEMATIC EDITORIAL (THEO MẪU B ECO) */}
      <section className="relative w-full overflow-hidden bg-[#07130b] h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] min-h-[560px] flex items-center border-b border-[#1f3627]">
        {/* Hình nền: Chuyển đổi linh hoạt giữa phong cách B ECO điện ảnh và ảnh thật 7 nia */}
        <img
          src={heroBgType === 'cinematic' ? '/images/hero-cinematic-b-eco.jpg' : '/images/products/bai-thuoc-7-vi.jpg'}
          alt="Ngân Hà Thảo Mộc - Phong cách B ECO mộc mạc"
          className={`absolute inset-0 w-full h-full object-cover ${heroBgType === 'cinematic' ? 'object-right sm:object-center' : 'object-center sm:object-[72%_center]'
            } opacity-95 transition-all duration-700 ease-out`}
        />

        {/* Lớp phủ chuyển màu nghệ thuật: Tối sâu sang bên trái để nổi bật chữ, trong suốt dần sang bên phải */}
        <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-[#06120a] via-[#06120a]/85 sm:via-[#06120a]/75 to-transparent/30 sm:to-transparent pointer-events-none"></div>

        {/* Lớp đổ bóng mờ tạo chiều sâu điện ảnh */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_50%,rgba(6,18,10,0.85)_0%,transparent_75%)] pointer-events-none"></div>

        {/* Viền bóng mờ cạnh phải và cạnh đáy để hình ảnh hòa tan tuyệt đối vào nền tối, không bị hở mép */}
        <div className="absolute inset-y-0 right-0 w-24 sm:w-44 bg-gradient-to-l from-[#07130b] via-[#07130b]/60 to-transparent pointer-events-none z-10"></div>
        <div className="absolute inset-x-0 bottom-0 h-20 sm:h-28 bg-gradient-to-t from-[#07130b] via-[#07130b]/50 to-transparent pointer-events-none z-10"></div>

        {/* Khối Nội Dung Bên Trái (Đã tinh gọn chữ tối đa theo phong cách tối giản cao cấp B ECO) */}
        <div className="relative z-10 max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 w-full py-12 sm:py-20 flex flex-col justify-center items-start text-left">
          {/* Nhãn phụ tinh tế */}
          <span className="text-[0.6875rem] sm:text-xs font-semibold text-[#cbb07c] uppercase tracking-[0.3em] mb-3 sm:mb-4 flex items-center gap-2 drop-shadow-sm">
            <span className="material-symbols-outlined text-[1rem]">spa</span>
            DƯỢC LIỆU BẢN ĐỊA • PHƠI KHÔ TỰ NHIÊN
          </span>

          {/* Tên thương hiệu lớn phong cách B ECO */}
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-[0.2em] sm:tracking-[0.25em] text-[#fbf9f2] drop-shadow-lg leading-tight mb-3">
            N G Â N &nbsp;H À
          </h1>

          {/* Slogan màu vàng rơm mộc mạc */}
          <p className="font-serif text-lg sm:text-xl lg:text-2xl text-[#d8c9aa] font-medium tracking-wide mb-8 sm:mb-10 drop-shadow-sm">
            Gom hương thảo mộc – Gói trọn an nhiên
          </p>

          {/* Cặp Nút Hành Động (Dual CTA) chuẩn phong cách B ECO */}
          <div className="flex flex-wrap items-center gap-3.5 sm:gap-4">
            {/* Nút chính: Màu vàng rơm đất ấm */}
            <Link
              to="/san-pham/bai-thuoc-xong-tam-tong-hop-7-vi-thao-duoc"
              className="px-6 sm:px-8 py-3.5 sm:py-4 bg-[#cbb07c] hover:bg-[#dfc492] text-[#14261a] font-bold text-xs sm:text-sm tracking-widest uppercase rounded shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 group"
            >
              <span>MUA NGAY</span>
              <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>

            {/* Nút phụ: Khung viền mỏng trong suốt kính mờ */}
            <a
              href="#huong-dan"
              className="px-6 sm:px-8 py-3.5 sm:py-4 border border-white/40 hover:border-white bg-black/25 hover:bg-white/10 text-white font-medium text-xs sm:text-sm tracking-widest uppercase rounded backdrop-blur-sm transition-all hover:-translate-y-0.5"
            >
              HƯỚNG DẪN SỬ DỤNG
            </a>
          </div>
        </div>

        {/* Nút chuyển đổi phong cách ảnh góc dưới phải */}
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 flex items-center bg-black/45 backdrop-blur-md border border-white/15 rounded-full p-1 shadow-lg">
          <button
            type="button"
            onClick={() => setHeroBgType('cinematic')}
            className={`px-3 py-1 text-[11px] font-medium rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${heroBgType === 'cinematic'
              ? 'bg-[#cbb07c] text-[#14261a] font-semibold shadow-xs'
              : 'text-white/70 hover:text-white'
              }`}
          >
            <span className="material-symbols-outlined text-[0.875rem]">auto_awesome</span>
            <span>Mẫu B ECO</span>
          </button>
          <button
            type="button"
            onClick={() => setHeroBgType('authentic')}
            className={`px-3 py-1 text-[11px] font-medium rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${heroBgType === 'authentic'
              ? 'bg-[#cbb07c] text-[#14261a] font-semibold shadow-xs'
              : 'text-white/70 hover:text-white'
              }`}
          >
            <span className="material-symbols-outlined text-[0.875rem]">photo_camera</span>
            <span>Ảnh Thật 7 Nia</span>
          </button>
        </div>
      </section>

      {/* 2. THẢO DƯỢC TỰ NHIÊN (CHUYỂN ĐỘNG NGANG TUẦN TỰ) */}
      <NaturalHerbsSlider />

      {/* 3. FEATURED PRODUCTS */}
      <section id="san-pham" className="scroll-mt-24 py-20 px-4 sm:px-8 lg:px-12 xl:px-16 max-w-[1536px] mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="font-serif text-2xl lg:text-3xl text-primary font-bold mt-2">
              Sản Phẩm Được Yêu Thích Nhất
            </h2>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0 text-secondary text-body-sm font-medium">
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_PRODUCTS.map((prod) => (
            <ProductCard key={prod.id} product={prod} onAddToCartSuccess={handleAddToCartSuccess} />
          ))}
        </div>
      </section>

      {/* 4. HƯỚNG DẪN SỬ DỤNG THẢO MỘC (5 BƯỚC NẤU TẮM DÂN GIAN) */}
      <div id="quy-trinh" className="scroll-mt-24"></div>
      <section id="huong-dan" className="scroll-mt-24 bg-surface-container-low py-14 sm:py-16 px-4 sm:px-8 lg:px-12 xl:px-16 border-y border-border-herbal">
        <div className="max-w-[1536px] mx-auto">
          {/* Tiêu đề ngắn gọn */}
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
            <span className="text-[0.6875rem] sm:text-xs font-semibold text-secondary uppercase tracking-widest flex items-center justify-center gap-1.5 mb-1.5">
              <span className="material-symbols-outlined text-[1rem] text-[#8a7258]">menu_book</span>
              HƯỚNG DẪN DÂN GIAN
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-primary font-bold">
              1. Nấu Nước Tắm Thảo Mộc
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5">
              5 bước nấu nước xông tắm giữ trọn tinh dầu và dược tính tự nhiên
            </p>
          </div>

          {/* Khung hướng dẫn 5 bước */}
          <div className="bg-surface rounded-2xl border border-border-herbal p-6 sm:p-8 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Bước 1 */}
              <div className="bg-surface-container-lowest rounded-xl p-4 sm:p-5 border border-border-herbal/60 flex flex-col hover:border-primary transition-all duration-300 group">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="font-serif text-xl font-bold text-tertiary">01</span>
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[1.125rem]">inventory_2</span>
                  </div>
                </div>
                <h4 className="font-serif text-sm font-bold text-primary mb-1">
                  Chuẩn bị
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Chuẩn bị 1 gói thảo mộc, rửa sơ qua nước sạch.
                </p>
              </div>

              {/* Bước 2 */}
              <div className="bg-surface-container-lowest rounded-xl p-4 sm:p-5 border border-border-herbal/60 flex flex-col hover:border-primary transition-all duration-300 group">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="font-serif text-xl font-bold text-tertiary">02</span>
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[1.125rem]">water_drop</span>
                  </div>
                </div>
                <h4 className="font-serif text-sm font-bold text-primary mb-1">
                  Thêm nước
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Cho vào nồi cùng khoảng 3–5 lít nước.
                </p>
              </div>

              {/* Bước 3 */}
              <div className="bg-surface-container-lowest rounded-xl p-4 sm:p-5 border border-border-herbal/60 flex flex-col hover:border-primary transition-all duration-300 group">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="font-serif text-xl font-bold text-tertiary">03</span>
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[1.125rem]">mode_heat</span>
                  </div>
                </div>
                <h4 className="font-serif text-sm font-bold text-primary mb-1">
                  Đun nhỏ lửa
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Đun sôi, hạ nhỏ lửa đun 30–45 phút.
                </p>
              </div>

              {/* Bước 4 */}
              <div className="bg-surface-container-lowest rounded-xl p-4 sm:p-5 border border-border-herbal/60 flex flex-col hover:border-primary transition-all duration-300 group">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="font-serif text-xl font-bold text-tertiary">04</span>
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[1.125rem]">filter_alt</span>
                  </div>
                </div>
                <h4 className="font-serif text-sm font-bold text-primary mb-1">
                  Lọc nước cốt
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Lọc lấy nước cốt, pha thêm nước sạch vừa đủ.
                </p>
              </div>

              {/* Bước 5 */}
              <div className="bg-surface-container-lowest rounded-xl p-4 sm:p-5 border border-border-herbal/60 flex flex-col hover:border-primary transition-all duration-300 group">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="font-serif text-xl font-bold text-tertiary">05</span>
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[1.125rem]">thermostat</span>
                  </div>
                </div>
                <h4 className="font-serif text-sm font-bold text-primary mb-1">
                  Kiểm tra nhiệt độ
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Sử dụng khi nước còn ấm (khoảng 38°C – 40°C).
                </p>
              </div>
            </div>

            {/* Chú thích & Nút hành động ngắn */}
            <div className="mt-6 pt-5 border-t border-border-herbal/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-on-surface-variant">
              <div className="flex items-center gap-2 text-center sm:text-left">
                <span className="material-symbols-outlined text-secondary text-[1.125rem] shrink-0">spa</span>
                <span><strong>Mẹo nhỏ:</strong> Tắm phòng kín gió, lau khô người ngay sau khi tắm.</span>
              </div>
              <Link
                to="/san-pham/bai-thuoc-xong-tam-tong-hop-7-vi-thao-duoc"
                className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary font-semibold rounded transition-colors text-xs shrink-0"
              >
                Mua Bài Thuốc 7 Vị (50k)
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TOAST NOTIFICATION POPUP */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-on-primary px-5 py-3.5 rounded shadow-lg border border-primary-container flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-secondary-fixed text-[1.5rem]">check_circle</span>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-sm">{toastMessage.title}</span>
            <span className="text-xs text-primary-fixed-dim line-clamp-1">{toastMessage.desc}</span>
          </div>
        </div>
      )}
    </div>
  );
};

