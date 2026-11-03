import React, { useState } from 'react';
import { formatCurrency } from '@/utils/formatCurrency';

export const InvoiceDetailModal = ({ isOpen, onClose, order, onUpdateStatus }) => {
  const [currentStatus, setCurrentStatus] = useState(order?.order_status || 'PENDING');
  const [currentPaymentStatus, setCurrentPaymentStatus] = useState(order?.payment_status || 'UNPAID');

  if (!isOpen || !order) return null;

  const handleStatusChange = (newStatus) => {
    setCurrentStatus(newStatus);
    onUpdateStatus(order.order_code, newStatus, currentPaymentStatus);
  };

  const handlePaymentStatusChange = (newPayStatus) => {
    setCurrentPaymentStatus(newPayStatus);
    onUpdateStatus(order.order_code, currentStatus, newPayStatus);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Vừa xong';
    const date = new Date(isoString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#fbf9f2] rounded-2xl border border-border-herbal shadow-2xl p-6 sm:p-8 text-on-surface max-h-[92vh] overflow-y-auto print:p-0 print:border-none print:shadow-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-outline hover:text-primary rounded-full hover:bg-surface-container transition-colors print:hidden"
          aria-label="Đóng"
        >
          <span className="material-symbols-outlined text-[1.25rem]">close</span>
        </button>

        {/* 1. Tiêu đề Hóa Đơn & Logo */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-border-herbal gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-serif text-xl sm:text-2xl font-bold text-primary">NgânHàshop</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#8a7258] bg-[#cbb07c]/20 px-2 py-0.5 rounded">
                HÓA ĐƠN BÁN HÀNG
              </span>
            </div>
            <p className="text-xs text-on-surface-variant">Đơn giản, tinh tế, an lành • Hotline: 1900 6826</p>
          </div>

          <div className="text-left sm:text-right">
            <span className="font-mono text-sm font-bold text-primary block">
              Mã: #{order.order_code}
            </span>
            <span className="text-xs text-on-surface-variant">
              Ngày lập: {formatDate(order.created_at)}
            </span>
          </div>
        </div>

        {/* 2. Thanh điều khiển trạng thái dành cho Quản Trị Viên (Ẩn khi in hóa đơn) */}
        <div className="mb-6 p-4 rounded-xl bg-surface-container-low border border-border-herbal/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-base">tune</span>
            <span className="text-xs font-semibold text-primary">Cập nhật đơn:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Đổi trạng thái đơn */}
            <select
              value={currentStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-3 py-1.5 bg-surface border border-border-herbal rounded-lg text-xs font-semibold text-primary cursor-pointer focus:outline-none focus:border-primary"
            >
              <option value="PENDING">Chờ xác nhận</option>
              <option value="CONFIRMED">Đã xác nhận</option>
              <option value="SHIPPING">Đang giao hàng</option>
              <option value="COMPLETED">Đã hoàn tất</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>

            {/* Đổi trạng thái thanh toán */}
            <select
              value={currentPaymentStatus}
              onChange={(e) => handlePaymentStatusChange(e.target.value)}
              className="px-3 py-1.5 bg-surface border border-border-herbal rounded-lg text-xs font-semibold text-primary cursor-pointer focus:outline-none focus:border-primary"
            >
              <option value="PAID">Đã thanh toán</option>
              <option value="UNPAID">Chưa thanh toán</option>
            </select>

            {/* Nút In */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-surface hover:bg-surface-container border border-border-herbal rounded-lg text-xs font-semibold text-primary transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">print</span>
              <span>In Hóa Đơn</span>
            </button>
          </div>
        </div>

        {/* 3. Khối Thông Tin Khách Hàng & Giao Nhận */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs">
          <div className="p-4 rounded-xl bg-surface border border-border-herbal/60">
            <span className="font-bold text-[#8a7258] uppercase tracking-wider block mb-2">
              Khách Hàng Nhận
            </span>
            <p className="font-semibold text-sm text-primary">{order.customer_name}</p>
            <p className="text-on-surface-variant mt-0.5">SĐT: <a href={`tel:${order.customer_phone}`} className="text-primary font-medium hover:underline">{order.customer_phone}</a></p>
            {order.customer_email && <p className="text-on-surface-variant">Email: {order.customer_email}</p>}
            <p className="text-on-surface-variant mt-1.5 leading-relaxed">
              <strong>Địa chỉ:</strong> {order.customer_address}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-border-herbal/60 flex flex-col justify-between">
            <div>
              <span className="font-bold text-[#8a7258] uppercase tracking-wider block mb-2">
                Thanh Toán & Ghi Chú
              </span>
              <p className="text-on-surface-variant">
                Hình thức: <strong>{order.payment_method === 'VIETQR' ? 'Chuyển khoản SePay VietQR' : 'Thanh toán tiền mặt (COD)'}</strong>
              </p>
              <p className="text-on-surface-variant mt-0.5">
                Thanh toán: <strong className={order.payment_status === 'PAID' ? 'text-green-700' : 'text-amber-700'}>
                  {order.payment_status === 'PAID' ? 'ĐÃ THANH TOÁN' : 'CHƯA THANH TOÁN'}
                </strong>
              </p>
            </div>
            {order.customer_note && (
              <div className="mt-2 pt-2 border-t border-border-herbal/50 text-[11px] text-on-surface-variant italic">
                "{order.customer_note}"
              </div>
            )}
          </div>
        </div>

        {/* 4. Bảng Chi Tiết Sản Phẩm Đặt Mua */}
        <div className="mb-6 rounded-xl border border-border-herbal overflow-hidden bg-surface">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container text-on-surface-variant uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Dược Liệu</th>
                <th className="py-2.5 px-3">Đơn Giá</th>
                <th className="py-2.5 px-3 text-center">SL</th>
                <th className="py-2.5 px-3 text-right">Thành Tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-herbal">
              {order.items?.map((item, idx) => (
                <tr key={idx} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      {item.thumbnail_url && (
                        <img
                          src={item.thumbnail_url}
                          alt={item.name}
                          className="w-9 h-9 rounded object-cover border border-border-herbal shrink-0"
                        />
                      )}
                      <div>
                        <span className="font-medium text-primary block line-clamp-1">{item.name}</span>
                        <span className="text-[10px] text-on-surface-variant">{item.unit || 'Gói'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-on-surface-variant">{formatCurrency(item.price)}</td>
                  <td className="py-3 px-3 text-center font-bold">{item.quantity}</td>
                  <td className="py-3 px-3 text-right font-serif font-bold text-primary">
                    {formatCurrency(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 5. Tổng kết tài chính */}
        <div className="p-4 rounded-xl bg-surface-container-low border border-border-herbal/70 flex flex-col gap-2 text-xs mb-6">
          <div className="flex justify-between text-on-surface-variant">
            <span>Tiền hàng (tạm tính):</span>
            <span className="font-medium text-primary">{formatCurrency(order.subtotal || 0)}</span>
          </div>
          <div className="flex justify-between text-on-surface-variant">
            <span>Phí vận chuyển:</span>
            <span>{order.shipping_fee > 0 ? formatCurrency(order.shipping_fee) : 'Miễn phí giao hàng'}</span>
          </div>
          <div className="h-[1px] bg-border-herbal my-1"></div>
          <div className="flex justify-between text-sm font-serif font-bold text-primary">
            <span>Tổng Cộng Thanh Toán:</span>
            <span className="text-base text-secondary">{formatCurrency(order.total || 0)}</span>
          </div>
        </div>

        {/* Nút đóng */}
        <div className="flex justify-end print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs uppercase tracking-wider rounded-lg transition-all"
          >
            Đóng Hóa Đơn
          </button>
        </div>
      </div>
    </div>
  );
};

