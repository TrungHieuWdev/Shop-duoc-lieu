import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <span className="font-serif text-6xl font-bold text-tertiary block mb-4">404</span>
      <h1 className="font-serif text-2xl font-bold text-primary mb-3">
        Không Tìm Thấy Trang Yêu Cầu
      </h1>
      <p className="text-body-sm text-on-surface-variant mb-8">
        Đường dẫn bạn truy cập có thể đã thay đổi hoặc không tồn tại. Hãy quay lại vườn thảo mộc để tiếp tục mua sắm nhé.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-container text-on-primary font-medium rounded transition-colors shadow-sm"
      >
        <span>Về Trang Chủ</span>
        <span className="material-symbols-outlined text-[1.125rem]">home</span>
      </Link>
    </div>
  );
};

