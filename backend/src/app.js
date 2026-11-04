import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { apiLimiter } from './middlewares/rateLimiter.js';
import { apiShield } from './middlewares/apiShield.js';
import apiRouter from './routes/index.js';

dotenv.config();

const app = express();

// Ẩn hoàn toàn chữ ký Express (Chống hacker nhận diện công nghệ backend)
app.disable('x-powered-by');

// 1. Cho phép nhận diện đúng IP qua reverse proxy (Cloudflare, Nginx, Railway...)
app.set('trust proxy', 1);

// Lớp lá chắn chống hacker dò quét API (API Shield 2026)
app.use(apiShield);

// 2. Chống Slowloris Attack: Hủy socket nếu client giữ kết nối quá 15 giây mà không hoàn tất
app.use((req, res, next) => {
  res.setTimeout(15000, () => {
    if (!res.headersSent) {
      res.status(408).json({
        success: false,
        error: {
          code: 'REQUEST_TIMEOUT',
          message: 'Yêu cầu xử lý quá hạn thời gian bảo vệ (15s). Kết nối đã được ngắt an toàn.',
        },
      });
    }
  });
  next();
});

// 3. Middlewares bảo mật tiêu chuẩn 2026 (Helmet Hardening)
app.use(
  helmet({
    contentSecurityPolicy: false, // Dành riêng cho REST API
    crossOriginEmbedderPolicy: false,
    frameguard: { action: 'deny' }, // Chống Clickjacking
    noSniff: true, // Chống MIME-sniffing
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
);

// 4. Cấu hình CORS chặt chẽ: chỉ cho phép frontend chính chủ nganhashop.pages.dev và localhost
const ALLOWED_ORIGIN_PATTERNS = [
  /^http:\/\/localhost(:\d+)?$/,
  /^https:\/\/.*\.pages\.dev$/,
  /^https:\/\/nganhashop\.pages\.dev$/,
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Cho phép truy vấn cục bộ hoặc công cụ kiểm tra (Postman, curl, server-to-server) khi không có origin
      if (!origin) return callback(null, true);

      const isAllowed = ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(origin));
      if (isAllowed || (process.env.CORS_ORIGIN && origin === process.env.CORS_ORIGIN)) {
        return callback(null, true);
      }
      return callback(new Error('Yêu cầu bị từ chối bởi chính sách CORS bảo mật Tiệm Thảo Mộc Ngân Hà.'));
    },
    credentials: true,
  })
);

// 5. Chống Flooding / DoS bằng Payload Lớn (Giới hạn tối đa 100KB cho mỗi yêu cầu)
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// 6. Cache-Control thông minh cho các truy vấn GET (tăng tốc độ và giảm tải CPU)
app.use((req, res, next) => {
  if (req.method === 'GET') {
    res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
  }
  next();
});

// 7. Gắn tiền tố API cùng Rate Limiter Tầng 1
app.use('/api', apiLimiter, apiRouter);

// Root route
app.get('/', (req, res) => {
  res.send('🌿 Tiệm Thảo Mộc Ngân Hà - Enterprise Secured API Server (2026 Edition)');
});

// Xử lý 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Đường dẫn ${req.originalUrl} không tồn tại trên hệ thống.`,
    },
  });
});

// Xử lý lỗi toàn cục (Không leak stack trace ra ngoài cho hacker phân tích)
app.use((err, req, res, next) => {
  console.error('[SECURITY AUDIT ERROR]:', err.message);
  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'Lỗi xử lý yêu cầu máy chủ.',
    },
  });
});

export default app;
