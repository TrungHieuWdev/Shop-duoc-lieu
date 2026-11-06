import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '@/utils/formatCurrency';
import { useCartStore } from '@/store/useCartStore';
import { flyItemToCart } from '@/utils/cartAnimation';

export const ProductCard = ({ product, onAddToCartSuccess }) => {
  const cardRef = useRef(null);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // 1. Lưu sản phẩm vào giỏ hàng ngay lập tức
    addItem(product, 1);

    // 2. Tìm ảnh sản phẩm làm điểm xuất phát bay
    const imgEl = cardRef.current?.querySelector('img') || e.currentTarget;
    const imageUrl = product.thumbnail_url || product.image_url;

    // 3. Kích hoạt hiệu ứng hình ảnh thu nhỏ bay vào giỏ hàng và làm giỏ hàng rung lên 1 nhịp
    flyItemToCart({
      sourceElement: imgEl,
      imageUrl,
      onComplete: () => {
        if (onAddToCartSuccess) {
          onAddToCartSuccess(product);
        }
      },
    });
  };

  return (
    <div
      ref={cardRef}
      className="scroll-reveal group relative flex flex-col bg-surface-container-lowest rounded-none p-2.5 sm:p-4 border border-border-herbal/70 shadow-xs hover:shadow-md transition-all duration-300"
    >
      {/* Product Image */}
      <Link to={`/san-pham/${product.slug}`} className="relative w-full aspect-square bg-surface-container rounded-none overflow-hidden block">
        <img
          src={product.thumbnail_url || product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          decoding="async"
        />
        {product.is_featured && (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-tertiary-container text-on-tertiary text-[10px] sm:text-[0.6875rem] font-semibold tracking-wider uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-none shadow-xs">
            Bán chạy
          </span>
        )}
      </Link>

      {/* Product Info */}
      <div className="pt-2.5 sm:pt-4 flex flex-col flex-1">
        <span className="text-[10px] sm:text-[0.6875rem] font-semibold text-secondary uppercase tracking-widest line-clamp-1">
          {product.category_name || product.unit || 'Thảo Mộc Bản Địa'}
        </span>
        <Link to={`/san-pham/${product.slug}`}>
          <h3 className="font-serif text-xs sm:text-base font-bold text-primary mt-1 group-hover:text-secondary transition-colors line-clamp-2 min-h-[2rem] sm:min-h-[2.75rem] leading-tight">
            {product.name}
          </h3>
        </Link>
        <span className="text-[11px] sm:text-body-sm text-on-surface-variant mt-0.5 sm:mt-1 line-clamp-1">
          {product.unit || 'Quy cách chuẩn'}
        </span>

        {/* Giá tiền (ví dụ: 50.000 ₫ / 1 gói) bên trái & Nút vuông chỉ hiện icon giỏ hàng (không bo góc) bên phải */}
        <div className="mt-auto pt-3 sm:pt-4 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1 min-w-0">
            <span className="font-sans text-sm sm:text-lg font-bold text-primary tabular-nums whitespace-nowrap">
              {formatCurrency(product.price)}
            </span>
            <span className="text-[11px] sm:text-xs text-on-surface-variant font-medium whitespace-nowrap">
              / 1 gói
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            aria-label="Thêm vào giỏ hàng"
            title="Thêm vào giỏ hàng"
            className="w-9 h-9 sm:w-10 sm:h-10 bg-tertiary-container hover:bg-tertiary text-on-tertiary rounded-none flex items-center justify-center shrink-0 transition-all duration-200 shadow-xs active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] sm:text-[20px]">shopping_bag</span>
          </button>
        </div>
      </div>
    </div>
  );
};

