import { formatCurrency } from './formatCurrency';
import api from '../services/api';
import { useAdminStore } from '../store/useAdminStore';

const escapeHtml = (val) =>
  String(val ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * Tạo giao diện HTML Email hóa đơn chuẩn Tiệm Thảo Dược Ngân Hà (giống mẫu Backend SMTP)
 * Dùng cho kênh EmailJS trên web tĩnh (nganhashop.pages.dev) hoặc xem trước.
 */
export const buildOrderHtmlTemplate = (order) => {
  const orderTime = order.created_at
    ? new Date(order.created_at).toLocaleString('vi-VN')
    : new Date().toLocaleString('vi-VN');

  const itemsRows = (order.items || [])
    .map(
      (it, idx) => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 10px 8px; font-size: 13px; color: #111827;">
          <strong>${idx + 1}. ${escapeHtml(it.name)}</strong>
          <div style="font-size: 11px; color: #6b7280; margin-top: 2px;">Quy cách: ${escapeHtml(it.unit || 'Gói/Túi')}</div>
        </td>
        <td style="padding: 10px 8px; text-align: center; font-size: 13px; font-weight: 600; color: #111827;">
          ${Number(it.quantity) || 1}
        </td>
        <td style="padding: 10px 8px; text-align: right; font-size: 13px; color: #374151;">
          ${formatCurrency(it.price || 0)}
        </td>
        <td style="padding: 10px 8px; text-align: right; font-size: 13px; font-weight: 600; color: #111827;">
          ${formatCurrency((Number(it.price) || 0) * (Number(it.quantity) || 1))}
        </td>
      </tr>`
    )
    .join('');

  const isPaid = order.payment_status === 'PAID';
  const paymentMethodLabel = order.payment_method === 'VIETQR' ? 'VIETQR' : 'COD';

  return `
    <div style="margin: 0; padding: 20px 10px; background-color: #f3f4f6; font-family: 'Segoe UI', Arial, Helvetica, sans-serif; line-height: 1.6; color: #111827;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 620px; background-color: #ffffff; border: 1px solid #d1d5db; font-family: 'Segoe UI', Arial, Helvetica, sans-serif;">
        <tr>
          <td style="padding: 22px 24px 18px; text-align: center; border-bottom: 2px solid #111827;">
            <div style="font-size: 18px; font-weight: 700; color: #111827; letter-spacing: 0.5px; text-transform: uppercase;">
              TIỆM THẢO DƯỢC NGÂN HÀ
            </div>
            <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">
              Đơn giản • Tinh tế • An lành
            </div>
            <div style="margin-top: 12px; display: inline-block; border: 1px solid #111827; padding: 5px 14px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; color: #111827; text-transform: uppercase;">
              CÓ ĐƠN ĐẶT HÀNG MỚI CẦN ĐI ĐƠN
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px 24px 16px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 12px 16px;">
              <tr>
                <td style="font-size: 13px; color: #374151; padding-bottom: 6px;">
                  Mã đơn hàng: <strong style="font-size: 15px; color: #111827; letter-spacing: 0.3px;">#${escapeHtml(order.order_code)}</strong>
                </td>
                <td style="text-align: right; font-size: 12px; color: #6b7280;">
                  ${escapeHtml(orderTime)}
                </td>
              </tr>
              <tr>
                <td colspan="2" style="font-size: 12px; color: #374151;">
                  Trạng thái thanh toán:
                  <strong style="border: 1px solid #d1d5db; background: #ffffff; padding: 2px 8px; display: inline-block; color: #111827;">
                    ${isPaid ? `ĐÃ THANH TOÁN (${paymentMethodLabel})` : `CHỜ THANH TOÁN (${paymentMethodLabel})`}
                  </strong>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 0 24px 18px;">
            <div style="font-size: 12px; font-weight: 700; color: #111827; text-transform: uppercase; border-bottom: 1.5px solid #111827; padding-bottom: 6px; margin-bottom: 10px;">
              1. Người Nhận Hàng &amp; Địa Chỉ Giao
            </div>
            <table width="100%" cellpadding="4" cellspacing="0" style="font-size: 13px; color: #111827;">
              <tr>
                <td width="30%" style="color: #6b7280;">Họ và tên:</td>
                <td><strong>${escapeHtml(order.customer_name)}</strong></td>
              </tr>
              <tr>
                <td style="color: #6b7280;">Số điện thoại:</td>
                <td>
                  <a href="tel:${escapeHtml(order.customer_phone)}" style="color: #111827; font-weight: 700; text-decoration: none;">
                    ${escapeHtml(order.customer_phone)}
                  </a>
                </td>
              </tr>
              <tr>
                <td style="color: #6b7280;">Địa chỉ giao hàng:</td>
                <td><strong>${escapeHtml(order.customer_address)}</strong></td>
              </tr>
              ${order.customer_note && String(order.customer_note).trim() ? `
              <tr>
                <td style="color: #6b7280;">Ghi chú dặn dò:</td>
                <td>${escapeHtml(order.customer_note)}</td>
              </tr>` : ''}
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 0 24px 18px;">
            <div style="font-size: 12px; font-weight: 700; color: #111827; text-transform: uppercase; border-bottom: 1.5px solid #111827; padding-bottom: 6px; margin-bottom: 10px;">
              2. Danh Sách Sản Phẩm Cần Soạn (${order.items?.length || 0} món)
            </div>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f9fafb; border-bottom: 1.5px solid #d1d5db; font-size: 11px; color: #4b5563; text-transform: uppercase;">
                  <th align="left" style="padding: 8px;">Tên Sản Phẩm</th>
                  <th align="center" style="padding: 8px;">SL</th>
                  <th align="right" style="padding: 8px;">Đơn Giá</th>
                  <th align="right" style="padding: 8px;">Thành Tiền</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 0 24px 22px;">
            <table width="100%" cellpadding="6" cellspacing="0" style="background-color: #f9fafb; border: 1px solid #e5e7eb; font-size: 13px;">
              <tr>
                <td style="color: #4b5563;">Tiền hàng tạm tính:</td>
                <td align="right" style="font-weight: 600; color: #111827;">${formatCurrency(order.subtotal || 0)}</td>
              </tr>
              <tr>
                <td style="color: #4b5563;">Tiền phí giao hàng:</td>
                <td align="right" style="color: #374151;">
                  ${order.shipping_fee > 0 ? formatCurrency(order.shipping_fee) : 'Miễn phí (Freeship)'}
                </td>
              </tr>
              <tr style="border-top: 1.5px solid #d1d5db;">
                <td style="font-size: 14px; font-weight: 700; color: #111827; padding-top: 10px;">TỔNG CỘNG THU:</td>
                <td align="right" style="font-size: 16px; font-weight: 700; color: #111827; padding-top: 10px;">${formatCurrency(order.total || 0)}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;
};

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
const inFlightOrderEmails = new Set();

export const sendAutomaticOrderEmail = async (order, targetEmail, senderOptions = {}) => {
  if (!order || !order.order_code) {
    return { success: false, message: 'Thiếu thông tin mã đơn hàng.' };
  }

  // 1. Chống gửi trùng lặp (Deduplication Guard + In-flight Lock): Một mã đơn hàng chỉ gửi email 1 lần duy nhất!
  const dedupKey = `nganha_email_dispatched_${order.order_code}`;
  if (
    inFlightOrderEmails.has(order.order_code) ||
    sessionStorage.getItem(dedupKey) ||
    localStorage.getItem(dedupKey)
  ) {
    return { success: true, deduplicated: true, message: 'Đơn hàng đã được gửi email trước đó.' };
  }
  inFlightOrderEmails.add(order.order_code);

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

  // 3. Thử gửi HTML đầy đủ qua EmailJS (nếu đã cấu hình VITE_EMAILJS_* trên Pages)
  const emailJsService = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const emailJsTemplate = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const emailJsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (emailJsService && emailJsTemplate && emailJsPublicKey) {
    try {
      const emailJsRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        keepalive: true,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: emailJsService,
          template_id: emailJsTemplate,
          user_id: emailJsPublicKey,
          template_params: {
            to_email: adminEmail,
            reply_to: senderEmail,
            subject,
            html_content: buildOrderHtmlTemplate(order),
          },
        }),
      });
      if (emailJsRes.ok) {
        sessionStorage.setItem(dedupKey, Date.now().toString());
        localStorage.setItem(dedupKey, Date.now().toString());
        saveEmailDispatchLog({
          order_code: order.order_code,
          sent_from: senderEmail,
          sent_to: adminEmail,
          sent_at: new Date().toISOString(),
          customer_name: order.customer_name,
          total: order.total,
          status: 'SENT_HTML',
          channel: 'EmailJS',
        });
        return {
          success: true,
          channel: 'EmailJS',
          adminEmail,
          message: `Đã gửi hóa đơn HTML đầy đủ qua EmailJS tới: ${adminEmail}`,
        };
      }
    } catch (e) {}
  }

  // 4. Fallback qua FormSubmit khi Backend offline hoặc chưa cấu hình SMTP / EmailJS
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
      'Mã Đơn Hàng': `#${order.order_code} (${orderTime})`,
      'Trạng Thái Thanh Toán': `${paymentState} (${paymentLabel})`,
      '1. Người Nhận Hàng': `${order.customer_name} — ${order.customer_phone}`,
      'Địa Chỉ Giao Hàng': order.customer_address,
      [`2. Danh Sách Sản Phẩm (${order.items?.length || 0} món)`]:
        conciseItems || 'Không có sản phẩm',
      'Tiền Hàng Tạm Tính': formatCurrency(order.subtotal || 0),
      'Phí Giao Hàng': shipLabel,
      'TỔNG CỘNG THU': formatCurrency(order.total || 0),
    };

    if (order.customer_note && String(order.customer_note).trim()) {
      formPayload['Ghi Chú Dặn Dò'] = String(order.customer_note).trim();
    }

    if (senderEmail) {
      formPayload._replyto = senderEmail;
    }

    const formRes = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(adminEmail)}`, {
      method: 'POST',
      keepalive: true,
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

  inFlightOrderEmails.delete(order.order_code);

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

