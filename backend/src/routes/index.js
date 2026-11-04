import { Router } from 'express';
import { strictActionLimiter } from '../middlewares/rateLimiter.js';
import {
  sendOrderEmailViaGoogleSmtp,
  verifyGoogleSmtp,
} from '../services/emailService.js';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'NganHa Herbal Shop API Server is running safely (2026 Hardened)',
    timestamp: new Date().toISOString(),
  });
});

// Endpoint tự động gửi email thông báo đơn hàng cho chủ shop qua Google SMTP
router.post('/notifications/send-order-email', strictActionLimiter, async (req, res) => {
  try {
    const { order, recipientEmail, subject, body } = req.body;

    // Kiểm tra tính hợp lệ của dữ liệu đơn hàng
    if (!order || typeof order !== 'object' || !order.order_code) {
      return res.status(400).json({
        success: false,
        error: 'Dữ liệu đơn hàng không hợp lệ.',
      });
    }

    const result = await sendOrderEmailViaGoogleSmtp({
      order,
      recipientEmail,
      subject,
      textBody: body,
    });

    return res.json(result);
  } catch (error) {
    console.error('[EMAIL DISPATCH ERROR]', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Không thể gửi email thông báo qua Google SMTP.',
    });
  }
});

// Endpoint kiểm tra kết nối Google SMTP
router.get('/notifications/verify-smtp', async (req, res) => {
  try {
    const result = await verifyGoogleSmtp();
    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
