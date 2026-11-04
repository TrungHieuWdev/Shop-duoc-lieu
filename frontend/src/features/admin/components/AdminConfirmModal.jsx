import React, { useEffect } from 'react';

/**
 * Modal Xác Nhận Thao Tác Chuẩn Admin 2026 ERP
 * - Thiết kế hoàn toàn rounded-none, phẳng, sắc nét, viền 1px
 * - Bắt buộc xác nhận trước mọi hành vi thay đổi dữ liệu trên trang quản trị
 */
export const AdminConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Xác Nhận Thay Đổi',
  subtitle = 'Thao tác trên hệ thống quản trị',
  message,
  confirmText = 'Xác Nhận Thay Đổi',
  cancelText = 'Hủy Bỏ',
  variant = 'primary', // 'primary' | 'danger' | 'warning' | 'info'
  icon = 'published_with_changes',
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const colorStyles = {
    primary: {
      btn: 'bg-[#2d7d46] hover:bg-[#236838] text-white',
      badge: 'bg-green-100 text-green-800 border-green-300',
      iconColor: 'text-[#2d7d46]',
      accentBorder: 'border-l-4 border-l-[#2d7d46]',
    },
    danger: {
      btn: 'bg-red-700 hover:bg-red-800 text-white',
      badge: 'bg-red-100 text-red-800 border-red-300',
      iconColor: 'text-red-700',
      accentBorder: 'border-l-4 border-l-red-600',
    },
    warning: {
      btn: 'bg-amber-700 hover:bg-amber-800 text-white',
      badge: 'bg-amber-100 text-amber-800 border-amber-300',
      iconColor: 'text-amber-700',
      accentBorder: 'border-l-4 border-l-amber-600',
    },
    info: {
      btn: 'bg-[#14261a] hover:bg-[#233f2c] text-[#cbb07c]',
      badge: 'bg-[#cbb07c]/20 text-[#8a7258] border-[#cbb07c]/40',
      iconColor: 'text-[#cbb07c]',
      accentBorder: 'border-l-4 border-l-[#cbb07c]',
    },
  }[variant] || {
    btn: 'bg-[#2d7d46] hover:bg-[#236838] text-white',
    badge: 'bg-green-100 text-green-800 border-green-300',
    iconColor: 'text-[#2d7d46]',
    accentBorder: 'border-l-4 border-l-[#2d7d46]',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[130] flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-md bg-[#faf8f3] rounded-none border border-[#ded7ca] shadow-2xl overflow-hidden ${colorStyles.accentBorder} animate-scaleUp`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Thanh tiêu đề Top Bar */}
        <div className="bg-[#14261a] text-white px-4 py-3 flex items-center justify-between border-b border-[#28402f]">
          <div className="flex items-center gap-2">
            <span className={`material-symbols-outlined text-lg ${colorStyles.iconColor}`}>
              {icon}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#cbb07c]">
              {subtitle}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/60 hover:text-white p-1 rounded-none hover:bg-white/10 transition-colors cursor-pointer"
            title="Đóng hộp thoại"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Nội dung thông báo xác nhận */}
        <div className="p-4 sm:p-5 space-y-3">
          <h3 className="font-serif text-base sm:text-lg font-bold text-[#14261a] leading-snug">
            {title}
          </h3>

          <div className="text-xs text-[#4a584d] leading-relaxed bg-white border border-[#e8e2d5] p-3 rounded-none">
            {typeof message === 'string' ? (
              <p className="whitespace-pre-line">{message}</p>
            ) : (
              message
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-[#7d8b80] italic">
            <span className="material-symbols-outlined text-xs">info</span>
            <span>Vui lòng kiểm tra kỹ trước khi xác nhận để đảm bảo tính toàn vẹn dữ liệu.</span>
          </div>
        </div>

        {/* Nút thao tác xác nhận / hủy bỏ */}
        <div className="bg-[#f0ece1] border-t border-[#ded7ca] px-4 py-3 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-gray-100 text-[#14261a] border border-[#ded7ca] font-semibold text-xs uppercase tracking-wider rounded-none transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 font-bold text-xs uppercase tracking-wider rounded-none shadow-xs transition-all flex items-center gap-1.5 cursor-pointer ${colorStyles.btn}`}
          >
            <span className="material-symbols-outlined text-sm">check</span>
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

