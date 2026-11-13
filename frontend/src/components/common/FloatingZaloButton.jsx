import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAdminStore } from '@/store/useAdminStore';

/**
 * Nút liên hệ Zalo nổi ở góc dưới bên phải trang người dùng.
 * Lấy số điện thoại Zalo chủ cửa hàng từ cấu hình Admin (useAdminStore).
 */
export const FloatingZaloButton = () => {
  const location = useLocation();
  const zaloPhone = useAdminStore((state) => state.settings?.zalo_phone);

  // Chỉ hiển thị ở các trang dành cho khách hàng, ẩn trong khu vực quản trị
  if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/quan-tri')) {
    return null;
  }

  const cleanPhone = String(zaloPhone || '0374276634').replace(/\D/g, '');
  if (!cleanPhone) {
    return null;
  }

  const zaloUrl = `https://zalo.me/${cleanPhone}`;

  return (
    <div className="fixed bottom-16 right-4 sm:bottom-20 sm:right-7 z-40 flex items-center group">
      {/* Nhãn gợi ý trượt ra khi di chuột trên màn hình lớn */}
      <span
        className="pointer-events-none mr-3 hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0068ff] text-white text-xs font-semibold rounded-full shadow-md opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap"
      >
        <span>Tư vấn qua Zalo!</span>
      </span>

      <a
        href={zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Nhắn tin Zalo chủ cửa hàng (${cleanPhone})`}
        className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#0068ff] hover:bg-[#0057d9] text-white shadow-[0_8px_24px_rgba(0,104,255,0.4)] transition-transform duration-300 hover:scale-110 active:scale-95 cursor-pointer"
      >
        {/* Vòng sóng lan tỏa (Pulse / Ripple Ring) */}
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-[#0068ff]/45 animate-ping pointer-events-none"
        />
        <span
          aria-hidden="true"
          className="absolute -inset-1.5 rounded-full border-2 border-[#0068ff]/35 animate-pulse pointer-events-none"
        />

        {/* Logo Zalo SVG sắc nét */}
        <svg
          viewBox="0 0 48 48"
          className="relative z-10 w-8 h-8 sm:w-9 sm:h-9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M24 6C13.507 6 5 13.45 5 22.64c0 5.18 2.7 9.81 6.95 12.86-.29 2.38-1.29 5.05-2.6 6.83-.31.42.06 1 .57.88 2.94-.68 6.46-2.08 8.33-3.21 1.83.46 3.76.71 5.75.71 10.493 0 19-7.45 19-16.64C43 13.45 34.493 6 24 6Z"
            fill="#FFFFFF"
          />
          <text
            x="24"
            y="26.5"
            textAnchor="middle"
            fill="#0068FF"
            fontSize="12.5"
            fontWeight="800"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            letterSpacing="-0.3"
          >
            Zalo
          </text>
        </svg>
      </a>
    </div>
  );
};

export default FloatingZaloButton;
