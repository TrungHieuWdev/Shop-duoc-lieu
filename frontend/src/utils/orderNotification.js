import { formatCurrency } from './formatCurrency';
import api from '../services/api';

/**
 * Tạo nội dung thông tin đơn hàng chi tiết để gửi đến Gmail của chủ shop
 */
export const createOrderEmailContent = (order) => {
  const subject = `[ĐƠN HÀNG MỚI #${order.order_code}] ${order.customer_name} - ${formatCurrency(order.total || 0)}`;

  const itemsList = (order.items || [])
    .map(
      (it, idx) =>
        `  ${idx + 1}. ${it.name} (${it.unit || 'Gói/Túi'}) - Số lượng: ${it.quantity} gói - Đơn giá: ${formatCurrency(it.price)}`
    )
    .join('\n');

  const body = `Kính gửi Chủ Tiệm Thảo Mộc Ngân Hà,

Hệ thống vừa tiếp nhận 01 đơn hàng mới từ khách hàng. Dưới đây là thông tin chi tiết để shop chuẩn bị đóng gói và đi đơn ngay:

==================================================
1. THÔNG TIN KHÁCH HÀNG & GIAO HÀNG
==================================================
- Mã đơn hàng: #${order.order_code}
- Họ và tên người nhận: ${order.customer_name}
- Số điện thoại: ${order.customer_phone}
- Địa chỉ giao hàng: ${order.customer_address}
- Ghi chú khách dặn: ${order.customer_note || 'Không có ghi chú'}
- Hình thức thanh toán: ${order.payment_method === 'VIETQR' ? 'Chuyển khoản VietQR' : 'Tiền mặt (COD)'}
- Trạng thái thanh toán: ${order.payment_status === 'PAID' ? 'ĐÃ THANH TOÁN (PAID)' : 'CHƯA THANH TOÁN'}
- Thời gian đặt: ${order.created_at ? new Date(order.created_at).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN')}

==================================================
2. DANH SÁCH DƯỢC LIỆU CẦN SOẠN ĐI ĐƠN
==================================================
${itemsList || '  (Chưa có danh sách mặt hàng)'}

==================================================
3. TỔNG KẾT TIỀN ĐƠN HÀNG
==================================================
- Tiền hàng (tạm tính): ${formatCurrency(order.subtotal || 0)}
- Tiền phí ship: ${order.shipping_fee > 0 ? formatCurrency(order.shipping_fee) : 'Miễn phí vận chuyển'}
- TỔNG CỘNG THU: ${formatCurrency(order.total || 0)}

==================================================
Vui lòng kiểm tra kho và xuất dược liệu đóng gói túi zip gửi cho đơn vị vận chuyển sớm nhất!
Tiệm Thảo Mộc Ngân Hà - Đơn giản, tinh tế, an lành.`;

  return { subject, body };
};

/**
 * Gửi thông báo đơn hàng đến Gmail chủ shop
 */
export const notifyAdminNewOrder = (order, targetEmail = 'hieunedz@gmail.com') => {
  const adminEmail = (targetEmail && targetEmail !== 'tiemthaomocnganha@gmail.com')
    ? targetEmail
    : 'hieunedz@gmail.com';
  const { subject, body } = createOrderEmailContent(order);

  // 1. Lưu log thông báo vào localStorage
  try {
    const raw = localStorage.getItem('nganha_admin_email_logs') || '[]';
    const logs = JSON.parse(raw);
    const newLog = {
      order_code: order.order_code,
      sent_to: adminEmail,
      sent_at: new Date().toISOString(),
      customer_name: order.customer_name,
      total: order.total,
    };
    localStorage.setItem('nganha_admin_email_logs', JSON.stringify([newLog, ...logs.slice(0, 50)]));
  } catch (e) {
    console.error('Lỗi lưu log email:', e);
  }

  // 2. Link mở nhanh trang soạn Gmail có sẵn nội dung
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    adminEmail
  )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  // 3. Link mailto tiêu chuẩn
  const mailtoUrl = `mailto:${encodeURIComponent(adminEmail)}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  // 4. Đồng thời kích hoạt gửi tự động ngầm
  sendAutomaticOrderEmail(order, adminEmail);

  return {
    adminEmail,
    subject,
    body,
    gmailComposeUrl,
    mailtoUrl,
  };
};

/**
 * Tự động gửi email thông báo đơn hàng trực tiếp về địa chỉ email mà chủ cửa hàng đã thiết lập
 * - Gửi tự động ngầm (background) không làm gián đoạn hay hiện popup cho khách
 * - Gửi qua API Backend (Nodemailer) nếu có kết nối
 * - Gửi qua dịch vụ Email Gateway (FormSubmit direct to recipient)
 * - Lưu bản ghi lịch sử gửi vào localStorage
 */
export const sendAutomaticOrderEmail = async (order, targetEmail) => {
  if (!order || !order.order_code) return;

  // 1. Chống gửi trùng lặp (Deduplication Guard): Một mã đơn hàng chỉ gửi email 1 lần duy nhất!
  const dedupKey = `nganha_email_dispatched_${order.order_code}`;
  if (sessionStorage.getItem(dedupKey) || localStorage.getItem(dedupKey)) {
    console.log(`[FRONTEND DEDUP] Đơn hàng #${order.order_code} đã được phát lệnh gửi email trước đó. Bỏ qua để tránh gửi trùng.`);
    return { success: true, message: 'Đã gửi trước đó' };
  }
  // Ghi nhận ngay lập tức vào bộ nhớ tạm để khóa các lệnh gửi trùng sau đó
  sessionStorage.setItem(dedupKey, Date.now().toString());
  localStorage.setItem(dedupKey, Date.now().toString());

  const adminEmail = (targetEmail && targetEmail !== 'tiemthaomocnganha@gmail.com')
    ? targetEmail
    : 'hieunedz@gmail.com';
  const { subject, body } = createOrderEmailContent(order);

  // 2. Lưu bản ghi vào nhật ký hệ thống admin
  try {
    const raw = localStorage.getItem('nganha_admin_email_logs') || '[]';
    const logs = JSON.parse(raw);
    const existing = logs.find(
      (l) => l.order_code === order.order_code && l.status === 'SENT_AUTO'
    );
    if (!existing) {
      const newLog = {
        order_code: order.order_code,
        sent_to: adminEmail,
        sent_at: new Date().toISOString(),
        customer_name: order.customer_name,
        total: order.total,
        status: 'SENT_AUTO',
      };
      localStorage.setItem(
        'nganha_admin_email_logs',
        JSON.stringify([newLog, ...logs.slice(0, 50)])
      );
    }
  } catch (e) {
    console.error('Lỗi lưu log email:', e);
  }

  // 3. Gửi tự động qua Backend Node.js / Google SMTP Nodemailer
  let backendSuccess = false;
  let backendResult = null;

  try {
    const res = await api.post('/api/notifications/send-order-email', {
      order,
      recipientEmail: adminEmail,
      subject,
      body,
    });
    backendResult = res;
    if (res && res.success) {
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
          subject,
          body,
        }),
      });
      const data = await fallbackRes.json();
      if (data && data.success) {
        backendSuccess = true;
        backendResult = data;
      }
    } catch (err) {}
  }

  // 4. CHỈ gửi dự phòng qua FormSubmit NẾU Backend hoàn toàn offline/thất bại
  if (!backendSuccess) {
    try {
      await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(adminEmail)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: subject,
          _template: 'box',
          _captcha: 'false',
          'Mã Đơn Hàng': `#${order.order_code}`,
          'Khách Hàng': order.customer_name,
          'Số Điện Thoại': order.customer_phone,
          'Địa Chỉ Giao Hàng': order.customer_address,
          'Ghi Chú Khách Dặn': order.customer_note || 'Không có ghi chú',
          'Hình Thức Thanh Toán': order.payment_method === 'VIETQR' ? 'Chuyển khoản VietQR' : 'Tiền mặt (COD)',
          'Trạng Thái Thanh Toán': order.payment_status === 'PAID' ? 'ĐÃ THANH TOÁN (PAID)' : 'CHƯA THANH TOÁN',
          'Tổng Tiền Thu': formatCurrency(order.total || 0),
          'Chi Tiết Dược Liệu Đi Đơn': body,
        }),
      });
    } catch (e) {}
  }

  return backendResult || { success: true, message: `Đã gửi thông báo đơn hàng tới: ${adminEmail}` };
};

