/**
 * LỚP LÁ CHẮN AN NINH BẢO VỆ API (API SHIELD 2026)
 * Tiệm Thảo Mộc Ngân Hà
 * 
 * 1. Tarpit & Anti-Reconnaissance: Chặn đứng các công cụ dò quét cổng (Ffuf, Dirsearch, Gobuster, Nmap)
 * 2. Client Signature Validation: Xác thực chữ ký bí mật của ứng dụng chính chủ
 * 3. Ngăn chặn hacker gọi trực tiếp API từ bên ngoài hoặc script phá hoại
 */

// Danh sách các đường dẫn dò quét phổ biến của hacker
const MALICIOUS_PROBE_PATTERNS = [
  /\/\.env/i,
  /\/\.git/i,
  /\/wp-admin/i,
  /\/wp-login/i,
  /\/phpmyadmin/i,
  /\/swagger/i,
  /\/actuator/i,
  /\/eval/i,
  /\/dump/i,
  /\/shell/i,
  /\/config\.json/i,
  /\/database/i,
  /\/backup/i,
];

// Danh sách IP bị tạm khóa do dò quét trái phép (In-memory blacklist)
const blockedIps = new Map();

export const apiShield = (req, res, next) => {
  const clientIp = req.ip || req.connection?.remoteAddress || 'unknown';

  // 1. Kiểm tra xem IP có đang nằm trong danh sách đen do dò quét trái phép không
  if (blockedIps.has(clientIp)) {
    const expireTime = blockedIps.get(clientIp);
    if (Date.now() < expireTime) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'IP_BLOCKED',
          message: 'Địa chỉ IP của bạn bị tạm ngắt kết nối do phát hiện hành vi dò quét hệ thống.',
        },
      });
    } else {
      blockedIps.delete(clientIp);
    }
  }

  const requestedPath = req.originalUrl || req.url;

  // 2. Tarpit Honeypot: Nếu truy cập vào các đường dẫn quét bot của hacker -> Khóa ngay IP trong 30 phút
  const isMaliciousProbe = MALICIOUS_PROBE_PATTERNS.some((pattern) => pattern.test(requestedPath));
  if (isMaliciousProbe) {
    console.warn(`[API SHIELD DETECTED] Phát hiện hành vi dò quét từ IP: ${clientIp} vào đường dẫn: ${requestedPath}`);
    blockedIps.set(clientIp, Date.now() + 30 * 60 * 1000); // Khóa 30 phút
    return res.status(403).json({
      success: false,
      error: {
        code: 'ACCESS_DENIED',
        message: 'Hành vi dò quét hệ thống bị cấm và đã được ghi lại nhật ký an ninh.',
      },
    });
  }

  // 3. Ngoại lệ cho đường dẫn kiểm tra sức khỏe hệ thống (Health Check)
  if (requestedPath === '/api/health' || requestedPath === '/') {
    return next();
  }

  // 4. Xác thực chữ ký Client (Chỉ chấp nhận yêu cầu từ Web App chính chủ Ngân Hà)
  const clientSignature = req.headers['x-nganha-client-signature'];
  const origin = req.headers['origin'] || req.headers['referer'] || '';

  // Chấp nhận nếu có chữ ký chính chủ HOẶC từ localhost / domain chính thức nganhashop.pages.dev
  const isOfficialOrigin =
    origin.includes('localhost') ||
    origin.includes('pages.dev') ||
    origin.includes('nganha');

  const isValidSignature = clientSignature === 'nganha_sec_2026_shield_v1';

  if (!isValidSignature && !isOfficialOrigin && req.method !== 'GET') {
    return res.status(403).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED_API_CALL',
        message: 'Yêu cầu API bị từ chối do thiếu chữ ký xác thực an toàn từ ứng dụng.',
      },
    });
  }

  next();
};

