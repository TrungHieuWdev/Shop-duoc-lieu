import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/useCartStore';
import { formatCurrency } from '@/utils/formatCurrency';

export const CartPage = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  const shippingFee = subtotal >= 350000 || subtotal === 0 ? 0 : 30000;
  const total = subtotal + shippingFee;

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-surface-container mx-auto flex items-center justify-center text-secondary mb-6">
          <span className="material-symbols-outlined text-[2.5rem]">shopping_bag</span>
        </div>
        <h2 className="font-serif text-2xl lg:text-3xl font-bold text-primary mb-3">
          Giỏ Hàng Của Bạn Đang Trống
        </h2>
        <p className="text-body-sm text-on-surface-variant max-w-md mx-auto mb-8">
          Hãy dạo quanh vườn thảo mộc và chọn cho mình hoặc gia đình những gói lá tắm, muối ngâm chân ấm áp nhé.
        </p>
        <Link
          to="/san-pham"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary hover:bg-primary-container text-on-primary font-medium rounded transition-colors shadow-sm"
        >
          <span>Khám Phá Sản Phẩm</span>
          <span className="material-symbols-outlined text-[1.125rem]">arrow_forward</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-12">
      <h1 className="font-serif text-2xl lg:text-3xl font-bold text-primary mb-8">
        Giỏ Hàng Thảo Mộc Của Bạn
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Danh sách sản phẩm trong giỏ */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded p-6 border border-border-herbal shadow-sm">
          <div className="divide-y divide-border-herbal/50">
            {items.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4 items-center">
                <img
                  src={item.thumbnail_url}
                  alt={item.name}
                  className="w-20 h-20 rounded object-cover bg-surface-container shrink-0 border border-border-herbal/50"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-base font-bold text-primary truncate">
                    {item.name}
                  </h3>
                  <span className="text-xs text-on-surface-variant block mt-0.5">{item.unit}</span>
                  <span className="text-sm font-semibold text-primary mt-1 block">
                    {formatCurrency(item.price)}
                  </span>
                </div>

                {/* Điều chỉnh số lượng */}
                <div className="flex items-center border border-border-herbal rounded shrink-0">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors"
                  >
                    +
                  </button>
                </div>

                <div className="text-right shrink-0 w-24">
                  <span className="font-serif font-bold text-primary block">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-xs text-error hover:underline mt-1"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tóm tắt thanh toán */}
        <div className="lg:col-span-4 bg-surface-container-low rounded p-6 border border-border-herbal shadow-sm">
          <h2 className="font-serif text-lg font-bold text-primary mb-4 pb-3 border-b border-border-herbal">
            Tóm Tắt Đơn Hàng
          </h2>

          <div className="flex flex-col gap-3 text-body-sm text-on-surface-variant mb-6">
            <div className="flex justify-between">
              <span>Tạm tính tiền hàng:</span>
              <span className="font-medium text-on-surface">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển:</span>
              <span>{shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee)}</span>
            </div>
            {subtotal < 350000 && (
              <p className="text-xs text-secondary italic">
                (Mua thêm {formatCurrency(350000 - subtotal)} để được MIỄN PHÍ VẬN CHUYỂN toàn quốc)
              </p>
            )}
            <div className="border-t border-border-herbal pt-3 flex justify-between items-baseline font-bold">
              <span className="font-serif text-base text-primary">TỔNG THANH TOÁN:</span>
              <span className="font-serif text-xl text-tertiary">{formatCurrency(total)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/dat-hang')}
            className="w-full py-3.5 px-4 bg-tertiary-container hover:bg-tertiary text-on-tertiary font-medium rounded flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <span>Tiến Hành Đặt Hàng</span>
            <span className="material-symbols-outlined text-[1.125rem]">arrow_forward</span>
          </button>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-secondary">
            <span className="material-symbols-outlined text-[1rem]">shield</span>
            <span>Thanh toán chuyển khoản VietQR tự động, an toàn</span>
          </div>
        </div>
      </div>
    </div>
  );
};

