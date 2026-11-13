import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/useCartStore';
import { useAdminStore } from '@/store/useAdminStore';
import { formatCurrency } from '@/utils/formatCurrency';
import { getVietQrUrl } from '@/utils/vietqr';
import { notifyAdminNewOrder } from '@/utils/orderNotification';
import api from '@/services/api';

export const PaymentPage = () => {
  const { orderCode } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const clearCart = useCartStore((state) => state.clearCart);
  const { settings, orders, updateOrderStatus, hydratePublicData } = useAdminStore();

  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('PENDING');

  // Lấy đơn hàng từ store nếu có
  const matchedOrder = orders.find((o) => o.order_code === orderCode);
  const finalAmount = paymentInfo?.amount || matchedOrder?.total || 0;

  // Lấy thông tin ngân hàng thụ hưởng từ cấu hình Admin cài đặt
  const bankName = settings?.bank_name || 'Vietcombank (Ngoại Thương)';
  const bankAccount = settings?.bank_account || '1033519890';
  const accountName = settings?.account_name || 'TIỆM THẢO DƯỢC NGÂN HÀ';
  const bankId = settings?.bank_id || 'VCB';

  // Tạo URL VietQR Napas247 động theo cài đặt Admin
  const qrUrl = getVietQrUrl({
    bankId,
    bankAccount,
    accountName,
    amount: finalAmount,
    orderCode: orderCode || 'THANH_TOAN',
  });

  // 1. Tải thông tin thanh toán & đồng bộ mới nhất tài khoản ngân hàng từ Supabase (PC, Tablet & Di động)
  useEffect(() => {
    let isMounted = true;

    const isLocalHost =
      typeof window !== 'undefined' &&
      ['localhost', '127.0.0.1'].includes(window.location.hostname);
    const hasBackendApi = Boolean(import.meta.env.VITE_API_BASE_URL) || isLocalHost;

    const initPayment = async () => {
      try {
        await hydratePublicData?.();
        if (hasBackendApi && orderCode && token) {
          const res = await api.post('/api/payments/create', {
            order_code: orderCode,
            access_token: token,
          });
          if (isMounted && res.success && res.data) {
            setPaymentInfo(res.data);
            if (res.data.payment_status === 'PAID') {
              clearCart();
              navigate(`/dat-hang-thanh-cong/${orderCode}?token=${token}`);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching payment details:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initPayment();

    return () => {
      isMounted = false;
    };
  }, [orderCode, token]);

  // 2. Polling kiểm tra trạng thái thanh toán tự động mỗi 3 giây
  useEffect(() => {
    if (!orderCode || !token || paymentStatus === 'PAID') return;

    const intervalId = setInterval(async () => {
      try {
        const res = await api.get(`/api/payments/${orderCode}/status`, {
          params: { token },
        });

        if (res.success && res.data && res.data.payment_status === 'PAID') {
          setPaymentStatus('PAID');
          clearInterval(intervalId);
          const paidAt = new Date().toISOString();
          const paidOrder = matchedOrder
            ? { ...matchedOrder, order_status: 'CONFIRMED', payment_status: 'PAID', paid_at: paidAt, created_at: paidAt }
            : { order_code: orderCode, total: finalAmount, order_status: 'CONFIRMED', payment_status: 'PAID', paid_at: paidAt, created_at: paidAt };
          const adminEmail = settings?.admin_email || 'hieunedz@gmail.com';
          notifyAdminNewOrder(paidOrder, adminEmail);
          clearCart();
          navigate(`/dat-hang-thanh-cong/${orderCode}?token=${token}`);
        }
      } catch (err) {
        console.error('Error polling payment status:', err);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [orderCode, token, paymentStatus]);

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-body-sm text-on-surface-variant font-medium">
          Đang khởi tạo mã thanh toán VietQR an toàn...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-3.5 sm:px-6 lg:px-12 py-6 sm:py-12">
      <div className="text-center mb-6 sm:mb-10">
        <span className="text-[0.625rem] sm:text-[0.6875rem] font-semibold text-secondary uppercase tracking-widest block mb-1.5 sm:mb-2">
          Thanh Toán Đơn Hàng #{orderCode}
        </span>
        <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-primary">
          Quét Mã Để Hoàn Tất Đơn Hàng Của Bạn
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-8 items-start bg-surface-container-lowest rounded-none p-3.5 sm:p-6 lg:p-8 border border-border-herbal shadow-xs">
        {/* Khung hiển thị mã QR phóng to (không chữ VietQR, chỉ hiện chủ tài khoản & số tài khoản) */}
        <div className="md:col-span-6 flex flex-col items-center justify-center p-4 sm:p-6 bg-surface-container-low rounded-none border border-border-herbal/70">
          <div className="w-full max-w-[280px] sm:max-w-[310px] bg-white p-3 sm:p-4 rounded-none shadow-xs border border-border-herbal flex flex-col items-center">
            <img
              src={qrUrl}
              alt={`Mã QR thanh toán đơn hàng ${orderCode}`}
              className="w-56 h-56 sm:w-64 sm:h-64 object-contain"
            />
            <div className="mt-3 pt-2.5 border-t border-border-herbal/50 w-full text-center">
              <p className="text-xs sm:text-sm font-bold text-primary uppercase tracking-wide break-words">
                {accountName}
              </p>
              <p className="text-sm sm:text-base font-sans font-bold text-primary tracking-wider tabular-nums mt-0.5">
                {bankAccount}
              </p>
            </div>
          </div>

          {/* Nút xác nhận thanh toán nhanh */}
          <button
            type="button"
            onClick={() => {
              updateOrderStatus(orderCode, 'CONFIRMED', 'PAID');
              const paidAt = new Date().toISOString();
              const paidOrder = matchedOrder
                ? { ...matchedOrder, order_status: 'CONFIRMED', payment_status: 'PAID', paid_at: paidAt, created_at: paidAt }
                : { order_code: orderCode, total: finalAmount, order_status: 'CONFIRMED', payment_status: 'PAID', paid_at: paidAt, created_at: paidAt };
              const adminEmail = settings?.admin_email || 'hieunedz@gmail.com';
              notifyAdminNewOrder(paidOrder, adminEmail);
              clearCart();
              navigate(`/dat-hang-thanh-cong/${orderCode}?token=${token || 'success'}`);
            }}
            className="mt-4 w-full max-w-[280px] sm:max-w-[310px] py-3 sm:py-2.5 px-3 bg-green-700 hover:bg-green-800 text-white font-bold text-xs sm:text-[13px] uppercase tracking-wider rounded-none shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base shrink-0">verified</span>
            <span>Xác Nhận Đã Chuyển Khoản Thành Công</span>
          </button>
        </div>

        {/* Khung chi tiết số tài khoản & nội dung chuyển khoản */}
        <div className="md:col-span-6 flex flex-col gap-3.5">
          <h2 className="font-serif text-base font-bold text-primary border-b border-border-herbal pb-2">
            Thông Tin Chuyển Khoản Ngân Hàng
          </h2>

          <div className="flex flex-col gap-2.5 text-body-sm">
            <div className="p-3 bg-surface-container-low rounded-none border border-border-herbal/60 flex justify-between items-center">
              <div>
                <span className="text-xs text-on-surface-variant block">Ngân hàng thụ hưởng:</span>
                <span className="font-semibold text-primary">{bankName}</span>
              </div>
            </div>

            <div className="p-3 bg-surface-container-low rounded-none border border-border-herbal/60 flex justify-between items-center">
              <div>
                <span className="text-xs text-on-surface-variant block">Số tài khoản:</span>
                <span className="font-sans font-bold text-lg text-primary tracking-wider tabular-nums">
                  {bankAccount}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(bankAccount, 'account')}
                className="px-2.5 py-1 text-xs font-semibold text-primary bg-surface border border-border-herbal rounded-none hover:bg-surface-container transition-colors cursor-pointer"
              >
                {copiedField === 'account' ? 'Đã chép ✓' : 'Sao chép'}
              </button>
            </div>

            <div className="p-3 bg-surface-container-low rounded-none border border-border-herbal/60 flex justify-between items-center">
              <div>
                <span className="text-xs text-on-surface-variant block">Chủ tài khoản:</span>
                <span className="font-semibold text-primary uppercase">
                  {accountName}
                </span>
              </div>
            </div>

            <div className="p-3 bg-surface-container-low rounded-none border border-border-herbal/60 flex justify-between items-center">
              <div>
                <span className="text-xs text-on-surface-variant block">Số tiền thanh toán:</span>
                <span className="font-sans font-bold text-xl text-tertiary tabular-nums">
                  {formatCurrency(finalAmount)}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(String(finalAmount), 'amount')}
                className="px-2.5 py-1 text-xs font-semibold text-primary bg-surface border border-border-herbal rounded-none hover:bg-surface-container transition-colors cursor-pointer"
              >
                {copiedField === 'amount' ? 'Đã chép ✓' : 'Sao chép'}
              </button>
            </div>

            <div className="p-3 bg-amber-50 rounded-none border border-amber-200 flex justify-between items-center">
              <div>
                <span className="text-xs text-amber-800 font-semibold block">
                  Nội dung chuyển khoản (BẮT BUỘC):
                </span>
                <span className="font-mono font-bold text-lg text-amber-950 tracking-wider">
                  {orderCode}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(orderCode, 'content')}
                className="px-2.5 py-1 text-xs font-semibold text-amber-900 bg-white border border-amber-300 rounded-none hover:bg-amber-100 transition-colors cursor-pointer"
              >
                {copiedField === 'content' ? 'Đã chép ✓' : 'Sao chép'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

