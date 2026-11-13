import nodemailer from 'nodemailer';

/**
 * CẤU HÌNH DỊCH VỤ GOOGLE SMTP CHO GMAIL CÁ NHÂN
 * Tiệm Thảo Mộc Ngân Hà
 * 
 * Lưu ý quan trọng cho chủ tiệm:
 * 1. Gmail cá nhân yêu cầu bật "Xác minh 2 bước" (2-Step Verification) trên tài khoản Google.
 * 2. Tạo "Mật khẩu ứng dụng" (App Password) gồm 16 chữ cái (không dùng mật khẩu đăng nhập bình thường).
 * 3. Điền tài khoản Gmail và Mật khẩu ứng dụng 16 ký tự vào file .env (SMTP_USER và SMTP_PASS).
 */

const formatMoney = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
    .format(amount || 0)
    .replace('₫', 'đ');
};

export const getGoogleTransporter = (customUser, customPass) => {
  const smtpUser = (customUser && String(customUser).trim()) || process.env.SMTP_USER;
  const smtpPass = (customPass && String(customPass).trim()) || process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass || smtpUser === 'your_store_system_email@gmail.com') {
    return null;
  }

  // Google SMTP hỗ trợ chuẩn cổng 465 (SSL) hoặc 587 (TLS)
  const smtpPort = Number(process.env.SMTP_PORT) || 465;
  const isSecure = smtpPort === 465;

  return {
    smtpUser: smtpUser.trim(),
    transporter: nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: smtpPort,
      secure: isSecure,
      auth: {
        user: smtpUser.trim(),
        pass: smtpPass.trim().replace(/\s+/g, ''), // Xóa bỏ khoảng trắng nếu copy từ Google
      },
      // Tăng timeout kết nối để tránh mạng chập chờn
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    }),
  };
};

/**
 * Tạo giao diện HTML Email hóa đơn chuyên nghiệp, mộc mạc gửi đến Gmail chủ shop
 */
export const buildOrderHtmlTemplate = (order) => {
  const itemsRows = (order.items || [])
    .map(
      (it, idx) => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 10px 8px; font-size: 13px; color: #111827;">
          <strong>${idx + 1}. ${it.name}</strong>
          <div style="font-size: 11px; color: #6b7280; margin-top: 2px;">Quy cách: ${it.unit || 'Gói/Túi'}</div>
        </td>
        <td style="padding: 10px 8px; text-align: center; font-size: 13px; font-weight: 600; color: #111827;">
          ${it.quantity}
        </td>
        <td style="padding: 10px 8px; text-align: right; font-size: 13px; color: #374151;">
          ${formatMoney(it.price)}
        </td>
        <td style="padding: 10px 8px; text-align: right; font-size: 13px; font-weight: 600; color: #111827;">
          ${formatMoney((it.price || 0) * (it.quantity || 1))}
        </td>
      </tr>
    `
    )
    .join('');

  const isPaid = order.payment_status === 'PAID';
  const paymentMethodLabel = order.payment_method === 'VIETQR' ? 'VIETQR' : 'COD';

  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="utf-8">
      <title>Đơn Hàng Mới #${order.order_code}</title>
    </head>
    <body style="margin: 0; padding: 20px 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111827;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 620px; background-color: #ffffff; border: 1px solid #d1d5db;">
        
        <!-- HEADER THƯƠNG HIỆU -->
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

        <!-- THÔNG TIN CHÍNH ĐƠN HÀNG -->
        <tr>
          <td style="padding: 20px 24px 16px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 12px 16px;">
              <tr>
                <td style="font-size: 13px; color: #374151; padding-bottom: 6px;">
                  Mã đơn hàng: <strong style="font-size: 14px; color: #111827; font-family: monospace;">#${order.order_code}</strong>
                </td>
                <td style="text-align: right; font-size: 12px; color: #6b7280;">
                  ${order.created_at ? new Date(order.created_at).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN')}
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

        <!-- KHỐI THÔNG TIN KHÁCH HÀNG -->
        <tr>
          <td style="padding: 0 24px 18px;">
            <div style="font-size: 12px; font-weight: 700; color: #111827; text-transform: uppercase; border-bottom: 1.5px solid #111827; padding-bottom: 6px; margin-bottom: 10px;">
              1. Người Nhận Hàng &amp; Địa Chỉ Giao
            </div>
            <table width="100%" cellpadding="4" cellspacing="0" style="font-size: 13px; color: #111827;">
              <tr>
                <td width="30%" style="color: #6b7280;">Họ và tên:</td>
                <td><strong>${order.customer_name}</strong></td>
              </tr>
              <tr>
                <td style="color: #6b7280;">Số điện thoại:</td>
                <td>
                  <a href="tel:${order.customer_phone}" style="color: #111827; font-weight: 700; text-decoration: none;">
                    ${order.customer_phone}
                  </a>
                </td>
              </tr>
              ${order.customer_email ? `
              <tr>
                <td style="color: #6b7280;">Email khách:</td>
                <td>${order.customer_email}</td>
              </tr>` : ''}
              <tr>
                <td style="color: #6b7280;">Địa chỉ giao hàng:</td>
                <td><strong>${order.customer_address}</strong></td>
              </tr>
              ${order.customer_note ? `
              <tr>
                <td style="color: #6b7280;">Ghi chú dặn dò:</td>
                <td>${order.customer_note}</td>
              </tr>` : ''}
            </table>
          </td>
        </tr>

        <!-- BẢNG DANH SÁCH DƯỢC LIỆU -->
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

        <!-- TỔNG KẾT TIỀN -->
        <tr>
          <td style="padding: 0 24px 22px;">
            <table width="100%" cellpadding="6" cellspacing="0" style="background-color: #f9fafb; border: 1px solid #e5e7eb; font-size: 13px;">
              <tr>
                <td style="color: #4b5563;">Tiền hàng tạm tính:</td>
                <td align="right" style="font-weight: 600; color: #111827;">${formatMoney(order.subtotal || 0)}</td>
              </tr>
              <tr>
                <td style="color: #4b5563;">Tiền phí giao hàng:</td>
                <td align="right" style="color: #374151;">
                  ${order.shipping_fee > 0 ? formatMoney(order.shipping_fee) : 'Miễn phí (Freeship)'}
                </td>
              </tr>
              <tr style="border-top: 1.5px solid #d1d5db;">
                <td style="font-size: 14px; font-weight: 700; color: #111827; padding-top: 10px;">
                  TỔNG CỘNG THU:
                </td>
                <td align="right" style="font-size: 16px; font-weight: 700; color: #111827; padding-top: 10px;">
                  ${formatMoney(order.total || 0)}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

// Bộ nhớ đệm chống gửi trùng lặp email cho cùng 1 đơn hàng (TTL: 30 phút)
const sentOrdersDeduplicationCache = new Map();

/**
 * Gửi email thông báo đơn hàng qua Google SMTP
 */
export const sendOrderEmailViaGoogleSmtp = async ({
  order,
  recipientEmail,
  senderEmail,
  senderAppPassword,
  subject,
  textBody,
}) => {
  const orderCode = order?.order_code;

  // 1. Kiểm tra chống gửi trùng lặp (Deduplication Guard)
  if (orderCode) {
    const lastSentTime = sentOrdersDeduplicationCache.get(orderCode);
    const now = Date.now();
    if (lastSentTime && now - lastSentTime < 1000 * 60 * 30) {
      console.log(
        `[GOOGLE SMTP DEDUP] Đơn hàng #${orderCode} đã được gửi email trước đó (${Math.round((now - lastSentTime) / 1000)}s trước). Tự động chặn để không gửi lặp!`
      );
      return {
        success: true,
        configured: true,
        deduplicated: true,
        message: `Đơn hàng #${orderCode} đã được gửi thông báo trước đó.`,
      };
    }
  }

  const mailer = getGoogleTransporter(senderEmail, senderAppPassword);

  // Luôn ưu tiên hòm thư thực tế của chủ shop trong .env, bỏ qua email mẫu 'tiemthaomocnganha@gmail.com'
  const isDummyEmail = !recipientEmail || recipientEmail === 'tiemthaomocnganha@gmail.com';
  const targetEmail = !isDummyEmail
    ? recipientEmail
    : (process.env.STORE_OWNER_EMAIL || process.env.SMTP_USER || 'hieunedz@gmail.com');

  const safeSubject = String(
    subject || `[ĐƠN HÀNG MỚI #${order?.order_code || ''}] Tiếp nhận đơn hàng mới`
  )
    .replace(/[\r\n]+/g, ' ')
    .slice(0, 150);

  // Nếu chưa cấu hình Google SMTP trong Admin hoặc .env
  if (!mailer) {
    console.log(
      `[GOOGLE SMTP] Chưa cấu hình SMTP_USER/SMTP_PASS (Admin hoặc backend/.env). Chờ fallback FormSubmit tới: ${targetEmail}`
    );
    return {
      success: true,
      configured: false,
      message:
        'Chưa cấu hình Google SMTP (Email gửi & Mật khẩu ứng dụng). Hệ thống sẽ chuyển sang kênh dự phòng.',
    };
  }

  const htmlContent = buildOrderHtmlTemplate(order);
  const fromEmail = mailer.smtpUser;

  const mailOptions = {
    from: `"Tiệm Thảo Dược Ngân Hà" <${fromEmail}>`,
    to: targetEmail,
    replyTo: order?.customer_email || fromEmail,
    subject: safeSubject,
    text: textBody || 'Thông báo đơn hàng mới từ Tiệm Thảo Dược Ngân Hà',
    html: htmlContent,
  };

  const info = await mailer.transporter.sendMail(mailOptions);
  console.log(`[GOOGLE SMTP SUCCESS] Đã gửi từ ${fromEmail} tới ${targetEmail}. MessageId: ${info.messageId}`);

  // Đánh dấu đơn hàng đã gửi thành công vào cache chống trùng
  if (orderCode) {
    sentOrdersDeduplicationCache.set(orderCode, Date.now());
  }

  return {
    success: true,
    configured: true,
    messageId: info.messageId,
    message: `Đã gửi thông báo đơn hàng từ ${fromEmail} đến Gmail chủ shop: ${targetEmail}`,
  };
};

/**
 * Kiểm tra xác thực tài khoản Google SMTP
 */
export const verifyGoogleSmtp = async () => {
  const mailer = getGoogleTransporter();
  if (!mailer) {
    return {
      success: false,
      configured: false,
      message: 'Chưa điền thông tin SMTP_USER và SMTP_PASS trong file backend/.env.',
    };
  }

  try {
    await mailer.transporter.verify();
    return {
      success: true,
      configured: true,
      message: `Kết nối thành công đến dịch vụ Google SMTP (${mailer.smtpUser}).`,
    };
  } catch (error) {
    console.error('[GOOGLE SMTP VERIFY FAILED]', error.message);
    let advice = 'Vui lòng kiểm tra lại cấu hình.';
    if (error.code === 'EAUTH' || error.message.includes('Username and Password not accepted')) {
      advice =
        'Mật khẩu ứng dụng Google không chính xác hoặc chưa được bật. Vui lòng vào Google Account -> Bảo mật -> Xác minh 2 bước -> Mật khẩu ứng dụng để tạo mật khẩu 16 chữ cái mới.';
    }
    return {
      success: false,
      configured: true,
      error: error.message,
      advice,
    };
  }
};

