import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/useCartStore';
import { useAdminStore } from '@/store/useAdminStore';
import { formatCurrency } from '@/utils/formatCurrency';
import { FREESHIP_VOUCHERS, evaluateFreeshipVoucher } from '@/utils/shippingVouchers';

export const CartPage = () => {
  const navigate = useNavigate();
  const {
    items,
    appliedVoucherCode,
    setAppliedVoucherCode,
    updateQuantity,
    removeItem,
    getSubtotal,
    getTotalItems,
  } = useCartStore();
  const { settings } = useAdminStore();
  const [itemToDelete, setItemToDelete] = useState(null);
  const [voucherInput, setVoucherInput] = useState(appliedVoucherCode || '');
  const [voucherFeedback, setVoucherFeedback] = useState(null);

  const subtotal = getSubtotal();
  const totalItems = getTotalItems();
  const freeThreshold = settings?.free_shipping_threshold || 350000;
  const baseShipping = settings?.default_shipping_fee || 30000;

  // Kiểm tra mã freeship theo hạn mức đang áp dụng
  const activeVoucherCheck = appliedVoucherCode
    ? evaluateFreeshipVoucher(appliedVoucherCode, subtotal)
    : { valid: false };
  const isVoucherFreeship = activeVoucherCheck.valid;
  const isThresholdFreeship = subtotal >= freeThreshold;
  const shippingFee = subtotal === 0 || isThresholdFreeship || isVoucherFreeship ? 0 : baseShipping;
  const total = subtotal + shippingFee;

  const progressPercent = freeThreshold > 0
    ? Math.min(100, Math.round((subtotal / freeThreshold) * 100))
    : 100;

  // Chỉ ẩn các mã Freeship có hạn mức thấp hơn hoặc bằng giá trị đơn hiện tại (vẫn hiện các mã hạn mức cao hơn)
  const availableSuggestionVouchers = FREESHIP_VOUCHERS.filter(
    (v) => subtotal < v.minOrder
  );

  // Tự động gỡ thông báo nếu khách cập nhật giỏ hàng làm thay đổi điều kiện mã đang chọn
  useEffect(() => {
    if (appliedVoucherCode) {
      const check = evaluateFreeshipVoucher(appliedVoucherCode, subtotal);
      if (!check.valid) {
        setVoucherFeedback({ type: 'warning', text: check.message });
      } else {
        setVoucherFeedback({ type: 'success', text: check.message });
      }
    } else {
      setVoucherFeedback(null);
    }
  }, [subtotal, appliedVoucherCode]);

  const handleApplyVoucher = (codeToApply) => {
    const isFromSuggestion = typeof codeToApply === 'string';
    const targetCode = isFromSuggestion ? codeToApply : voucherInput;
    const clean = String(targetCode || '').trim().toUpperCase();

    const check = evaluateFreeshipVoucher(clean, subtotal);
    if (check.valid) {
      setVoucherInput(clean);
      setAppliedVoucherCode(clean);
      setVoucherFeedback({ type: 'success', text: check.message });
    } else {
      // Nếu bấm vào mã gợi ý chưa đủ điều kiện: chỉ hiện thông báo vàng bên dưới, không điền vào ô nhập mã
      if (!isFromSuggestion) {
        setVoucherInput(clean);
      }
      setAppliedVoucherCode('');
      setVoucherFeedback({ type: 'error', text: check.message });
    }
  };

  const inputVoucherCheck = voucherInput.trim()
    ? evaluateFreeshipVoucher(voucherInput, subtotal)
    : { valid: false };
  const canApplyInput = Boolean(voucherInput.trim()) && inputVoucherCheck.valid;

  const handleRemoveVoucher = () => {
    setAppliedVoucherCode('');
    setVoucherInput('');
    setVoucherFeedback(null);
  };

  const handleDecreaseQuantity = (item) => {
    if (item.quantity <= 1) {
      setItemToDelete(item);
    } else {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const confirmDeleteItem = () => {
    if (itemToDelete) {
      removeItem(itemToDelete.id);
      setItemToDelete(null);
    }
  };

  if (items.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-surface-container mx-auto flex items-center justify-center text-secondary mb-6">
          <span className="material-symbols-outlined text-[2.5rem]">shopping_bag</span>
        </div>
        <h2 className="font-serif text-2xl lg:text-3xl font-bold text-primary mb-3">
          Giỏ Hàng Của Bạn Đang Trống
        </h2>
        <p className="text-body-sm text-on-surface-variant max-w-md mx-auto mb-8">
          Hãy dạo quanh vườn thảo dược và chọn cho mình hoặc gia đình những gói lá tắm, muối ngâm chân ấm áp nhé.
        </p>
        <Link
          to="/san-pham"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary hover:bg-primary-container text-on-primary font-medium rounded-none transition-colors shadow-sm"
        >
          <span>Khám Phá Sản Phẩm</span>
          <span className="material-symbols-outlined text-[1.125rem]">arrow_forward</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1536px] mx-auto px-3.5 sm:px-8 lg:px-12 xl:px-16 py-6 sm:py-12">
      <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-6 sm:mb-8">
        Giỏ Hàng Thảo Dược Của Bạn
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start w-full">
        {/* Danh sách sản phẩm trong giỏ */}
        <div className="lg:col-span-8 w-full bg-surface-container-lowest rounded-none p-3.5 sm:p-6 border border-border-herbal shadow-xs">
          <div className="divide-y divide-border-herbal/50">
            {items.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-3 sm:gap-6 sm:items-center justify-between">
                <div className="flex gap-3.5 items-center flex-1 min-w-0">
                  <img
                    src={item.thumbnail_url}
                    alt={item.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-none object-cover bg-surface-container shrink-0 border border-border-herbal/50 shadow-2xs"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-xs sm:text-base font-bold text-primary line-clamp-2 sm:truncate leading-tight">
                      {item.name}
                    </h3>
                    <span className="text-[11px] sm:text-xs text-on-surface-variant block mt-1">{item.unit}</span>
                    <span className="text-xs sm:text-sm font-semibold text-primary mt-1 block tabular-nums">
                      {formatCurrency(item.price)}
                    </span>
                  </div>
                </div>

                {/* Điều chỉnh số lượng & Giá thành (Cố định độ rộng cột để không nhảy layout khi số thay đổi) */}
                <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 pl-[4.875rem] sm:pl-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-dashed border-border-herbal/40 shrink-0">
                  <div className="flex items-center border border-border-herbal rounded-none shrink-0 bg-surface select-none">
                    <button
                      type="button"
                      onClick={() => handleDecreaseQuantity(item)}
                      className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors cursor-pointer text-sm font-medium"
                      aria-label="Giảm"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-xs sm:text-sm font-semibold tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors cursor-pointer text-sm font-medium"
                      aria-label="Tăng"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right shrink-0 w-28 sm:w-32">
                    <span className="font-sans font-bold text-xs sm:text-base text-primary block tabular-nums whitespace-nowrap">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setItemToDelete(item)}
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
        <div className="lg:col-span-4 w-full space-y-4">
          <div className="bg-surface-container-low rounded-none p-4 sm:p-6 border border-border-herbal shadow-xs space-y-5">
            {/* Thanh tiến trình Miễn Phí Vận Chuyển Toàn Quốc */}
            <div className="bg-surface p-3.5 sm:p-4 border border-border-herbal/80 rounded-none space-y-2.5">
              <div className="flex items-center justify-between gap-2 text-xs sm:text-sm font-bold text-primary">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[1.125rem] text-primary">local_shipping</span>
                  <span>Miễn Phí Vận Chuyển Toàn Quốc</span>
                </div>
                <span className="font-sans font-bold tabular-nums text-primary">
                  {isVoucherFreeship ? '100%' : `${progressPercent}%`}
                </span>
              </div>

              <div className="w-full h-2 bg-border-herbal/40 overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${isVoucherFreeship ? 100 : progressPercent}%` }}
                />
              </div>

              {isThresholdFreeship || isVoucherFreeship ? (
                <p className="text-[11px] sm:text-xs text-emerald-700 font-medium leading-snug">
                  ✓ Đơn hàng đã được MIỄN PHÍ VẬN CHUYỂN toàn quốc
                  {isVoucherFreeship && !isThresholdFreeship ? ` (theo mã ${appliedVoucherCode})` : ''}.
                </p>
              ) : (
                <p className="text-[11px] sm:text-xs text-on-surface-variant leading-snug tabular-nums">
                  Mua thêm <strong className="text-primary font-bold">{formatCurrency(freeThreshold - subtotal)}</strong> để nhận ưu đãi Freeship (đơn từ {formatCurrency(freeThreshold)}).
                </p>
              )}
            </div>

            {/* Mã giảm giá / Voucher Freeship theo hạn mức */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
                <span className="material-symbols-outlined text-[1rem] text-secondary">sell</span>
                <span>MÃ GIẢM GIÁ / VOUCHER</span>
              </div>

              <div className="flex items-stretch gap-2">
                <input
                  type="text"
                  value={voucherInput}
                  onChange={(e) => {
                    const nextVal = e.target.value.toUpperCase();
                    setVoucherInput(nextVal);
                    if (nextVal.trim()) {
                      const check = evaluateFreeshipVoucher(nextVal, subtotal);
                      if (!check.valid && check.reason === 'MIN_ORDER') {
                        setVoucherFeedback({ type: 'error', text: check.message });
                      } else if (check.valid) {
                        setVoucherFeedback(null);
                      }
                    } else if (!appliedVoucherCode) {
                      setVoucherFeedback(null);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (canApplyInput) {
                        handleApplyVoucher();
                      }
                    }
                  }}
                  placeholder="NHẬP MÃ (FREESHIP150, FREESHIP250...)"
                  className="flex-1 min-w-0 px-3 py-2 bg-surface border border-border-herbal rounded-none text-xs font-mono text-primary placeholder:text-outline focus:outline-none focus:border-primary"
                />
                <button
                  type="button"
                  disabled={!canApplyInput}
                  onClick={() => handleApplyVoucher()}
                  className="px-4 py-2 bg-secondary hover:bg-primary text-on-primary text-xs font-bold rounded-none transition-colors shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-secondary"
                >
                  Áp dụng
                </button>
              </div>

              {/* Gợi ý các mã Freeship theo hạn mức (ẩn khi đã đạt Freeship tự động) */}
              {availableSuggestionVouchers.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="text-on-surface-variant mr-0.5">Gợi ý:</span>
                  {availableSuggestionVouchers.map((v) => {
                    const isActive = isVoucherFreeship && appliedVoucherCode === v.code;
                    return (
                      <button
                        key={v.code}
                        type="button"
                        onClick={() => handleApplyVoucher(v.code)}
                        title={v.label}
                        className={`px-2 py-1 font-mono text-[11px] font-semibold border transition-colors cursor-pointer rounded-none ${
                          isActive
                            ? 'bg-primary text-on-primary border-primary'
                            : 'bg-surface-container hover:bg-surface-container-high text-primary border-border-herbal/70'
                        }`}
                      >
                        +{v.code}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Thông báo trạng thái áp dụng mã */}
              {voucherFeedback && (
                <div
                  className={`flex items-start justify-between gap-2 p-2.5 text-[11px] leading-snug border ${
                    voucherFeedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-900 border-amber-200'
                  }`}
                >
                  <span>{voucherFeedback.text}</span>
                  {isVoucherFreeship && (
                    <button
                      type="button"
                      onClick={handleRemoveVoucher}
                      className="text-emerald-900 hover:text-red-700 font-bold shrink-0 cursor-pointer"
                      title="Gỡ mã"
                    >
                      ✕
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="border-t border-border-herbal pt-4 flex flex-col gap-2.5 text-xs sm:text-body-sm text-on-surface-variant">
              <div className="flex justify-between items-center gap-2">
                <span>Số lượng:</span>
                <span className="font-sans font-semibold text-on-surface tabular-nums whitespace-nowrap">
                  {totalItems} đơn vị bán
                </span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span>Tạm tính tiền hàng:</span>
                <span className="font-sans font-semibold text-on-surface tabular-nums whitespace-nowrap">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span>Phí vận chuyển:</span>
                <span className="font-sans font-medium tabular-nums whitespace-nowrap">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-semibold">Miễn phí</span>
                  ) : (
                    formatCurrency(shippingFee)
                  )}
                </span>
              </div>
              <div className="border-t border-border-herbal pt-3 mt-1 flex justify-between items-baseline font-bold gap-2">
                <span className="font-serif text-sm sm:text-base text-primary shrink-0">TỔNG THANH TOÁN:</span>
                <span className="font-sans font-bold text-lg sm:text-xl text-tertiary tabular-nums whitespace-nowrap">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/dat-hang')}
            className="w-full py-3.5 px-4 bg-tertiary-container hover:bg-tertiary text-on-tertiary font-semibold text-xs sm:text-sm rounded-none flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
          >
            <span>Tiến Hành Đặt Hàng</span>
            <span className="material-symbols-outlined text-[1.125rem]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Modal xác nhận xóa sản phẩm khỏi giỏ hàng */}
      {itemToDelete && (
        <div
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setItemToDelete(null)}
        >
          <div
            className="bg-surface w-full max-w-md border border-border-herbal p-6 shadow-xl rounded-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-50 border border-red-200 text-red-700 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[1.375rem]">delete</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-primary">
                Xác Nhận Xóa Sản Phẩm
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-6">
              Bạn có chắc chắn muốn xóa sản phẩm{' '}
              <strong className="text-primary font-semibold">"{itemToDelete.name}"</strong> khỏi giỏ hàng không?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2.5 border border-border-herbal bg-surface-container-low hover:bg-surface-container text-primary text-xs font-semibold uppercase tracking-wider rounded-none transition-colors cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={confirmDeleteItem}
                className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold uppercase tracking-wider rounded-none transition-colors cursor-pointer shadow-xs"
              >
                Xác Nhận Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

