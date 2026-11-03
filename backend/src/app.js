import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import apiRouter from './routes/index.js';

dotenv.config();

const app = express();

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

// Gắn tiền tố API
app.use('/api', apiRouter);

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

