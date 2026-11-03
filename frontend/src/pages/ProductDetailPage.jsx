import React, { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { formatCurrency } from '@/utils/formatCurrency';
import { useCartStore } from '@/store/useCartStore';
import { flyItemToCart } from '@/utils/cartAnimation';

const MOCK_DETAILS = {
  'bai-thuoc-xong-tam-tong-hop-7-vi-thao-duoc': {
    id: 1,
    name: 'Bài Thuốc Xông Tắm Tổng Hợp 7 Vị Thảo Dược (Phơi Khô)',
    category_name: 'Bài Thuốc Xông Tắm',
    unit: 'Gói 1 nồi xông (150g)',
    price: 50000,
    original_price: 65000,
    summary: 'Bài thuốc xông tắm dân gian tổng hợp đủ 7 vị thảo dược phơi khô: Đinh lăng, gừng sẻ, sả chanh, lá trầu không, ngải cứu nếp, lá bưởi thơm và hoa hồng.',
    description: 'Được phối ngũ theo phương pháp cổ truyền từ 7 loại thảo mộc bản địa Việt Nam phơi khô tự nhiên. Nồi nước xông tỏa hương thơm thảo mộc ấm nồng dịu ngọt, giúp toát mồ hôi giải cảm lạnh, thông kinh hoạt lạc, làm ấm cơ thể cho mẹ sau sinh, dưỡng nhan sáng da và xua tan căng thẳng sau ngày làm việc mệt mỏi.',
    ingredients: '1. Lá đinh lăng phơi khô • 2. Gừng sẻ thái lát phơi khô • 3. Lá sả chanh cắt khúc • 4. Lá trầu không phơi khô • 5. Lá ngải cứu nếp • 6. Lá bưởi già phơi khô • 7. Nụ và cánh hoa hồng phơi khô.',
    usage: 'Rửa sơ thảo mộc qua nước sạch. Cho toàn bộ gói thảo mộc vào nồi cùng 3 - 5 lít nước sạch, đun sôi kỹ từ 5 - 10 phút để dược chất và tinh dầu tỏa đều. Trùm chăn hoặc lều xông kín người trong 10 - 15 phút đến khi cơ thể toát mồ hôi nhẹ. Sau khi xông, pha thêm nước ấm để lau người hoặc tắm dội nhẹ nhàng (không tắm nước lạnh ngay).',
    image_url: '/images/products/bai-thuoc-7-vi.jpg',
  },
  'la-dinh-lang-phoi-kho-200g': {
    id: 2,
    name: 'Lá Đinh Lăng Phơi Khô',
    category_name: 'Dược Liệu Lẻ',
    unit: 'Túi zip 200g',
    price: 50000,
    original_price: 65000,
    summary: 'Lá đinh lăng nếp nhiều nhánh, phơi khô thơm thanh bồi bổ khí huyết.',
    description: 'Được ví như "nhân sâm người nghèo", có công dụng bồi bổ khí huyết, giảm đau mỏi cơ khớp, an thần và hỗ trợ cơ thể mau lại sức.',
    ingredients: '100% Lá đinh lăng nếp tự nhiên phơi khô.',
    usage: 'Nấu nước tắm hoặc đun uống/ngâm chân theo nhu cầu.',
    image_url: '/images/herbs/dinh-lang.jpg',
  },
  'gung-se-phoi-kho-thai-lat-200g': {
    id: 3,
    name: 'Gừng Phơi Khô (Gừng Sẻ Thái Lát)',
    category_name: 'Dược Liệu Lẻ',
    unit: 'Túi zip 200g',
    price: 40000,
    original_price: 50000,
    summary: 'Gừng sẻ ta củ già thơm cay nồng ấm, thái lát phơi khô tự nhiên.',
    description: 'Gừng sẻ bản địa củ nhỏ nhưng chắc thịt và giàu tinh dầu Zingiberen. Thích hợp dùng đun nước ngâm chân, pha nước xông giải cảm, hoặc giữ ấm cơ thể cho sản phụ.',
    ingredients: '100% Gừng sẻ già tự nhiên thái lát phơi khô.',
    usage: 'Dùng 20 - 30g nấu cùng 2 - 3 lít nước sôi, có thể thêm chút muối hạt để ngâm chân hoặc xông.',
    image_url: '/images/herbs/gung-kho.jpg',
  },
  'la-sa-phoi-kho-thai-khuc-200g': {
    id: 4,
    name: 'Lá Sả Phơi Khô (Cắt Khúc)',
    category_name: 'Dược Liệu Lẻ',
    unit: 'Túi zip 200g',
    price: 30000,
    original_price: 40000,
    summary: 'Thân và lá sả đồi thơm nồng tinh dầu Citral, cắt khúc phơi khô giải cảm.',
    description: 'Giúp thông thoáng lỗ chân lông, giải cảm, thông mũi nghẹt, xua tan mùi cơ thể và tạo cảm giác nhẹ nhõm khoan khoái.',
    ingredients: '100% Sả chanh đồi phơi khô cắt khúc.',
    usage: 'Dùng 30 - 40g đun nước xông hơi giải cảm hoặc nấu nước gội đầu.',
    image_url: '/images/herbs/sa-chanh.jpg',
  },
  'la-trau-khong-phoi-kho-150g': {
    id: 5,
    name: 'Lá Trầu Không Phơi Khô',
    category_name: 'Dược Liệu Lẻ',
    unit: 'Túi zip 150g',
    price: 45000,
    original_price: 55000,
    summary: 'Lá trầu bánh tẻ tuyển chọn, phơi khô nguyên lá giàu kháng sinh tự nhiên.',
    description: 'Chứa hàm lượng cao Eugenol và Chavicol giúp kháng khuẩn, kháng nấm, làm sạch da dịu nhẹ, phòng phong hàn cho mẹ sau sinh.',
    ingredients: '100% Lá trầu không bản địa phơi khô.',
    usage: 'Dùng 15 - 20g đun sôi với nước 10 phút, dùng để xông, tắm hoặc rửa vùng da cần làm sạch.',
    image_url: '/images/herbs/la-trau-khong.jpg',
  },
  'la-ngai-cuu-nep-phoi-kho-200g': {
    id: 6,
    name: 'Lá Ngải Cứu Nếp Phơi Khô',
    category_name: 'Dược Liệu Lẻ',
    unit: 'Túi zip 200g',
    price: 35000,
    original_price: 45000,
    summary: 'Ngải cứu nếp non đồi cao thơm nồng, phơi khô nguyên búp ôn kinh tán hàn.',
    description: 'Vị đắng thơm, tính ấm, chuyên trị phong hàn, nhức mỏi xương khớp, làm ấm chân tay và hỗ trợ ngủ sâu giấc khi dùng ngâm chân.',
    ingredients: '100% Ngải cứu nếp phơi khô.',
    usage: 'Cho 30g vào 2 lít nước sôi đun 5 phút, pha nước ấm ngâm chân trước khi đi ngủ.',
    image_url: '/images/herbs/ngai-cuu.jpg',
  },
  'la-buoi-phoi-kho-thom-150g': {
    id: 7,
    name: 'Lá Bưởi Phơi Khô',
    category_name: 'Dược Liệu Lẻ',
    unit: 'Túi zip 150g',
    price: 35000,
    original_price: 45000,
    summary: 'Lá bưởi già nhiều túi tinh dầu thơm ngát, phơi khô dùng xông và gội đầu.',
    description: 'Giàu tinh dầu tự nhiên giúp thông thoáng đường thở, sạch gàu ngứa da đầu, giúp tóc mềm mượt và lưu lại hương đồng nội dịu nhẹ.',
    ingredients: '100% Lá bưởi già phơi khô.',
    usage: 'Đun cùng nước sôi 10 phút để xông mặt, xông người hoặc làm nước tráng tóc.',
    image_url: '/images/herbs/la-buoi.jpg',
  },
  'hoa-hong-phoi-kho-100g': {
    id: 8,
    name: 'Hoa Hồng Phơi Khô (Nụ & Cánh)',
    category_name: 'Dược Liệu Lẻ',
    unit: 'Túi zip 100g',
    price: 55000,
    original_price: 70000,
    summary: 'Nụ và cánh hoa hồng tự nhiên phơi khô, giàu chất chống oxy hóa dưỡng nhan.',
    description: 'Hoa hồng thơm ngát phơi khô lưu giữ trọn vẹn hương hoa và vitamin. Rất tuyệt vời khi dùng pha nước tắm xông dưỡng ẩm mịn màng làn da, giảm căng thẳng thần kinh hoặc pha trà thảo mộc thanh lọc cơ thể.',
    ingredients: '100% Nụ và cánh hoa hồng sạch tự nhiên phơi khô.',
    usage: 'Dùng 15 - 20g thả vào nồi nước xông, bồn tắm nước ấm hoặc hãm với nước sôi thưởng trà.',
    image_url: '/images/herbs/hoa-hong.jpg',
  },
};

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const imgRef = useRef(null);

  const product = MOCK_DETAILS[slug] || MOCK_DETAILS['bai-thuoc-xong-tam-tong-hop-7-vi-thao-duoc'];

  const [quantity, setQuantity] = useState(1);
  const [toastVisible, setToastVisible] = useState(false);

  const handleAddToCart = (e) => {
    // 1. Lưu sản phẩm vào store
    addItem(product, quantity);

    // 2. Kích hoạt hiệu ứng bay vào giỏ và rung giỏ hàng
    const sourceEl = imgRef.current || e.currentTarget;
    flyItemToCart({
      sourceElement: sourceEl,
      imageUrl: product.image_url || product.thumbnail_url,
    });

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
              ref={imgRef}
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

