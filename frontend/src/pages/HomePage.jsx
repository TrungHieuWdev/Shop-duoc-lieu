import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '@/features/products/components/ProductCard';

// Dữ liệu mẫu đồng bộ với database/seed.sql và hình ảnh từ Stitch
const FEATURED_PRODUCTS = [
  {
    id: 1,
    name: 'Túi Thảo Mộc Tắm Sau Sinh Cổ Truyền (10 túi lọc)',
    slug: 'tui-thao-moc-tam-sau-sinh-co-truyen-10-tui-loc',
    category_name: 'Nấu Tắm Cổ Truyền',
    unit: '500g (10 túi lọc lớn)',
    price: 185000,
    original_price: 220000,
    is_featured: true,
    thumbnail_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCq1sMtLK0ySLwW4N6VGPDz2QXIhEGK9eauIEVne7CI4wigWTOllcM5pG7PJDmY3czSpZp9-cG6c84E9Pkdu_TVFi-fLWqmzcLJuZWdwoYUX7GrXu3VjRFeYQE12sQtIiY5TqcmFU0eKM-nd27jskX7bhGZ5KNWY5XkwCQDCZZzq7Wyl6lcxqn5J2tXI5Q5FO9_omT_XOHPxWXFjUUiOTFIEFlgdqMf07j4czAuP_Nh',
  },
  {
    id: 5,
    name: 'Cao Bồ Kết & Hương Nhu Rừng Cô Đặc (300ml)',
    slug: 'cao-bo-ket-co-dac-goi-dau-co-nho-noi-vo-buoi-300ml',
    category_name: 'Gội Đầu Dân Gian',
    unit: 'Chai vòi nhấn 300ml',
    price: 190000,
    original_price: 225000,
    is_featured: true,
    thumbnail_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBg1tWFyC5_Y5npw1UxMl9abFxhEnSAyopTGUU4uxUPtAxhZNongE4jBeB80V6DGEI4p3qrQIR05uK33JRl-8mwGJVIb8DE4ZSOJYJGvt3LQ8ngq7mH-_CbuYs1l-EFhxDri2e3zUNmW6ZlawptZMU0x_oNN2c8M6dhZ0-4wUbcaYXidtypXk9LM5nxLAAK0xx1ZefSQMIRa41y03tEA5EAQBBxF528DO7hJ39a-GVp',
  },
  {
    id: 4,
    name: 'Thảo Mộc Ngâm Chân Gừng Gió & Ngải Cứu (500g)',
    slug: 'muoi-ngam-chan-thao-duoc-gung-gio-ngai-cuu-500g',
    category_name: 'Dưỡng Thể & Ngâm Chân',
    unit: 'Hũ thủy tinh 500g',
    price: 125000,
    original_price: 150000,
    is_featured: true,
    thumbnail_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFt51Z7eIYVvR9JtXpW19mXZznbPvG007nSX8aIYDBQ6LEyq7BNwAvyDSNfOBKKVR5NB9Ql0FfWTxHVr1mzY_S6uYpU6GmwVvHICrYKjB7BLkdal30oIBgbm5fWvJYvyhV3CF1bxKxiX04iSXlqYMJaC0MeNcZCvceK_EBD8AC5fda_IaDNH-jqOqiM4HipgGPs5LTQrtlxwC9BmPRVmB4w4kQdhq15BmxiwWiShKR',
  },
  {
    id: 3,
    name: 'Muối Khoáng Ngâm Chân Thảo Mộc Quế Chi (500g)',
    slug: 'muoi-khoang-ngam-chan-thao-moc-hoa-hoi-que-chi-500g',
    category_name: 'Thư Giãn Khí Huyết',
    unit: 'Hũ thủy tinh 500g',
    price: 120000,
    original_price: 140000,
    is_featured: false,
    thumbnail_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBa0Jt1aOkLc_k79PSaLoTtd4sgsSrzTWsJKqYsAUFGd0iPiVA2LzzjIOgyBlYTdFvPMdMxdOA2xX9gwhzIe4wftlB38IagisD-QcduNRdpmlrdZybuCTITyntP5xpIanXU_mFfY4cvOOnvrTFecssu5LEKUERyFElsb6s6bCUXQAt48MW-8BSqeVGXYyyfYBN3kE91_vTxkD6OqBYb6bUg5Wgy2ejBFSZAYK1EfWIb',
  },
];

export const HomePage = () => {
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
      {/* 1. HERO SECTION - Tối ưu khoảng cách và responsive trên PC, Mobile, iPad */}
      <section className="relative px-4 sm:px-8 lg:px-12 xl:px-16 pt-3 sm:pt-5 lg:pt-7 pb-10 sm:pb-14 lg:pb-16 max-w-[1536px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Cột Nội Dung Bên Trái: Căn trái đồng nhất trên cùng một trục */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Badge Tự Nhiên */}
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 sm:mb-4 rounded bg-secondary-container text-on-secondary-container w-fit">
              <span className="material-symbols-outlined text-[1rem]">eco</span>
              <span className="text-[0.6875rem] font-semibold tracking-widest uppercase">
                100% Dược Liệu Tự Nhiên
              </span>
            </div>

            {/* Tiêu đề H1: 48-56px trên desktop, leading ~1.1, max-w 750-800px, ngắt sau "dịu lành", giữ "thảo mộc" không gãy dòng */}
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[3.25rem] text-primary font-bold leading-[1.2] sm:leading-[1.15] lg:leading-[1.1] tracking-tight max-w-[780px] mb-3 sm:mb-4 lg:mb-5">
              Chăm sóc cơ thể dịu lành{' '}
              <br className="hidden sm:inline" />
              từ <span className="whitespace-nowrap">thảo mộc</span> thiên nhiên
            </h1>

            {/* Đoạn mô tả: max-w 650-700px, font 18-19px desktop, line-height 1.65, tránh từ mồ côi dòng cuối */}
            <p className="text-sm sm:text-base lg:text-[1.1875rem] leading-[1.65] text-on-surface-variant max-w-[680px] mb-6 sm:mb-8 [text-wrap:balance]">
              Tuyển chọn các loại thảo mộc tắm gội truyền thống, được thu hái và chế biến cẩn thận, mang đến giải pháp chăm sóc cơ thể gần gũi với thiên nhiên.
            </p>

            {/* Nút Kêu Gọi Hành Động (CTA) */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <Link
                to="/san-pham"
                className="px-5 py-3 sm:px-6 sm:py-3.5 bg-primary hover:bg-primary-container text-on-primary font-medium rounded text-sm sm:text-base shadow-sm hover:shadow transition-all flex items-center gap-2"
              >
                <span>Khám Phá Dược Thảo</span>
                <span className="material-symbols-outlined text-[1.125rem]">arrow_forward</span>
              </Link>
              <a
                href="#quy-trinh"
                className="px-5 py-3 sm:px-6 sm:py-3.5 bg-surface-container border border-border-herbal hover:bg-surface-container-high text-primary font-medium rounded text-sm sm:text-base transition-colors"
              >
                Tìm hiểu quy trình
              </a>
            </div>

            {/* Thống kê 3 cột */}
            <div className="w-full max-w-[680px] grid grid-cols-3 gap-2 sm:gap-4 pt-4 sm:pt-6 border-t border-border-herbal">
              <div className="flex flex-col">
                <span className="font-serif text-lg sm:text-xl lg:text-2xl font-bold text-primary">35°C</span>
                <span className="text-[0.6875rem] sm:text-xs text-on-surface-variant leading-tight">Sấy lạnh giữ tinh dầu</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg sm:text-xl lg:text-2xl font-bold text-primary">0%</span>
                <span className="text-[0.6875rem] sm:text-xs text-on-surface-variant leading-tight">Không chất bảo quản</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg sm:text-xl lg:text-2xl font-bold text-primary">100%</span>
                <span className="text-[0.6875rem] sm:text-xs text-on-surface-variant leading-tight">Thảo mộc thu hái sạch</span>
              </div>
            </div>
          </div>

          {/* Cột Hình Ảnh Bên Phải: Tối ưu tỷ lệ và kích thước chuẩn cho mobile & iPad */}
          <div className="lg:col-span-5 relative w-full max-w-sm sm:max-w-md lg:max-w-none mx-auto mt-4 lg:mt-0">
            <div className="relative aspect-[4/5] rounded overflow-hidden shadow-md border border-border-herbal">
              <img
                src="/images/hero-herbs.jpg"
                alt="Khay thảo mộc tự nhiên: Gừng sẻ, lá trầu, sả chanh và ngải cứu sấy lạnh"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-surface/90 backdrop-blur-sm p-3 sm:p-4 rounded border border-border-herbal">
                <span className="text-[0.625rem] sm:text-[0.6875rem] font-semibold text-secondary uppercase tracking-widest block">
                  Dược liệu sấy lạnh đối lưu
                </span>
                <span className="font-serif text-xs sm:text-sm font-bold text-primary">
                  Gừng sẻ, lá trầu, sả chanh & ngải cứu bản địa
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SECTION */}
      <section className="bg-surface-container-low py-16 px-4 sm:px-8 lg:px-12 xl:px-16 border-y border-border-herbal">
        <div className="max-w-[1536px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-[0.6875rem] font-semibold text-secondary uppercase tracking-widest">
                Phân Loại Dược Thảo
              </span>
              <h2 className="font-serif text-2xl lg:text-3xl text-primary font-bold mt-2">
                Dưỡng Thể Tự Nhiên
              </h2>
            </div>
            <Link to="/san-pham" className="text-body-sm text-secondary hover:text-primary font-medium flex items-center gap-1 mt-4 md:mt-0">
              <span>Xem tất cả sản phẩm</span>
              <span className="material-symbols-outlined text-[1rem]">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Mục 1: Thảo mộc nấu tắm */}
            <Link to="/san-pham?category=thao-moc-xong-tam" className="group bg-surface rounded overflow-hidden border border-border-herbal shadow-sm hover:shadow-md transition-all">
              <div className="aspect-[4/3] overflow-hidden bg-surface-container">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCogreer1-cEtRhQXeDCZLyNwFt7bWX1QbFrbPpr7GpZvql_ohYiXMkDicQwZCcsUUuGSgP75RkizDXqMb6mVxoJIo8M8mPsHMCqwctTBvVdFxbtQHKk_xlEjTDZxBDaAJnhFRR2WHnWMv8l74JXEUFU3bcZ7N4lSupp9IOiEiKYvIH-6vcPP1fl47sOkcWU0Jqwe_YFP1nWB9vj6lSmKviVRNJWsc0mhUkBeyOBDa"
                  alt="Thảo mộc nấu tắm"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <h3 className="font-serif text-base font-bold text-primary group-hover:text-secondary transition-colors">
                  Thảo mộc nấu tắm
                </h3>
                <p className="text-xs text-on-surface-variant mt-1">Lá tắm sau sinh & xông giải cảm</p>
              </div>
            </Link>

            {/* Mục 2: Thảo mộc gội đầu */}
            <Link to="/san-pham?category=cham-soc-toc-tu-nhien" className="group bg-surface rounded overflow-hidden border border-border-herbal shadow-sm hover:shadow-md transition-all">
              <div className="aspect-[4/3] overflow-hidden bg-surface-container">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHfFwia3XDlTQf7wLbjHsli91WNjFKcGImwhxfD_n_RwVKbQfKE4LRGdAUcTCnjyL4QD7XyW54bOpBKBR3Zlhz8Pf8bzi7nmXrU1VH_q6tDCzgk033ROx6HmXeBMLQjDNeuItKDIc6lH9j1VCRmsYY0d-mONbkp3uyA9pA_-U5JViKGArU0zsY8F90Zre_w4mFDn2jo8cnRznlleqlRiiuzuTnBafK4h7hPADR1Qm"
                  alt="Thảo mộc gội đầu"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <h3 className="font-serif text-base font-bold text-primary group-hover:text-secondary transition-colors">
                  Thảo mộc gội đầu
                </h3>
                <p className="text-xs text-on-surface-variant mt-1">Cao bồ kết & cỏ nhọ nồi tự nhiên</p>
              </div>
            </Link>

            {/* Mục 3: Thảo mộc ngâm chân */}
            <Link to="/san-pham?category=muoi-ngam-chan-duoc-lieu" className="group bg-surface rounded overflow-hidden border border-border-herbal shadow-sm hover:shadow-md transition-all">
              <div className="aspect-[4/3] overflow-hidden bg-surface-container">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNfaDVW16QhgVn26Fgnv1wGG3nsXciuyTm6bfGb0QAcdC-W5ZSmmmdDaE9VEFm0poPb3wOBinlA4Z5qa6Nss-9bs8EvUbJm20C4F6C-S0gnVDk_FX5JoL3Y7lEGRrDa5YcNP8-Fpsht15dZYpEMBQHlyjJFHKRFxtkTzqzyeWYx4NHQZeNSTa7eoJfByVIodbkWuyXKXWbGQJo7Ut9Itm9M-wieqcSZH5K_iS4mrVe"
                  alt="Thảo mộc ngâm chân"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <h3 className="font-serif text-base font-bold text-primary group-hover:text-secondary transition-colors">
                  Thảo mộc ngâm chân
                </h3>
                <p className="text-xs text-on-surface-variant mt-1">Muối khoáng gừng gió & ngải cứu</p>
              </div>
            </Link>

            {/* Mục 4: Xà bông sinh dược */}
            <Link to="/san-pham?category=xa-bong-sinh-duoc" className="group bg-surface rounded overflow-hidden border border-border-herbal shadow-sm hover:shadow-md transition-all">
              <div className="aspect-[4/3] overflow-hidden bg-surface-container">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNyVlRHU96SFxzv3eDAmOhHPvUSS7nKx3cgUygbNnbFzWavwQQdJPG2tHsxtXyOFNgIodnr9_5C9iRxFrdxXAIBlWZ7yT6eSUmz8rrOmFUhhsmx9b7KPa7Fr3MiJSocffLBC-zj9zuhUIKmbXiSFU0yGktlFnQk2a_Ak2z1PR1eCayRV6QEFyao-HPNY0UuyXRsUjsHAw4ZZ-cbJHTfRd1M71QC8J87N7JGWkh81AL"
                  alt="Xà bông sinh dược"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <h3 className="font-serif text-base font-bold text-primary group-hover:text-secondary transition-colors">
                  Xà bông sinh dược
                </h3>
                <p className="text-xs text-on-surface-variant mt-1">Nghệ mật ong & mướp đắng tràm trà</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="py-20 px-4 sm:px-8 lg:px-12 xl:px-16 max-w-[1536px] mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-[0.6875rem] font-semibold text-secondary uppercase tracking-widest">
              Tuyển Chọn Độc Bản
            </span>
            <h2 className="font-serif text-2xl lg:text-3xl text-primary font-bold mt-2">
              Sản Phẩm Được Yêu Thích Nhất
            </h2>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0 text-secondary text-body-sm font-medium">
            <span className="material-symbols-outlined text-[1.25rem]">verified</span>
            <span>Chứng nhận kiểm nghiệm dược liệu an toàn</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_PRODUCTS.map((prod) => (
            <ProductCard key={prod.id} product={prod} onAddToCartSuccess={handleAddToCartSuccess} />
          ))}
        </div>
      </section>

      {/* 4. HERBAL PROCESS (QUY TRÌNH 4 BƯỚC) */}
      <section id="quy-trinh" className="scroll-mt-24 bg-surface-container py-20 px-4 sm:px-8 lg:px-12 xl:px-16 border-y border-border-herbal">
        <div className="max-w-[1536px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[0.6875rem] font-semibold text-secondary uppercase tracking-widest">
              Nguồn Gốc & Quy Trình
            </span>
            <h2 className="font-serif text-2xl lg:text-4xl text-primary font-bold mt-2">
              Gìn Giữ Hồn Thảo Mộc Tự Nhiên
            </h2>
            <p className="text-body-sm text-on-surface-variant mt-3">
              Mỗi túi thảo mộc đến tay bạn đều trải qua quy trình khép kín, lưu giữ trọn vẹn dược tính và hương thơm tinh dầu tự nhiên.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-surface p-6 rounded border border-border-herbal flex flex-col gap-3">
              <span className="text-2xl font-serif font-bold text-tertiary">01</span>
              <h3 className="font-serif text-base font-bold text-primary">Thu hái ban mai</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Dược liệu được hái tay vào sáng sớm khi còn đọng sương mai, bảo toàn hàm lượng tinh dầu cao nhất trong từng phiến lá.
              </p>
            </div>

            <div className="bg-surface p-6 rounded border border-border-herbal flex flex-col gap-3">
              <span className="text-2xl font-serif font-bold text-tertiary">02</span>
              <h3 className="font-serif text-base font-bold text-primary">Sục ozone khử khuẩn</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Rửa sạch bằng nước nguồn tự nhiên qua hệ thống sục ozone loại bỏ hoàn toàn bụi bẩn và nấm mốc tự nhiên.
              </p>
            </div>

            <div className="bg-surface p-6 rounded border border-border-herbal flex flex-col gap-3">
              <span className="text-2xl font-serif font-bold text-tertiary">03</span>
              <h3 className="font-serif text-base font-bold text-primary">Sấy lạnh đối lưu 35°C</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Phương pháp sấy nhiệt độ thấp độc quyền giúp thảo mộc giữ nguyên màu xanh tươi và không làm bay hơi tinh dầu quý.
              </p>
            </div>

            <div className="bg-surface p-6 rounded border border-border-herbal flex flex-col gap-3">
              <span className="text-2xl font-serif font-bold text-tertiary">04</span>
              <h3 className="font-serif text-base font-bold text-primary">Đóng gói màng kraft zip</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Bảo quản trong túi giấy kraft tráng màng nhôm thực phẩm, chống ẩm mốc tự nhiên và thân thiện với môi trường.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 3 BƯỚC CHUẨN BỊ MỘC MẠC */}
      <section id="huong-dan" className="scroll-mt-24 py-20 px-4 sm:px-8 lg:px-12 xl:px-16 max-w-[1536px] mx-auto w-full">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-[0.6875rem] font-semibold text-secondary uppercase tracking-widest">
            Cách Dùng Đơn Giản
          </span>
          <h2 className="font-serif text-2xl lg:text-3xl text-primary font-bold mt-2">
            3 Bước Chuẩn Bị Mộc Mạc
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 bg-surface-container-low rounded border border-border-herbal">
            <div className="w-14 h-14 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[1.75rem]">skillet</span>
            </div>
            <h3 className="font-serif text-lg font-bold text-primary">1. Ủ Túi Thảo Mộc</h3>
            <p className="text-body-sm text-on-surface-variant mt-2 leading-relaxed">
              Cho 1 túi lọc vào 2-3 lít nước sôi 100°C. Đậy nắp ủ trong 10-15 phút để thảo mộc nở đều và chiết xuất dưỡng chất.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-surface-container-low rounded border border-border-herbal">
            <div className="w-14 h-14 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[1.75rem]">soap</span>
            </div>
            <h3 className="font-serif text-lg font-bold text-primary">2. Chiết Xuất Tinh Chất</h3>
            <p className="text-body-sm text-on-surface-variant mt-2 leading-relaxed">
              Dùng đũa hoặc tay sạch bóp nhẹ túi lọc nhiều lần để tinh dầu trong lá trầu không, gừng gió hòa tan vào nước.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-surface-container-low rounded border border-border-herbal">
            <div className="w-14 h-14 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[1.75rem]">self_improvement</span>
            </div>
            <h3 className="font-serif text-lg font-bold text-primary">3. Pha Ấm & Tận Hưởng</h3>
            <p className="text-body-sm text-on-surface-variant mt-2 leading-relaxed">
              Pha thêm nước ấm vừa đủ nhiệt độ cơ thể (khoảng 40°C). Bắt đầu xông hơi, tắm dội thư giãn hoặc ngâm chân trước khi ngủ.
            </p>
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

