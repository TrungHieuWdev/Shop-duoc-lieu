import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Khởi tạo Connection Pool cho MySQL
export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'herbal_shop',
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: 0,
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

