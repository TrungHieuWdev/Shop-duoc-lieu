import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Khởi tạo Connection Pool cho MySQL - Tối ưu cho 50-100 người dùng truy cập đồng thời
export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'herbal_shop',
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 30, // Hỗ trợ 30-50 kết nối đồng thời mượt mà
  maxIdle: 15, // Giữ sẵn 15 kết nối rảnh rỗi trong bộ nhớ để phản hồi tức thì
  idleTimeout: 60000, // Đóng kết nối nhàn rỗi sau 60 giây để tiết kiệm RAM
  queueLimit: 150, // Hàng đợi an toàn lên đến 150 truy vấn khi cao điểm
  enableKeepAlive: true, // Giữ kết nối TCP sống, loại bỏ độ trễ bắt tay TCP lặp lại
  keepAliveInitialDelay: 10000,
});

export const testDbConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Đã kết nối thành công đến cơ sở dữ liệu MySQL (herbal_shop)');
    connection.release();
    return true;
  } catch (error) {
    console.warn('⚠️ Chưa thể kết nối MySQL (Hãy đảm bảo MySQL đang chạy và đúng mật khẩu trong .env):', error.message);
    return false;
  }
};

export default pool;

