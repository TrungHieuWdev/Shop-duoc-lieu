import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '@/features/products/components/ProductCard';

// Danh sách các sản phẩm thực tế: Bài thuốc 7 vị và 7 nguyên liệu lẻ 100% phơi khô
const ALL_PRODUCTS = [
  {
    id: 1,
    category_slug: 'bai-thuoc-xong-tam',
    category_name: 'Bài Thuốc Xông Tắm',
    name: 'Bài Thuốc Xông Tắm Tổng Hợp 7 Vị Thảo Dược (Phơi Khô)',
    slug: 'bai-thuoc-xong-tam-tong-hop-7-vi-thao-duoc',
    unit: 'Gói 1 nồi xông (150g)',
    price: 50000,
    original_price: 65000,
    is_featured: true,
    thumbnail_url: '/images/products/bai-thuoc-7-vi.jpg',
  },
  {
    id: 2,
    category_slug: 'duoc-lieu-le',
    category_name: 'Dược Liệu Lẻ',
    name: 'Lá Đinh Lăng Phơi Khô',
    slug: 'la-dinh-lang-phoi-kho-200g',
    unit: 'Túi zip 200g',
    price: 50000,
    original_price: 65000,
    is_featured: true,
    thumbnail_url: '/images/herbs/dinh-lang.jpg',
  },
  {
    id: 3,
    category_slug: 'duoc-lieu-le',
    category_name: 'Dược Liệu Lẻ',
    name: 'Gừng Phơi Khô (Gừng Sẻ Thái Lát)',
    slug: 'gung-se-phoi-kho-thai-lat-200g',
    unit: 'Túi zip 200g',
    price: 40000,
    original_price: 50000,
    is_featured: true,
    thumbnail_url: '/images/herbs/gung-kho.jpg',
  },
  {
    id: 4,
    category_slug: 'duoc-lieu-le',
    category_name: 'Dược Liệu Lẻ',
    name: 'Lá Sả Phơi Khô (Cắt Khúc)',
    slug: 'la-sa-phoi-kho-thai-khuc-200g',
    unit: 'Túi zip 200g',
    price: 30000,
    original_price: 40000,
    is_featured: true,
    thumbnail_url: '/images/herbs/sa-chanh.jpg',
  },
  {
    id: 5,
    category_slug: 'duoc-lieu-le',
    category_name: 'Dược Liệu Lẻ',
    name: 'Lá Trầu Không Phơi Khô',
    slug: 'la-trau-khong-phoi-kho-150g',
    unit: 'Túi zip 150g',
    price: 45000,
    original_price: 55000,
    is_featured: true,
    thumbnail_url: '/images/herbs/la-trau-khong.jpg',
  },
  {
    id: 6,
    category_slug: 'duoc-lieu-le',
    category_name: 'Dược Liệu Lẻ',
    name: 'Lá Ngải Cứu Nếp Phơi Khô',
    slug: 'la-ngai-cuu-nep-phoi-kho-200g',
    unit: 'Túi zip 200g',
    price: 35000,
    original_price: 45000,
    is_featured: true,
    thumbnail_url: '/images/herbs/ngai-cuu.jpg',
  },
  {
    id: 7,
    category_slug: 'duoc-lieu-le',
    category_name: 'Dược Liệu Lẻ',
    name: 'Lá Bưởi Phơi Khô',
    slug: 'la-buoi-phoi-kho-thom-150g',
    unit: 'Túi zip 150g',
    price: 35000,
    original_price: 45000,
    is_featured: true,
    thumbnail_url: '/images/herbs/la-buoi.jpg',
  },
  {
    id: 8,
    category_slug: 'duoc-lieu-le',
    category_name: 'Dược Liệu Lẻ',
    name: 'Hoa Hồng Phơi Khô (Nụ & Cánh)',
    slug: 'hoa-hong-phoi-kho-100g',
    unit: 'Túi zip 100g',
    price: 55000,
    original_price: 70000,
    is_featured: true,
    thumbnail_url: '/images/herbs/hoa-hong.jpg',
  },
];

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'all';
  const keyword = searchParams.get('keyword') || '';
  const [sortBy, setSortBy] = useState('newest');
  const [toastMessage, setToastMessage] = useState(null);

  // Lọc sản phẩm
  const filteredProducts = ALL_PRODUCTS.filter((prod) => {
    const matchCategory = selectedCategory === 'all' || prod.category_slug === selectedCategory;
    const matchKeyword = !keyword || prod.name.toLowerCase().includes(keyword.toLowerCase());
    return matchCategory && matchKeyword;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    return b.id - a.id;
  });

  const handleCategoryChange = (slug) => {
    const newParams = new URLSearchParams(searchParams);
    if (slug === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', slug);
    }
    setSearchParams(newParams);
  };

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
    <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-12">
      {/* 1. HERO BANNER TRANG SẢN PHẨM (THEO BỐ CỤC KHUNG THẺ 2 CỘT CỦA B-ECO) */}
      <section className="mb-10 overflow-hidden rounded-2xl border border-border-herbal/70 bg-surface-container-low shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] items-stretch">
          {/* Cột chữ bên trái */}
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14">
            <span className="text-[0.6875rem] sm:text-xs font-semibold text-secondary uppercase tracking-[0.25em] mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[1rem] text-[#8a7258]">spa</span>
              DƯỢC LIỆU BẢN ĐỊA • PHƠI KHÔ TỰ NHIÊN
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight leading-tight mb-3">
              Sản Phẩm Ngân Hà
            </h1>
            <p className="font-serif text-base sm:text-lg text-[#8a7258] font-medium mb-3">
              Gieo Mầm Lành — Từ từng chiếc lá nhỏ
            </p>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-[50ch] leading-relaxed">
              Tuyển chọn bài thuốc xông tắm cổ truyền 7 vị dân gian và các loại thảo dược đơn vị phơi khô giữ trọn tinh dầu bản địa.
            </p>
          </div>

          {/* Cột ảnh bên phải với lớp hòa màu mộc mạc sang trái */}
          <div className="relative min-h-[260px] sm:min-h-[320px] bg-surface-container overflow-hidden">
            <img
              src="/images/products/bai-thuoc-7-vi.jpg"
              alt="7 Nia Thảo Mộc Phơi Khô Ngân Hà"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* Lớp gradient hòa tan ảnh vào khối chữ bên trái */}
            <div className="absolute inset-y-0 left-0 hidden lg:block w-32 bg-gradient-to-r from-surface-container-low to-transparent"></div>
            {/* Lớp phủ chuyển sắc nhẹ */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent lg:hidden"></div>
          </div>
        </div>
      </section>

      {/* 2. THANH CÔNG CỤ LỌC STICKY (CHUẨN UX B-ECO: GHIM ĐẦU TRANG KHI CUỘN) */}
      <div className="sticky top-16 md:top-20 z-30 -mx-4 sm:-mx-8 lg:-mx-12 xl:-mx-16 px-4 sm:px-8 lg:px-12 xl:px-16 py-3.5 bg-surface/95 backdrop-blur-md border-y border-border-herbal mb-8 shadow-2xs">
        <div className="max-w-[1536px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          {/* Nhóm Tabs danh mục */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {[
              { label: 'Tất Cả', slug: 'all' },
              { label: 'Bài Thuốc 7 Vị', slug: 'bai-thuoc-xong-tam' },
              { label: 'Dược Liệu Lẻ', slug: 'duoc-lieu-le' },
            ].map((cat) => (
              <button
                key={cat.slug}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.slug
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container border border-border-herbal/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Ô tìm kiếm & Sắp xếp */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="text-xs text-on-surface-variant hidden sm:inline whitespace-nowrap">
              <strong>{filteredProducts.length}</strong> sản phẩm
            </span>

            <div className="flex items-center gap-1.5 bg-surface-container-low border border-border-herbal/70 rounded-full px-3 py-1.5 text-xs text-on-surface">
              <span className="material-symbols-outlined text-[1rem] text-[#8a7258]">sort</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs text-on-surface focus:outline-none cursor-pointer"
              >
                <option value="newest">Phổ biến nhất</option>
                <option value="price_asc">Giá: Thấp đến cao</option>
                <option value="price_desc">Giá: Cao đến thấp</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Lưới sản phẩm */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-on-surface-variant">Không tìm thấy sản phẩm nào phù hợp với tìm kiếm của bạn.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} onAddToCartSuccess={handleAddToCartSuccess} />
          ))}
        </div>
      )}

      {/* Toast Popup */}
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

export default ProductsPage;
