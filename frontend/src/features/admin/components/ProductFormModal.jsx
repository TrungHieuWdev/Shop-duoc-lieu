import React, { useState, useEffect } from 'react';
import { formatCurrency } from '@/utils/formatCurrency';

// Danh sách hình ảnh thảo mộc có sẵn trong tiệm để chủ shop chọn nhanh
const HERB_IMAGE_PRESETS = [
  { label: 'Bài Thuốc 7 Vị', url: '/images/products/bai-thuoc-7-vi.jpg' },
  { label: 'Đinh Lăng', url: '/images/herbs/dinh-lang.jpg' },
  { label: 'Gừng Sẻ', url: '/images/herbs/gung-kho.jpg' },
  { label: 'Sả Chanh', url: '/images/herbs/sa-chanh.jpg' },
  { label: 'Lá Trầu Không', url: '/images/herbs/la-trau-khong.jpg' },
  { label: 'Lá Ngải Cứu', url: '/images/herbs/ngai-cuu.jpg' },
  { label: 'Lá Bưởi', url: '/images/herbs/la-buoi.jpg' },
  { label: 'Hoa Hồng', url: '/images/herbs/hoa-hong.jpg' },
];

export const ProductFormModal = ({ isOpen, onClose, productToEdit, onSave, requestConfirmation }) => {
  const [formData, setFormData] = useState({
    name: '',
    category_slug: 'duoc-lieu-le',
    unit: 'Túi zip 200g',
    price: 35000,
    original_price: 45000,
    stock: 50,
    thumbnail_url: '/images/products/bai-thuoc-7-vi.jpg',
  });

  const [customImageUrl, setCustomImageUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || '',
        category_slug: productToEdit.category_slug || 'duoc-lieu-le',
        unit: productToEdit.unit || 'Túi zip 200g',
        price: productToEdit.price || 0,
        original_price: productToEdit.original_price || productToEdit.price || 0,
        stock: productToEdit.stock !== undefined ? productToEdit.stock : 0,
        thumbnail_url: productToEdit.thumbnail_url || '/images/products/bai-thuoc-7-vi.jpg',
      });
      setCustomImageUrl(productToEdit.thumbnail_url || '');
    } else {
      setFormData({
        name: '',
        category_slug: 'duoc-lieu-le',
        unit: 'Túi zip 200g',
        price: 35000,
        original_price: 45000,
        stock: 50,
        thumbnail_url: '/images/products/bai-thuoc-7-vi.jpg',
      });
      setCustomImageUrl('');
    }
    setErrorMsg('');
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Vui lòng nhập tên dược liệu');
      return;
    }
    if (formData.price <= 0) {
      setErrorMsg('Giá bán phải lớn hơn 0');
      return;
    }
    if (formData.stock < 0) {
      setErrorMsg('Số lượng tồn kho không được âm');
      return;
    }

    const payload = {
      ...formData,
      thumbnail_url: customImageUrl.trim() || formData.thumbnail_url,
    };

    if (requestConfirmation) {
      requestConfirmation({
        title: productToEdit
          ? `Xác Nhận Cập Nhật Dược Liệu: ${payload.name}`
          : `Xác Nhận Thêm Mới Dược Liệu: ${payload.name}`,
        subtitle: productToEdit ? 'Lưu Thay Đổi Chi Tiết Dược Liệu' : 'Thêm Vị Dược Liệu Mới',
        variant: 'primary',
        icon: productToEdit ? 'edit_note' : 'add_circle',
        confirmText: productToEdit ? 'Xác Nhận Cập Nhật' : 'Xác Nhận Thêm Mới',
        message: (
          <div className="space-y-2 text-xs">
            <p>
              {productToEdit
                ? `Bạn có chắc chắn muốn lưu thông tin cập nhật cho dược liệu #${productToEdit.id} - "${payload.name}"?`
                : `Bạn có chắc chắn muốn thêm vị dược liệu mới "${payload.name}" vào danh mục kho?`}
            </p>
            <div className="bg-[#faf8f3] p-2.5 border border-[#ded7ca] space-y-1">
              <div>• Tên dược liệu: <strong>{payload.name}</strong></div>
              <div>• Quy cách đóng gói: <strong>{payload.unit}</strong></div>
              <div>• Giá bán lẻ: <strong>{formatCurrency(payload.price)}</strong></div>
              <div>• Số lượng tồn kho: <strong>{payload.stock} gói</strong></div>
            </div>
          </div>
        ),
        onConfirm: () => {
          onSave(payload);
          onClose();
        },
      });
    } else {
      onSave(payload);
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#faf8f5] rounded-2xl border border-border-herbal shadow-2xl p-4 sm:p-6 text-on-surface max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 text-outline hover:text-primary rounded-lg hover:bg-surface-container transition-colors"
          aria-label="Đóng"
        >
          <span className="material-symbols-outlined text-[1.25rem]">close</span>
        </button>

        {/* Tiêu đề */}
        <div className="mb-4">
          <span className="text-[0.6875rem] font-bold text-[#8a7258] uppercase tracking-[0.2em] block mb-1">
            QUẢN TRỊ KHO DƯỢC LIỆU
          </span>
          <h3 className="font-serif text-xl font-bold text-primary">
            {productToEdit ? 'Chỉnh Sửa Dược Liệu' : 'Thêm Dược Liệu Mới'}
          </h3>
          <p className="text-xs text-on-surface-variant mt-0.5">
            {productToEdit
              ? `Cập nhật giá bán, số lượng tồn kho và thông tin của #${productToEdit.id}`
              : 'Thêm thảo mộc mới vào danh mục bán lẻ của tiệm'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-2.5 rounded-none bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[1.125rem]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Tên sản phẩm */}
          <div>
            <label className="block text-xs font-semibold text-primary mb-1">
              Tên dược liệu / Thảo mộc <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="VD: Cỏ Mần Trầu Phơi Khô"
              className="w-full px-3 py-1.5 bg-surface-container-low border border-border-herbal rounded-none text-xs text-on-surface focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Phân loại & Quy cách */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-primary mb-1">
                Phân loại danh mục
              </label>
              <select
                value={formData.category_slug}
                onChange={(e) => setFormData({ ...formData, category_slug: e.target.value })}
                className="w-full px-3 py-1.5 bg-surface-container-low border border-border-herbal rounded-none text-xs text-on-surface focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="duoc-lieu-le">Dược Liệu Lẻ</option>
                <option value="bai-thuoc-xong-tam">Bài Thuốc Xông Tắm</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary mb-1">
                Quy cách đóng gói
              </label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="VD: Túi zip 200g, Gói 150g"
                className="w-full px-3 py-1.5 bg-surface-container-low border border-border-herbal rounded-none text-xs text-on-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Giá tiền & Tồn kho */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-primary mb-1">
                Giá bán lẻ (đ) <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                min="1000"
                step="1000"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 bg-surface-container-low border border-border-herbal rounded-none text-xs font-bold text-primary focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary mb-1">
                Giá gốc / Niêm yết (đ)
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={formData.original_price}
                onChange={(e) => setFormData({ ...formData, original_price: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 bg-surface-container-low border border-border-herbal rounded-none text-xs text-on-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary mb-1">
                Tồn kho (Gói/Túi) <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 bg-surface-container-low border border-border-herbal rounded-none text-xs font-bold text-primary focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Chọn ảnh sản phẩm */}
          <div>
            <label className="block text-xs font-semibold text-primary mb-1">
              Hình ảnh dược liệu
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 mb-2">
              {HERB_IMAGE_PRESETS.map((preset) => (
                <button
                  key={preset.url}
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, thumbnail_url: preset.url });
                    setCustomImageUrl(preset.url);
                  }}
                  className={`relative aspect-square rounded-none overflow-hidden border transition-all cursor-pointer ${
                    (customImageUrl || formData.thumbnail_url) === preset.url
                      ? 'border-[#cbb07c] ring-2 ring-[#cbb07c]/50'
                      : 'border-border-herbal/70 opacity-70 hover:opacity-100'
                  }`}
                  title={preset.label}
                >
                  <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <input
              type="text"
              value={customImageUrl}
              onChange={(e) => setCustomImageUrl(e.target.value)}
              placeholder="Hoặc nhập đường dẫn ảnh: /images/herbs/... hoặc https://..."
              className="w-full px-2.5 py-1.5 bg-surface-container-low border border-border-herbal rounded-none text-[11px] text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          {/* Nút hành động */}
          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-border-herbal">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border-herbal bg-surface hover:bg-surface-container text-xs font-semibold text-on-surface transition-colors cursor-pointer"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#cbb07c] hover:bg-[#dfc492] text-[#14261a] text-xs font-bold uppercase tracking-wider shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">save</span>
              <span>{productToEdit ? 'Lưu Thay Đổi' : 'Thêm Dược Liệu'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
