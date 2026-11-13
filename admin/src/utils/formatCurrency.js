/**
 * Định dạng số tiền sang định dạng tiền tệ Việt Nam Đồng (VND)
 * @param {number|string} amount 
 * @returns {string} Ví dụ: "185.000 ₫"
 */
export const formatCurrency = (amount) => {
  const numericAmount = Number(amount) || 0;
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(numericAmount);
};

