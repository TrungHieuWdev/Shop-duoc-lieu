import React, { useState, useEffect } from 'react';

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

export const ProductFormModal = ({ isOpen, onClose, productToEdit, onSave }) => {
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

    onSave({
      ...formData,
      thumbnail_url: customImageUrl.trim() || formData.thumbnail_url,
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#fbf9f2] rounded-2xl border border-border-herbal shadow-2xl p-6 sm:p-8 text-on-surface max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-outline hover:text-primary rounded-full hover:bg-surface-container transition-colors"
          aria-label="Đóng"
        >
          <span className="material-symbols-outlined text-[1.25rem]">close</span>
        </button>

        {/* Tiêu đề */}
        <div className="mb-6">
          <span className="text-[0.6875rem] font-bold text-[#8a7258] uppercase tracking-[0.2em] block mb-1">
            QUẢN TRỊ KHO DƯỢC LIỆU
          </span>
          <h3 className="font-serif text-2xl font-bold text-primary">
            {productToEdit ? 'Chỉnh Sửa Dược Liệu' : 'Thêm Dược Liệu Mới'}
          </h3>
          <p className="text-xs text-on-surface-variant mt-0.5">
            {productToEdit
              ? `Cập nhật giá bán, số lượng tồn kho và thông tin của #${productToEdit.id}`
              : 'Thêm thảo mộc mới vào danh mục bán lẻ của tiệm'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[1.125rem]">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full px-3 py-2 bg-surface-container-low border border-border-herbal rounded-lg text-xs text-on-surface focus:outline-none focus:border-primary transition-colors"
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
                className="w-full px-3 py-2 bg-surface-container-low border border-border-herbal rounded-lg text-xs text-on-surface focus:outline-none focus:border-primary cursor-pointer"
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
                className="w-full px-3 py-2 bg-surface-container-low border border-border-herbal rounded-lg text-xs text-on-surface focus:outline-none focus:border-primary transition-colors"
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
                className="w-full px-3 py-2 bg-surface-container-low border border-border-herbal rounded-lg text-xs font-bold text-primary focus:outline-none focus:border-primary transition-colors"
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
                className="w-full px-3 py-2 bg-surface-container-low border border-border-herbal rounded-lg text-xs text-on-surface focus:outline-none focus:border-primary transition-colors"
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
                className="w-full px-3 py-2 bg-surface-container-low border border-border-herbal rounded-lg text-xs font-bold text-primary focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Chọn ảnh sản phẩm */}
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5">
              Hình ảnh dược liệu
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-2">
              {HERB_IMAGE_PRESETS.map((preset) => (
                <button
                  key={preset.url}
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, thumbnail_url: preset.url });
                    setCustomImageUrl(preset.url);
                  }}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    (customImageUrl || formData.thumbnail_url) === preset.url
                      ? 'border-[#cbb07c] ring-2 ring-[#cbb07c]/50 scale-105'
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
              className="w-full px-3 py-1.5 bg-surface-container-low border border-border-herbal rounded text-[11px] text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          {/* Nút hành động */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-border-herbal">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-border-herbal bg-surface hover:bg-surface-container text-xs font-semibold text-on-surface transition-colors"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-[#cbb07c] hover:bg-[#dfc492] text-[#14261a] text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
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

