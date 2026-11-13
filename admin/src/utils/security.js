/**
 * BỘ TIÊU CHUẨN AN NINH & BẢO MẬT DỮ LIỆU CHUẨN 2026
 * Tiệm Thảo Mộc Ngân Hà
 * 
 * Bảo vệ chống:
 * 1. XSS (Cross-Site Scripting) - Làm sạch dữ liệu khách hàng trước khi hiển thị/lưu trữ
 * 2. Form Flooding & Spam Bot - Chặn các yêu cầu gửi liên tục
 * 3. Payload Injection & Memory Exhaustion - Giới hạn độ dài chuỗi
 */

// Làm sạch chuỗi văn bản, loại bỏ hoàn toàn các thẻ HTML, script, iframe nguy hiểm
export const sanitizeInput = (text, maxLength = 500) => {
  if (typeof text !== 'string') return '';
  
  return text
    .trim()
    // Loại bỏ thẻ HTML/script/iframe/onclick/javascript:
    .replace(/<[^>]*>?/gm, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    // Cắt bớt nếu vượt quá độ dài tối đa chống tấn công làm tràn bộ nhớ
    .slice(0, maxLength);
};

// Kiểm tra số điện thoại di động Việt Nam chuẩn (10 chữ số)
export const isValidVietnamesePhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  const cleanPhone = phone.trim().replace(/\s+/g, '');
  const phoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;
  return phoneRegex.test(cleanPhone);
};

// Kiểm tra định dạng Email hợp lệ
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
};

// Rate limiter phía client chống spam click / bot gửi hàng ngàn đơn hàng mỗi giây
const actionTimestamps = new Map();

export const checkClientThrottle = (actionKey, maxCalls = 3, windowMs = 10000) => {
  const now = Date.now();
  const timestamps = (actionTimestamps.get(actionKey) || []).filter(
    (t) => now - t < windowMs
  );

  if (timestamps.length >= maxCalls) {
    const oldest = timestamps[0];
    const waitSeconds = Math.ceil((windowMs - (now - oldest)) / 1000);
    return {
      allowed: false,
      waitSeconds,
      message: `Hệ thống phát hiện thao tác quá nhanh. Vui lòng chờ ${waitSeconds} giây để tiếp tục.`,
    };
  }

  timestamps.push(now);
  actionTimestamps.set(actionKey, timestamps);
  return { allowed: true, waitSeconds: 0 };
};

