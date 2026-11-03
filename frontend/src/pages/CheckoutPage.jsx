import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '@/store/useCartStore';
import { formatCurrency } from '@/utils/formatCurrency';
import api from '@/services/api';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  const shippingFee = subtotal >= 350000 || subtotal === 0 ? 0 : 30000;
  const total = subtotal + shippingFee;

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    customer_address: '',
    customer_note: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold text-primary mb-4">
          Bạn chưa có sản phẩm nào để đặt hàng
        </h2>
        <Link to="/san-pham" className="text-secondary hover:underline font-medium">
          Quay lại cửa hàng xem sản phẩm
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Kiểm tra tính hợp lệ cơ bản
    if (!formData.customer_name.trim() || !formData.customer_phone.trim() || !formData.customer_address.trim()) {
      setErrorMessage('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ giao hàng.');
      return;
    }

    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!phoneRegex.test(formData.customer_phone.trim())) {
      setErrorMessage('Số điện thoại không đúng định dạng di động Việt Nam (10 chữ số).');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        customer_name: formData.customer_name.trim(),
        customer_phone: formData.customer_phone.trim(),
        customer_email: formData.customer_email.trim() || undefined,
        customer_address: formData.customer_address.trim(),
        customer_note: formData.customer_note.trim() || undefined,
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      };

      const res = await api.post('/api/orders', payload);

      if (res.success && res.data) {
        const { order_code, access_token } = res.data;
        navigate(`/thanh-toan/${order_code}?token=${access_token}`);
      } else {
        setErrorMessage(res.message || 'Không thể tạo đơn hàng. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error('Error creating order:', err);
      setErrorMessage(
        err.error?.message || 'Có sự cố xảy ra khi tạo đơn hàng. Vui lòng thử lại sau giây lát.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-12">
      <h1 className="font-serif text-2xl lg:text-3xl font-bold text-primary mb-8">
        Thông Tin Nhận Hàng & Thanh Toán
      </h1>

      {errorMessage && (
        <div className="mb-6 p-4 rounded bg-error-container text-on-error-container text-body-sm flex items-center gap-3">
          <span className="material-symbols-outlined text-[1.25rem]">error</span>
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form thông tin giao hàng */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded p-6 lg:p-8 border border-border-herbal shadow-sm">
          <h2 className="font-serif text-lg font-bold text-primary mb-6 pb-2 border-b border-border-herbal flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[1.25rem]">local_shipping</span>
            <span>1. Người Nhận Hàng</span>
          </h2>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-primary mb-1">
                Họ và tên người nhận <span className="text-error">*</span>
              </label>
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                placeholder="Ví dụ: Nguyễn Thị Hoa"
                required
                className="w-full px-3.5 py-2.5 bg-surface-container-low border border-border-herbal rounded text-body-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-primary mb-1">
                  Số điện thoại di động <span className="text-error">*</span>
                </label>
                <input
                  type="tel"
                  name="customer_phone"
                  value={formData.customer_phone}
                  onChange={handleChange}
                  placeholder="0987 654 321"
                  required
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border border-border-herbal rounded text-body-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-1">
                  Email nhận thông báo (Không bắt buộc)
                </label>
                <input
                  type="email"
                  name="customer_email"
                  value={formData.customer_email}
                  onChange={handleChange}
                  placeholder="hoa.nguyen@example.com"
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border border-border-herbal rounded text-body-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary mb-1">
                Địa chỉ giao hàng chi tiết <span className="text-error">*</span>
              </label>
              <input
                type="text"
                name="customer_address"
                value={formData.customer_address}
                onChange={handleChange}
                placeholder="Số nhà, tên ngõ/đường, phường/xã, quận/huyện, tỉnh/thành"
                required
                className="w-full px-3.5 py-2.5 bg-surface-container-low border border-border-herbal rounded text-body-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary mb-1">
                Ghi chú cho cửa hàng (Tùy chọn)
              </label>
              <textarea
                name="customer_note"
                value={formData.customer_note}
                onChange={handleChange}
                rows={3}
                placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến..."
                className="w-full px-3.5 py-2.5 bg-surface-container-low border border-border-herbal rounded text-body-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Xem lại đơn hàng & Nút xác nhận */}
        <div className="lg:col-span-5 bg-surface-container-low rounded p-6 lg:p-8 border border-border-herbal shadow-sm">
          <h2 className="font-serif text-lg font-bold text-primary mb-4 pb-2 border-b border-border-herbal flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[1.25rem]">inventory_2</span>
            <span>2. Tóm Tắt Đơn Hàng ({items.length} món)</span>
          </h2>

          <div className="divide-y divide-border-herbal/50 max-h-60 overflow-y-auto mb-6 pr-2">
            {items.map((item) => (
              <div key={item.id} className="py-2.5 first:pt-0 flex justify-between items-center text-body-sm">
                <div className="min-w-0 pr-4">
                  <span className="font-medium text-primary block truncate">{item.name}</span>
                  <span className="text-xs text-on-surface-variant">SL: {item.quantity}</span>
                </div>
                <span className="font-semibold text-primary shrink-0">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2.5 text-body-sm text-on-surface-variant border-t border-border-herbal pt-4 mb-6">
            <div className="flex justify-between">
              <span>Tiền hàng:</span>
              <span className="font-medium text-on-surface">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Phí giao hàng:</span>
              <span>{shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee)}</span>
            </div>
            <div className="border-t border-border-herbal pt-3 flex justify-between items-baseline font-bold">
              <span className="font-serif text-base text-primary">TỔNG CỘNG:</span>
              <span className="font-serif text-2xl text-tertiary">{formatCurrency(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-tertiary-container hover:bg-tertiary text-on-tertiary font-semibold rounded flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-60"
          >
            {isSubmitting ? (
              <span>Đang tạo đơn hàng...</span>
            ) : (
              <>
                <span>Xác Nhận Đặt Hàng & Quét Mã QR</span>
                <span className="material-symbols-outlined text-[1.125rem]">qr_code_2</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

