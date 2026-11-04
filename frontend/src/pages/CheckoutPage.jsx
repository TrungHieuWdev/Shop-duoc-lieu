import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '@/store/useCartStore';
import { useAdminStore } from '@/store/useAdminStore';
import { formatCurrency } from '@/utils/formatCurrency';
import { notifyAdminNewOrder } from '@/utils/orderNotification';
import api from '@/services/api';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getSubtotal } = useCartStore();
  const { settings, addOrder } = useAdminStore();

  const subtotal = getSubtotal();
  const freeThreshold = settings?.free_shipping_threshold || 350000;
  const baseShipping = settings?.default_shipping_fee || 30000;
  const shippingFee = subtotal >= freeThreshold || subtotal === 0 ? 0 : baseShipping;
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

      // Tạo mã đơn hàng duy nhất
      const realOrderCode = `NH-${Date.now().toString().slice(-6)}`;
      const newOrder = {
        id: realOrderCode,
        order_code: realOrderCode,
        created_at: new Date().toISOString(),
        customer_name: formData.customer_name.trim(),
        customer_phone: formData.customer_phone.trim(),
        customer_email: formData.customer_email.trim(),
        customer_address: formData.customer_address.trim(),
        customer_note: formData.customer_note.trim(),
        payment_method: 'VIETQR',
        payment_status: 'UNPAID',
        order_status: 'PENDING',
        shipping_fee: shippingFee,
        subtotal: subtotal,
        total: total,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          unit: item.unit,
          price: item.price,
          quantity: item.quantity,
          thumbnail_url: item.thumbnail_url,
        })),
      };

      // Ghi nhận đơn hàng vào hệ thống quản lý
      addOrder(newOrder);

      // Tự động kích hoạt thông báo đơn hàng gửi đến Gmail của chủ shop
      const adminEmail = settings?.admin_email || 'tiemthaomocnganha@gmail.com';
      notifyAdminNewOrder(newOrder, adminEmail);

      // Gọi backend nếu có
      try {
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
        if (res.success && res.data?.order_code) {
          navigate(`/thanh-toan/${res.data.order_code}?token=${res.data.access_token || 'vt'}`);
          return;
        }
      } catch (backendErr) {
        // Backend offline, fallback lưu store đã hoàn tất
      }

      // CHUYỂN NGAY SANG MÀN HÌNH QUÉT MÃ VIETQR (KHÔNG BỎ QUA MÃ QR!)
      navigate(`/thanh-toan/${realOrderCode}`);
    } catch (err) {
      console.error('Error creating order:', err);
      setErrorMessage('Không thể tạo đơn hàng. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1536px] mx-auto px-3.5 sm:px-8 lg:px-12 xl:px-16 py-6 sm:py-12">
      <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-6 sm:mb-8">
        Thông Tin Nhận Hàng &amp; Thanh Toán
      </h1>

      {errorMessage && (
        <div className="mb-6 p-3.5 sm:p-4 rounded-xl bg-error-container text-on-error-container text-xs sm:text-body-sm flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[1.25rem] shrink-0">error</span>
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Form thông tin giao hàng */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-4 sm:p-6 lg:p-8 border border-border-herbal shadow-xs">
          <h2 className="font-serif text-base sm:text-lg font-bold text-primary mb-5 sm:mb-6 pb-2.5 border-b border-border-herbal flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[1.25rem]">local_shipping</span>
            <span>1. Người Nhận Hàng</span>
          </h2>

          <div className="flex flex-col gap-3.5 sm:gap-4">
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
                className="w-full px-3.5 py-2.5 bg-surface-container-low border border-border-herbal rounded-xl text-base sm:text-body-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
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
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border border-border-herbal rounded-xl text-base sm:text-body-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
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
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border border-border-herbal rounded-xl text-base sm:text-body-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
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
                className="w-full px-3.5 py-2.5 bg-surface-container-low border border-border-herbal rounded-xl text-base sm:text-body-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
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
                className="w-full px-3.5 py-2.5 bg-surface-container-low border border-border-herbal rounded-xl text-base sm:text-body-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Xem lại đơn hàng & Nút xác nhận */}
        <div className="lg:col-span-5 bg-surface-container-low rounded-2xl p-4 sm:p-6 lg:p-8 border border-border-herbal shadow-xs">
          <h2 className="font-serif text-base sm:text-lg font-bold text-primary mb-3.5 sm:mb-4 pb-2.5 border-b border-border-herbal flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[1.25rem]">inventory_2</span>
            <span>2. Tóm Tắt Đơn Hàng ({items.length} món)</span>
          </h2>

          <div className="divide-y divide-border-herbal/50 max-h-56 overflow-y-auto mb-5 sm:mb-6 pr-1">
            {items.map((item) => (
              <div key={item.id} className="py-2.5 first:pt-0 flex justify-between items-center text-xs sm:text-body-sm gap-2">
                <div className="min-w-0 pr-2">
                  <span className="font-medium text-primary block truncate">{item.name}</span>
                  <span className="text-[11px] text-on-surface-variant">SL: {item.quantity}</span>
                </div>
                <span className="font-semibold text-primary shrink-0">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2.5 text-xs sm:text-body-sm text-on-surface-variant border-t border-border-herbal pt-3.5 mb-5 sm:mb-6">
            <div className="flex justify-between">
              <span>Tiền hàng:</span>
              <span className="font-medium text-on-surface">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Phí giao hàng:</span>
              <span>{shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee)}</span>
            </div>
            <div className="border-t border-border-herbal pt-3 flex justify-between items-baseline font-bold">
              <span className="font-serif text-sm sm:text-base text-primary">TỔNG CỘNG:</span>
              <span className="font-serif text-xl sm:text-2xl text-tertiary">{formatCurrency(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-tertiary-container hover:bg-tertiary text-on-tertiary font-semibold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-60 cursor-pointer active:scale-98"
          >
            {isSubmitting ? (
              <span>Đang tạo đơn hàng...</span>
            ) : (
              <>
                <span>Xác Nhận Đặt Hàng &amp; Quét Mã QR</span>
                <span className="material-symbols-outlined text-[1.125rem]">qr_code_2</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

