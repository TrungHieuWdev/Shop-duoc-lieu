import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/useCartStore';
import { formatCurrency } from '@/utils/formatCurrency';
import api from '@/services/api';

export const PaymentPage = () => {
  const { orderCode } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const clearCart = useCartStore((state) => state.clearCart);

  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('PENDING');

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
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-body-sm text-on-surface-variant font-medium">
          Đang khởi tạo mã thanh toán VietQR an toàn...
        </p>
      </div>
    );
  }

  const qrUrl =
    paymentInfo?.qr_code_url ||
    `https://vietqr.app/img?acc=1017588888&bank=Vietcombank&amount=${paymentInfo?.amount || 0}&des=${orderCode}&template=compact`;

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-12 py-12">
      <div className="text-center mb-10">
        <span className="text-[0.6875rem] font-semibold text-secondary uppercase tracking-widest block mb-2">
          Thanh Toán Đơn Hàng #{orderCode}
        </span>
        <h1 className="font-serif text-2xl lg:text-3xl font-bold text-primary">
          Quét Mã VietQR Chuyển Khoản Ngân Hàng
        </h1>
        <p className="text-body-sm text-on-surface-variant max-w-lg mx-auto mt-2">
          Mở ứng dụng ngân hàng bất kỳ để quét mã QR dưới đây. Hệ thống SePay sẽ tự động nhận diện giao dịch sau vài giây.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start bg-surface-container-lowest rounded-xl p-6 lg:p-10 border border-border-herbal shadow-sm">
        {/* Khung hiển thị mã VietQR */}
        <div className="md:col-span-6 flex flex-col items-center justify-center p-6 bg-surface-container-low rounded border border-border-herbal/70">
          <div className="w-64 h-64 bg-white p-3 rounded-lg shadow-sm border border-border-herbal/40 flex items-center justify-center">
            <img src={qrUrl} alt={`Mã VietQR đơn hàng ${orderCode}`} className="w-full h-full object-contain" />
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-secondary bg-surface px-3 py-1.5 rounded border border-border-herbal">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
            <span>Đang chờ chuyển khoản tự động...</span>
          </div>
        </div>

        {/* Khung chi tiết số tài khoản & nội dung chuyển khoản */}
        <div className="md:col-span-6 flex flex-col gap-4">
          <h2 className="font-serif text-base font-bold text-primary border-b border-border-herbal pb-2">
            Thông Tin Chuyển Khoản Thủ Công
          </h2>

          <div className="flex flex-col gap-3 text-body-sm">
            <div className="p-3 bg-surface-container-low rounded border border-border-herbal/60 flex justify-between items-center">
              <div>
                <span className="text-xs text-on-surface-variant block">Ngân hàng:</span>
                <span className="font-semibold text-primary">{paymentInfo?.bank_name || 'Vietcombank'}</span>
              </div>
            </div>

            <div className="p-3 bg-surface-container-low rounded border border-border-herbal/60 flex justify-between items-center">
              <div>
                <span className="text-xs text-on-surface-variant block">Số tài khoản:</span>
                <span className="font-serif font-bold text-lg text-primary tracking-wider">
                  {paymentInfo?.bank_account || '1017588888'}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(paymentInfo?.bank_account || '1017588888', 'account')}
                className="px-2.5 py-1 text-xs font-semibold text-primary bg-surface border border-border-herbal rounded hover:bg-surface-container transition-colors"
              >
                {copiedField === 'account' ? 'Đã chép ✓' : 'Sao chép'}
              </button>
            </div>

            <div className="p-3 bg-surface-container-low rounded border border-border-herbal/60 flex justify-between items-center">
              <div>
                <span className="text-xs text-on-surface-variant block">Chủ tài khoản:</span>
                <span className="font-semibold text-primary uppercase">
                  {paymentInfo?.account_name || 'TIEM THAO MOC NGAN HA'}
                </span>
              </div>
            </div>

            <div className="p-3 bg-surface-container-low rounded border border-border-herbal/60 flex justify-between items-center">
              <div>
                <span className="text-xs text-on-surface-variant block">Số tiền chính xác:</span>
                <span className="font-serif font-bold text-xl text-tertiary">
                  {formatCurrency(paymentInfo?.amount || 0)}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(String(paymentInfo?.amount || 0), 'amount')}
                className="px-2.5 py-1 text-xs font-semibold text-primary bg-surface border border-border-herbal rounded hover:bg-surface-container transition-colors"
              >
                {copiedField === 'amount' ? 'Đã chép ✓' : 'Sao chép'}
              </button>
            </div>

            <div className="p-3 bg-amber-50 rounded border border-amber-200 flex justify-between items-center">
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
                className="px-2.5 py-1 text-xs font-semibold text-amber-900 bg-white border border-amber-300 rounded hover:bg-amber-100 transition-colors"
              >
                {copiedField === 'content' ? 'Đã chép ✓' : 'Sao chép'}
              </button>
            </div>
          </div>

          <div className="mt-2 p-3 rounded bg-surface-container-low text-xs text-on-surface-variant leading-relaxed">
            💡 <strong>Lưu ý quan trọng:</strong> Giữ nguyên nội dung chuyển khoản là <strong>{orderCode}</strong> để hệ thống tự động xác nhận đơn hàng của bạn ngay khi tiền vào.
          </div>
        </div>
      </div>
    </div>
  );
};

