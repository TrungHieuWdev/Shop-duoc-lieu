import app from './app.js';
import { testDbConnection } from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`====================================================`);
  console.log(`🌿 Backend Server đang chạy tại: http://localhost:${PORT}`);
  console.log(`📡 Health check endpoint: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
  
  // Kiểm tra kết nối Database
  await testDbConnection();
});

