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
  const { settings, orders, updateOrderStatus } = useAdminStore();

  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('PENDING');

  // Lấy đơn hàng từ store nếu có
  const matchedOrder = orders.find((o) => o.order_code === orderCode);
  const finalAmount = paymentInfo?.amount || matchedOrder?.total || 0;

  // Lấy thông tin ngân hàng thụ hưởng từ cấu hình Admin cài đặt
  const bankName = settings?.bank_name || 'MBBank (Quân Đội)';
  const bankAccount = settings?.bank_account || '0983124567';
  const accountName = settings?.account_name || 'TIỆM THẢO MỘC NGÂN HÀ';
  const bankId = settings?.bank_id || 'MB';

  // Tạo URL VietQR Napas247 động theo cài đặt Admin
  const qrUrl = getVietQrUrl({
    bankId,
    bankAccount,
    accountName,
    amount: finalAmount,
    orderCode: orderCode || 'THANH_TOAN',
  });

  // 1. Tải thông tin thanh toán & mã VietQR
  useEffect(() => {
    let isMounted = true;

    const fetchPaymentDetails = async () => {
      try {
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
      } catch (err) {
        console.error('Error fetching payment details:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (orderCode && token) {
      fetchPaymentDetails();
    } else {
      // Offline / Local Store Mode: Hiện mã VietQR ngay lập tức không bị xoay chờ
      setLoading(false);
    }

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
          Quét Mã VietQR Chuyển Khoản Ngân Hàng
        </h1>
        <p className="text-xs sm:text-body-sm text-on-surface-variant max-w-lg mx-auto mt-2 leading-relaxed">
          Mở ứng dụng ngân hàng bất kỳ để quét mã QR dưới đây. Hệ thống tự động nhận diện giao dịch sau khi chuyển khoản thành công.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start bg-surface-container-lowest rounded-none p-4 sm:p-6 lg:p-8 border border-border-herbal shadow-xs">
        {/* Khung hiển thị mã VietQR */}
        <div className="md:col-span-6 flex flex-col items-center justify-center p-4 sm:p-6 bg-surface-container-low rounded-none border border-border-herbal/70">
          <div className="w-56 h-56 sm:w-68 sm:h-68 bg-white p-3 rounded-none shadow-xs border border-border-herbal flex items-center justify-center">
            <img src={qrUrl} alt={`Mã VietQR đơn hàng ${orderCode}`} className="w-full h-full object-contain" />
          </div>

          <div className="mt-3.5 sm:mt-4 flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-secondary bg-surface px-3 py-1.5 rounded-none border border-border-herbal">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
            <span>Mã VietQR chuẩn Napas247 • Tự động điền số tiền &amp; nội dung</span>
          </div>

          {/* Nút xác nhận thanh toán nhanh */}
          <button
            type="button"
            onClick={() => {
              updateOrderStatus(orderCode, 'CONFIRMED', 'PAID');
              clearCart();
              navigate(`/dat-hang-thanh-cong/${orderCode}?token=${token || 'success'}`);
            }}
            className="mt-4 w-full py-2.5 bg-green-700 hover:bg-green-800 text-white font-bold text-xs uppercase tracking-wider rounded-none shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">verified</span>
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

          <div className="mt-1 p-2.5 rounded-none bg-surface-container-low text-xs text-on-surface-variant leading-relaxed border border-border-herbal/40">
            💡 <strong>Mẹo:</strong> Quét mã VietQR trên điện thoại sẽ tự động điền đúng Số tài khoản, Ngân hàng, Số tiền và Nội dung {orderCode} mà không cần nhập tay.
          </div>
        </div>
      </div>
    </div>
  );
};

