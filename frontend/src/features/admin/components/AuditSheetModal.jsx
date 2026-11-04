import React, { useState, useEffect } from 'react';
import { formatCurrency } from '@/utils/formatCurrency';

export const AuditSheetModal = ({ isOpen, onClose, products, onSaveAudit, requestConfirmation }) => {
  const [items, setItems] = useState([]);
  const [note, setNote] = useState('');
  const [auditDate, setAuditDate] = useState(() => new Date().toISOString().slice(0, 16));
  const [saveMode, setSaveMode] = useState('balanced'); // 'balanced' | 'draft'

  useEffect(() => {
    if (isOpen && products) {
      setItems(
        products.map((p) => ({
          product_id: p.id,
          name: p.name,
          unit: p.unit,
          price: p.price,
          system_stock: Number(p.stock),
          actual_stock: Number(p.stock),
          diff: 0,
        }))
      );
      setNote(`Phiếu kiểm kho ngày ${new Date().toLocaleDateString('vi-VN')}`);
      setAuditDate(new Date().toISOString().slice(0, 16));
      setSaveMode('balanced');
    }
  }, [isOpen, products]);

  if (!isOpen) return null;

  const handleActualChange = (productId, val) => {
    const num = val === '' ? 0 : Math.max(0, parseInt(val, 10) || 0);
    setItems((prev) =>
      prev.map((item) => {
        if (item.product_id === productId) {
          return {
            ...item,
            actual_stock: num,
            diff: num - item.system_stock,
          };
        }
        return item;
      })
    );
  };

  const totalActual = items.reduce((sum, item) => sum + item.actual_stock, 0);
  const totalIncrease = items.reduce((sum, item) => sum + (item.diff > 0 ? item.diff : 0), 0);
  const totalDecrease = items.reduce((sum, item) => sum + (item.diff < 0 ? Math.abs(item.diff) : 0), 0);
  const totalDiff = totalIncrease - totalDecrease;
  const totalDiffValue = items.reduce((sum, item) => sum + item.diff * item.price, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = `KK${String(Date.now()).slice(-6)}`;
    const nowIso = new Date().toISOString();
    const isBalanced = saveMode === 'balanced';

    const auditData = {
      code,
      created_at: new Date(auditDate).toISOString(),
      balanced_at: isBalanced ? nowIso : null,
      creator: 'Quản Trị Viên Ngân Hà',
      balancer: isBalanced ? 'Quản Trị Viên Ngân Hà' : '—',
      status: isBalanced ? 'Đã cân bằng kho' : 'Phiếu tạm',
      total_diff: totalDiff,
      total_diff_value: totalDiffValue,
      total_increase: totalIncrease,
      total_decrease: totalDecrease,
      note: note.trim() || 'Kiểm kho định kỳ Tiệm Thảo Mộc Ngân Hà',
      items,
    };

    if (requestConfirmation) {
      requestConfirmation({
        title: `Xác Nhận Lập Phiếu Kiểm Kho: ${code}`,
        subtitle: isBalanced ? 'Cân Bằng Kho Ngay Lập Tức' : 'Lưu Thành Phiếu Tạm',
        icon: isBalanced ? 'published_with_changes' : 'save_as',
        variant: isBalanced ? 'warning' : 'info',
        confirmText: isBalanced ? 'Xác Nhận Cân Bằng Kho' : 'Xác Nhận Lưu Phiếu',
        message: (
          <div className="space-y-2 text-xs">
            <p>
              Bạn có chắc chắn muốn hoàn tất phiếu kiểm kho <strong>{code}</strong> với chế độ{' '}
              <strong className={isBalanced ? 'text-amber-800' : 'text-primary'}>
                {isBalanced ? 'Cân bằng kho ngay' : 'Lưu phiếu tạm'}
              </strong>?
            </p>
            <div className="bg-[#faf8f3] p-2.5 border border-[#ded7ca] space-y-1">
              <div>• Danh mục kiểm kê: <strong>{items.length} vị dược liệu</strong></div>
              <div>• Tổng chênh lệch tồn: <strong>{totalDiff > 0 ? `+${totalDiff}` : totalDiff} gói</strong></div>
              <div>• Tổng giá trị lệch: <strong>{formatCurrency(totalDiffValue)}</strong></div>
              {isBalanced && (
                <div className="text-amber-800 font-semibold pt-1 border-t border-[#ded7ca]">
                  ⚠️ Chế độ này sẽ thay đổi trực tiếp số lượng tồn kho của các dược liệu trong hệ thống.
                </div>
              )}
            </div>
          </div>
        ),
        onConfirm: () => {
          onSaveAudit(auditData);
          onClose();
        },
      });
    } else {
      onSaveAudit(auditData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-surface rounded-2xl max-w-4xl w-full border border-border-herbal shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-3.5 sm:p-4 border-b border-border-herbal bg-[#1d3527] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#d4b986] text-[#1d3527] flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-lg">fact_check</span>
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                Tạo Phiếu Kiểm Kho Mới
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider bg-[#d4b986]/20 text-[#e0cfab] px-1.5 py-0.2 rounded-full border border-[#d4b986]/40">
                  Chuẩn KiotViet
                </span>
              </h3>
              <p className="text-[11px] text-[#a3b899]">
                Kiểm đếm thực tế và đối soát tồn kho sổ sách của Tiệm Thảo Mộc Ngân Hà
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-white/10 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          {/* Top Form Fields: Date & Note */}
          <div className="p-3 bg-[#faf8f3] border-b border-border-herbal/80 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-primary uppercase tracking-wider mb-1">
                Thời gian kiểm kho
              </label>
              <input
                type="datetime-local"
                value={auditDate}
                onChange={(e) => setAuditDate(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-border-herbal rounded-none text-xs font-semibold text-primary focus:outline-none focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-primary uppercase tracking-wider mb-1">
                Ghi chú kiểm kho / Lý do
              </label>
              <input
                type="text"
                placeholder="VD: Kiểm kê định kỳ đầu tháng, kiểm tra hàng đóng gói..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-border-herbal rounded-none text-xs text-primary focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Table of items to audit */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4">
            <div className="border border-border-herbal rounded-none overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#14261a]/5 text-primary uppercase tracking-wider text-[10px] border-b border-border-herbal font-bold">
                  <tr>
                    <th className="py-2 px-2.5">Mã &amp; Dược Liệu</th>
                    <th className="py-2 px-2.5 text-center">Quy Cách</th>
                    <th className="py-2 px-2.5 text-right">Tồn Kho Sổ Sách</th>
                    <th className="py-2 px-2.5 text-center w-32">Thực Tế Đếm Được</th>
                    <th className="py-2 px-2.5 text-right">Chênh Lệch</th>
                    <th className="py-2 px-2.5 text-right">Giá Trị Lệch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-herbal/60 bg-white">
                  {items.map((item) => {
                    const diff = item.diff;
                    const diffValue = diff * item.price;
                    return (
                      <tr key={item.product_id} className="hover:bg-surface-container-low/40 transition-colors">
                        <td className="py-2 px-2.5">
                          <span className="font-mono text-[10px] text-outline font-semibold block">
                            #{item.product_id}
                          </span>
                          <span className="font-bold text-primary line-clamp-1">{item.name}</span>
                        </td>
                        <td className="py-2 px-2.5 text-center text-on-surface-variant text-[11px]">
                          {item.unit}
                        </td>
                        <td className="py-2 px-2.5 text-right font-semibold text-primary">
                          {item.system_stock} <span className="text-[10px] text-outline font-normal">gói</span>
                        </td>
                        <td className="py-2 px-2.5 text-center">
                          <input
                            type="number"
                            min="0"
                            value={item.actual_stock}
                            onChange={(e) => handleActualChange(item.product_id, e.target.value)}
                            className="w-20 px-2 py-1 bg-surface border border-primary/50 focus:border-primary text-center font-bold text-primary rounded-none text-xs"
                          />
                        </td>
                        <td className="py-2 px-2.5 text-right">
                          <span
                            className={`font-mono font-bold text-xs px-1.5 py-0.2 rounded-none border ${
                              diff === 0
                                ? 'bg-gray-50 text-gray-600 border-gray-200'
                                : diff > 0
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                            }`}
                          >
                            {diff > 0 ? `+${diff}` : diff}
                          </span>
                        </td>
                        <td className="py-2 px-2.5 text-right font-medium">
                          <span
                            className={
                              diffValue === 0
                                ? 'text-outline'
                                : diffValue > 0
                                ? 'text-green-700 font-bold'
                                : 'text-red-700 font-bold'
                            }
                          >
                            {diffValue > 0 ? `+${formatCurrency(diffValue)}` : formatCurrency(diffValue)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Quick summary cards underneath */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-xs">
              <div className="p-2 bg-surface-container-low border border-border-herbal rounded-none">
                <span className="text-[10px] uppercase font-bold text-outline block">Tổng thực tế</span>
                <span className="font-serif font-bold text-sm text-primary">{totalActual} gói</span>
              </div>
              <div className="p-2 bg-green-50 border border-green-200 rounded-none">
                <span className="text-[10px] uppercase font-bold text-green-800 block">Lệch tăng</span>
                <span className="font-mono font-bold text-sm text-green-700">+{totalIncrease} gói</span>
              </div>
              <div className="p-2 bg-red-50 border border-red-200 rounded-none">
                <span className="text-[10px] uppercase font-bold text-red-800 block">Lệch giảm</span>
                <span className="font-mono font-bold text-sm text-red-700">-{totalDecrease} gói</span>
              </div>
              <div className="p-2 bg-[#cbb07c]/15 border border-[#cbb07c]/40 rounded-none">
                <span className="text-[10px] uppercase font-bold text-primary block">Tổng giá trị lệch</span>
                <span className="font-serif font-bold text-sm text-primary">
                  {totalDiffValue >= 0 ? `+${formatCurrency(totalDiffValue)}` : formatCurrency(totalDiffValue)}
                </span>
              </div>
            </div>
          </div>

          {/* Modal Footer with Actions */}
          <div className="p-3 border-t border-border-herbal bg-[#faf8f3] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-primary">
                <input
                  type="radio"
                  name="saveMode"
                  value="balanced"
                  checked={saveMode === 'balanced'}
                  onChange={() => setSaveMode('balanced')}
                  className="accent-[#14261a]"
                />
                <span>Cân bằng kho ngay (Cập nhật tồn kho)</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-on-surface-variant">
                <input
                  type="radio"
                  name="saveMode"
                  value="draft"
                  checked={saveMode === 'draft'}
                  onChange={() => setSaveMode('draft')}
                  className="accent-[#14261a]"
                />
                <span>Lưu tạm (Chưa điều chỉnh kho)</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 border border-border-herbal text-on-surface hover:bg-surface-container rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#1d3527] hover:bg-[#284935] text-[#d4b986] font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>{saveMode === 'balanced' ? 'Hoàn Tất & Cân Bằng' : 'Lưu Phiếu Tạm'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
