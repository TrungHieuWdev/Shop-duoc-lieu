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
    <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-12">
      {/* Header trang sản phẩm */}
      <div className="mb-8">
        <span className="text-[0.6875rem] font-semibold text-secondary uppercase tracking-widest block mb-1">
          Dược Thảo Bản Địa Việt Nam
        </span>
        <h1 className="font-serif text-3xl font-bold text-primary">Danh Mục Sản Phẩm Thảo Mộc Phơi Khô</h1>
        <p className="text-body-sm text-on-surface-variant mt-2 max-w-xl">
          100% thảo mộc tự nhiên phơi khô cẩn thận, gồm bài thuốc xông tắm tổng hợp 7 vị và các loại thảo dược nguyên liệu bán lẻ.
        </p>
      </div>

      {/* Bộ lọc danh mục & Sắp xếp */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-herbal mb-8">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Tất Cả Thảo Dược', slug: 'all' },
            { label: 'Bài Thuốc Xông Tắm (7 Vị)', slug: 'bai-thuoc-xong-tam' },
            { label: 'Dược Liệu Lẻ Phơi Khô', slug: 'duoc-lieu-le' },
          ].map((cat) => (
            <button
              key={cat.slug}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`px-4 py-2 rounded text-xs font-semibold transition-colors ${
                selectedCategory === cat.slug
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container border border-border-herbal/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-on-surface-variant">Sắp xếp:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 bg-surface-container-low border border-border-herbal rounded text-xs text-on-surface focus:outline-none focus:border-primary"
          >
            <option value="newest">Mới nhất</option>
            <option value="price_asc">Giá tăng dần</option>
            <option value="price_desc">Giá giảm dần</option>
          </select>
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
