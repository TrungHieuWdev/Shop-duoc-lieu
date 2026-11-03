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
      className="group relative flex flex-col bg-surface-container-lowest rounded p-4 border border-border-herbal/60 shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* Product Image */}
      <Link to={`/san-pham/${product.slug}`} className="relative w-full aspect-square bg-surface-container rounded overflow-hidden block">
        <img
          src={product.thumbnail_url || product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.is_featured && (
          <span className="absolute top-3 left-3 bg-tertiary-container text-on-tertiary text-[0.6875rem] font-semibold tracking-wider uppercase px-2.5 py-1 rounded shadow-sm">
            Bán chạy
          </span>
        )}
      </Link>

      {/* Product Info */}
      <div className="pt-4 flex flex-col flex-1">
        <span className="text-[0.6875rem] font-semibold text-secondary uppercase tracking-widest">
          {product.category_name || product.unit || 'Thảo Mộc Bản Địa'}
        </span>
        <Link to={`/san-pham/${product.slug}`}>
          <h3 className="font-serif text-base font-bold text-primary mt-1 group-hover:text-secondary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <span className="text-body-sm text-on-surface-variant mt-1">
          {product.unit || 'Quy cách chuẩn'}
        </span>

        {/* Price Display */}
        <div className="mt-4 flex items-baseline gap-2">
          <span className="font-serif text-lg font-bold text-primary">
            {formatCurrency(product.price)}
          </span>
          {product.original_price && Number(product.original_price) > Number(product.price) && (
            <span className="text-body-sm text-outline line-through">
              {formatCurrency(product.original_price)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="mt-4 w-full py-2.5 px-4 bg-tertiary-container hover:bg-tertiary text-on-tertiary text-xs font-semibold rounded flex items-center justify-center gap-2 transition-colors duration-200 shadow-sm active:scale-95"
        >
          <span className="material-symbols-outlined text-base">shopping_bag</span>
          <span>+ Giỏ Hàng</span>
        </button>
      </div>
    </div>
  );
};

