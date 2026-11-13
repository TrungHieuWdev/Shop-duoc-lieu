import { formatCurrency } from './formatCurrency';
import api from '../services/api';
import { useAdminStore } from '../store/useAdminStore';

/**
 * Tạo nội dung thông tin đơn hàng chi tiết để gửi đến Gmail của chủ shop
 */
export const createOrderEmailContent = (order) => {
  const subject = `[ĐƠN HÀNG MỚI #${order.order_code}] ${order.customer_name} - ${formatCurrency(order.total || 0)}`;
  const orderTime = order.created_at
    ? new Date(order.created_at).toLocaleString('vi-VN')
    : new Date().toLocaleString('vi-VN');

  const itemsList = (order.items || [])
    .map(
      (it, idx) =>
        `  ${idx + 1}. ${it.name}${it.unit ? ` (${it.unit})` : ''} × ${it.quantity || 1} — ${formatCurrency(
          (it.price || 0) * (it.quantity || 1)
        )}`
    )
    .join('\n');

  const paymentMethodLabel =
    order.payment_method === 'VIETQR' ? 'Chuyển khoản VietQR' : 'Tiền mặt (COD)';
  const paymentStatusLabel =
    order.payment_status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán';
  const shippingLabel =
    order.shipping_fee > 0 ? formatCurrency(order.shipping_fee) : 'Miễn phí vận chuyển';

  const noteLine =
    order.customer_note && String(order.customer_note).trim()
      ? `\n• Ghi chú: ${String(order.customer_note).trim()}`
      : '';

  const body = `THẢO DƯỢC NGÂN HÀ — PHIẾU ĐƠN HÀNG MỚI #${order.order_code}
Thời gian đặt: ${orderTime}

1. THÔNG TIN GIAO HÀNG
• Người nhận: ${order.customer_name}
• Số điện thoại: ${order.customer_phone}
• Địa chỉ: ${order.customer_address}${noteLine}

2. CHI TIẾT SẢN PHẨM
${itemsList || '  (Chưa có danh sách sản phẩm)'}

3. TỔNG KẾT THANH TOÁN
• Tiền hàng: ${formatCurrency(order.subtotal || 0)}
• Phí vận chuyển: ${shippingLabel}
• Tổng thanh toán: ${formatCurrency(order.total || 0)}
• Hình thức: ${paymentMethodLabel} (${paymentStatusLabel})

Thảo Dược Ngân Hà • Đơn giản, tinh tế, an lành.`;

  return { subject, body };
};

/**
 * Gửi thông báo đơn hàng đến Gmail chủ shop
 */
export const notifyAdminNewOrder = (order, targetEmail = 'hieunedz@gmail.com') => {
  const adminEmail = (targetEmail && targetEmail !== 'tiemthaomocnganha@gmail.com')
    ? targetEmail.trim()
    : 'hieunedz@gmail.com';
  const { subject, body } = createOrderEmailContent(order);

  // 1. Link mở nhanh trang soạn Gmail có sẵn nội dung
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    adminEmail
  )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  // 2. Link mailto tiêu chuẩn
  const mailtoUrl = `mailto:${encodeURIComponent(adminEmail)}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  // 3. Kích hoạt gửi tự động ngầm qua Backend SMTP hoặc FormSubmit
  sendAutomaticOrderEmail(order, adminEmail);

  return {
    adminEmail,
    subject,
    body,
    gmailComposeUrl,
    mailtoUrl,
  };
};

const saveEmailDispatchLog = (logEntry) => {
  try {
    const raw = localStorage.getItem('nganha_admin_email_logs') || '[]';
    const logs = JSON.parse(raw);
    const filtered = logs.filter((l) => l.order_code !== logEntry.order_code);
    localStorage.setItem(
      'nganha_admin_email_logs',
      JSON.stringify([logEntry, ...filtered.slice(0, 50)])
    );
  } catch (e) {
    console.error('Lỗi lưu log email:', e);
  }
};

/**
 * Tự động gửi email thông báo đơn hàng trực tiếp về địa chỉ email mà chủ cửa hàng đã thiết lập
 * - Gửi tự động ngầm (background) không làm gián đoạn hay hiện popup cho khách
 * - Ưu tiên gửi qua API Backend (Google SMTP Nodemailer) nếu đã cấu hình SMTP
 * - Tự động fallback qua FormSubmit khi Backend offline hoặc chưa cấu hình SMTP
 * - Ghi nhận chính xác trạng thái gửi thực tế vào lịch sử admin
 */
export const sendAutomaticOrderEmail = async (order, targetEmail, senderOptions = {}) => {
  if (!order || !order.order_code) {
    return { success: false, message: 'Thiếu thông tin mã đơn hàng.' };
  }

  // 1. Chống gửi trùng lặp (Deduplication Guard): Một mã đơn hàng chỉ gửi email 1 lần duy nhất!
  const dedupKey = `nganha_email_dispatched_${order.order_code}`;
  if (sessionStorage.getItem(dedupKey) || localStorage.getItem(dedupKey)) {
    return { success: true, deduplicated: true, message: 'Đơn hàng đã được gửi email trước đó.' };
  }

  const storeSettings = useAdminStore.getState()?.settings || {};
  const adminEmail = (targetEmail && targetEmail !== 'tiemthaomocnganha@gmail.com')
    ? targetEmail.trim()
    : (storeSettings.admin_email || 'hieunedz@gmail.com');
  const senderEmail = (senderOptions.senderEmail || storeSettings.shop_sender_email || 'nganhashop995@gmail.com').trim();
  const senderAppPassword = (senderOptions.senderAppPassword || '').trim();

  const { subject, body } = createOrderEmailContent(order);

  // 2. Chỉ thử gửi qua Backend Node.js / Google SMTP khi chạy local hoặc có cấu hình VITE_API_BASE_URL
  // (Trên Cloudflare Pages *.pages.dev tĩnh không có backend, gửi thẳng FormSubmit ngay để không bị trễ/lỗi localhost)
  const isLocalHost =
    typeof window !== 'undefined' &&
    ['localhost', '127.0.0.1'].includes(window.location.hostname);
  const hasBackendApi = Boolean(import.meta.env.VITE_API_BASE_URL) || isLocalHost;

  let backendSuccess = false;
  let backendResult = null;

  const isBackendSmtpSent = (res) => Boolean(res && res.success && res.configured !== false);

  if (hasBackendApi) {
    try {
      const res = await api.post('/api/notifications/send-order-email', {
        order,
        recipientEmail: adminEmail,
        senderEmail: senderEmail || undefined,
        senderAppPassword: senderAppPassword || undefined,
        subject,
        body,
      });
      backendResult = res;
      if (isBackendSmtpSent(res)) {
        backendSuccess = true;
      }
    } catch (e) {
      // Dự phòng gọi endpoint tương đối nếu api base url chưa trỏ về backend
      try {
        const fallbackRes = await fetch('/api/notifications/send-order-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-NganHa-Client-Signature': 'nganha_sec_2026_shield_v1',
          },
          body: JSON.stringify({
            order,
            recipientEmail: adminEmail,
            senderEmail: senderEmail || undefined,
            senderAppPassword: senderAppPassword || undefined,
            subject,
            body,
          }),
        });
        if (fallbackRes.ok) {
          const data = await fallbackRes.json();
          if (isBackendSmtpSent(data)) {
            backendSuccess = true;
            backendResult = data;
          }
        }
      } catch (err) { }
    }
  }

  if (backendSuccess) {
    sessionStorage.setItem(dedupKey, Date.now().toString());
    localStorage.setItem(dedupKey, Date.now().toString());
    saveEmailDispatchLog({
      order_code: order.order_code,
      sent_from: senderEmail || 'Google SMTP (.env)',
      sent_to: adminEmail,
      sent_at: new Date().toISOString(),
      customer_name: order.customer_name,
      total: order.total,
      status: 'SENT_SMTP',
      channel: 'Google SMTP',
    });
    return {
      success: true,
      channel: 'Google SMTP',
      adminEmail,
      message: backendResult?.message || `Đã gửi email đơn hàng qua Google SMTP tới: ${adminEmail}`,
    };
  }

  // 3. Fallback qua FormSubmit khi Backend offline hoặc chưa cấu hình SMTP
  try {
    const orderTime = order.created_at
      ? new Date(order.created_at).toLocaleString('vi-VN')
      : new Date().toLocaleString('vi-VN');

    const conciseItems = (order.items || [])
      .map(
        (it, idx) =>
          `${idx + 1}. ${it.name}${it.unit ? ` (${it.unit})` : ''} × ${it.quantity || 1} — ${formatCurrency(
            (it.price || 0) * (it.quantity || 1)
          )}`
      )
      .join('\n');

    const paymentLabel = order.payment_method === 'VIETQR' ? 'Chuyển khoản VietQR' : 'COD (Thu hộ)';
    const paymentState = order.payment_status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán';
    const shipLabel =
      order.shipping_fee > 0 ? formatCurrency(order.shipping_fee) : 'Miễn phí vận chuyển';

    const formPayload = {
      _subject: subject,
      _template: 'table',
      _captcha: 'false',
      'Mã Đơn & Thời Gian': `#${order.order_code} • ${orderTime}`,
      'Người Nhận & SĐT': `${order.customer_name} — ${order.customer_phone}`,
      'Địa Chỉ Giao Hàng': order.customer_address,
      'Chi Tiết Sản Phẩm': conciseItems || 'Không có sản phẩm',
      'Tạm Tính & Phí Ship': `Tiền hàng: ${formatCurrency(order.subtotal || 0)} | Phí ship: ${shipLabel}`,
      'Tổng Thanh Toán': `${formatCurrency(order.total || 0)} (${paymentLabel} • ${paymentState})`,
    };

    if (order.customer_note && String(order.customer_note).trim()) {
      formPayload['Ghi Chú Khách Hàng'] = String(order.customer_note).trim();
    }

    if (senderEmail) {
      formPayload._replyto = senderEmail;
    }

    const formRes = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(adminEmail)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(formPayload),
    });

    const formData = await formRes.json().catch(() => ({}));
    const rawMsg = String(formData?.message || '');
    const needsActivation = rawMsg.toLowerCase().includes('activat');
    const isFormOk = formRes.ok && (formData?.success === true || formData?.success === 'true');

    if (isFormOk) {
      sessionStorage.setItem(dedupKey, Date.now().toString());
      localStorage.setItem(dedupKey, Date.now().toString());
      saveEmailDispatchLog({
        order_code: order.order_code,
        sent_from: senderEmail || 'FormSubmit Gateway',
        sent_to: adminEmail,
        sent_at: new Date().toISOString(),
        customer_name: order.customer_name,
        total: order.total,
        status: 'SENT_AUTO',
        channel: 'FormSubmit',
      });
      return {
        success: true,
        channel: 'FormSubmit',
        adminEmail,
        message: senderEmail
          ? `Đã gửi thông báo đơn hàng (từ ${senderEmail}) tới Gmail chủ shop: ${adminEmail}`
          : `Đã gửi thông báo đơn hàng thành công tới Gmail: ${adminEmail}`,
      };
    }

    if (needsActivation) {
      saveEmailDispatchLog({
        order_code: order.order_code,
        sent_from: senderEmail || 'FormSubmit Gateway',
        sent_to: adminEmail,
        sent_at: new Date().toISOString(),
        customer_name: order.customer_name,
        total: order.total,
        status: 'NEEDS_ACTIVATION',
        channel: 'FormSubmit',
      });
      return {
        success: false,
        needsActivation: true,
        channel: 'FormSubmit',
        adminEmail,
        message: `Email ${adminEmail} chưa kích hoạt FormSubmit. Vui lòng mở Gmail ${adminEmail} và bấm "Activate Form" trong thư từ FormSubmit (chỉ cần 1 lần duy nhất).`,
      };
    }
  } catch (e) { }

  saveEmailDispatchLog({
    order_code: order.order_code,
    sent_from: senderEmail || 'Chưa cấu hình',
    sent_to: adminEmail,
    sent_at: new Date().toISOString(),
    customer_name: order.customer_name,
    total: order.total,
    status: 'FAILED',
    channel: 'Offline',
  });

  return {
    success: false,
    adminEmail,
    message: `Chưa thể gửi tự động tới ${adminEmail} do máy chủ SMTP chưa cấu hình hoặc mất kết nối mạng.`,
  };
};

