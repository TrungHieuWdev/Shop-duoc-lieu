import { formatCurrency } from './formatCurrency';

export const FREESHIP_VOUCHERS = [
  {
    code: 'FREESHIP150',
    minOrder: 150000,
    label: 'Miễn phí ship đơn từ 150.000 đ',
  },
  {
    code: 'FREESHIP250',
    minOrder: 250000,
    label: 'Miễn phí ship đơn từ 250.000 đ',
  },
  {
    code: 'FREESHIP350',
    minOrder: 350000,
    label: 'Miễn phí ship đơn từ 350.000 đ',
  },
];

export const evaluateFreeshipVoucher = (rawCode, subtotal = 0) => {
  const cleanCode = String(rawCode || '').trim().toUpperCase();
  if (!cleanCode) {
    return {
      valid: false,
      reason: 'EMPTY',
      message: 'Vui lòng nhập mã Freeship.',
    };
  }

  const voucher = FREESHIP_VOUCHERS.find((v) => v.code === cleanCode);
  if (!voucher) {
    return {
      valid: false,
      reason: 'NOT_FOUND',
      message: `Mã "${cleanCode}" không hợp lệ. Vui lòng dùng FREESHIP150, FREESHIP250 hoặc FREESHIP350.`,
    };
  }

  if (subtotal < voucher.minOrder) {
    const missing = voucher.minOrder - subtotal;
    return {
      valid: false,
      reason: 'MIN_ORDER',
      voucher,
      missing,
      message: `Mã ${voucher.code} áp dụng cho đơn từ ${formatCurrency(voucher.minOrder)} (cần mua thêm ${formatCurrency(missing)}).`,
    };
  }

  return {
    valid: true,
    voucher,
    message: `Đã áp dụng mã ${voucher.code}: Miễn phí vận chuyển toàn quốc!`,
  };
};

