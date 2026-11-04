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

export const getGoogleTransporter = () => {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass || smtpUser === 'your_store_system_email@gmail.com') {
    return null;
  }

  // Google SMTP hỗ trợ chuẩn cổng 465 (SSL) hoặc 587 (TLS)
  const smtpPort = Number(process.env.SMTP_PORT) || 465;
  const isSecure = smtpPort === 465;

  return nodemailer.createTransport({
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
  });
};

/**
 * Tạo giao diện HTML Email hóa đơn chuyên nghiệp, mộc mạc gửi đến Gmail chủ shop
 */
export const buildOrderHtmlTemplate = (order) => {
  const itemsRows = (order.items || [])
    .map(
      (it, idx) => `
      <tr style="border-bottom: 1px solid #eae5db;">
        <td style="padding: 10px 8px; font-size: 13px; color: #1d3527;">
          <strong>${idx + 1}. ${it.name}</strong>
          <div style="font-size: 11px; color: #7d8b80;">Quy cách: ${it.unit || 'Gói/Túi'}</div>
        </td>
        <td style="padding: 10px 8px; text-align: center; font-size: 13px; font-weight: bold; color: #1d3527;">
          ${it.quantity}
        </td>
        <td style="padding: 10px 8px; text-align: right; font-size: 13px; color: #554d42;">
          ${formatMoney(it.price)}
        </td>
        <td style="padding: 10px 8px; text-align: right; font-size: 13px; font-weight: bold; color: #1d3527;">
          ${formatMoney((it.price || 0) * (it.quantity || 1))}
        </td>
      </tr>
    `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="utf-8">
      <title>Đơn Hàng Mới #${order.order_code}</title>
    </head>
    <body style="margin: 0; padding: 20px 0; background-color: #f5f2eb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 620px; background-color: #ffffff; border: 1px solid #ded7ca; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        
        <!-- HEADER THƯƠNG HIỆU -->
        <tr>
          <td style="background-color: #1d3527; padding: 24px 24px 20px; text-align: center; border-bottom: 3px solid #d4b986;">
            <div style="font-size: 20px; font-weight: bold; color: #d4b986; letter-spacing: 1px; text-transform: uppercase;">
              🌿 TIỆM THẢO MỘC NGÂN HÀ
            </div>
            <div style="font-size: 12px; color: #d6dfd3; margin-top: 4px; letter-spacing: 0.5px;">
              Đơn giản • Tinh tế • An lành
            </div>
            <div style="margin-top: 14px; display: inline-block; background-color: rgba(212, 185, 134, 0.2); border: 1px solid #d4b986; padding: 6px 14px; border-radius: 20px; color: #ffffff; font-size: 12px; font-weight: bold;">
              🔔 CÓ ĐƠN ĐẶT HÀNG MỚI CẦN ĐI ĐƠN
            </div>
          </td>
        </tr>

        <!-- THÔNG TIN CHÍNH ĐƠN HÀNG -->
        <tr>
          <td style="padding: 24px 24px 16px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #faf8f5; border: 1px solid #eae5db; border-radius: 6px; padding: 14px 16px;">
              <tr>
                <td style="font-size: 13px; color: #554d42; padding-bottom: 6px;">
                  Mã đơn hàng: <strong style="font-size: 15px; color: #1d3527; font-family: monospace;">#${order.order_code}</strong>
                </td>
                <td style="text-align: right; font-size: 12px; color: #7d8b80;">
                  ${order.created_at ? new Date(order.created_at).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN')}
                </td>
              </tr>
              <tr>
                <td colspan="2" style="font-size: 12px; color: #554d42;">
                  Trạng thái thanh toán: 
                  <strong style="color: ${order.payment_status === 'PAID' ? '#166534' : '#b45309'}; background: ${order.payment_status === 'PAID' ? '#dcfce7' : '#fef3c7'}; padding: 2px 8px; border-radius: 4px; display: inline-block;">
                    ${order.payment_status === 'PAID' ? '✓ ĐÃ THANH TOÁN (VIETQR NAPAS247)' : '• CHỜ THANH TOÁN (COD / CHUYỂN KHOẢN)'}
                  </strong>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- KHỐI THÔNG TIN KHÁCH HÀNG -->
        <tr>
          <td style="padding: 0 24px 16px;">
            <div style="font-size: 13px; font-weight: bold; color: #1d3527; text-transform: uppercase; border-bottom: 2px solid #1d3527; padding-bottom: 6px; margin-bottom: 10px;">
              👤 1. Người Nhận Hàng &amp; Địa Chỉ Giao
            </div>
            <table width="100%" cellpadding="4" cellspacing="0" style="font-size: 13px; color: #333333;">
              <tr>
                <td width="30%" style="color: #666666;">Họ và tên:</td>
                <td><strong style="color: #1d3527;">${order.customer_name}</strong></td>
              </tr>
              <tr>
                <td style="color: #666666;">Số điện thoại:</td>
                <td>
                  <a href="tel:${order.customer_phone}" style="color: #2d7d46; font-weight: bold; text-decoration: none; font-size: 14px;">
                    📞 ${order.customer_phone} (Bấm để gọi ngay)
                  </a>
                </td>
              </tr>
              ${order.customer_email ? `
              <tr>
                <td style="color: #666666;">Email khách:</td>
                <td>${order.customer_email}</td>
              </tr>` : ''}
              <tr>
                <td style="color: #666666;">Địa chỉ giao hàng:</td>
                <td><strong style="color: #1d3527;">${order.customer_address}</strong></td>
              </tr>
              <tr>
                <td style="color: #666666;">Ghi chú dặn dò:</td>
                <td style="color: #b45309; font-style: italic;">${order.customer_note || 'Không có ghi chú thêm'}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- BẢNG DANH SÁCH DƯỢC LIỆU -->
        <tr>
          <td style="padding: 0 24px 16px;">
            <div style="font-size: 13px; font-weight: bold; color: #1d3527; text-transform: uppercase; border-bottom: 2px solid #1d3527; padding-bottom: 6px; margin-bottom: 10px;">
              📦 2. Danh Sách Dược Liệu Cần Soạn Đi Đơn (${order.items?.length || 0} món)
            </div>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
              <thead>
                <tr style="background-color: #faf8f5; border-bottom: 2px solid #ded7ca; font-size: 12px; color: #7d8b80; text-transform: uppercase;">
                  <th align="left" style="padding: 8px;">Tên Vị Dược Liệu</th>
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
          <td style="padding: 0 24px 24px;">
            <table width="100%" cellpadding="6" cellspacing="0" style="background-color: #faf8f5; border: 1px solid #eae5db; border-radius: 6px; font-size: 13px;">
              <tr>
                <td style="color: #666666;">Tiền hàng tạm tính:</td>
                <td align="right" style="font-weight: bold; color: #1d3527;">${formatMoney(order.subtotal || 0)}</td>
              </tr>
              <tr>
                <td style="color: #666666;">Tiền phí giao hàng:</td>
                <td align="right" style="color: #554d42;">
                  ${order.shipping_fee > 0 ? formatMoney(order.shipping_fee) : '<span style="color: #166534; font-weight: bold;">Miễn phí (Freeship)</span>'}
                </td>
              </tr>
              <tr style="border-top: 2px solid #ded7ca;">
                <td style="font-size: 15px; font-weight: bold; color: #1d3527; padding-top: 10px;">
                  TỔNG CỘNG THU:
                </td>
                <td align="right" style="font-size: 18px; font-weight: bold; color: #b45309; padding-top: 10px;">
                  ${formatMoney(order.total || 0)}
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER & NHẮC NHỞ -->
        <tr>
          <td style="background-color: #faf8f5; padding: 18px 24px; text-align: center; border-top: 1px solid #eae5db; font-size: 12px; color: #7d8b80; line-height: 1.6;">
            <div>💡 <em>Chủ shop vui lòng kiểm tra số lượng dược liệu trong kho, đóng gói túi zip cẩn thận và liên hệ bưu cục/shipper giao hàng.</em></div>
            <div style="margin-top: 6px; font-size: 11px; color: #a89f91;">
              Hệ thống thông báo tự động từ Website Tiệm Thảo Mộc Ngân Hà © 2026.
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

/**
 * Gửi email thông báo đơn hàng qua Google SMTP
 */
export const sendOrderEmailViaGoogleSmtp = async ({ order, recipientEmail, subject, textBody }) => {
  const transporter = getGoogleTransporter();

  const targetEmail =
    recipientEmail || process.env.STORE_OWNER_EMAIL || 'tiemthaomocnganha@gmail.com';

  const safeSubject = String(
    subject || `[ĐƠN HÀNG MỚI #${order?.order_code || ''}] Tiếp nhận đơn hàng mới`
  )
    .replace(/[\r\n]+/g, ' ')
    .slice(0, 150);

  // Nếu chưa cấu hình Google SMTP trong .env
  if (!transporter) {
    console.log(
      `[GOOGLE SMTP] Chưa cấu hình SMTP_USER hoặc SMTP_PASS trong file backend/.env. Ghi nhận log mô phỏng tới: ${targetEmail}`
    );
    return {
      success: true,
      configured: false,
      message:
        'Hệ thống đã ghi nhận đơn hàng. Để nhận email tự động thật, vui lòng cấu hình tài khoản Gmail và Mật khẩu ứng dụng 16 ký tự trong file backend/.env.',
    };
  }

  const htmlContent = buildOrderHtmlTemplate(order);
  const fromEmail = process.env.SMTP_USER;

  const mailOptions = {
    from: `"Tiệm Thảo Mộc Ngân Hà" <${fromEmail}>`,
    to: targetEmail,
    subject: safeSubject,
    text: textBody || 'Thông báo đơn hàng mới từ Tiệm Thảo Mộc Ngân Hà',
    html: htmlContent,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`[GOOGLE SMTP SUCCESS] Đã gửi thành công thư tới ${targetEmail}. MessageId: ${info.messageId}`);

  return {
    success: true,
    configured: true,
    messageId: info.messageId,
    message: `Đã gửi thông báo đơn hàng thành công đến Gmail: ${targetEmail}`,
  };
};

/**
 * Kiểm tra xác thực tài khoản Google SMTP
 */
export const verifyGoogleSmtp = async () => {
  const transporter = getGoogleTransporter();
  if (!transporter) {
    return {
      success: false,
      configured: false,
      message: 'Chưa điền thông tin SMTP_USER và SMTP_PASS trong file backend/.env.',
    };
  }

  try {
    await transporter.verify();
    return {
      success: true,
      configured: true,
      message: `Kết nối thành công đến dịch vụ Google SMTP (${process.env.SMTP_USER}).`,
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

