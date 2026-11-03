import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import apiRouter from './routes/index.js';

dotenv.config();

const app = express();

// Cho phép nhận diện đúng IP qua reverse proxy (Cloudflare, Nginx, Render, Railway...)
app.set('trust proxy', 1);

// Middlewares bảo mật & phân tích dữ liệu
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cache-Control cho các truy vấn GET (giúp 50-100 người dùng cùng xem không làm nghẽn máy chủ)
app.use((req, res, next) => {
  if (req.method === 'GET') {
    res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
  }
  next();
});

// Giới hạn tần suất truy vấn an toàn (chống spam bot nhưng đảm bảo 50-100 người dùng lướt nhanh không bị chặn)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 600, // Tối đa 600 yêu cầu / IP / 15 phút
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Hệ thống đang phục vụ lượng lớn khách truy cập, vui lòng thử lại sau ít phút.',
    },
  },
});

// Gắn tiền tố API cùng Rate Limiter
app.use('/api', apiLimiter, apiRouter);

// Root route
app.get('/', (req, res) => {
  res.send('🌿 Tiệm Thảo Mộc Ngân Hà - Backend API Server is running.');
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

// Xử lý lỗi toàn cục
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'Lỗi máy chủ nội bộ',
    },
  });
});

export default app;

