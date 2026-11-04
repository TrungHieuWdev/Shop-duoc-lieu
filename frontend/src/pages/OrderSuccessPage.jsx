import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useAdminStore } from '@/store/useAdminStore';
import { formatCurrency } from '@/utils/formatCurrency';
import { sendAutomaticOrderEmail } from '@/utils/orderNotification';
import api from '@/services/api';

export const OrderSuccessPage = () => {
  const { orderCode } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const { orders, settings } = useAdminStore();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tìm đơn hàng từ store phòng trường hợp backend offline hoặc mock
  const fallbackOrder = orders.find((o) => o.order_code === orderCode);
  const displayOrder = order || fallbackOrder;
  const adminEmail = settings?.admin_email || 'tiemthaomocnganha@gmail.com';

  // Tự động gửi thông báo đơn hàng trực tiếp về email chủ tiệm đã thiết lập
  useEffect(() => {
    if (orderCode && displayOrder) {
      const dispatchedKey = `nganha_order_email_dispatched_${orderCode}`;
      if (!sessionStorage.getItem(dispatchedKey)) {
        sessionStorage.setItem(dispatchedKey, 'true');
        sendAutomaticOrderEmail(displayOrder, adminEmail);
      }
    }
  }, [orderCode, displayOrder, adminEmail]);

  useEffect(() => {
    let isMounted = true;

    const fetchOrder = async () => {
      try {
        const res = await api.get(`/api/orders/${orderCode}`, {
          params: { token },
        });
        if (isMounted && res.success && res.data) {
          setOrder(res.data);
        }
      } catch (err) {
        console.error('Error fetching order details:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (orderCode && token && token !== 'success') {
      fetchOrder();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [orderCode, token]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-body-sm text-on-surface-variant font-medium">Đang tải thông tin đơn hàng...</p>
      </div>
    );
  }

  const items = displayOrder?.items || [];
  const totalAmount = displayOrder?.total ?? displayOrder?.total_amount ?? 0;

  return (
    <div className="max-w-3xl mx-auto px-3.5 sm:px-6 lg:px-12 py-8 sm:py-16">
      <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-8 lg:p-12 border border-border-herbal shadow-xs text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-secondary-container text-on-secondary-container mx-auto flex items-center justify-center mb-4 sm:mb-6 shadow-xs">
          <span className="material-symbols-outlined text-[2.5rem] sm:text-[3rem]">check_circle</span>
        </div>

        <span className="text-[10px] sm:text-xs font-semibold text-secondary uppercase tracking-widest block mb-1.5 sm:mb-2">
          Giao Dịch Đã Xác Nhận Tự Động
        </span>
        <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-2.5 sm:mb-3">
          Đặt Hàng &amp; Thanh Toán Thành Công!
        </h1>
        <p className="text-xs sm:text-body-sm text-on-surface-variant max-w-lg mx-auto mb-6 sm:mb-8 leading-relaxed">
          Cảm ơn bạn đã tin chọn các sản phẩm thảo mộc tự nhiên. Đơn hàng của bạn đã được chuyển đến chủ cửa hàng để chuẩn bị đóng gói và gửi hàng sớm nhất.
        </p>

        {/* Thông tin hóa đơn đơn hàng */}
        <div className="bg-surface-container-low rounded-xl p-4 sm:p-6 border border-border-herbal/70 text-left mb-6 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-border-herbal text-body-sm">
            <div>
              <span className="text-xs text-on-surface-variant block">Mã đơn hàng:</span>
              <span className="font-mono font-bold text-primary text-base">#{orderCode}</span>
            </div>
            <div>
              <span className="text-xs text-on-surface-variant block">Trạng thái thanh toán:</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded text-xs">
                <span className="material-symbols-outlined text-xs">verified</span>
                <span>ĐÃ THANH TOÁN (PAID)</span>
              </span>
            </div>
            {displayOrder?.customer_name && (
              <div>
                <span className="text-xs text-on-surface-variant block">Người nhận:</span>
                <span className="font-semibold text-primary">{displayOrder.customer_name}</span>
              </div>
            )}
            {displayOrder?.customer_phone && (
              <div>
                <span className="text-xs text-on-surface-variant block">Số điện thoại:</span>
                <span className="font-semibold text-primary">{displayOrder.customer_phone}</span>
              </div>
            )}
            {displayOrder?.customer_address && (
              <div className="sm:col-span-2">
                <span className="text-xs text-on-surface-variant block">Địa chỉ nhận hàng:</span>
                <span className="text-on-surface">{displayOrder.customer_address}</span>
              </div>
            )}
          </div>

          {/* Danh sách mặt hàng trong hóa đơn */}
          {items.length > 0 && (
            <div className="pt-4 divide-y divide-border-herbal/50">
              <span className="text-xs font-semibold text-secondary uppercase tracking-widest block mb-2">
                Sản phẩm trong đơn:
              </span>
              {items.map((item, idx) => {
                const itemName = item.name || item.product_name;
                const lineTotal = item.line_total || item.price * item.quantity;
                return (
                  <div key={idx} className="py-2 flex justify-between text-body-sm">
                    <span>
                      {itemName} <span className="text-xs text-on-surface-variant">x {item.quantity}</span>
                    </span>
                    <span className="font-semibold text-primary">{formatCurrency(lineTotal)}</span>
                  </div>
                );
              })}
              <div className="pt-3 flex justify-between items-baseline font-bold border-t border-border-herbal mt-2">
                <span className="font-serif text-primary">Tổng tiền thanh toán:</span>
                <span className="font-serif text-lg text-tertiary">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Nút quay lại trang chủ */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary-container text-on-primary font-medium rounded transition-colors shadow-sm"
        >
          <span>Tiếp Tục Dạo Vườn Thảo Mộc</span>
          <span className="material-symbols-outlined text-[1.125rem]">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
};
