import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useAdminStore } from '@/store/useAdminStore';
import { formatCurrency } from '@/utils/formatCurrency';
import { ProductFormModal } from '@/features/admin/components/ProductFormModal';
import { InvoiceDetailModal } from '@/features/admin/components/InvoiceDetailModal';
import { AuditSheetModal } from '@/features/admin/components/AuditSheetModal';
import { AdminOverviewDashboard } from '@/features/admin/components/AdminOverviewDashboard';
import { AdminSettingsTab } from '@/features/admin/components/AdminSettingsTab';
import { AdminConfirmModal } from '@/features/admin/components/AdminConfirmModal';

export const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const {
    products,
    orders,
    auditLogs,
    settings,
    updateProduct,
    addProduct,
    deleteProduct,
    updateOrderStatus,
    addAuditLog,
    balanceAuditSheet,
    deleteAuditSheet,
    updateSettings,
  } = useAdminStore();

  // Navigation tab: 'overview' (Dashboard 2026) | 'audit' (Phiếu kiểm kho) | 'products' (Hàng hóa & Tồn kho) | 'orders' (Hóa đơn) | 'settings' (Cài đặt)
  const [activeTab, setActiveTab] = useState('overview');

  // Filter states
  const [searchCode, setSearchCode] = useState('');
  const [searchName, setSearchName] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'Phiếu tạm' | 'Đã cân bằng kho'
  const [categoryFilter, setCategoryFilter] = useState('all'); // for products
  const [orderStatusFilter, setOrderStatusFilter] = useState('all'); // for orders
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Master-Detail Expanded Rows
  const [expandedLogCode, setExpandedLogCode] = useState('KK000001'); // default open first item like KiotViet

  // Inline product quick-edit state
  const [editingProdId, setEditingProdId] = useState(null);
  const [inlinePrice, setInlinePrice] = useState(0);
  const [inlineStock, setInlineStock] = useState(0);

  // Modals state
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  // Dialog xác nhận mọi thao tác thay đổi dữ liệu trong Admin
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    subtitle: '',
    message: null,
    confirmText: 'Xác Nhận Thay Đổi',
    cancelText: 'Hủy Bỏ',
    variant: 'primary',
    icon: 'published_with_changes',
    onConfirm: () => {},
  });

  const requestConfirmation = ({
    title,
    subtitle = 'Xác nhận thao tác quản trị',
    message,
    confirmText = 'Xác Nhận Thay Đổi',
    cancelText = 'Hủy Bỏ',
    variant = 'primary',
    icon = 'published_with_changes',
    onConfirm,
  }) => {
    setConfirmDialog({
      isOpen: true,
      title,
      subtitle,
      message,
      confirmText,
      cancelText,
      variant,
      icon,
      onConfirm: () => {
        if (onConfirm) onConfirm();
      },
    });
  };

  // Checkbox selection state
  const [selectedLogCodes, setSelectedLogCodes] = useState([]);

  // Auth gate
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-[#faf8f3] rounded-none border border-[#ded7ca] text-center shadow-md eco-rise-1">
        <div className="w-14 h-14 mx-auto bg-[#14261a] text-[#cbb07c] flex items-center justify-center mb-4 shadow-sm rounded-none">
          <span className="material-symbols-outlined text-[1.875rem]">lock</span>
        </div>
        <span className="text-[10px] font-bold text-[#8a7258] uppercase tracking-[0.22em] block mb-1">
          HỆ THỐNG NỘI BỘ
        </span>
        <h2 className="font-serif text-2xl font-bold text-primary mb-2">Yêu Cầu Quyền Quản Trị</h2>
        <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
          Khu vực quản trị kho hàng và hóa đơn chỉ dành cho nhân sự nội bộ Tiệm Thảo Mộc Ngân Hà. Vui lòng đăng nhập để tiếp tục.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/admin/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold uppercase tracking-wider rounded-none shadow-xs transition-all cursor-pointer"
          >
            <span>Đăng Nhập Nội Bộ</span>
            <span className="material-symbols-outlined text-base">login</span>
          </Link>
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-surface hover:bg-surface-container border border-border-herbal text-primary text-xs font-semibold rounded-none transition-all"
          >
            <span>Về Cửa Hàng</span>
          </Link>
        </div>
      </div>
    );
  }

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLogout = () => {
    requestConfirmation({
      title: 'Xác Nhận Đăng Xuất Quản Trị',
      subtitle: 'Kết Thúc Phiên Làm Việc',
      icon: 'logout',
      variant: 'warning',
      confirmText: 'Đăng Xuất Ngay',
      message: 'Bạn có chắc chắn muốn đăng xuất khỏi trang quản trị Tiệm Thảo Mộc Ngân Hà?',
      onConfirm: () => {
        logout();
        navigate('/');
      },
    });
  };

  // 1. Quản lý Phiếu Kiểm Kho (Audit Logs)
  const filteredAuditLogs = useMemo(() => {
    return (auditLogs || []).filter((log) => {
      if (searchCode && !log.code.toLowerCase().includes(searchCode.toLowerCase())) {
        return false;
      }
      if (searchName) {
        const hasItem = (log.items || []).some((item) =>
          item.name.toLowerCase().includes(searchName.toLowerCase())
        );
        const matchNote = (log.note || '').toLowerCase().includes(searchName.toLowerCase());
        if (!hasItem && !matchNote) return false;
      }
      if (statusFilter !== 'all' && log.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [auditLogs, searchCode, searchName, statusFilter]);

  // 2. Quản lý Hàng Hóa (Products)
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (searchName && !p.name.toLowerCase().includes(searchName.toLowerCase())) {
        return false;
      }
      if (searchCode && !String(p.id).includes(searchCode.replace('#', ''))) {
        return false;
      }
      if (categoryFilter !== 'all' && p.category_slug !== categoryFilter) {
        return false;
      }
      if (statusFilter !== 'all' && p.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [products, searchName, searchCode, categoryFilter, statusFilter]);

  // 3. Quản lý Hóa Đơn (Orders)
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (searchCode && !o.order_code.toLowerCase().includes(searchCode.toLowerCase())) {
        return false;
      }
      if (searchName) {
        const matchCust = (o.customer_name || '').toLowerCase().includes(searchName.toLowerCase());
        const matchPhone = (o.customer_phone || '').includes(searchName);
        if (!matchCust && !matchPhone) return false;
      }
      if (orderStatusFilter !== 'all') {
        if (orderStatusFilter === 'PAID') return o.payment_status === 'PAID';
        return o.order_status === orderStatusFilter;
      }
      return true;
    });
  }, [orders, searchCode, searchName, orderStatusFilter]);

  // Toggle row expand
  const toggleRowExpand = (code) => {
    setExpandedLogCode((prev) => (prev === code ? null : code));
  };

  // Toggle select log checkbox
  const handleToggleSelectLog = (code) => {
    setSelectedLogCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleSelectAllLogs = () => {
    if (selectedLogCodes.length === filteredAuditLogs.length) {
      setSelectedLogCodes([]);
    } else {
      setSelectedLogCodes(filteredAuditLogs.map((l) => l.code));
    }
  };

  // Thực hiện xuất file CSV sau khi đã xác nhận
  const executeExportCsv = () => {
    let csvContent = '\uFEFF'; // UTF-8 BOM
    let fileName = 'xuat_du_lieu.csv';

    if (activeTab === 'audit') {
      csvContent += 'Mã kiểm kho,Thời gian,Ngày cân bằng,Trạng thái,Tổng chênh lệch,Tổng giá trị lệch,Người tạo,Ghi chú\n';
      filteredAuditLogs.forEach((l) => {
        const timeStr = l.created_at ? new Date(l.created_at).toLocaleString('vi-VN') : '';
        const balStr = l.balanced_at ? new Date(l.balanced_at).toLocaleString('vi-VN') : '—';
        csvContent += `"${l.code}","${timeStr}","${balStr}","${l.status}","${l.total_diff}","${l.total_diff_value}","${l.creator}","${(l.note || '').replace(/"/g, '""')}"\n`;
      });
      fileName = `Phieu_Kiem_Kho_${new Date().toISOString().slice(0, 10)}.csv`;
    } else if (activeTab === 'products') {
      csvContent += 'Mã dược liệu,Tên dược liệu,Danh mục,Quy cách,Giá bán lẻ,Tồn kho,Trạng thái\n';
      filteredProducts.forEach((p) => {
        csvContent += `"#${p.id}","${p.name.replace(/"/g, '""')}","${p.category_name}","${p.unit}","${p.price}","${p.stock}","${p.status}"\n`;
      });
      fileName = `Danh_Muc_Duoc_Lieu_${new Date().toISOString().slice(0, 10)}.csv`;
    } else {
      csvContent += 'Mã hóa đơn,Khách hàng,Số điện thoại,Ngày đặt,Phương thức,Tổng tiền,Trạng thái đơn,Trạng thái thanh toán\n';
      filteredOrders.forEach((o) => {
        const d = o.created_at ? new Date(o.created_at).toLocaleDateString('vi-VN') : '';
        csvContent += `"${o.order_code}","${(o.customer_name || '').replace(/"/g, '""')}","${o.customer_phone}","${d}","${o.payment_method}","${o.total}","${o.order_status}","${o.payment_status}"\n`;
      });
      fileName = `Hoa_Don_Ban_Hang_${new Date().toISOString().slice(0, 10)}.csv`;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`✓ Đã xuất file thành công: ${fileName}`);
  };

  // Xác nhận xuất file CSV
  const handleExportCsv = () => {
    const tabNames = {
      audit: 'Phiếu Kiểm Kho',
      products: 'Hàng Hóa & Tồn Kho',
      orders: 'Hóa Đơn & Đơn Hàng',
    };
    const currentTabName = tabNames[activeTab] || 'Dữ Liệu';

    requestConfirmation({
      title: `Xác Nhận Xuất Dữ Liệu: ${currentTabName}`,
      subtitle: 'Tải Báo Cáo Định Dạng CSV',
      icon: 'download',
      variant: 'info',
      confirmText: 'Tải File Về Máy',
      message: `Hệ thống sẽ kết xuất toàn bộ dữ liệu ${currentTabName} hiện tại ra tệp tin CSV (tương thích Microsoft Excel với font tiếng Việt chuẩn UTF-8). Bạn có muốn tải về ngay không?`,
      onConfirm: () => {
        executeExportCsv();
      },
    });
  };

  // Cân bằng kho cho một phiếu tạm với xác nhận
  const handleBalanceSheet = (code) => {
    const targetLog = auditLogs.find((l) => l.code === code);
    requestConfirmation({
      title: `Xác Nhận Cân Bằng Phiếu Kiểm Kho: ${code}`,
      subtitle: 'Đồng Bộ Số Lượng Tồn Kho Thực Tế',
      icon: 'done_all',
      variant: 'warning',
      confirmText: 'Xác Nhận Cân Bằng Kho',
      message: (
        <div className="space-y-2 text-xs">
          <p>
            Bạn có chắc chắn muốn cân bằng kho theo phiếu kiểm kho <strong>{code}</strong>?
          </p>
          <div className="bg-amber-50 p-2.5 border border-amber-200 text-amber-900 space-y-1">
            <div>• Ghi chú: <strong>{targetLog?.note || 'Kiểm kho định kỳ'}</strong></div>
            <div>• Tổng chênh lệch: <strong>{targetLog?.total_diff > 0 ? `+${targetLog?.total_diff}` : targetLog?.total_diff} gói</strong></div>
            <div>• Hệ thống sẽ tự động cập nhật số lượng tồn kho thực tế vào kho hàng chính.</div>
          </div>
        </div>
      ),
      onConfirm: () => {
        balanceAuditSheet(code);
        showToast(`✓ Đã cân bằng phiếu kiểm kho ${code} & cập nhật tồn kho thành công`);
      },
    });
  };

  // Xóa phiếu kiểm kho với xác nhận
  const handleDeleteSheet = (code) => {
    requestConfirmation({
      title: `Xác Nhận Xóa Phiếu Kiểm Kho: ${code}`,
      subtitle: 'Xóa Bản Ghi Kiểm Kho',
      icon: 'delete',
      variant: 'danger',
      confirmText: 'Xác Nhận Xóa Phiếu',
      message: (
        <div className="space-y-2 text-xs">
          <p className="text-red-800 font-semibold">
            CẢNH BÁO: Thao tác này không thể hoàn tác!
          </p>
          <p>
            Bạn có chắc chắn muốn xóa vĩnh viễn phiếu kiểm kho <strong>{code}</strong> khỏi hệ thống?
          </p>
        </div>
      ),
      onConfirm: () => {
        deleteAuditSheet(code);
        if (expandedLogCode === code) setExpandedLogCode(null);
        showToast(`✓ Đã xóa thành công phiếu kiểm kho ${code}`);
      },
    });
  };

  // Lưu sửa nhanh giá bán & tồn kho với xác nhận
  const handleSaveQuickEdit = (p) => {
    const newPriceNum = Number(inlinePrice);
    const newStockNum = Number(inlineStock);

    if (newPriceNum <= 0) {
      showToast('⚠️ Giá bán phải lớn hơn 0 đ');
      return;
    }
    if (newStockNum < 0) {
      showToast('⚠️ Số lượng tồn kho không được âm');
      return;
    }

    requestConfirmation({
      title: `Xác Nhận Cập Nhật Dược Liệu: ${p.name}`,
      subtitle: 'Sửa Nhanh Giá Bán & Tồn Kho',
      icon: 'published_with_changes',
      variant: 'primary',
      confirmText: 'Xác Nhận Lưu Thay Đổi',
      message: (
        <div className="space-y-2 text-xs">
          <p>
            Bạn có chắc chắn muốn thay đổi thông tin dược liệu <strong>#{p.id} - {p.name}</strong>?
          </p>
          <div className="bg-[#faf8f3] p-2.5 border border-[#ded7ca] space-y-1">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Giá bán lẻ:</span>
              <span className="font-mono font-bold text-primary">
                {formatCurrency(p.price)} ➔ <span className="text-tertiary">{formatCurrency(newPriceNum)}</span>
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Tồn kho thực tế:</span>
              <span className="font-mono font-bold text-primary">
                {p.stock} gói ➔ <span className="text-emerald-700">{newStockNum} gói</span>
              </span>
            </div>
          </div>
        </div>
      ),
      onConfirm: () => {
        updateProduct(p.id, {
          price: newPriceNum,
          stock: newStockNum,
        });
        setEditingProdId(null);
        showToast(`✓ Đã cập nhật dược liệu #${p.id} (${p.name}): ${formatCurrency(newPriceNum)} | ${newStockNum} gói`);
      },
    });
  };

  // Xóa dược liệu với xác nhận
  const handleDeleteProduct = (p) => {
    requestConfirmation({
      title: `Xác Nhận Xóa Dược Liệu: ${p.name}`,
      subtitle: 'Xóa Dược Liệu Khỏi Kho Hàng',
      icon: 'delete_forever',
      variant: 'danger',
      confirmText: 'Xác Nhận Xóa Vĩnh Viễn',
      message: (
        <div className="space-y-2 text-xs">
          <p className="text-red-800 font-semibold">
            CẢNH BÁO: Thao tác này sẽ loại bỏ hoàn toàn dược liệu khỏi danh mục bán lẻ!
          </p>
          <p>
            Bạn có chắc chắn muốn xóa dược liệu <strong>#{p.id} - {p.name}</strong>?
          </p>
          <div className="bg-red-50 p-2.5 border border-red-200 text-red-900 space-y-1">
            <div>• Danh mục: <strong>{p.category_name}</strong></div>
            <div>• Quy cách: <strong>{p.unit}</strong></div>
            <div>• Tồn kho hiện có: <strong>{p.stock} gói</strong></div>
          </div>
        </div>
      ),
      onConfirm: () => {
        deleteProduct(p.id);
        showToast(`✓ Đã xóa hoàn tất dược liệu "${p.name}"`);
      },
    });
  };

  // In phiếu kiểm kho
  const handlePrintSheet = () => {
    window.print();
  };

  // Tính toán nhanh tổng tồn kho & giá trị
  const totalStockCount = products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
  const totalStockValue = products.reduce((sum, p) => sum + (Number(p.stock) || 0) * (p.price || 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.order_status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-[#1c241e] flex flex-col font-sans">
      {/* =========================================================================
          1. THANH QUẢN LÝ ADMIN (STICKY CÙNG THANH NAV CHÍNH, KHÔNG BỊ CUỐN MẤT)
             - Đầy đủ 5 Tab: Tổng Quan 2026, Phiếu Kiểm Kho, Hàng Hóa, Hóa Đơn, Cài Đặt (VietQR & Ship)
             - Hoàn toàn Rounded-None, sắc nét chuẩn ERP
          ========================================================================= */}
      <header className="bg-[#1d3527] border-b border-[#2a4d38] text-white sticky top-16 md:top-20 z-40 shadow-sm">
        <div className="max-w-[1700px] mx-auto px-2 sm:px-6 flex items-center justify-between h-12 sm:h-13">
          {/* Navigation Tabs (5 Tabs chính) */}
          <nav className="flex items-center gap-1.5 overflow-x-auto scrollbar-none flex-nowrap py-1">
            {/* Tab 1: Tổng Quan Dashboard 2026 */}
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer rounded-lg ${
                activeTab === 'overview'
                  ? 'bg-[#2a4d38] text-[#d4b986] shadow-xs'
                  : 'text-[#d6dfd3] hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-base">analytics</span>
              <span>Tổng Quan</span>
            </button>

            {/* Tab 2: Phiếu Kiểm Kho */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('audit');
                setStatusFilter('all');
              }}
              className={`px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer rounded-lg ${
                activeTab === 'audit'
                  ? 'bg-[#2a4d38] text-[#d4b986] shadow-xs'
                  : 'text-[#d6dfd3] hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-base">fact_check</span>
              <span>Phiếu Kiểm Kho</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-[#d4b986]/20 text-[#e6d8b9] rounded-full border border-[#d4b986]/30 font-mono">
                {auditLogs.length}
              </span>
            </button>

            {/* Tab 3: Hàng Hóa & Tồn Kho */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('products');
                setStatusFilter('all');
              }}
              className={`px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer rounded-lg ${
                activeTab === 'products'
                  ? 'bg-[#2a4d38] text-[#d4b986] shadow-xs'
                  : 'text-[#d6dfd3] hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-base">inventory_2</span>
              <span>Hàng Hóa &amp; Tồn Kho</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-white/15 text-white rounded-full border border-white/20 font-mono">
                {products.length}
              </span>
            </button>

            {/* Tab 4: Hóa Đơn & Đơn Hàng */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('orders');
                setOrderStatusFilter('all');
              }}
              className={`px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer rounded-lg ${
                activeTab === 'orders'
                  ? 'bg-[#2a4d38] text-[#d4b986] shadow-xs'
                  : 'text-[#d6dfd3] hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-base">receipt_long</span>
              <span>Hóa Đơn &amp; Đơn Hàng</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 font-mono font-bold rounded-full ${
                  pendingOrdersCount > 0
                    ? 'bg-amber-500 text-white animate-pulse'
                    : 'bg-white/15 text-white border border-white/20'
                }`}
              >
                {orders.length}
              </span>
            </button>

            {/* Tab 5: Cài Đặt (Setup VietQR & Phí Ship) */}
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer rounded-lg ${
                activeTab === 'settings'
                  ? 'bg-[#2a4d38] text-[#d4b986] shadow-xs'
                  : 'text-[#d6dfd3] hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-base">settings</span>
              <span>Cài Đặt (VietQR &amp; Ship)</span>
            </button>
          </nav>

          {/* Right User Actions & View Store button */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Chuông Thông Báo Đơn Hàng Mới */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-1.5 text-[#d4b986] hover:bg-white/10 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
                title="Thông báo đơn hàng mới"
              >
                <span className="material-symbols-outlined text-xl">notifications</span>
                {orders.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {orders.length}
                  </span>
                )}
              </button>

              {/* Dropdown Danh Sách Thông Báo Đơn Hàng */}
              {notifDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-[#1c241e] border border-border-herbal shadow-2xl rounded-2xl z-50 animate-scaleUp overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="bg-[#1d3527] text-white px-4 py-3 flex items-center justify-between border-b border-[#2a4d38]">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#d4b986] text-base">notifications_active</span>
                      <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#d4b986]">
                        Thông Báo Đơn Hàng ({orders.length})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotifDropdownOpen(false)}
                      className="text-white/60 hover:text-white p-0.5 cursor-pointer rounded-md hover:bg-white/10"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-border-herbal/50">
                    {orders.length === 0 ? (
                      <div className="p-6 text-center text-xs text-on-surface-variant">
                        <span className="material-symbols-outlined text-2xl text-outline mb-1 block">notifications_off</span>
                        <span>Chưa có thông báo đơn hàng nào mới</span>
                      </div>
                    ) : (
                      orders.slice(0, 10).map((o) => (
                        <div
                          key={o.order_code}
                          onClick={() => {
                            setSelectedOrder(o);
                            setNotifDropdownOpen(false);
                          }}
                          className="p-3 hover:bg-[#faf8f3] cursor-pointer transition-colors flex items-start gap-2.5"
                        >
                          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${o.payment_status === 'PAID' ? 'bg-green-600' : 'bg-amber-500'}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-mono font-bold text-xs text-primary">#{o.order_code}</span>
                              <span className="font-serif font-bold text-xs text-tertiary">{formatCurrency(o.total || 0)}</span>
                            </div>
                            <p className="text-xs text-primary font-medium truncate mt-0.5">{o.customer_name} • {o.customer_phone}</p>
                            <div className="flex items-center justify-between mt-1 text-[10px]">
                              <span className={o.payment_status === 'PAID' ? 'text-green-700 font-bold' : 'text-amber-700 font-bold'}>
                                {o.payment_status === 'PAID' ? '✓ Đã thanh toán (VietQR)' : '• Chờ thanh toán'}
                              </span>
                              <span className="text-on-surface-variant">
                                {o.created_at ? new Date(o.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : 'Vừa xong'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {orders.length > 0 && (
                    <div className="p-2.5 bg-[#f8f6f0] border-t border-border-herbal text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('orders');
                          setNotifDropdownOpen(false);
                        }}
                        className="text-[11px] font-bold text-primary hover:text-secondary uppercase tracking-wider cursor-pointer"
                      >
                        Xem tất cả {orders.length} hóa đơn trong hệ thống →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Link
              to="/"
              className="px-3 py-1.5 bg-[#2a4d38] hover:bg-[#345e45] text-[#d4b986] border border-[#d4b986]/40 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-xs"
              title="Mở giao diện khách hàng mua sắm"
            >
              <span className="material-symbols-outlined text-sm">storefront</span>
              <span className="hidden sm:inline">Bán Hàng</span>
            </Link>

            <div className="hidden md:flex items-center gap-2 pl-2 border-l border-white/20">
              <div className="w-6 h-6 bg-[#d4b986]/30 text-[#f5eedd] flex items-center justify-center font-bold text-xs rounded-full">
                A
              </div>
              <span className="text-xs font-semibold text-white/90 truncate max-w-[140px]">
                {user?.name || user?.email || 'admin'}
              </span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 text-white/70 hover:text-red-300 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Đăng xuất khỏi hệ thống"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. WORKSPACE BẰNG PHẲNG (ROUNDED-NONE, VUÔNG VẮN)
          ========================================================================= */}
      <div className="flex-1 max-w-[1700px] w-full mx-auto p-2 sm:p-4 lg:p-5 flex flex-col gap-3.5">
        {/* =========================================================================
            TAB 1: EXECUTIVE DASHBOARD 2026 (LỢI NHUẬN THUẦN & ĐƠN HÀNG MỚI)
            ========================================================================= */}
        {activeTab === 'overview' && (
          <AdminOverviewDashboard
            orders={orders}
            products={products}
            onNavigateTab={(tabName) => setActiveTab(tabName)}
          />
        )}

        {/* =========================================================================
            TAB 5: CÀI ĐẶT HỆ THỐNG (TÀI KHOẢN NGÂN HÀNG, VIETQR NAPAS247 & PHÍ SHIP)
            ========================================================================= */}
        {activeTab === 'settings' && (
          <AdminSettingsTab
            settings={settings}
            requestConfirmation={requestConfirmation}
            onSaveSettings={(newSettings) => {
              updateSettings(newSettings);
              showToast('✓ Đã lưu cấu hình tài khoản VietQR, Gmail & phí ship thành công!');
            }}
          />
        )}

        {/* =========================================================================
            CÁC TAB QUẢN TRỊ 2 CỘT (PHIẾU KIỂM KHO, HÀNG HÓA & HÓA ĐƠN)
            ========================================================================= */}
        {(activeTab === 'audit' || activeTab === 'products' || activeTab === 'orders') && (
          <div className="flex flex-col md:flex-row gap-3.5 items-start w-full">
            {/* Nút bấm hiển thị bộ lọc trên Di động */}
            <div className="w-full md:hidden flex items-center justify-between bg-white p-3 border border-border-herbal shadow-xs rounded-none">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider cursor-pointer"
              >
                <span className="material-symbols-outlined text-base text-[#8a7258]">tune</span>
                <span>{mobileFilterOpen ? 'Ẩn bộ lọc tìm kiếm ▲' : 'Hiện bộ lọc tìm kiếm & phân loại ▼'}</span>
              </button>
              <span className="text-[11px] text-on-surface-variant font-medium">
                {activeTab === 'audit'
                  ? `${filteredAuditLogs.length} phiếu`
                  : activeTab === 'products'
                  ? `${filteredProducts.length} dược liệu`
                  : `${filteredOrders.length} hóa đơn`}
              </span>
            </div>

            {/* CỘT TRÁI: SIDEBAR BỘ LỌC TÌM KIẾM */}
            <aside
              className={`w-full md:w-64 lg:w-72 shrink-0 flex flex-col gap-3 ${
                mobileFilterOpen ? 'block' : 'hidden md:flex'
              }`}
            >
              {/* Card 1: Ô Tìm Kiếm */}
              <div className="bg-white border border-border-herbal shadow-xs rounded-xl overflow-hidden">
                <div className="bg-[#1d3527] text-[#d4b986] px-3.5 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">search</span>
                  <span>Tìm kiếm</span>
                </div>
                <div className="p-3 space-y-2.5 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-primary mb-1">
                      {activeTab === 'audit'
                        ? 'Theo mã phiếu kiểm'
                        : activeTab === 'products'
                        ? 'Theo mã dược liệu (#)'
                        : 'Theo mã hóa đơn (#)'}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchCode}
                        onChange={(e) => setSearchCode(e.target.value)}
                        placeholder={
                          activeTab === 'audit'
                            ? 'VD: KK000001'
                            : activeTab === 'products'
                            ? 'VD: #1, #2...'
                            : 'VD: NH-1234'
                        }
                        className="w-full pl-8 pr-2.5 py-1.5 bg-[#faf8f3] border border-border-herbal rounded-xl text-xs text-primary focus:outline-none focus:border-[#1d3527] font-mono"
                      />
                      <span className="material-symbols-outlined text-outline text-sm absolute left-2 top-2">
                        tag
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-primary mb-1">
                      {activeTab === 'audit'
                        ? 'Theo tên hàng trong phiếu'
                        : activeTab === 'products'
                        ? 'Theo tên vị dược liệu'
                        : 'Theo tên / SĐT khách'}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        placeholder="Nhập từ khóa tìm..."
                        className="w-full pl-8 pr-2.5 py-1.5 bg-[#faf8f3] border border-border-herbal rounded-xl text-xs text-primary focus:outline-none focus:border-[#1d3527]"
                      />
                      <span className="material-symbols-outlined text-outline text-sm absolute left-2 top-2">
                        manage_search
                      </span>
                    </div>
                  </div>

                  {(searchCode || searchName) && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchCode('');
                        setSearchName('');
                      }}
                      className="w-full py-1 text-[11px] text-red-600 hover:text-red-700 hover:underline flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xs">restart_alt</span>
                      <span>Xóa bộ lọc tìm kiếm</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Card 2: Trạng thái */}
              <div className="bg-white border border-border-herbal shadow-xs rounded-xl overflow-hidden">
                <div className="bg-[#1d3527] text-[#d4b986] px-3.5 py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">filter_alt</span>
                    <span>Trạng thái</span>
                  </span>
                </div>
                <div className="p-3 space-y-2 text-xs">
                  {activeTab === 'audit' && (
                    <>
                      <label className="flex items-center gap-2 cursor-pointer font-medium hover:text-primary">
                        <input
                          type="radio"
                          name="auditStatus"
                          checked={statusFilter === 'all'}
                          onChange={() => setStatusFilter('all')}
                          className="accent-[#14261a]"
                        />
                        <span>Tất cả phiếu kiểm</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer font-medium hover:text-primary">
                        <input
                          type="radio"
                          name="auditStatus"
                          checked={statusFilter === 'Đã cân bằng kho'}
                          onChange={() => setStatusFilter('Đã cân bằng kho')}
                          className="accent-[#14261a]"
                        />
                        <span className="text-green-700 font-semibold">Đã cân bằng kho</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer font-medium hover:text-primary">
                        <input
                          type="radio"
                          name="auditStatus"
                          checked={statusFilter === 'Phiếu tạm'}
                          onChange={() => setStatusFilter('Phiếu tạm')}
                          className="accent-[#14261a]"
                        />
                        <span className="text-amber-700 font-semibold">Phiếu tạm (Chưa cân bằng)</span>
                      </label>
                    </>
                  )}

                  {activeTab === 'products' && (
                    <>
                      <label className="flex items-center gap-2 cursor-pointer font-medium hover:text-primary">
                        <input
                          type="radio"
                          name="prodStatus"
                          checked={statusFilter === 'all'}
                          onChange={() => setStatusFilter('all')}
                          className="accent-[#14261a]"
                        />
                        <span>Tất cả dược liệu ({products.length})</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer font-medium hover:text-primary">
                        <input
                          type="radio"
                          name="prodStatus"
                          checked={statusFilter === 'Còn hàng'}
                          onChange={() => setStatusFilter('Còn hàng')}
                          className="accent-[#14261a]"
                        />
                        <span className="text-green-700 font-semibold">Còn hàng dồi dào</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer font-medium hover:text-primary">
                        <input
                          type="radio"
                          name="prodStatus"
                          checked={statusFilter === 'Sắp hết'}
                          onChange={() => setStatusFilter('Sắp hết')}
                          className="accent-[#14261a]"
                        />
                        <span className="text-amber-700 font-semibold">Cảnh báo sắp hết (&le; 20 gói)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer font-medium hover:text-primary">
                        <input
                          type="radio"
                          name="prodStatus"
                          checked={statusFilter === 'Hết hàng'}
                          onChange={() => setStatusFilter('Hết hàng')}
                          className="accent-[#14261a]"
                        />
                        <span className="text-red-700 font-semibold">Đã hết hàng</span>
                      </label>
                    </>
                  )}

                  {activeTab === 'orders' && (
                    <>
                      {[
                        { label: 'Tất cả đơn', val: 'all' },
                        { label: 'Chờ xác nhận', val: 'PENDING' },
                        { label: 'Đang giao hàng', val: 'SHIPPING' },
                        { label: 'Đã thanh toán', val: 'PAID' },
                        { label: 'Đã hoàn tất', val: 'COMPLETED' },
                      ].map((it) => (
                        <label key={it.val} className="flex items-center gap-2 cursor-pointer font-medium hover:text-primary">
                          <input
                            type="radio"
                            name="orderStatus"
                            checked={orderStatusFilter === it.val}
                            onChange={() => setOrderStatusFilter(it.val)}
                            className="accent-[#14261a]"
                          />
                          <span>{it.label}</span>
                        </label>
                      ))}
                    </>
                  )}
                </div>
              </div>

              {/* Card 3: Nhóm hàng / Danh mục */}
              {activeTab === 'products' && (
                <div className="bg-white border border-border-herbal shadow-xs rounded-xl overflow-hidden">
                  <div className="bg-[#1d3527] text-[#d4b986] px-3.5 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">category</span>
                    <span>Nhóm dược liệu</span>
                  </div>
                  <div className="p-3 space-y-2 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer font-medium hover:text-primary">
                      <input
                        type="radio"
                        name="catFilter"
                        checked={categoryFilter === 'all'}
                        onChange={() => setCategoryFilter('all')}
                        className="accent-[#1d3527]"
                      />
                      <span>Tất cả nhóm</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-medium hover:text-primary">
                      <input
                        type="radio"
                        name="catFilter"
                        checked={categoryFilter === 'bai-thuoc-xong-tam'}
                        onChange={() => setCategoryFilter('bai-thuoc-xong-tam')}
                        className="accent-[#1d3527]"
                      />
                      <span>Bài Thuốc Xông Tắm</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-medium hover:text-primary">
                      <input
                        type="radio"
                        name="catFilter"
                        checked={categoryFilter === 'duoc-lieu-le'}
                        onChange={() => setCategoryFilter('duoc-lieu-le')}
                        className="accent-[#1d3527]"
                      />
                      <span>Dược Liệu Lẻ Đơn Vị</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Card 4: Thống Kê Nhanh Kho Hàng */}
              <div className="bg-white border border-border-herbal p-3 shadow-xs rounded-xl space-y-2 text-xs">
                <span className="text-[10px] font-bold text-[#8a7258] uppercase tracking-wider block">
                  Tổng quan tồn kho
                </span>
                <div className="flex justify-between items-center py-1 border-b border-border-herbal/50">
                  <span className="text-on-surface-variant">Tổng vị dược liệu:</span>
                  <span className="font-bold text-primary">{products.length} vị</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-border-herbal/50">
                  <span className="text-on-surface-variant">Tổng số lượng kho:</span>
                  <span className="font-bold text-primary">{totalStockCount} gói</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-on-surface-variant">Ước tính giá trị kho:</span>
                  <span className="font-serif font-bold text-primary">{formatCurrency(totalStockValue)}</span>
                </div>
              </div>
            </aside>

            {/* CỘT PHẢI: BẢNG DỮ LIỆU CHÍNH */}
            <main className="flex-1 w-full min-w-0 flex flex-col gap-3">
              {/* Top Action Bar */}
              <div className="bg-white border border-border-herbal p-3 sm:p-4 shadow-xs rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="font-serif text-lg sm:text-xl font-bold text-primary flex items-center gap-2">
                    {activeTab === 'audit' && (
                      <>
                        <span className="material-symbols-outlined text-[#8a7258] text-xl">fact_check</span>
                        <span>Phiếu Kiểm Kho</span>
                      </>
                    )}
                    {activeTab === 'products' && (
                      <>
                        <span className="material-symbols-outlined text-[#8a7258] text-xl">inventory_2</span>
                        <span>Hàng Hóa &amp; Quản Lý Tồn Kho</span>
                      </>
                    )}
                    {activeTab === 'orders' && (
                      <>
                        <span className="material-symbols-outlined text-[#8a7258] text-xl">receipt_long</span>
                        <span>Hóa Đơn &amp; Đơn Hàng</span>
                      </>
                    )}
                  </h1>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {activeTab === 'audit' && 'Bấm vào từng dòng để xem chi tiết đối soát thực tế & cân bằng kho'}
                    {activeTab === 'products' && 'Chỉnh sửa giá bán lẻ và tồn kho trực tiếp trên từng sản phẩm'}
                    {activeTab === 'orders' && 'Xem chi tiết đơn mua hàng của khách, in hóa đơn và cập nhật giao hàng'}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {activeTab === 'audit' && (
                    <button
                      type="button"
                      onClick={() => setAuditModalOpen(true)}
                      className="px-3.5 py-1.5 bg-[#2d7d46] hover:bg-[#25693a] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">add</span>
                      <span>+ Kiểm kho</span>
                    </button>
                  )}

                  {activeTab === 'products' && (
                    <button
                      type="button"
                      onClick={() => {
                        setProductToEdit(null);
                        setProductModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 bg-[#2d7d46] hover:bg-[#25693a] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">add</span>
                      <span>+ Thêm dược liệu</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleExportCsv}
                    className="px-3.5 py-1.5 bg-[#2d7d46] hover:bg-[#25693a] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Tải bảng dữ liệu dạng file CSV (mở được bằng Excel)"
                  >
                    <span className="material-symbols-outlined text-base">file_download</span>
                    <span>Xuất file</span>
                  </button>
                </div>
              </div>

              {/* View 1: Tab Phiếu Kiểm Kho */}
              {activeTab === 'audit' && (
                <div className="bg-white border border-border-herbal shadow-xs rounded-xl overflow-hidden">
                  {filteredAuditLogs.length === 0 ? (
                    <div className="py-16 text-center text-xs text-on-surface-variant flex flex-col items-center">
                      <span className="material-symbols-outlined text-4xl text-outline mb-2">fact_check</span>
                      <p className="font-semibold text-primary">Không có phiếu kiểm kho nào phù hợp</p>
                    </div>
                  ) : (
                    <>
                      {/* Mobile View */}
                      <div className="block md:hidden divide-y divide-border-herbal">
                        {filteredAuditLogs.map((log) => {
                          const isExpanded = expandedLogCode === log.code;
                          return (
                            <div key={log.code} className="p-3.5 bg-white space-y-2.5">
                              <div
                                onClick={() => toggleRowExpand(log.code)}
                                className="flex items-center justify-between cursor-pointer"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-primary text-sm">
                                    {log.code}
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 text-[10px] font-bold border rounded-none ${
                                      log.status === 'Đã cân bằng kho'
                                        ? 'bg-green-50 text-green-800 border-green-300'
                                        : 'bg-amber-50 text-amber-800 border-amber-300'
                                    }`}
                                  >
                                    {log.status}
                                  </span>
                                </div>
                                <span className="material-symbols-outlined text-base text-[#8a7258]">
                                  {isExpanded ? 'expand_less' : 'expand_more'}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-xs py-1 border-t border-b border-border-herbal/50">
                                <div>
                                  <span className="text-[10px] text-on-surface-variant uppercase block">Thời gian:</span>
                                  <span className="text-primary font-medium">
                                    {log.created_at ? new Date(log.created_at).toLocaleDateString('vi-VN') : '—'}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[10px] text-on-surface-variant uppercase block">Tổng chênh lệch:</span>
                                  <span
                                    className={`font-mono font-bold ${
                                      log.total_diff === 0
                                        ? 'text-gray-600'
                                        : log.total_diff > 0
                                        ? 'text-green-700'
                                        : 'text-red-700'
                                    }`}
                                  >
                                    {log.total_diff > 0 ? `+${log.total_diff}` : log.total_diff} gói
                                  </span>
                                </div>
                              </div>

                              {isExpanded && (
                                <div className="pt-2 space-y-3 bg-[#faf8f3] p-3 border border-border-herbal rounded-none text-xs">
                                  <div className="space-y-1">
                                    <div className="text-[11px] text-on-surface-variant">
                                      <strong>Người tạo:</strong> {log.creator || 'Quản Trị Viên Ngân Hà'}
                                    </div>
                                    <div className="text-[11px] text-on-surface-variant">
                                      <strong>Ghi chú:</strong> "{log.note || 'Không có ghi chú'}"
                                    </div>
                                  </div>

                                  <div className="border border-border-herbal rounded-none overflow-hidden bg-white">
                                    <table className="w-full text-left text-xs">
                                      <thead className="bg-[#14261a]/5 text-primary text-[10px] uppercase font-bold border-b border-border-herbal">
                                        <tr>
                                          <th className="py-1.5 px-2">Dược liệu</th>
                                          <th className="py-1.5 px-2 text-right">Sổ</th>
                                          <th className="py-1.5 px-2 text-right">Thực</th>
                                          <th className="py-1.5 px-2 text-right">Lệch</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-border-herbal/40">
                                        {(log.items || []).map((it, idx) => (
                                          <tr key={idx}>
                                            <td className="py-1.5 px-2 font-medium text-primary line-clamp-1">{it.name}</td>
                                            <td className="py-1.5 px-2 text-right">{it.system_stock}</td>
                                            <td className="py-1.5 px-2 text-right font-bold">{it.actual_stock}</td>
                                            <td
                                              className={`py-1.5 px-2 text-right font-bold ${
                                                it.diff === 0 ? 'text-gray-500' : it.diff > 0 ? 'text-green-700' : 'text-red-700'
                                              }`}
                                            >
                                              {it.diff > 0 ? `+${it.diff}` : it.diff}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>

                                  <div className="flex items-center gap-2 pt-1">
                                    {log.status === 'Phiếu tạm' && (
                                      <button
                                        type="button"
                                        onClick={() => handleBalanceSheet(log.code)}
                                        className="flex-1 py-1.5 bg-green-700 text-white font-bold text-xs rounded-none flex items-center justify-center gap-1 cursor-pointer"
                                      >
                                        <span className="material-symbols-outlined text-sm">done_all</span>
                                        <span>Cân Bằng Ngay</span>
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      onClick={handlePrintSheet}
                                      className="px-3 py-1.5 bg-white border border-border-herbal text-primary font-semibold text-xs rounded-none cursor-pointer"
                                    >
                                      In Phiếu
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteSheet(log.code)}
                                      className="p-1.5 text-red-600 bg-red-50 border border-red-200 rounded-none cursor-pointer"
                                    >
                                      <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Desktop View */}
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead className="bg-[#14261a]/5 text-primary uppercase tracking-wider text-[10px] border-b border-border-herbal font-bold">
                            <tr>
                              <th className="py-2.5 px-3 w-10 text-center">
                                <input
                                  type="checkbox"
                                  checked={
                                    selectedLogCodes.length > 0 &&
                                    selectedLogCodes.length === filteredAuditLogs.length
                                  }
                                  onChange={handleSelectAllLogs}
                                  className="accent-[#14261a] cursor-pointer rounded-none"
                                />
                              </th>
                              <th className="py-2.5 px-3">Mã kiểm kho</th>
                              <th className="py-2.5 px-3">Thời gian</th>
                              <th className="py-2.5 px-3">Ngày cân bằng</th>
                              <th className="py-2.5 px-3 text-right">Tổng chênh lệch</th>
                              <th className="py-2.5 px-3 text-right">Tổng giá trị lệch</th>
                              <th className="py-2.5 px-3 text-right">SL lệch tăng</th>
                              <th className="py-2.5 px-3 text-right">Tổng giá trị tăng</th>
                              <th className="py-2.5 px-3 text-center">Trạng thái</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border-herbal/60">
                            {filteredAuditLogs.map((log) => {
                              const isExpanded = expandedLogCode === log.code;
                              const isSelected = selectedLogCodes.includes(log.code);

                              return (
                                <React.Fragment key={log.code}>
                                  <tr
                                    onClick={() => toggleRowExpand(log.code)}
                                    className={`cursor-pointer transition-colors ${
                                      isExpanded
                                        ? 'bg-[#faf8f3] font-medium'
                                        : 'hover:bg-surface-container-low/50'
                                    } ${isSelected ? 'bg-amber-50/60' : ''}`}
                                  >
                                    <td
                                      className="py-2.5 px-3 text-center"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleSelectLog(log.code);
                                      }}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => {}}
                                        className="accent-[#14261a] cursor-pointer rounded-none"
                                      />
                                    </td>
                                    <td className="py-2.5 px-3 font-mono font-bold text-primary flex items-center gap-1.5">
                                      <span className="material-symbols-outlined text-sm text-[#8a7258]">
                                        {isExpanded ? 'expand_more' : 'chevron_right'}
                                      </span>
                                      <span>{log.code}</span>
                                    </td>
                                    <td className="py-2.5 px-3 text-on-surface-variant">
                                      {log.created_at
                                        ? new Date(log.created_at).toLocaleString('vi-VN', {
                                            dateStyle: 'short',
                                            timeStyle: 'short',
                                          })
                                        : '—'}
                                    </td>
                                    <td className="py-2.5 px-3 text-on-surface-variant">
                                      {log.balanced_at
                                        ? new Date(log.balanced_at).toLocaleString('vi-VN', {
                                            dateStyle: 'short',
                                            timeStyle: 'short',
                                          })
                                        : '—'}
                                    </td>
                                    <td className="py-2.5 px-3 text-right font-mono font-bold">
                                      <span
                                        className={
                                          log.total_diff === 0
                                            ? 'text-gray-600'
                                            : log.total_diff > 0
                                            ? 'text-green-700'
                                            : 'text-red-700'
                                        }
                                      >
                                        {log.total_diff > 0 ? `+${log.total_diff}` : log.total_diff}
                                      </span>
                                    </td>
                                    <td className="py-2.5 px-3 text-right font-medium">
                                      <span
                                        className={
                                          log.total_diff_value === 0
                                            ? 'text-gray-600'
                                            : log.total_diff_value > 0
                                            ? 'text-green-700 font-bold'
                                            : 'text-red-700 font-bold'
                                        }
                                      >
                                        {formatCurrency(log.total_diff_value || 0)}
                                      </span>
                                    </td>
                                    <td className="py-2.5 px-3 text-right font-mono text-green-700 font-semibold">
                                      {log.total_increase || 0}
                                    </td>
                                    <td className="py-2.5 px-3 text-right text-green-700 font-medium">
                                      {formatCurrency((log.total_increase || 0) * 45000)}
                                    </td>
                                    <td className="py-2.5 px-3 text-center">
                                      <span
                                        className={`px-2 py-0.5 text-[10px] font-bold border rounded-none ${
                                          log.status === 'Đã cân bằng kho'
                                            ? 'bg-green-50 text-green-800 border-green-300'
                                            : 'bg-amber-50 text-amber-800 border-amber-300'
                                        }`}
                                      >
                                        {log.status}
                                      </span>
                                    </td>
                                  </tr>

                                  {isExpanded && (
                                    <tr className="bg-[#faf8f3]">
                                      <td colSpan={9} className="p-3 sm:p-5 border-t border-b border-border-herbal">
                                        <div className="bg-white border border-border-herbal p-4 shadow-2xs rounded-none space-y-4">
                                          <div className="flex items-center justify-between border-b border-border-herbal pb-2">
                                            <div className="flex items-center gap-2">
                                              <button
                                                type="button"
                                                className="px-3 py-1 bg-[#14261a] text-[#cbb07c] font-bold text-xs rounded-none"
                                              >
                                                Thông tin
                                              </button>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              {log.status === 'Phiếu tạm' && (
                                                <button
                                                  type="button"
                                                  onClick={() => handleBalanceSheet(log.code)}
                                                  className="px-3 py-1 bg-green-700 hover:bg-green-800 text-white font-bold text-xs rounded-none flex items-center gap-1 cursor-pointer"
                                                >
                                                  <span className="material-symbols-outlined text-sm">done_all</span>
                                                  <span>Cân Bằng Kho Ngay</span>
                                                </button>
                                              )}
                                              <button
                                                type="button"
                                                onClick={handlePrintSheet}
                                                className="px-2.5 py-1 bg-surface hover:bg-surface-container border border-border-herbal text-primary font-semibold text-xs rounded-none flex items-center gap-1 cursor-pointer"
                                              >
                                                <span className="material-symbols-outlined text-sm">print</span>
                                                <span>In Phiếu</span>
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => handleDeleteSheet(log.code)}
                                                className="p-1 text-red-600 hover:bg-red-50 rounded-none cursor-pointer"
                                                title="Xóa phiếu"
                                              >
                                                <span className="material-symbols-outlined text-base">delete</span>
                                              </button>
                                            </div>
                                          </div>

                                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                                            <div className="space-y-1.5">
                                              <div className="flex gap-2">
                                                <span className="text-on-surface-variant w-28 shrink-0">Mã kiểm kho:</span>
                                                <span className="font-mono font-bold text-primary">{log.code}</span>
                                              </div>
                                              <div className="flex gap-2">
                                                <span className="text-on-surface-variant w-28 shrink-0">Thời gian:</span>
                                                <span className="font-medium text-primary">
                                                  {log.created_at ? new Date(log.created_at).toLocaleString('vi-VN') : '—'}
                                                </span>
                                              </div>
                                              <div className="flex gap-2">
                                                <span className="text-on-surface-variant w-28 shrink-0">Ngày cân bằng:</span>
                                                <span className="font-medium text-primary">
                                                  {log.balanced_at ? new Date(log.balanced_at).toLocaleString('vi-VN') : '—'}
                                                </span>
                                              </div>
                                            </div>

                                            <div className="space-y-1.5">
                                              <div className="flex gap-2">
                                                <span className="text-on-surface-variant w-28 shrink-0">Trạng thái:</span>
                                                <span className="font-bold text-green-700">{log.status}</span>
                                              </div>
                                              <div className="flex gap-2">
                                                <span className="text-on-surface-variant w-28 shrink-0">Người tạo:</span>
                                                <span className="font-medium text-primary">{log.creator || 'Quản Trị Viên Ngân Hà'}</span>
                                              </div>
                                              <div className="flex gap-2">
                                                <span className="text-on-surface-variant w-28 shrink-0">Người cân bằng:</span>
                                                <span className="font-medium text-primary">{log.balancer || 'Quản Trị Viên Ngân Hà'}</span>
                                              </div>
                                            </div>

                                            <div className="sm:col-span-2 lg:col-span-1 p-2.5 bg-[#faf8f3] border border-border-herbal rounded-none">
                                              <span className="text-[10px] font-bold text-[#8a7258] uppercase tracking-wider block mb-1">
                                                Ghi chú phiếu
                                              </span>
                                              <p className="text-xs text-on-surface italic">
                                                "{log.note || 'Không có ghi chú'}"
                                              </p>
                                            </div>
                                          </div>

                                          <div className="border border-border-herbal rounded-none overflow-hidden">
                                            <table className="w-full text-left text-xs">
                                              <thead className="bg-[#14261a]/5 text-primary text-[10px] uppercase tracking-wider font-bold border-b border-border-herbal">
                                                <tr>
                                                  <th className="py-2 px-3">Mã hàng hóa</th>
                                                  <th className="py-2 px-3">Tên hàng</th>
                                                  <th className="py-2 px-3 text-center">Đơn vị</th>
                                                  <th className="py-2 px-3 text-right">Tồn kho</th>
                                                  <th className="py-2 px-3 text-right">Thực tế</th>
                                                  <th className="py-2 px-3 text-right">SL lệch</th>
                                                </tr>
                                              </thead>
                                              <tbody className="divide-y divide-border-herbal/50 bg-white">
                                                {(log.items || []).map((item, idx) => (
                                                  <tr key={idx} className="hover:bg-surface-container-low/30">
                                                    <td className="py-2 px-3 font-mono font-semibold text-outline">
                                                      SP00000{item.product_id}
                                                    </td>
                                                    <td className="py-2 px-3 font-medium text-primary">
                                                      {item.name}
                                                    </td>
                                                    <td className="py-2 px-3 text-center text-on-surface-variant text-[11px]">
                                                      {item.unit}
                                                    </td>
                                                    <td className="py-2 px-3 text-right font-semibold text-primary">
                                                      {item.system_stock}
                                                    </td>
                                                    <td className="py-2 px-3 text-right font-bold text-primary">
                                                      {item.actual_stock}
                                                    </td>
                                                    <td className="py-2 px-3 text-right font-mono font-bold">
                                                      <span
                                                        className={
                                                          item.diff === 0
                                                            ? 'text-gray-500'
                                                            : item.diff > 0
                                                            ? 'text-green-700'
                                                            : 'text-red-700'
                                                        }
                                                      >
                                                        {item.diff > 0 ? `+${item.diff}` : item.diff}
                                                      </span>
                                                    </td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                            </table>
                                          </div>

                                          <div className="flex flex-col items-end gap-1 text-xs pt-1">
                                            <div className="flex items-center gap-6">
                                              <span className="text-on-surface-variant font-medium">Tổng thực tế:</span>
                                              <span className="font-bold text-primary min-w-[60px] text-right">
                                                {(log.items || []).reduce((s, it) => s + (it.actual_stock || 0), 0)}
                                              </span>
                                            </div>
                                            <div className="flex items-center gap-6">
                                              <span className="text-on-surface-variant font-medium">Tổng lệch tăng:</span>
                                              <span className="font-mono font-bold text-green-700 min-w-[60px] text-right">
                                                {log.total_increase || 0}
                                              </span>
                                            </div>
                                            <div className="flex items-center gap-6">
                                              <span className="text-on-surface-variant font-medium">Tổng lệch giảm:</span>
                                              <span className="font-mono font-bold text-red-700 min-w-[60px] text-right">
                                                {log.total_decrease || 0}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* View 2: Tab Hàng Hóa & Tồn Kho */}
              {activeTab === 'products' && (
                <div className="bg-white border border-border-herbal shadow-xs rounded-xl overflow-hidden">
                  <div className="p-3 border-b border-border-herbal flex items-center justify-between bg-[#14261a]/5">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      Danh mục dược liệu ({filteredProducts.length} vị)
                    </span>
                    <Link
                      to="/san-pham"
                      className="text-xs font-semibold text-[#8a7258] hover:text-primary flex items-center gap-1"
                    >
                      <span>Xem gian hàng</span>
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </Link>
                  </div>

                  {/* Mobile View */}
                  <div className="block md:hidden divide-y divide-border-herbal">
                    {filteredProducts.map((p) => {
                      const isEditing = editingProdId === p.id;
                      return (
                        <div key={p.id} className="p-3 space-y-2 bg-white">
                          <div className="flex items-start gap-2.5">
                            <img
                              src={p.thumbnail_url || '/images/products/bai-thuoc-7-vi.jpg'}
                              alt={p.name}
                              className="w-12 h-12 rounded-none object-cover border border-border-herbal shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-xs font-semibold text-outline">#{p.id}</span>
                                <span
                                  className={`px-2 py-0.5 text-[10px] font-bold border rounded-none ${
                                    p.status === 'Còn hàng'
                                      ? 'bg-green-50 text-green-800 border-green-300'
                                      : p.status === 'Sắp hết'
                                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                                      : 'bg-red-50 text-red-800 border-red-300'
                                  }`}
                                >
                                  {p.status}
                                </span>
                              </div>
                              <h4 className="font-serif font-bold text-sm text-primary line-clamp-1">{p.name}</h4>
                              <span className="text-[11px] text-on-surface-variant block">{p.unit}</span>
                            </div>
                          </div>

                          {isEditing ? (
                            <div className="p-2.5 bg-[#faf8f3] border border-[#cbb07c] rounded-none space-y-2">
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <label className="block text-[10px] font-bold text-primary">Giá bán lẻ (đ):</label>
                                  <input
                                    type="number"
                                    min="0"
                                    step="any"
                                    placeholder="VD: 50000"
                                    value={inlinePrice}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setInlinePrice(val === '' ? '' : val.replace(/^0+(?=\d)/, ''));
                                    }}
                                    className="w-full px-2 py-1 bg-white border border-primary rounded-lg font-bold tabular-nums"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-primary">Tồn kho (gói):</label>
                                  <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    placeholder="0"
                                    value={inlineStock}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setInlineStock(val === '' ? '' : val.replace(/^0+(?=\d)/, ''));
                                    }}
                                    className="w-full px-2 py-1 bg-white border border-primary rounded-lg font-bold tabular-nums"
                                  />
                                </div>
                              </div>
                              <div className="flex items-center gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => handleSaveQuickEdit(p)}
                                  className="flex-1 py-1 bg-green-700 hover:bg-green-800 text-white font-bold text-xs rounded-none cursor-pointer"
                                >
                                  Lưu
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingProdId(null)}
                                  className="px-3 py-1 bg-gray-200 text-xs font-semibold rounded-none cursor-pointer"
                                >
                                  Hủy
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between pt-1">
                              <div>
                                <span className="text-[10px] uppercase text-outline block">Giá &amp; Tồn kho:</span>
                                <span className="font-serif font-bold text-sm text-primary mr-2">
                                  {formatCurrency(p.price)}
                                </span>
                                <span className="text-xs text-on-surface-variant font-semibold">
                                  ({p.stock} {p.unit?.split(' ')?.[0] || 'gói'})
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingProdId(p.id);
                                    setInlinePrice(p.price);
                                    setInlineStock(p.stock);
                                  }}
                                  className="px-2 py-1 bg-surface-container hover:bg-surface-container-high text-xs font-semibold rounded-none border border-border-herbal"
                                >
                                  Sửa Nhanh
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setProductToEdit(p);
                                    setProductModalOpen(true);
                                  }}
                                  className="p-1 text-primary hover:bg-surface-container rounded-none border border-border-herbal"
                                  title="Chi tiết"
                                >
                                  <span className="material-symbols-outlined text-base">tune</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProduct(p)}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded-none border border-red-200 cursor-pointer"
                                  title="Xóa dược liệu"
                                >
                                  <span className="material-symbols-outlined text-base">delete</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Desktop View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#14261a]/5 text-primary text-[10px] uppercase tracking-wider font-bold border-b border-border-herbal">
                        <tr>
                          <th className="py-2.5 px-3">Ảnh &amp; Mã</th>
                          <th className="py-2.5 px-3">Tên dược liệu</th>
                          <th className="py-2.5 px-3">Quy cách</th>
                          <th className="py-2.5 px-3">Giá bán lẻ (đ)</th>
                          <th className="py-2.5 px-3">Số lượng tồn</th>
                          <th className="py-2.5 px-3">Trạng thái</th>
                          <th className="py-2.5 px-3 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-herbal/60">
                        {filteredProducts.map((p) => {
                          const isEditing = editingProdId === p.id;
                          return (
                            <tr key={p.id} className="hover:bg-surface-container-low/40 transition-colors">
                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-2">
                                  <img
                                    src={p.thumbnail_url || '/images/products/bai-thuoc-7-vi.jpg'}
                                    alt={p.name}
                                    className="w-9 h-9 rounded-none object-cover border border-border-herbal"
                                  />
                                  <span className="font-mono text-outline font-semibold">#{p.id}</span>
                                </div>
                              </td>
                              <td className="py-2.5 px-3 font-semibold text-primary max-w-[220px]">
                                <span className="block line-clamp-2">{p.name}</span>
                                <span className="text-[10px] text-secondary font-normal">{p.category_name}</span>
                              </td>
                              <td className="py-2.5 px-3 text-on-surface-variant">{p.unit}</td>
                              <td className="py-2.5 px-3">
                                {isEditing ? (
                                  <input
                                    type="number"
                                    min="0"
                                    step="any"
                                    placeholder="VD: 50000"
                                    value={inlinePrice}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setInlinePrice(val === '' ? '' : val.replace(/^0+(?=\d)/, ''));
                                    }}
                                    className="w-24 px-2 py-1 bg-surface border-2 border-primary rounded-lg font-bold text-xs tabular-nums"
                                  />
                                ) : (
                                  <span className="font-serif font-bold text-primary text-sm tabular-nums">
                                    {formatCurrency(p.price)}
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-3">
                                {isEditing ? (
                                  <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    placeholder="0"
                                    value={inlineStock}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setInlineStock(val === '' ? '' : val.replace(/^0+(?=\d)/, ''));
                                    }}
                                    className="w-20 px-2 py-1 bg-surface border-2 border-primary rounded-lg font-bold text-xs tabular-nums"
                                  />
                                ) : (
                                  <span className="font-semibold text-primary tabular-nums">
                                    {p.stock} <span className="text-[10px] text-outline font-normal">gói</span>
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-3">
                                <span
                                  className={`px-2 py-0.5 text-[10px] font-bold border rounded-none ${
                                    p.status === 'Còn hàng'
                                      ? 'bg-green-50 text-green-800 border-green-300'
                                      : p.status === 'Sắp hết'
                                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                                      : 'bg-red-50 text-red-800 border-red-300'
                                  }`}
                                >
                                  {p.status}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                {isEditing ? (
                                  <div className="flex items-center justify-end gap-1">
                                    <button
                                      type="button"
                                      onClick={() => handleSaveQuickEdit(p)}
                                      className="p-1 bg-green-700 hover:bg-green-800 text-white rounded-none cursor-pointer"
                                      title="Lưu thay đổi"
                                    >
                                      <span className="material-symbols-outlined text-sm">check</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setEditingProdId(null)}
                                      className="p-1 bg-gray-200 hover:bg-gray-300 rounded-none cursor-pointer"
                                      title="Hủy"
                                    >
                                      <span className="material-symbols-outlined text-sm">close</span>
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-end gap-1">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingProdId(p.id);
                                        setInlinePrice(p.price);
                                        setInlineStock(p.stock);
                                      }}
                                      className="px-2 py-1 text-[11px] font-semibold text-primary hover:bg-surface-container rounded-none border border-border-herbal"
                                    >
                                      Sửa Nhanh
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setProductToEdit(p);
                                        setProductModalOpen(true);
                                      }}
                                      className="p-1 text-primary hover:bg-surface-container rounded-none border border-border-herbal"
                                      title="Chi tiết"
                                    >
                                      <span className="material-symbols-outlined text-sm">edit</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteProduct(p)}
                                      className="p-1 text-red-600 hover:bg-red-50 rounded-none border border-red-200 cursor-pointer"
                                      title="Xóa dược liệu"
                                    >
                                      <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* View 3: Tab Hóa Đơn & Đơn Hàng */}
              {activeTab === 'orders' && (
                <div className="bg-white border border-border-herbal shadow-xs rounded-xl overflow-hidden">
                  <div className="p-3 border-b border-border-herbal flex items-center justify-between bg-[#14261a]/5">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      Danh sách hóa đơn bán lẻ ({filteredOrders.length} đơn)
                    </span>
                    <span className="text-[11px] text-on-surface-variant font-medium">
                      {orders.length === 0 ? 'Dữ liệu thực tế: 0 đơn' : 'Cập nhật thời gian thực'}
                    </span>
                  </div>

                  {orders.length === 0 ? (
                    <div className="py-16 px-6 text-center flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-surface-container flex items-center justify-center text-outline mb-3 rounded-none">
                        <span className="material-symbols-outlined text-3xl">inbox</span>
                      </div>
                      <h4 className="font-serif text-lg font-bold text-primary mb-1">
                        Chưa Có Đơn Hàng Nào Phát Sinh
                      </h4>
                      <p className="text-xs text-on-surface-variant max-w-md leading-relaxed mb-5">
                        Hệ thống đang hoạt động ở trạng thái thực tế sạch (không có đơn hàng ảo). Khi khách đặt hàng qua trang web, hóa đơn và dữ liệu thanh toán sẽ tự động hiển thị tại đây.
                      </p>
                      <Link
                        to="/san-pham"
                        className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold uppercase tracking-wider rounded-none transition-all inline-flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-base">shopping_bag</span>
                        <span>Thử Đặt Đơn Trên Gian Hàng</span>
                      </Link>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#14261a]/5 text-primary text-[10px] uppercase tracking-wider font-bold border-b border-border-herbal">
                          <tr>
                            <th className="py-2.5 px-3">Mã hóa đơn</th>
                            <th className="py-2.5 px-3">Khách hàng</th>
                            <th className="py-2.5 px-3">Ngày đặt</th>
                            <th className="py-2.5 px-3">Phương thức</th>
                            <th className="py-2.5 px-3">Tổng tiền</th>
                            <th className="py-2.5 px-3">Trạng thái</th>
                            <th className="py-2.5 px-3 text-right">Chi tiết</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border-herbal/60">
                          {filteredOrders.map((o) => (
                            <tr key={o.order_code} className="hover:bg-surface-container-low/40">
                              <td className="py-2.5 px-3 font-mono font-bold text-primary">#{o.order_code}</td>
                              <td className="py-2.5 px-3">
                                <span className="font-semibold text-primary block">{o.customer_name}</span>
                                <span className="text-[11px] text-on-surface-variant">{o.customer_phone}</span>
                              </td>
                              <td className="py-2.5 px-3 text-on-surface-variant">
                                {o.created_at ? new Date(o.created_at).toLocaleDateString('vi-VN') : 'Mới đây'}
                              </td>
                              <td className="py-2.5 px-3">
                                <span className="font-medium text-primary">
                                  {o.payment_method === 'VIETQR' ? 'VietQR SePay' : 'Tiền mặt (COD)'}
                                </span>
                                <span
                                  className={`block text-[10px] font-bold ${
                                    o.payment_status === 'PAID' ? 'text-green-700' : 'text-amber-700'
                                  }`}
                                >
                                  {o.payment_status === 'PAID' ? '• Đã thanh toán' : '• Chưa thanh toán'}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 font-serif font-bold text-primary text-sm">
                                {formatCurrency(o.total || 0)}
                              </td>
                              <td className="py-2.5 px-3">
                                <span
                                  className={`px-2 py-0.5 text-[10px] font-bold border rounded-none ${
                                    o.order_status === 'COMPLETED' || o.order_status === 'PAID'
                                      ? 'bg-green-50 text-green-800 border-green-300'
                                      : o.order_status === 'SHIPPING'
                                      ? 'bg-blue-50 text-blue-800 border-blue-300'
                                      : 'bg-amber-50 text-amber-800 border-amber-300'
                                  }`}
                                >
                                  {o.order_status}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => setSelectedOrder(o)}
                                  className="px-3 py-1 bg-primary/10 hover:bg-primary text-primary hover:text-white font-bold text-xs rounded-none transition-all inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-sm">visibility</span>
                                  <span>Xem Hóa Đơn</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </main>
          </div>
        )}
      </div>

      {/* =========================================================================
          MODALS (ROUNDED-NONE)
          ========================================================================= */}
      {/* 1. Modal Tạo Phiếu Kiểm Kho Mới */}
      <AuditSheetModal
        isOpen={auditModalOpen}
        onClose={() => setAuditModalOpen(false)}
        products={products}
        requestConfirmation={requestConfirmation}
        onSaveAudit={(newAuditLog) => {
          addAuditLog(newAuditLog);
          setExpandedLogCode(newAuditLog.code);
          showToast(`✓ Đã tạo thành công phiếu kiểm kho ${newAuditLog.code}`);
        }}
      />

      {/* 2. Modal Thêm / Chỉnh Sửa Dược Liệu */}
      <ProductFormModal
        isOpen={productModalOpen}
        onClose={() => {
          setProductModalOpen(false);
          setProductToEdit(null);
        }}
        productToEdit={productToEdit}
        requestConfirmation={requestConfirmation}
        onSave={(data) => {
          if (productToEdit) {
            updateProduct(productToEdit.id, data);
            showToast(`✓ Đã cập nhật thành công dược liệu "${data.name}"`);
          } else {
            addProduct(data);
            showToast(`✓ Đã thêm mới thành công dược liệu "${data.name}"`);
          }
        }}
      />

      {/* 3. Modal Xem Chi Tiết Hóa Đơn & Cập Nhật Trạng Thái */}
      <InvoiceDetailModal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
        requestConfirmation={requestConfirmation}
        showToast={showToast}
        onUpdateStatus={(code, orderStatus, paymentStatus) => {
          updateOrderStatus(code, orderStatus, paymentStatus);
          setSelectedOrder((prev) =>
            prev && prev.order_code === code
              ? { ...prev, order_status: orderStatus, payment_status: paymentStatus }
              : prev
          );
        }}
      />

      {/* 4. Modal Xác Nhận Mọi Thao Tác Thay Đổi Chuẩn 2026 ERP */}
      <AdminConfirmModal
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        subtitle={confirmDialog.subtitle}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        variant={confirmDialog.variant}
        icon={confirmDialog.icon}
      />

      {/* 5. Toast Thông Báo Phản Hồi Xác Nhận */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[140] bg-[#14261a] text-[#cbb07c] px-4 py-3 rounded-none shadow-2xl border border-[#cbb07c]/60 flex items-center gap-2.5 text-xs font-bold animate-fadeIn">
          <span className="material-symbols-outlined text-green-400 text-lg shrink-0">check_circle</span>
          <span className="leading-tight">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-white/50 hover:text-white p-0.5 rounded-none cursor-pointer"
            title="Đóng thông báo"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}
    </div>
  );
};
