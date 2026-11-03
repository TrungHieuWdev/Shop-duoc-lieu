import React from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

/**
 * Banner thông báo trạng thái Internet phong cách Dynamic Pill chuẩn Web 2026.
 * Nổi ở đầu màn hình với hiệu ứng kính mờ (glassmorphism),
 * không che chắn nội dung chính nhưng đảm bảo người dùng nắm bắt tức thì.
 */
export const NetworkBanner = () => {
  const { isOnline, isReconnected, isChecking, checkConnection } = useNetworkStatus();

  // Khi đang online bình thường và không ở trạng thái vừa khôi phục -> ẩn banner
  if (isOnline && !isReconnected) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-3 sm:top-5 inset-x-0 z-[100] flex justify-center px-4 pointer-events-none transition-all duration-300 ease-out"
    >
      {!isOnline ? (
        /* Trạng thái mất kết nối Internet */
        <div className="pointer-events-auto max-w-xl w-full sm:w-auto bg-[#3a1a12]/95 backdrop-blur-md text-[#ffdad6] border border-[#ba1a1a]/40 shadow-xl rounded-2xl sm:rounded-full px-4 py-2.5 sm:px-6 sm:py-3 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 animate-pulse-gentle">
          <div className="flex items-center gap-3">
            {/* Vòng nhấp nháy báo động đỏ */}
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>

            <span className="material-symbols-outlined text-[1.25rem] text-red-300 shrink-0">
              wifi_off
            </span>

            <div className="text-left">
              <p className="text-xs sm:text-sm font-medium leading-tight">
                Mất kết nối Internet
              </p>
              <p className="text-[11px] sm:text-xs text-[#ffb4ab] leading-tight mt-0.5">
                Vui lòng kiểm tra Wi-Fi / 4G của bạn
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => checkConnection()}
              disabled={isChecking}
              className="px-3 py-1 bg-[#ffdad6] hover:bg-white text-[#3a1a12] text-xs font-semibold rounded-full transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
            >
              <span
                className={`material-symbols-outlined text-[1rem] ${
                  isChecking ? 'animate-spin' : ''
                }`}
              >
                refresh
              </span>
              <span>{isChecking ? 'Đang thử...' : 'Thử lại'}</span>
            </button>

            <a
              href="tel:19006826"
              className="text-xs text-[#ffdad6]/80 hover:text-white underline underline-offset-2 px-1 hidden sm:inline"
            >
              Hotline 1900 6826
            </a>
          </div>
        </div>
      ) : (
        /* Trạng thái vừa khôi phục kết nối thành công */
        <div className="pointer-events-auto bg-[#1f3627]/95 backdrop-blur-md text-[#cee9d4] border border-[#354d3d] shadow-xl rounded-full px-5 py-2.5 flex items-center gap-2.5 transition-transform duration-300 transform translate-y-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#cee9d4] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
          </span>

          <span className="material-symbols-outlined text-[1.25rem] text-emerald-300">
            wifi
          </span>

          <p className="text-xs sm:text-sm font-medium">
            Đã khôi phục kết nối Internet! Chúc bạn trải nghiệm an lành.
          </p>
        </div>
      )}
    </div>
  );
};

export default NetworkBanner;

