import React, { useState } from 'react';
import { BrandLogoIcon } from './BrandLogoIcon';
import { BotanicalDivider } from './BotanicalDivider';

/**
 * Màn hình toàn trang báo mất kết nối Internet chuẩn Web 2026.
 * Giúp người dùng không bị bỡ ngỡ, cung cấp hướng dẫn kiểm tra và số điện thoại hỗ trợ.
 */
export const OfflineScreen = ({ onRetry }) => {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async () => {
    setRetrying(true);
    if (onRetry) {
      await onRetry();
    } else {
      window.location.reload();
    }
    setTimeout(() => setRetrying(false), 1200);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="max-w-xl w-full mx-auto text-center relative z-10">
        {/* Biểu tượng thảo mộc & sóng tín hiệu */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-surface-container-high flex items-center justify-center border border-border-herbal shadow-inner">
            <span className="material-symbols-outlined text-[3rem] text-[#8a7258] animate-pulse">
              cloud_off
            </span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#50250e] text-white flex items-center justify-center border-2 border-surface shadow">
            <span className="material-symbols-outlined text-[1.125rem]">
              signal_wifi_off
            </span>
          </div>
        </div>

        {/* Tiêu đề & Thông điệp phong cách Dược Thảo */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary mb-3">
          Đường Truyền Tạm Gián Đoạn
        </h2>
        <p className="text-body-sm text-on-surface-variant max-w-md mx-auto mb-5 leading-relaxed">
          Không thể kết nối đến máy chủ thảo mộc. Vui lòng kiểm tra lại sóng Wi-Fi hoặc dữ liệu 4G/5G trên thiết bị của bạn.
        </p>

        {/* Đường kẻ thảo mộc nghệ thuật */}
        <div className="flex justify-center my-4">
          <BotanicalDivider />
        </div>

        {/* Gợi ý xử lý nhanh */}
        <div className="bg-surface-container-low border border-border-herbal rounded-xl p-4 sm:p-5 mb-8 text-left max-w-md mx-auto shadow-sm">
          <p className="text-xs uppercase tracking-wider font-semibold text-secondary mb-3 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[1rem]">tips_and_updates</span>
            Gợi ý khắc phục nhanh:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-on-surface-variant">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Kiểm tra lại công tắc Wi-Fi hoặc dữ liệu di động (4G/5G).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Thử bật/tắt chế độ máy bay để làm mới địa chỉ mạng.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Nếu cần mua gấp, bấm gọi hotline hỗ trợ đặt hàng ngay bên dưới.</span>
            </li>
          </ul>
        </div>

        {/* Cụm nút hành động */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary-container text-on-primary font-medium rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            <span
              className={`material-symbols-outlined text-[1.25rem] ${
                retrying ? 'animate-spin' : ''
              }`}
            >
              refresh
            </span>
            <span>{retrying ? 'Đang kiểm tra kết nối...' : 'Thử tải lại trang'}</span>
          </button>

          <a
            href="tel:19006826"
            className="w-full sm:w-auto px-6 py-3 bg-surface-container-lowest hover:bg-surface-container border border-border-herbal text-primary font-medium rounded-lg transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[1.25rem] text-[#54634c]">
              call
            </span>
            <span>Hotline 1900 6826</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default OfflineScreen;

