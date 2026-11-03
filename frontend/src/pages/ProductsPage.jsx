import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '@/features/products/components/ProductCard';

// Dữ liệu mẫu ban đầu khớp với seed database
const ALL_PRODUCTS = [
  {
    id: 1,
    category_slug: 'thao-moc-xong-tam',
    category_name: 'Thảo Mộc Xông Tắm',
    name: 'Túi Thảo Mộc Tắm Sau Sinh Cổ Truyền (10 túi lọc)',
    slug: 'tui-thao-moc-tam-sau-sinh-co-truyen-10-tui-loc',
    unit: 'Hộp 10 túi lọc',
    price: 185000,
    original_price: 220000,
    is_featured: true,
    thumbnail_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCq1sMtLK0ySLwW4N6VGPDz2QXIhEGK9eauIEVne7CI4wigWTOllcM5pG7PJDmY3czSpZp9-cG6c84E9Pkdu_TVFi-fLWqmzcLJuZWdwoYUX7GrXu3VjRFeYQE12sQtIiY5TqcmFU0eKM-nd27jskX7bhGZ5KNWY5XkwCQDCZZzq7Wyl6lcxqn5J2tXI5Q5FO9_omT_XOHPxWXFjUUiOTFIEFlgdqMf07j4czAuP_Nh',
  },
  {
    id: 2,
    category_slug: 'thao-moc-xong-tam',
    category_name: 'Thảo Mộc Xông Tắm',
    name: 'Lá Xông Hơi Giải Cảm Thư Giãn Dân Gian (5 gói)',
    slug: 'la-xong-hoi-giai-cam-thu-gian-dan-gian-5-goi',
    unit: 'Gói 5 túi',
    price: 95000,
    original_price: 115000,
    is_featured: true,
    thumbnail_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCogreer1-cEtRhQXeDCZLyNwFt7bWX1QbFrbPpr7GpZvql_ohYiXMkDicQwZCcsUUuGSgP75RkizDXqMb6mVxoJIo8M8mPsHMCqwctTBvVdFxbtQHKk_xlEjTDZxBDaAJnhFRR2WHnWMv8l74JXEUFU3bcZ7N4lSupp9IOiEiKYvIH-6vcPP1fl47sOkcWU0Jqwe_YFP1nWB9vj6lSmKviVRNJWsc0mhUkBeyOBDa',
  },
  {
    id: 3,
    category_slug: 'muoi-ngam-chan-duoc-lieu',
    category_name: 'Muối Ngâm Chân',
    name: 'Muối Khoáng Ngâm Chân Thảo Mộc Hoa Hồi & Quế Chi (500g)',
    slug: 'muoi-khoang-ngam-chan-thao-moc-hoa-hoi-que-chi-500g',
    unit: 'Hũ thủy tinh 500g',
    price: 120000,
    original_price: 140000,
    is_featured: true,
    thumbnail_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBa0Jt1aOkLc_k79PSaLoTtd4sgsSrzTWsJKqYsAUFGd0iPiVA2LzzjIOgyBlYTdFvPMdMxdOA2xX9gwhzIe4wftlB38IagisD-QcduNRdpmlrdZybuCTITyntP5xpIanXU_mFfY4cvOOnvrTFecssu5LEKUERyFElsb6s6bCUXQAt48MW-8BSqeVGXYyyfYBN3kE91_vTxkD6OqBYb6bUg5Wgy2ejBFSZAYK1EfWIb',
  },
  {
    id: 4,
    category_slug: 'muoi-ngam-chan-duoc-lieu',
    category_name: 'Muối Ngâm Chân',
    name: 'Muối Ngâm Chân Thảo Dược Gừng Gió & Ngải Cứu (500g)',
    slug: 'muoi-ngam-chan-thao-duoc-gung-gio-ngai-cuu-500g',
    unit: 'Hũ thủy tinh 500g',
    price: 125000,
    original_price: 150000,
    is_featured: false,
    thumbnail_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFt51Z7eIYVvR9JtXpW19mXZznbPvG007nSX8aIYDBQ6LEyq7BNwAvyDSNfOBKKVR5NB9Ql0FfWTxHVr1mzY_S6uYpU6GmwVvHICrYKjB7BLkdal30oIBgbm5fWvJYvyhV3CF1bxKxiX04iSXlqYMJaC0MeNcZCvceK_EBD8AC5fda_IaDNH-jqOqiM4HipgGPs5LTQrtlxwC9BmPRVmB4w4kQdhq15BmxiwWiShKR',
  },
  {
    id: 5,
    category_slug: 'cham-soc-toc-tu-nhien',
    category_name: 'Chăm Sóc Tóc',
    name: 'Cao Bồ Kết & Hương Nhu Rừng Cô Đặc (300ml)',
    slug: 'cao-bo-ket-co-dac-goi-dau-co-nho-noi-vo-buoi-300ml',
    unit: 'Chai vòi nhấn 300ml',
    price: 190000,
    original_price: 225000,
    is_featured: true,
    thumbnail_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBg1tWFyC5_Y5npw1UxMl9abFxhEnSAyopTGUU4uxUPtAxhZNongE4jBeB80V6DGEI4p3qrQIR05uK33JRl-8mwGJVIb8DE4ZSOJYJGvt3LQ8ngq7mH-_CbuYs1l-EFhxDri2e3zUNmW6ZlawptZMU0x_oNN2c8M6dhZ0-4wUbcaYXidtypXk9LM5nxLAAK0xx1ZefSQMIRa41y03tEA5EAQBBxF528DO7hJ39a-GVp',
  },
  {
    id: 6,
    category_slug: 'cham-soc-toc-tu-nhien',
    category_name: 'Chăm Sóc Tóc',
    name: 'Xịt Dưỡng Tóc Tinh Chất Vỏ Bưởi & Hoa Nhài (150ml)',
    slug: 'xit-duong-toc-tinh-chat-vo-buoi-hoa-nhai-150ml',
    unit: 'Chai xịt 150ml',
    price: 135000,
    original_price: 160000,
    is_featured: false,
    thumbnail_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHfFwia3XDlTQf7wLbjHsli91WNjFKcGImwhxfD_n_RwVKbQfKE4LRGdAUcTCnjyL4QD7XyW54bOpBKBR3Zlhz8Pf8bzi7nmXrU1VH_q6tDCzgk033ROx6HmXeBMLQjDNeuItKDIc6lH9j1VCRmsYY0d-mONbkp3uyA9pA_-U5JViKGArU0zsY8F90Zre_w4mFDn2jo8cnRznlleqlRiiuzuTnBafK4h7hPADR1Qm',
  },
  {
    id: 7,
    category_slug: 'xa-bong-sinh-duoc',
    category_name: 'Xà Bông Sinh Dược',
    name: 'Xà Bông Thảo Dược Nghệ Mật Ong Rừng (100g)',
    slug: 'xa-bong-thao-duoc-nghe-mat-ong-rung-100g',
    unit: 'Bánh 100g',
    price: 65000,
    original_price: 80000,
    is_featured: true,
    thumbnail_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNyVlRHU96SFxzv3eDAmOhHPvUSS7nKx3cgUygbNnbFzWavwQQdJPG2tHsxtXyOFNgIodnr9_5C9iRxFrdxXAIBlWZ7yT6eSUmz8rrOmFUhhsmx9b7KPa7Fr3MiJSocffLBC-zj9zuhUIKmbXiSFU0yGktlFnQk2a_Ak2z1PR1eCayRV6QEFyao-HPNY0UuyXRsUjsHAw4ZZ-cbJHTfRd1M71QC8J87N7JGWkh81AL',
  },
  {
    id: 8,
    category_slug: 'xa-bong-sinh-duoc',
    category_name: 'Xà Bông Sinh Dược',
    name: 'Xà Bông Mướp Đắng & Tràm Trà Kháng Khuẩn (100g)',
    slug: 'xa-bong-muop-dang-tram-tra-100g',
    unit: 'Bánh 100g',
    price: 70000,
    original_price: 85000,
    is_featured: false,
    thumbnail_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNyVlRHU96SFxzv3eDAmOhHPvUSS7nKx3cgUygbNnbFzWavwQQdJPG2tHsxtXyOFNgIodnr9_5C9iRxFrdxXAIBlWZ7yT6eSUmz8rrOmFUhhsmx9b7KPa7Fr3MiJSocffLBC-zj9zuhUIKmbXiSFU0yGktlFnQk2a_Ak2z1PR1eCayRV6QEFyao-HPNY0UuyXRsUjsHAw4ZZ-cbJHTfRd1M71QC8J87N7JGWkh81AL',
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
        <h1 className="font-serif text-3xl font-bold text-primary">Danh Mục Sản Phẩm</h1>
        <p className="text-body-sm text-on-surface-variant mt-2 max-w-xl">
          Tất cả sản phẩm đều được sản xuất từ nguyên liệu cỏ cây sấy lạnh đối lưu 35°C, không pha trộn hương liệu công nghiệp.
        </p>
      </div>

      {/* Bộ lọc danh mục & Sắp xếp */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-herbal mb-8">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Tất Cả', slug: 'all' },
            { label: 'Thảo Mộc Nấu Tắm', slug: 'thao-moc-xong-tam' },
            { label: 'Muối Ngâm Chân', slug: 'muoi-ngam-chan-duoc-lieu' },
            { label: 'Chăm Sóc Tóc', slug: 'cham-soc-toc-tu-nhien' },
            { label: 'Xà Bông Sinh Dược', slug: 'xa-bong-sinh-duoc' },
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

