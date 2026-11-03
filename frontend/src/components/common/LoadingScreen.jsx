import React, { useState, useEffect } from 'react';
import { BrandLogoIcon } from './BrandLogoIcon';

const BOTANICAL_MESSAGES = [
  'Đang chuẩn bị tinh chất thảo mộc...',
  'Chắt lọc hương thơm thuần khiết từ thiên nhiên...',
  'Gìn giữ trọn vẹn dược tính tự nhiên...',
  'Sắp hoàn tất, an lòng chờ đợi trong giây lát...',
];

/**
 * Trình tải trang nghệ thuật phong cách Mộc Nhiên Thảo chuẩn Web 2026.
 * Kết hợp hiệu ứng hô hấp (breathing animation) của logo thảo mộc,
 * sóng khuếch tán tinh dầu và thanh tiến trình mượt mà.
 */
export const LoadingScreen = ({
  fullScreen = true,
  message,
  subMessage,
}) => {
  const [messageIndex, setMessageIndex] = useState(0);

  // Xoay vòng câu thông điệp an lành sau mỗi 2.2 giây
  useEffect(() => {
    if (message) return; // Nếu có custom message thì giữ nguyên
    const timer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % BOTANICAL_MESSAGES.length);
    }, 2200);
    return () => clearInterval(timer);
  }, [message]);

  const currentMessage = message || BOTANICAL_MESSAGES[messageIndex];

  const content = (
    <div className="flex flex-col items-center justify-center text-center px-6 max-w-md select-none">
      {/* Vùng Logo thảo mộc với vòng sóng khuếch tán (Diffusing Aura Rings) */}
      <div className="relative flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 mb-6">
        {/* Vòng lan tỏa 1 */}
        <span className="absolute inset-0 rounded-full bg-[#cee9d4]/30 animate-ping opacity-60 pointer-events-none"></span>

        {/* Vòng lan tỏa 2 có viền mỏng */}
        <span className="absolute -inset-3 rounded-full border border-[#d8c9aa]/60 animate-pulse pointer-events-none"></span>

        {/* Nền đệm tròn mềm mại */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-surface-container-low border border-border-herbal flex items-center justify-center shadow-md">
          {/* Logo thảo mộc chính xác của shop */}
          <div className="animate-pulse">
            <BrandLogoIcon className="w-12 h-12 sm:w-14 sm:h-14 text-primary transition-transform duration-700" />
          </div>
        </div>
      </div>

      {/* Tên thương hiệu phong cách Apothecary */}
      <p className="font-serif text-lg sm:text-xl font-bold text-primary tracking-wide mb-1.5">
        NgânHàshop
      </p>

      {/* Thông điệp tải mượt mà */}
      <p className="text-body-sm text-secondary font-medium transition-opacity duration-500 min-h-[1.5rem]">
        {currentMessage}
      </p>

      {subMessage && (
        <p className="text-xs text-on-surface-variant/70 mt-1">
          {subMessage}
        </p>
      )}

      {/* Thanh tiến trình thảo mộc chuyển động vô hạn (Infinite Herb Stream) */}
      <div className="w-48 sm:w-56 h-1 bg-[#eae8e1] rounded-full overflow-hidden mt-5 relative">
        <div className="h-full bg-gradient-to-r from-[#d8c9aa] via-[#1f3627] to-[#54634c] rounded-full w-2/5 animate-[loading-bar_1.6s_ease-in-out_infinite]"></div>
      </div>

      <span className="text-[11px] text-[#8a7258] mt-3 tracking-widest uppercase">
        ĐƠN GIẢN • TINH TẾ • AN LÀNH
      </span>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="fixed inset-0 z-[999] bg-surface/95 backdrop-blur-md flex items-center justify-center transition-opacity duration-300"
        role="status"
        aria-live="polite"
      >
        {content}
      </div>
    );
  }

  return (
    <div className="w-full py-16 flex items-center justify-center" role="status">
      {content}
    </div>
  );
};

/**
 * Biểu tượng xoay tải nhỏ (Inline Spinner) dùng cho nút bấm hoặc card tải
 */
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3',
  };

  return (
    <div
      className={`inline-block rounded-full border-solid border-primary/25 border-t-primary animate-spin ${
        sizeMap[size] || sizeMap.md
      } ${className}`}
      role="status"
      aria-label="Đang tải"
    >
      <span className="sr-only">Đang tải...</span>
    </div>
  );
};

export default LoadingScreen;

