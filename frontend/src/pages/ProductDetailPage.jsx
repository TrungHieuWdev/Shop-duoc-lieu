import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { formatCurrency } from '@/utils/formatCurrency';
import { useCartStore } from '@/store/useCartStore';

const MOCK_DETAILS = {
  'tui-thao-moc-tam-sau-sinh-co-truyen-10-tui-loc': {
    id: 1,
    name: 'Túi Thảo Mộc Tắm Sau Sinh Cổ Truyền (10 túi lọc)',
    category_name: 'Thảo Mộc Xông Tắm',
    unit: 'Hộp 10 túi lọc (500g)',
    price: 185000,
    original_price: 220000,
    summary: 'Công thức thảo mộc vùng cao giúp làm ấm cơ thể, thư giãn các cơ và hỗ trợ làn da phụ nữ sau sinh sạch sẽ, sảng khoái.',
    description: 'Sản phẩm được thu hái từ các loại thảo dược bản địa sấy khô tự nhiên. Túi lọc tiện lợi giúp mẹ bầu sau sinh có thể nấu nước tắm gội mà không lo cặn lá. Hương thơm thảo mộc ấm nồng tạo cảm giác bình an, xoa dịu mệt mỏi sau thai kỳ.',
    ingredients: 'Lá bưởi, sả chanh, hương nhu tía, ngải cứu, gừng gió, kinh giới, quế chi, hoa hồi tự nhiên.',
    usage: 'Cho 1 túi lọc vào nồi chứa 3-5 lít nước sôi, đậy nắp ủ trong 10-15 phút để thảo mộc ra hết tinh chất. Pha thêm nước ấm đến nhiệt độ vừa phải (khoảng 40°C) và dùng để lau người, tắm hoặc gội đầu.',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCq1sMtLK0ySLwW4N6VGPDz2QXIhEGK9eauIEVne7CI4wigWTOllcM5pG7PJDmY3czSpZp9-cG6c84E9Pkdu_TVFi-fLWqmzcLJuZWdwoYUX7GrXu3VjRFeYQE12sQtIiY5TqcmFU0eKM-nd27jskX7bhGZ5KNWY5XkwCQDCZZzq7Wyl6lcxqn5J2tXI5Q5FO9_omT_XOHPxWXFjUUiOTFIEFlgdqMf07j4czAuP_Nh',
  },
};

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const product = MOCK_DETAILS[slug] || {
    id: 1,
    name: 'Túi Thảo Mộc Tắm Sau Sinh Cổ Truyền (10 túi lọc)',
    category_name: 'Thảo Mộc Xông Tắm',
    unit: 'Hộp 10 túi lọc',
    price: 185000,
    original_price: 220000,
    summary: 'Công thức thảo mộc vùng cao giúp làm ấm cơ thể, thư giãn các cơ và hỗ trợ làm sạch da tự nhiên.',
    description: 'Dược thảo sấy lạnh đối lưu 35°C giữ trọn vẹn tinh dầu và sắc xanh tự nhiên của lá cây.',
    ingredients: 'Lá bưởi, lá trầu không, gừng gió, sả chanh, ngải cứu, quế chi.',
    usage: 'Ủ 1 túi lọc với nước sôi trong 15 phút, pha ấm để tắm hoặc xông hơi.',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCq1sMtLK0ySLwW4N6VGPDz2QXIhEGK9eauIEVne7CI4wigWTOllcM5pG7PJDmY3czSpZp9-cG6c84E9Pkdu_TVFi-fLWqmzcLJuZWdwoYUX7GrXu3VjRFeYQE12sQtIiY5TqcmFU0eKM-nd27jskX7bhGZ5KNWY5XkwCQDCZZzq7Wyl6lcxqn5J2tXI5Q5FO9_omT_XOHPxWXFjUUiOTFIEFlgdqMf07j4czAuP_Nh',
  };

  const [quantity, setQuantity] = useState(1);
  const [toastVisible, setToastVisible] = useState(false);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    navigate('/dat-hang');
  };

  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-on-surface-variant mb-8">
        <Link to="/" className="hover:text-primary">Trang chủ</Link>
        <span>/</span>
        <Link to="/san-pham" className="hover:text-primary">Sản phẩm</Link>
        <span>/</span>
        <span className="text-primary font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Hình ảnh sản phẩm */}
        <div className="lg:col-span-6 bg-surface-container-lowest rounded-xl p-4 border border-border-herbal shadow-sm">
          <div className="aspect-square rounded-lg overflow-hidden bg-surface-container">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Thông tin chi tiết & Mua hàng */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div>
            <span className="text-xs font-semibold text-secondary uppercase tracking-widest block mb-2">
              {product.category_name}
            </span>
            <h1 className="font-serif text-2xl lg:text-3xl font-bold text-primary">
              {product.name}
            </h1>
            <span className="text-body-sm text-on-surface-variant block mt-1">{product.unit}</span>
          </div>

          {/* Giá tiền */}
          <div className="flex items-baseline gap-3 p-4 bg-surface-container-low rounded border border-border-herbal/60">
            <span className="font-serif text-3xl font-bold text-primary">
              {formatCurrency(product.price)}
            </span>
            {product.original_price && (
              <span className="text-base text-outline line-through">
                {formatCurrency(product.original_price)}
              </span>
            )}
            <span className="ml-auto text-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              Còn hàng trong kho
            </span>
          </div>

          <p className="text-body-sm text-on-surface-variant leading-relaxed">
            {product.summary}
          </p>

          {/* Chọn số lượng */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-primary">Số lượng:</span>
            <div className="flex items-center border border-border-herbal rounded bg-surface">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-on-surface hover:bg-surface-container"
              >
                -
              </button>
              <span className="w-10 text-center font-medium text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 flex items-center justify-center text-on-surface hover:bg-surface-container"
              >
                +
              </button>
            </div>
          </div>

          {/* Nút thao tác */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <button
              onClick={handleAddToCart}
              className="py-3.5 px-4 bg-surface-container-lowest border-2 border-primary text-primary hover:bg-surface-container font-semibold rounded flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[1.25rem]">shopping_bag</span>
              <span>+ Thêm Vào Giỏ</span>
            </button>
            <button
              onClick={handleBuyNow}
              className="py-3.5 px-4 bg-tertiary-container hover:bg-tertiary text-on-tertiary font-semibold rounded flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <span>Mua Ngay</span>
              <span className="material-symbols-outlined text-[1.25rem]">bolt</span>
            </button>
          </div>

          {/* Thành phần & Cách dùng */}
          <div className="border-t border-border-herbal pt-6 flex flex-col gap-4 text-body-sm">
            <div>
              <h3 className="font-serif font-bold text-primary mb-1">🌿 Thành Phần Thảo Mộc:</h3>
              <p className="text-on-surface-variant">{product.ingredients}</p>
            </div>
            <div>
              <h3 className="font-serif font-bold text-primary mb-1">🍵 Hướng Dẫn Nấu & Sử Dụng:</h3>
              <p className="text-on-surface-variant">{product.usage}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastVisible && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-on-primary px-5 py-3.5 rounded shadow-lg border border-primary-container flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-secondary-fixed text-[1.5rem]">check_circle</span>
          <div>
            <span className="font-serif font-bold text-sm block">Đã thêm vào giỏ hàng</span>
            <span className="text-xs text-primary-fixed-dim">{product.name} (SL: {quantity})</span>
          </div>
        </div>
      )}
    </div>
  );
};

