import React, { useState, useEffect } from 'react';
import { VIETQR_BANKS, getVietQrUrl } from '@/utils/vietqr';
import { formatCurrency } from '@/utils/formatCurrency';
import { sendAutomaticOrderEmail, notifyAdminNewOrder } from '@/utils/orderNotification';
import { useAuthStore } from '@/store/useAuthStore';

export const AdminSettingsTab = ({ settings, onSaveSettings, requestConfirmation }) => {
  const { changePassword } = useAuthStore();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [formData, setFormData] = useState({
    bank_id: settings?.bank_id || 'MB',
    bank_name: settings?.bank_name || 'MBBank (Quân Đội)',
    bank_account: settings?.bank_account || '0983124567',
    account_name: settings?.account_name || 'TIỆM THẢO MỘC NGÂN HÀ',
    admin_email: settings?.admin_email || 'tiemthaomocnganha@gmail.com',
    default_shipping_fee: settings?.default_shipping_fee || 30000,
    free_shipping_threshold: settings?.free_shipping_threshold || 350000,
  });

  const [testAmount, setTestAmount] = useState(50000);
  const [isSaved, setIsSaved] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [emailLogs, setEmailLogs] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('nganha_admin_email_logs') || '[]';
      setEmailLogs(JSON.parse(raw));
    } catch (e) {
      setEmailLogs([]);
    }
  }, [isSaved, testingEmail]);

  const handleSendTestEmail = async () => {
    if (!formData.admin_email) return;
    setTestingEmail(true);
    setTestResult(null);

    const testOrder = {
      order_code: 'TEST-' + Math.floor(100000 + Math.random() * 900000),
      customer_name: 'Khách Hàng Thử Nghiệm',
      customer_phone: '0983124567',
      customer_address: '123 Đường Thảo Mộc, Phường An Lành, TP.HCM',
      customer_note: 'Đơn hàng kiểm tra gửi thông báo email',
      payment_method: 'VIETQR',
      payment_status: 'PAID',
      subtotal: 50000,
      shipping_fee: 20000,
      total: 70000,
      items: [
        {
          name: 'Hoa Hồng Phơi Khô (Nụ & Cánh)',
          unit: 'Túi zip 100g',
          quantity: 1,
          price: 50000,
        },
      ],
    };

    try {
      await sendAutomaticOrderEmail(testOrder, formData.admin_email);
      setTestResult({
        success: true,
        message: `Đã phát lệnh gửi thông báo đơn hàng thử nghiệm đến: ${formData.admin_email}.`,
      });
      // Làm mới danh sách log
      const raw = localStorage.getItem('nganha_admin_email_logs') || '[]';
      setEmailLogs(JSON.parse(raw));
    } catch (err) {
      setTestResult({
        success: false,
        message: 'Lỗi khi gửi thông báo: ' + (err.message || 'Không thể kết nối'),
      });
    } finally {
      setTestingEmail(false);
    }
  };

  // Chọn ngân hàng từ danh sách
  const handleBankChange = (e) => {
    const selectedCode = e.target.value;
    const foundBank = VIETQR_BANKS.find((b) => b.code === selectedCode);
    setFormData((prev) => ({
      ...prev,
      bank_id: selectedCode,
      bank_name: foundBank ? foundBank.name : selectedCode,
    }));
  };

  // Tạo URL VietQR sống động để xem trước và quét thử
  const liveQrUrl = getVietQrUrl({
    bankId: formData.bank_id,
    bankAccount: formData.bank_account,
    accountName: formData.account_name,
    amount: testAmount,
    orderCode: 'TEST_QUET_MA',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (requestConfirmation) {
      requestConfirmation({
        title: 'Xác Nhận Lưu Cài Đặt Hệ Thống',
        subtitle: 'Cập Nhật Tài Khoản VietQR, Gmail & Phí Ship',
        icon: 'settings_suggest',
        variant: 'info',
        confirmText: 'Xác Nhận Lưu Cài Đặt',
        message: (
          <div className="space-y-2 text-xs">
            <p>
              Bạn có chắc chắn muốn lưu và áp dụng toàn bộ cấu hình mới cho hệ thống?
            </p>
            <div className="bg-[#faf8f3] p-2.5 border border-[#ded7ca] space-y-1">
              <div>• Ngân hàng thụ hưởng: <strong>{formData.bank_name}</strong></div>
              <div>• Số tài khoản: <strong className="font-mono">{formData.bank_account}</strong> ({formData.account_name})</div>
              <div>• Gmail nhận đơn để đi đơn: <strong className="text-secondary">{formData.admin_email}</strong></div>
              <div>• Phí ship mặc định: <strong>{formatCurrency(formData.default_shipping_fee)}</strong></div>
              <div>• Ngưỡng Freeship: <strong>{formatCurrency(formData.free_shipping_threshold)}</strong></div>
            </div>
          </div>
        ),
        onConfirm: () => {
          onSaveSettings(formData);
          setIsSaved(true);
          setTimeout(() => setIsSaved(false), 3000);
        },
      });
    } else {
      onSaveSettings(formData);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  return (
    <div className="space-y-4 w-full">
      {/* 1. Header Cài Đặt */}
      <div className="bg-white border border-border-herbal p-3.5 sm:p-4 shadow-xs rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">settings</span>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-primary">
              Cài Đặt Tài Khoản Ngân Hàng, VietQR &amp; Gmail Nhận Đơn Hàng
            </h2>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Cấu hình này tự động kích hoạt mã <strong>VietQR Napas247</strong> cho khách chuyển khoản, gửi thông tin đơn về <strong>Gmail chủ tiệm</strong> và đồng bộ tiền phí ship trên toàn gian hàng.
          </p>
        </div>

        {isSaved && (
          <div className="px-3 py-1.5 bg-green-100 border border-green-300 text-green-800 text-xs font-bold rounded-lg flex items-center gap-1.5 animate-fadeIn">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            <span>Đã lưu cài đặt thành công!</span>
          </div>
        )}
      </div>

      {/* 2. Form Cài Đặt 2 Cột (Trái: Nhập Liệu | Phải: Xem Trước & Quét Thử VietQR) */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* CỘT TRÁI: CẤU HÌNH NGÂN HÀNG, PHÍ SHIP & GMAIL */}
        <div className="lg:col-span-7 space-y-4">
          {/* Card 1: Cấu hình Tài khoản Ngân Hàng VietQR */}
          <div className="bg-white border border-border-herbal p-4 shadow-xs rounded-xl space-y-3">
            <div className="border-b border-border-herbal pb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base">account_balance</span>
              <h3 className="font-serif text-sm font-bold text-primary uppercase tracking-wider">
                1. Tài Khoản Ngân Hàng Thụ Hưởng (VietQR)
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-primary uppercase tracking-wider mb-1">
                  Chọn Ngân Hàng Thụ Hưởng <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.bank_id}
                  onChange={handleBankChange}
                  className="w-full px-3 py-2 bg-[#faf8f3] border border-border-herbal rounded-none text-xs font-semibold text-primary focus:outline-none focus:border-primary cursor-pointer"
                >
                  {VIETQR_BANKS.map((b) => (
                    <option key={b.code} value={b.code}>
                      {b.name} ({b.shortName})
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-on-surface-variant mt-0.5 block">
                  Hệ thống kết nối trực tiếp cổng chuyển khoản liên ngân hàng Napas247
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-primary uppercase tracking-wider mb-1">
                  Số Tài Khoản Ngân Hàng <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.bank_account}
                  onChange={(e) => setFormData({ ...formData, bank_account: e.target.value })}
                  placeholder="VD: 0983124567, 1017588888..."
                  className="w-full px-3 py-2 bg-[#faf8f3] border border-border-herbal rounded-none text-xs font-mono font-bold text-primary focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-primary uppercase tracking-wider mb-1">
                  Tên Chủ Tài Khoản (In hoa không dấu) <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.account_name}
                  onChange={(e) => setFormData({ ...formData, account_name: e.target.value.toUpperCase() })}
                  placeholder="VD: TIEM THAO MOC NGAN HA hoặc NGUYEN VAN A"
                  className="w-full px-3 py-2 bg-[#faf8f3] border border-border-herbal rounded-none text-xs font-semibold text-primary uppercase focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Cấu hình Gmail Chủ Shop Nhận Thông Báo Đơn Hàng Để Đi Đơn */}
          <div className="bg-white border border-border-herbal p-4 shadow-xs rounded-xl space-y-3">
            <div className="border-b border-border-herbal pb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">mail</span>
                <h3 className="font-serif text-sm font-bold text-primary uppercase tracking-wider">
                  2. Gmail Chủ Shop Nhận Đơn Hàng Để Đi Đơn
                </h3>
              </div>
              <span className="text-[10px] bg-[#cbb07c]/20 text-[#8a7258] font-bold px-1.5 py-0.2">
                Tự động gửi đơn
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-primary uppercase tracking-wider mb-1">
                  Địa Chỉ Gmail / Email Nhận Đơn Hàng <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={formData.admin_email}
                    onChange={(e) => setFormData({ ...formData, admin_email: e.target.value })}
                    placeholder="VD: trunghieudev88@gmail.com..."
                    className="w-full pl-8 pr-3 py-2 bg-[#faf8f3] border border-border-herbal rounded-xl text-xs font-semibold text-primary focus:outline-none focus:border-primary"
                  />
                  <span className="material-symbols-outlined text-outline text-sm absolute left-2.5 top-2.5">
                    alternate_email
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant mt-1.5 leading-relaxed">
                  Khi khách đặt đơn hoặc hoàn tất thanh toán, hệ thống sẽ tự động gửi toàn bộ thông tin đơn (Tên khách, SĐT, Địa chỉ, Danh sách các món thảo mộc, Phí ship và Tổng tiền) về hòm thư này để tiệm chuẩn bị đóng gói và đi đơn ngay.
                </p>
              </div>

              {/* Hướng dẫn cấu hình Google SMTP */}
              <div className="p-3 bg-[#faf8f5] border border-[#e2dbce] rounded-xl text-xs space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-primary">
                  <span className="material-symbols-outlined text-sm text-[#8a7258]">settings_suggest</span>
                  <span>Thiết Lập Google SMTP (Gmail Cá Nhân):</span>
                </div>
                <div className="text-[11px] text-on-surface-variant leading-relaxed space-y-1">
                  <p>1. Truy cập tài khoản Google của bạn tại <strong className="text-primary font-mono">myaccount.google.com</strong> &gt; mục <strong>Bảo mật</strong>.</p>
                  <p>2. Đảm bảo đã bật <strong>Xác minh 2 bước</strong>, sau đó chọn <strong>Mật khẩu ứng dụng (App Passwords)</strong>.</p>
                  <p>3. Đặt tên <em>"Tiệm Thảo Mộc Ngân Hà"</em> để nhận <strong>mật khẩu 16 chữ cái</strong>.</p>
                  <p>4. Điền địa chỉ Gmail vào <code className="bg-white px-1 border border-border-herbal font-mono text-primary font-bold">SMTP_USER</code> và 16 ký tự vào <code className="bg-white px-1 border border-border-herbal font-mono text-primary font-bold">SMTP_PASS</code> trong file <code className="bg-white px-1 border border-border-herbal font-mono text-primary font-bold">backend/.env</code>.</p>
                </div>
              </div>

              {/* Nút gửi thử email kiểm tra kết nối */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border-herbal/50">
                <button
                  type="button"
                  disabled={testingEmail || !formData.admin_email}
                  onClick={handleSendTestEmail}
                  className="px-3 py-1.5 bg-[#1d3527] hover:bg-[#284935] text-[#d4b986] font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  <span className={`material-symbols-outlined text-sm ${testingEmail ? 'animate-spin' : ''}`}>
                    {testingEmail ? 'progress_activity' : 'send'}
                  </span>
                  <span>{testingEmail ? 'Đang Gửi Thử...' : 'Gửi Thử Email Thông Báo'}</span>
                </button>

                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                    formData.admin_email
                  )}&su=${encodeURIComponent('[ĐƠN HÀNG MẪU] Kiểm tra hòm thư')}&body=${encodeURIComponent(
                    'Đây là thư kiểm tra kết nối từ hệ thống Tiệm Thảo Mộc Ngân Hà.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-surface hover:bg-surface-container border border-border-herbal text-primary font-semibold text-xs rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                  <span>Mở Gmail Kiểm Tra</span>
                </a>
              </div>

              {testResult && (
                <div
                  className={`p-2.5 text-xs font-medium border flex items-start gap-2 ${
                    testResult.success
                      ? 'bg-green-50 text-green-900 border-green-200'
                      : 'bg-red-50 text-red-900 border-red-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm mt-0.5 shrink-0">
                    {testResult.success ? 'check_circle' : 'error'}
                  </span>
                  <div className="leading-relaxed">
                    <p>{testResult.message}</p>
                    <p className="text-[11px] text-green-800 mt-1">
                      💡 <em>Mẹo:</em> Nếu chưa thấy trong Hộp thư đến, bạn vui lòng kiểm tra mục <strong>Thư rác (Spam)</strong> hoặc <strong>Quảng cáo</strong> của Gmail {formData.admin_email}.
                    </p>
                  </div>
                </div>
              )}

              {/* Hộp hướng dẫn nhận thư vào Gmail */}
              <div className="p-2.5 bg-amber-50/80 border border-amber-200 text-amber-950 text-xs leading-relaxed space-y-1">
                <div className="font-bold flex items-center gap-1 text-amber-900">
                  <span className="material-symbols-outlined text-sm">info</span>
                  <span>Cách kích hoạt để nhận thư tự động vào Gmail:</span>
                </div>
                <p className="text-[11px]">
                  1. Khi hệ thống gửi email tự động lần đầu đến <strong>{formData.admin_email}</strong>, FormSubmit sẽ gửi 1 thư kích hoạt với tiêu đề <em>"Action Required: Confirm your form"</em>.
                </p>
                <p className="text-[11px]">
                  2. Bạn chỉ cần mở thư đó và bấm nút <strong>"Activate Form"</strong> (chỉ làm 1 lần duy nhất).
                </p>
                <p className="text-[11px]">
                  3. Kể từ đó, mọi đơn hàng mới khách đặt sẽ tự động gửi thẳng vào hòm thư Gmail của bạn mà không bị chặn.
                </p>
              </div>

              {/* Nhật ký gửi email gần nhất */}
              {emailLogs.length > 0 && (
                <div className="pt-2 border-t border-border-herbal/60 space-y-1.5">
                  <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">
                    Nhật ký thông báo gần nhất ({emailLogs.length} lần gửi):
                  </span>
                  <div className="max-h-32 overflow-y-auto space-y-1 divide-y divide-border-herbal/30 pr-1">
                    {emailLogs.slice(0, 5).map((log, idx) => (
                      <div key={idx} className="pt-1 flex items-center justify-between text-[11px]">
                        <div>
                          <span className="font-mono font-bold text-primary">#{log.order_code}</span>
                          <span className="text-on-surface-variant mx-1">•</span>
                          <span className="text-primary">{log.customer_name}</span>
                          <span className="text-on-surface-variant text-[10px] block">
                            {log.sent_at ? new Date(log.sent_at).toLocaleTimeString('vi-VN') : ''} ➔ {log.sent_to}
                          </span>
                        </div>
                        <span className="px-1.5 py-0.2 bg-green-100 text-green-800 text-[10px] font-bold">
                          ĐÃ GỬI
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Cấu hình Tiền Phí Vận Chuyển (Shipping Fee) */}
          <div className="bg-white border border-border-herbal p-4 shadow-xs rounded-xl space-y-3">
            <div className="border-b border-border-herbal pb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base">local_shipping</span>
              <h3 className="font-serif text-sm font-bold text-primary uppercase tracking-wider">
                3. Thiết Lập Tiền Phí Ship Toàn Shop
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-primary uppercase tracking-wider mb-1">
                  Tiền Phí Ship Mặc Định (đ) <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  required
                  value={formData.default_shipping_fee}
                  onChange={(e) => setFormData({ ...formData, default_shipping_fee: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#faf8f3] border border-border-herbal rounded-xl text-xs font-bold text-primary focus:outline-none focus:border-primary"
                />
                <span className="text-[10px] text-on-surface-variant mt-0.5 block">
                  Hiện hành: {formatCurrency(formData.default_shipping_fee)}
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-primary uppercase tracking-wider mb-1">
                  Ngưỡng Miễn Phí Vận Chuyển (đ) <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="10000"
                  required
                  value={formData.free_shipping_threshold}
                  onChange={(e) => setFormData({ ...formData, free_shipping_threshold: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#faf8f3] border border-border-herbal rounded-xl text-xs font-bold text-primary focus:outline-none focus:border-primary"
                />
                <span className="text-[10px] text-on-surface-variant mt-0.5 block">
                  Đơn từ {formatCurrency(formData.free_shipping_threshold)} được Freeship
                </span>
              </div>
            </div>
          </div>

          {/* Nút Submit */}
          <div className="pt-1">
            <button
              type="submit"
              className="w-full py-2.5 bg-[#2d7d46] hover:bg-[#25693a] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">save</span>
              <span>Lưu Cài Đặt Ngân Hàng, Gmail &amp; Phí Ship</span>
            </button>
          </div>

          {/* Card 4: An Ninh & Đổi Mật Khẩu Quản Trị Viên (Chuẩn 2026) */}
          <div className="bg-white border border-border-herbal p-4 shadow-xs rounded-xl space-y-3 mt-4">
            <div className="border-b border-border-herbal pb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">security</span>
                <h3 className="font-serif text-sm font-bold text-primary uppercase tracking-wider">
                  4. An Ninh &amp; Đổi Mật Khẩu Quản Trị Hệ Thống
                </h3>
              </div>
              <span className="text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.2">
                Bảo vệ nội bộ
              </span>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              Để bảo vệ tài khoản khỏi các đối tượng tấn công dò mật khẩu tự động (Brute-force/Bot), vui lòng đặt mật khẩu có độ dài tối thiểu từ <strong>8 ký tự</strong> trở lên.
            </p>

            {passwordStatus && (
              <div
                className={`p-2.5 text-xs font-medium border flex items-start gap-2 ${
                  passwordStatus.success
                    ? 'bg-green-50 text-green-900 border-green-200'
                    : 'bg-red-50 text-red-900 border-red-200'
                }`}
              >
                <span className="material-symbols-outlined text-sm mt-0.5 shrink-0">
                  {passwordStatus.success ? 'check_circle' : 'gpp_bad'}
                </span>
                <span>{passwordStatus.message}</span>
              </div>
            )}

            <div className="space-y-2.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-primary uppercase tracking-wider mb-1">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-[#faf8f3] border border-border-herbal rounded-none text-xs font-medium text-primary focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-primary uppercase tracking-wider mb-1">
                    Mật khẩu mới (Tối thiểu 8 ký tự)
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    placeholder="Tối thiểu 8 ký tự..."
                    className="w-full px-3 py-2 bg-[#faf8f3] border border-border-herbal rounded-none text-xs font-medium text-primary focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-primary uppercase tracking-wider mb-1">
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    placeholder="Nhập lại mật khẩu mới..."
                    className="w-full px-3 py-2 bg-[#faf8f3] border border-border-herbal rounded-none text-xs font-medium text-primary focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setPasswordStatus(null);
                  if (!passwordForm.currentPassword) {
                    setPasswordStatus({ success: false, message: 'Vui lòng nhập mật khẩu hiện tại.' });
                    return;
                  }
                  if (passwordForm.newPassword.length < 8) {
                    setPasswordStatus({ success: false, message: 'Mật khẩu mới phải dài tối thiểu 8 ký tự.' });
                    return;
                  }
                  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                    setPasswordStatus({ success: false, message: 'Mật khẩu mới và xác nhận mật khẩu không khớp.' });
                    return;
                  }

                  requestConfirmation({
                    title: 'Xác Nhận Đổi Mật Khẩu Quản Trị',
                    subtitle: 'Bảo mật chuẩn an ninh 2026',
                    message: 'Bạn có chắc chắn muốn cập nhật mật khẩu đăng nhập Quản Trị Viên mới không?',
                    confirmText: 'Xác Nhận Đổi Mật Khẩu',
                    variant: 'primary',
                    icon: 'lock_reset',
                    onConfirm: () => {
                      const res = changePassword(passwordForm.currentPassword, passwordForm.newPassword);
                      setPasswordStatus(res);
                      if (res.success) {
                        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      }
                    },
                  });
                }}
                className="w-full py-2 bg-[#1d3527] hover:bg-[#284935] text-[#d4b986] font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs mt-1"
              >
                <span className="material-symbols-outlined text-sm">lock_reset</span>
                <span>Cập Nhật Mật Khẩu Bảo Mật Mới</span>
              </button>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: XEM TRƯỚC VÀ QUÉT THỬ MÃ VIETQR HOẠT ĐỘNG THẬT */}
        <div className="lg:col-span-5 bg-white border border-border-herbal p-4 shadow-xs rounded-xl space-y-3">
          <div className="border-b border-border-herbal pb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-base">qr_code_scanner</span>
              <h3 className="font-serif text-sm font-bold text-primary uppercase tracking-wider">
                Mã VietQR Hoạt Động Trực Tiếp
              </h3>
            </div>
            <span className="px-1.5 py-0.2 bg-green-100 text-green-800 text-[10px] font-bold font-mono">
              Live Napas247
            </span>
          </div>

          <p className="text-xs text-on-surface-variant leading-relaxed">
            Mã QR dưới đây được tạo trực tiếp từ số tài khoản và ngân hàng bạn đang nhập. Bạn có thể mở ứng dụng ngân hàng bất kỳ trên điện thoại quét thử để kiểm tra tính chính xác.
          </p>

          {/* Khung hiển thị QR */}
          <div className="p-3 bg-[#faf8f3] border border-border-herbal flex flex-col items-center justify-center">
            <div className="w-56 h-56 bg-white p-2 border border-border-herbal shadow-xs flex items-center justify-center">
              <img
                src={liveQrUrl}
                alt="Mã VietQR kiểm tra"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="mt-3 w-full space-y-1 text-xs">
              <div className="flex justify-between border-b border-border-herbal/50 py-1">
                <span className="text-on-surface-variant">Ngân hàng:</span>
                <span className="font-bold text-primary">{formData.bank_name}</span>
              </div>
              <div className="flex justify-between border-b border-border-herbal/50 py-1">
                <span className="text-on-surface-variant">Số tài khoản:</span>
                <span className="font-mono font-bold text-primary text-sm">{formData.bank_account}</span>
              </div>
              <div className="flex justify-between border-b border-border-herbal/50 py-1">
                <span className="text-on-surface-variant">Chủ tài khoản:</span>
                <span className="font-bold text-primary uppercase">{formData.account_name}</span>
              </div>
              <div className="flex justify-between border-b border-border-herbal/50 py-1">
                <span className="text-on-surface-variant">Gmail nhận đơn:</span>
                <span className="font-semibold text-secondary truncate max-w-[180px]">{formData.admin_email}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-on-surface-variant">Số tiền quét thử:</span>
                <input
                  type="number"
                  step="10000"
                  value={testAmount}
                  onChange={(e) => setTestAmount(Number(e.target.value))}
                  className="w-24 px-2 py-0.5 bg-white border border-border-herbal rounded-none font-bold text-right text-xs"
                />
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-green-50 border border-green-200 text-green-900 text-xs space-y-1">
            <div className="font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-green-700">verified</span>
              <span>Tự động áp dụng cho khách mua hàng:</span>
            </div>
            <p className="text-[11px] leading-relaxed text-green-800">
              Khi khách hàng chọn phương thức <strong>VietQR</strong> lúc đặt hàng, trang thanh toán sẽ tạo mã QR nạp đúng Số tài khoản, Ngân hàng và Số tiền chính xác của đơn hàng.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
