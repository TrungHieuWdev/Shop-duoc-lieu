import { Router } from 'express';
import nodemailer from 'nodemailer';
import { strictActionLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'NganHa Herbal Shop API Server is running safely (2026 Hardened)',
    timestamp: new Date().toISOString(),
  });
});

// Endpoint tự động gửi email thông báo đơn hàng cho chủ shop (Có Strict Rate Limiter 15 lần/10 phút)
router.post('/notifications/send-order-email', strictActionLimiter, async (req, res) => {
  try {
    const { order, recipientEmail, subject, body } = req.body;
    
    // Kiểm tra định dạng cơ bản để phòng spam
    if (!order || typeof order !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Dữ liệu đơn hàng không hợp lệ.',
      });
    }

    const targetEmail = recipientEmail || process.env.STORE_OWNER_EMAIL || 'tiemthaomocnganha@gmail.com';

    // Rút gọn & làm sạch tiêu đề và nội dung để chống Mail Header Injection
    const safeSubject = String(subject || `[ĐƠN HÀNG MỚI #${order?.order_code || ''}] Tiếp nhận đơn hàng`)
      .replace(/[\r\n]+/g, ' ')
      .slice(0, 150);
    const safeBody = String(body || '').slice(0, 5000);

    console.log(`[EMAIL DISPATCH] Đang gửi thông báo đơn hàng #${order?.order_code || ''} tới: ${targetEmail}`);

    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpUser && smtpPass && smtpUser !== 'your_store_system_email@gmail.com') {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"Tiệm Thảo Mộc Ngân Hà" <${smtpUser}>`,
        to: targetEmail,
        subject: safeSubject,
        text: safeBody,
      });

      console.log(`[EMAIL DISPATCH] Đã gửi email thành công tới ${targetEmail} qua SMTP`);
      return res.json({
        success: true,
        message: `Đã gửi thông báo đơn hàng tới ${targetEmail} thành công!`,
      });
    } else {
      console.log(`[EMAIL DISPATCH] Đã ghi nhận log gửi email an toàn tới: ${targetEmail}`);
      return res.json({
        success: true,
        mock: true,
        message: `Đã ghi nhận yêu cầu gửi email tới ${targetEmail}`,
      });
    }
  } catch (error) {
    console.error('[EMAIL DISPATCH ERROR]', error.message);
    return res.status(500).json({
      success: false,
      error: 'Không thể xử lý gửi email thông báo vào thời điểm hiện tại.',
    });
  }
});

export default router;
