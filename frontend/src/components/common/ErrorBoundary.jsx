import React from 'react';
import { BotanicalDivider } from './BotanicalDivider';

/**
 * ErrorBoundary bắt lỗi runtime / 500 chuẩn Web 2026.
 * Ngăn chặn lỗi JavaScript làm trắng màn hình,
 * hiển thị giao diện thông báo lỗi dịu nhẹ, an tâm theo phong cách Mộc Nhiên Thảo.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // Có thể ghi log lỗi về Sentry hoặc console
    console.error('Đã xảy ra lỗi giao diện:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-16">
          <div className="max-w-xl w-full mx-auto text-center">
            {/* Biểu tượng lỗi nghệ thuật */}
            <div className="relative inline-flex items-center justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-surface-container-high border border-border-herbal flex items-center justify-center shadow-inner">
                <span className="material-symbols-outlined text-[3.5rem] text-[#8a7258]">
                  eco
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#50250e] text-white flex items-center justify-center border-2 border-surface shadow">
                <span className="material-symbols-outlined text-[1.125rem]">
                  build
                </span>
              </div>
            </div>

            {/* Tiêu đề & Thông báo */}
            <span className="text-xs uppercase tracking-widest text-[#8a7258] font-semibold block mb-2">
              SỰ CỐ HỆ THỐNG (500)
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary mb-3">
              Có Chút Gián Đoạn Ngoài Ý Muốn
            </h1>
            <p className="text-body-sm text-on-surface-variant max-w-md mx-auto mb-6 leading-relaxed">
              Trang vừa gặp sự cố trong quá trình xử lý dược liệu điện tử. Đừng lo lắng, dữ liệu của bạn vẫn an toàn và đội ngũ kỹ thuật đang kiểm tra.
            </p>

            <div className="flex justify-center my-4">
              <BotanicalDivider />
            </div>

            {/* Cụm nút khôi phục */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-6 mb-8">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary-container text-on-primary font-medium rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[1.25rem]">
                  refresh
                </span>
                <span>Tải lại trang</span>
              </button>

              <button
                onClick={this.handleGoHome}
                className="w-full sm:w-auto px-6 py-3 bg-surface-container-lowest hover:bg-surface-container border border-border-herbal text-primary font-medium rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[1.25rem]">
                  home
                </span>
                <span>Về Trang Chủ</span>
              </button>
            </div>

            {/* Chi tiết lỗi kỹ thuật cho Dev (thu gọn) */}
            {import.meta.env?.DEV && this.state.error && (
              <details className="text-left bg-surface-container-low border border-border-herbal rounded-lg p-3 text-xs text-on-surface-variant max-w-lg mx-auto">
                <summary className="cursor-pointer font-medium text-error hover:underline select-none">
                  Chi tiết lỗi kỹ thuật (chế độ phát triển)
                </summary>
                <pre className="mt-2 p-2 bg-[#1b1c18] text-[#cee9d4] rounded overflow-x-auto text-[11px] leading-relaxed">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="mt-8 pt-6 border-t border-border-herbal text-xs text-on-surface-variant/80">
              Cần hỗ trợ ngay? Liên hệ tổng đài tư vấn:{' '}
              <a href="tel:19006826" className="text-primary font-semibold hover:underline">
                1900 6826
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

