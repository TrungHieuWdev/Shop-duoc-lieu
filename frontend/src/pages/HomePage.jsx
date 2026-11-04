import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '@/features/products/components/ProductCard';
import { BotanicalDivider } from '@/components/common/BotanicalDivider';
import { BotanicalWatermark } from '@/components/common/BotanicalWatermark';
import { useAdminStore } from '@/store/useAdminStore';

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
  const storeProducts = useAdminStore((state) => state.products);
  const featuredList = storeProducts && storeProducts.length > 0 ? storeProducts : FEATURED_PRODUCTS;
  const [toastMessage, setToastMessage] = useState(null);

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
      <section className="relative w-full overflow-hidden bg-[#07130b] h-[calc(100dvh-4rem)] md:h-[calc(100vh-5rem)] min-h-[480px] sm:min-h-[560px] flex items-center border-b border-[#1f3627]">
        {/* Hình nền thảo dược điện ảnh chuẩn phong cách B ECO */}
        <img
          src="/images/hero-cinematic-b-eco.jpg"
          alt="Ngân Hà Thảo Mộc - Gom hương thảo mộc, gói trọn an nhiên"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-[70%_center] sm:object-center opacity-95 transition-all duration-700 ease-out"
        />

        {/* Lớp phủ chuyển màu nghệ thuật: Tối sâu sang bên trái để nổi bật chữ, trong suốt dần sang bên phải */}
        <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-[#06120a] via-[#06120a]/90 sm:via-[#06120a]/75 to-transparent/40 sm:to-transparent pointer-events-none"></div>

        {/* Lớp đổ bóng mờ tạo chiều sâu điện ảnh */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_50%,rgba(6,18,10,0.85)_0%,transparent_75%)] pointer-events-none"></div>

        {/* Viền bóng mờ cạnh phải và cạnh đáy để hình ảnh hòa tan tuyệt đối vào nền tối, không bị hở mép */}
        <div className="absolute inset-y-0 right-0 w-16 sm:w-44 bg-gradient-to-l from-[#07130b] via-[#07130b]/60 to-transparent pointer-events-none z-10"></div>
        <div className="absolute inset-x-0 bottom-0 h-16 sm:h-28 bg-gradient-to-t from-[#07130b] via-[#07130b]/50 to-transparent pointer-events-none z-10"></div>

        {/* Khối Nội Dung Bên Trái (Đã tinh gọn chữ tối đa theo phong cách tối giản cao cấp B ECO) */}
        <div className="relative z-10 max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 w-full py-8 sm:py-20 flex flex-col justify-center items-start text-left">
          {/* Nhãn phụ tinh tế */}
          <span className="eco-rise text-[0.625rem] sm:text-xs font-semibold text-[#cbb07c] uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-2.5 sm:mb-4 flex items-center gap-1.5 sm:gap-2 drop-shadow-sm">
            <span className="material-symbols-outlined text-[0.875rem] sm:text-[1rem]">spa</span>
            TINH CHỌN THẢO DƯỢC • TRỌN VẸN HƯƠNG TỰ NHIÊN
          </span>

          {/* Tên thương hiệu lớn phong cách B ECO */}
          <h1 className="eco-rise-1 font-serif text-3xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-[0.14em] sm:tracking-[0.25em] text-[#fbf9f2] drop-shadow-lg leading-tight mb-2 sm:mb-3 whitespace-nowrap">
            N G Â N &nbsp;H À
          </h1>

          {/* Slogan màu vàng rơm mộc mạc */}
          <p className="eco-rise-2 font-serif text-sm sm:text-xl lg:text-2xl text-[#d8c9aa] font-medium tracking-wide mb-6 sm:mb-10 drop-shadow-sm">
            Gom hương thảo dược – Gói trọn an nhiên
          </p>

          {/* Cặp Nút Hành Động (Dual CTA) chuẩn phong cách B ECO */}
          <div className="eco-rise-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            {/* Nút chính: Màu vàng rơm đất ấm */}
            <Link
              to="/san-pham"
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-[#cbb07c] hover:bg-[#dfc492] text-[#14261a] font-bold text-xs sm:text-sm tracking-widest uppercase rounded-lg sm:rounded shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>MUA NGAY</span>
              <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>

            {/* Nút phụ: Khung viền mỏng trong suốt kính mờ dẫn sang trang Cách Dùng */}
            <Link
              to="/cach-dung"
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 border border-white/40 hover:border-white bg-black/25 hover:bg-white/10 text-white font-medium text-xs sm:text-sm tracking-widest uppercase rounded-lg sm:rounded backdrop-blur-sm transition-all hover:-translate-y-0.5 flex items-center justify-center cursor-pointer"
            >
              HƯỚNG DẪN SỬ DỤNG
            </Link>
          </div>
        </div>
      </section>

      {/* 2. SẢN PHẨM NỔI BẬT */}
      <section className="eco-rise-3 py-10 sm:py-20 px-3.5 sm:px-8 lg:px-12 xl:px-16 max-w-[1536px] mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-12 gap-2 sm:gap-3">
          <div>
            <span className="text-[0.625rem] sm:text-xs font-semibold text-secondary uppercase tracking-[0.2em] flex items-center gap-1.5 mb-1">
              <span className="material-symbols-outlined text-[0.875rem] sm:text-[1rem] text-[#8a7258]">spa</span>
              DƯỢC LIỆU PHƠI KHÔ
            </span>
            <h2 className="font-serif text-xl sm:text-3xl lg:text-4xl text-primary font-bold">
              Sản Phẩm Được Yêu Thích Nhất
            </h2>
          </div>
          <Link
            to="/san-pham"
            className="text-xs sm:text-sm font-semibold text-secondary hover:text-primary flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>Xem tất cả sản phẩm</span>
            <span className="material-symbols-outlined text-[1.125rem]">arrow_forward</span>
          </Link>
        </div>

        {/* Lưới sản phẩm: 2 cột trên điện thoại (chuẩn e-commerce) và 4 cột trên máy tính */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {featuredList.slice(0, 8).map((prod) => (
            <ProductCard key={prod.id} product={prod} onAddToCartSuccess={handleAddToCartSuccess} />
          ))}
        </div>
      </section>

      {/* 3. KHÁM PHÁ VỀ THẢO DƯỢC & CÁCH DÙNG (CẦU NỐI SANG 2 TRANG CHUYÊN BIỆT) */}
      <section className="eco-rise-4 bg-surface-container-low border-t border-border-herbal py-10 sm:py-20 px-3.5 sm:px-8 lg:px-12 xl:px-16">
        <div className="max-w-[1536px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Card Về thảo dược */}
          <div className="bg-surface rounded-2xl border border-border-herbal/70 p-5 sm:p-8 md:p-10 flex flex-col justify-between hover:border-primary transition-all duration-300 shadow-xs group">
            <div>
              <span className="text-[0.625rem] sm:text-[0.6875rem] font-semibold text-secondary uppercase tracking-widest block mb-1.5 sm:mb-2">
                NGUỒN GỐC & DƯỢC TÍNH
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-primary mb-2 sm:mb-3 group-hover:text-secondary transition-colors">
                Về Thảo Dược Bản Địa
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-5 sm:mb-6">
                Tìm hiểu công dụng và dược tính tự nhiên của 7 vị thuốc xông tắm cổ truyền: Đinh lăng, Gừng sẻ, Lá trầu không, Ngải cứu, Sả chanh, Lá bưởi và Hoa hồng phơi khô.
              </p>
            </div>
            <Link
              to="/ve-thao-duoc"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary group-hover:translate-x-1 transition-all"
            >
              <span>Khám phá 7 vị thảo mộc</span>
              <span className="material-symbols-outlined text-[1rem]">arrow_forward</span>
            </Link>
          </div>

          {/* Card Cách dùng */}
          <div className="bg-surface rounded-2xl border border-border-herbal/70 p-5 sm:p-8 md:p-10 flex flex-col justify-between hover:border-primary transition-all duration-300 shadow-xs group">
            <div>
              <span className="text-[0.625rem] sm:text-[0.6875rem] font-semibold text-secondary uppercase tracking-widest block mb-1.5 sm:mb-2">
                HƯỚNG DẪN DÂN GIAN
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-primary mb-2 sm:mb-3 group-hover:text-secondary transition-colors">
                Cách Dùng Nấu Nước Tắm
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-5 sm:mb-6">
                Trọn bộ 5 bước nấu nước tắm thảo mộc đơn giản tại nhà, xông hơi giải cảm, xông tắm sau sinh và ngâm chân ấm kinh lạc dưỡng sinh cho cả gia đình.
              </p>
            </div>
            <Link
              to="/cach-dung"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary group-hover:translate-x-1 transition-all"
            >
              <span>Xem hướng dẫn 5 bước</span>
              <span className="material-symbols-outlined text-[1rem]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* TOAST NOTIFICATION POPUP */}
      {toastMessage && (
        <div className="fixed bottom-4 inset-x-4 sm:bottom-6 sm:right-6 sm:inset-x-auto sm:max-w-md z-50 bg-primary text-on-primary px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl sm:rounded shadow-lg border border-primary-container flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-secondary-fixed text-[1.375rem] sm:text-[1.5rem] shrink-0">check_circle</span>
          <div className="flex flex-col min-w-0">
            <span className="font-serif font-bold text-xs sm:text-sm">{toastMessage.title}</span>
            <span className="text-[11px] sm:text-xs text-primary-fixed-dim truncate">{toastMessage.desc}</span>
          </div>
        </div>
      )}
    </div>
  );
};

