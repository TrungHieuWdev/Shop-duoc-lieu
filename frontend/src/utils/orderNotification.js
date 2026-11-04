import { formatCurrency } from './formatCurrency';

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
export const notifyAdminNewOrder = (order, targetEmail = 'tiemthaomocnganha@gmail.com') => {
  const { subject, body } = createOrderEmailContent(order);
  const adminEmail = targetEmail || 'tiemthaomocnganha@gmail.com';

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

  return {
    adminEmail,
    subject,
    body,
    gmailComposeUrl,
    mailtoUrl,
  };
};

