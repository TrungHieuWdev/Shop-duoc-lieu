import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/useCartStore';
import { useAdminStore } from '@/store/useAdminStore';
import { formatCurrency } from '@/utils/formatCurrency';

export const CartPage = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const { settings } = useAdminStore();

  const subtotal = getSubtotal();
  const freeThreshold = settings?.free_shipping_threshold || 350000;
  const baseShipping = settings?.default_shipping_fee || 30000;
  const shippingFee = subtotal >= freeThreshold || subtotal === 0 ? 0 : baseShipping;
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
    <div className="max-w-[1536px] mx-auto px-3.5 sm:px-8 lg:px-12 xl:px-16 py-6 sm:py-12">
      <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-6 sm:mb-8">
        Giỏ Hàng Thảo Mộc Của Bạn
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Danh sách sản phẩm trong giỏ */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-2xl p-3.5 sm:p-6 border border-border-herbal shadow-xs">
          <div className="divide-y divide-border-herbal/50">
            {items.map((item) => (
              <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
                <div className="flex gap-3 items-center flex-1 min-w-0">
                  <img
                    src={item.thumbnail_url}
                    alt={item.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-surface-container shrink-0 border border-border-herbal/50 shadow-2xs"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-xs sm:text-base font-bold text-primary line-clamp-2 sm:truncate leading-tight">
                      {item.name}
                    </h3>
                    <span className="text-[11px] sm:text-xs text-on-surface-variant block mt-0.5">{item.unit}</span>
                    <span className="text-xs sm:text-sm font-semibold text-primary mt-0.5 block">
                      {formatCurrency(item.price)}
                    </span>
                  </div>
                </div>

                {/* Điều chỉnh số lượng & Giá thành (Tối ưu cho màn hình cảm ứng điện thoại) */}
                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pl-[4.75rem] sm:pl-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-dashed border-border-herbal/40">
                  <div className="flex items-center border border-border-herbal rounded-lg shrink-0 bg-surface">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors cursor-pointer text-sm"
                      aria-label="Giảm"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs sm:text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors cursor-pointer text-sm"
                      aria-label="Tăng"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right shrink-0 min-w-[5.5rem]">
                    <span className="font-serif font-bold text-xs sm:text-base text-primary block">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[11px] sm:text-xs text-red-600 hover:underline mt-0.5 cursor-pointer font-medium"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tóm tắt thanh toán */}
        <div className="lg:col-span-4 bg-surface-container-low rounded-2xl p-4 sm:p-6 border border-border-herbal shadow-xs">
          <h2 className="font-serif text-base sm:text-lg font-bold text-primary mb-3 sm:mb-4 pb-2.5 border-b border-border-herbal">
            Tóm Tắt Đơn Hàng
          </h2>

          <div className="flex flex-col gap-2.5 sm:gap-3 text-xs sm:text-body-sm text-on-surface-variant mb-5 sm:mb-6">
            <div className="flex justify-between">
              <span>Tạm tính tiền hàng:</span>
              <span className="font-medium text-on-surface">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển:</span>
              <span>{shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee)}</span>
            </div>
            {subtotal < 350000 && (
              <p className="text-[11px] sm:text-xs text-secondary italic">
                (Mua thêm {formatCurrency(350000 - subtotal)} để được MIỄN PHÍ VẬN CHUYỂN toàn quốc)
              </p>
            )}
            <div className="border-t border-border-herbal pt-3 flex justify-between items-baseline font-bold">
              <span className="font-serif text-sm sm:text-base text-primary">TỔNG THANH TOÁN:</span>
              <span className="font-serif text-lg sm:text-xl text-tertiary">{formatCurrency(total)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/dat-hang')}
            className="w-full py-3.5 px-4 bg-tertiary-container hover:bg-tertiary text-on-tertiary font-semibold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-98"
          >
            <span>Tiến Hành Đặt Hàng</span>
            <span className="material-symbols-outlined text-[1.125rem]">arrow_forward</span>
          </button>

          <div className="mt-3.5 flex items-center justify-center gap-1.5 text-[11px] sm:text-xs text-secondary">
            <span className="material-symbols-outlined text-[1rem]">shield</span>
            <span>Thanh toán chuyển khoản VietQR tự động, an toàn</span>
          </div>
        </div>
      </div>
    </div>
  );
};

