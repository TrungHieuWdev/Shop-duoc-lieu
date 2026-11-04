import rateLimit from 'express-rate-limit';

// Tầng 1: Giới hạn toàn bộ API (chống bot quét dữ liệu hàng loạt)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 300, // Tối đa 300 yêu cầu / IP / 15 phút
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Hệ thống phát hiện tần suất yêu cầu cao bất thường. Vui lòng thử lại sau ít phút.',
    },
  },
});

// Tầng 2: Giới hạn nghiêm ngặt cho gửi thư / tạo đơn (chống bom thư, spam đơn giả mạo)
export const strictActionLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 phút
  max: 15, // Tối đa 15 yêu cầu / IP / 10 phút
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'ACTION_RATE_LIMITED',
      message: 'Bạn đã thực hiện thao tác quá nhiều lần trong thời gian ngắn. Vui lòng chờ 10 phút để đảm bảo an toàn.',
    },
  },
});

// Tầng 3: Giới hạn đăng nhập quản trị (chống brute-force tấn công mật khẩu)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 5, // Tối đa 5 lần thử / 15 phút
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'AUTH_RATE_LIMITED',
      message: 'Quá số lần đăng nhập cho phép. Vui lòng thử lại sau 15 phút.',
    },
  },
});

