import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useAdminStore } from '@/store/useAdminStore';
import { formatCurrency } from '@/utils/formatCurrency';
import { ProductFormModal } from '@/features/admin/components/ProductFormModal';
import { InvoiceDetailModal } from '@/features/admin/components/InvoiceDetailModal';

export const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const {
    products,
    orders,
    updateProduct,
    addProduct,
    deleteProduct,
    updateOrderStatus,
  } = useAdminStore();

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders'
  const [orderFilter, setOrderFilter] = useState('all');

  // Modals state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Chỉnh sửa nhanh trực tiếp trên dòng (Inline edit state)
  const [editingId, setEditingId] = useState(null);
  const [inlinePrice, setInlinePrice] = useState(0);
  const [inlineStock, setInlineStock] = useState(0);

  // Nếu chưa đăng nhập, hiển thị nhắc nhở
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-surface rounded-2xl border border-border-herbal text-center shadow-lg">
        <span className="material-symbols-outlined text-[3rem] text-[#8a7258] mb-3">lock</span>
        <h2 className="font-serif text-2xl font-bold text-primary mb-2">Yêu Cầu Quyền Quản Trị</h2>
        <p className="text-xs text-on-surface-variant mb-6">
          Vui lòng nhấn vào biểu tượng tài khoản trên thanh điều hướng để đăng nhập tài khoản quản trị.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary text-xs font-bold uppercase rounded-lg shadow-sm"
        >
          <span>Về Trang Chủ</span>
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </Link>
      </div>
    );
  }

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // 1. Thao tác với sản phẩm
  const handleOpenAddProduct = () => {
    setProductToEdit(null);
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setProductToEdit(prod);
    setProductModalOpen(true);
  };

  const handleSaveProduct = (prodData) => {
    if (productToEdit) {
      updateProduct(productToEdit.id, prodData);
      showToast(`Đã cập nhật dược liệu "${prodData.name}"`);
    } else {
      addProduct(prodData);
      showToast(`Đã thêm dược liệu mới "${prodData.name}"`);
    }
  };

  const handleDeleteProduct = (prod) => {
    if (window.confirm(`Bạn có chắc muốn xóa dược liệu "${prod.name}" khỏi danh mục?`)) {
      deleteProduct(prod.id);
      showToast(`Đã xóa "${prod.name}"`);
    }
  };

  // Bắt đầu chỉnh sửa nhanh giá hoặc số lượng tồn kho
  const handleStartInlineEdit = (prod) => {
    setEditingId(prod.id);
    setInlinePrice(prod.price);
    setInlineStock(prod.stock);
  };

  const handleSaveInlineEdit = (id) => {
    updateProduct(id, {
      price: Number(inlinePrice),
      stock: Number(inlineStock),
    });
    setEditingId(null);
    showToast('Đã lưu thay đổi giá tiền & tồn kho thành công');
  };

  // 2. Thao tác với hóa đơn
  const handleViewInvoice = (order) => {
    setSelectedOrder(order);
  };

  const handleUpdateStatus = (orderCode, newStatus, newPaymentStatus) => {
    updateOrderStatus(orderCode, newStatus, newPaymentStatus);
    // Cập nhật selectedOrder nếu đang mở modal
    setSelectedOrder((prev) =>
      prev && prev.order_code === orderCode
        ? { ...prev, order_status: newStatus, payment_status: newPaymentStatus }
        : prev
    );
    showToast(`Đã cập nhật hóa đơn #${orderCode}`);
  };

  // Tính toán các chỉ số động
  const totalRevenue = orders
    .filter((o) => o.payment_status === 'PAID' || o.order_status === 'COMPLETED')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const pendingOrdersCount = orders.filter((o) => o.order_status === 'PENDING').length;
  const lowStockCount = products.filter((p) => p.stock <= 20).length;

  // Lọc hóa đơn theo tab
  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'all') return true;
    if (orderFilter === 'PAID') return o.payment_status === 'PAID';
    return o.order_status === orderFilter;
  });

  const getOrderStatusBadge = (status) => {
    switch (status) {
      case 'PAID':
      case 'COMPLETED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">Hoàn tất</span>;
      case 'SHIPPING':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">Đang giao</span>;
      case 'CONFIRMED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">Đã xác nhận</span>;
      case 'PENDING':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Chờ xác nhận</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">Đã hủy</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-surface-container text-on-surface">{status}</span>;
    }
  };

  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-12">
      {/* 1. Header Quản trị */}
      <div className="eco-rise flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-border-herbal gap-4">
        <div>
          <span className="text-[0.6875rem] font-bold text-[#8a7258] uppercase tracking-[0.25em] flex items-center gap-1.5 mb-1">
            <span className="material-symbols-outlined text-[1rem]">verified_user</span>
            BẢNG ĐIỀU KHIỂN HỆ THỐNG
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-primary">
            Quản Trị Tiệm Thảo Mộc Ngân Hà
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Xin chào, <strong>{user?.name || user?.email}</strong> • Phiên làm việc bảo mật
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="px-4 py-2 bg-surface hover:bg-surface-container border border-border-herbal text-primary text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">storefront</span>
            <span>Xem Cửa Hàng</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span>Đăng Xuất</span>
          </button>
        </div>
      </div>

      {/* 2. Chỉ số tóm tắt (KPI Cards) */}
      <div className="eco-rise-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-surface rounded-xl border border-border-herbal/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Tổng Dược Liệu</span>
            <span className="material-symbols-outlined text-[#8a7258] text-[1.25rem]">eco</span>
          </div>
          <span className="font-serif text-3xl font-bold text-primary">{products.length} Vị</span>
          <p className="text-[11px] text-green-700 mt-1">Đang bày bán trong tiệm</p>
        </div>

        <div className="bg-surface rounded-xl border border-border-herbal/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Đơn Hàng & Hóa Đơn</span>
            <span className="material-symbols-outlined text-[#8a7258] text-[1.25rem]">receipt_long</span>
          </div>
          <span className="font-serif text-3xl font-bold text-primary">{orders.length} Đơn</span>
          <p className="text-[11px] text-on-surface-variant mt-1">
            {orders.length > 0
              ? (pendingOrdersCount > 0 ? `${pendingOrdersCount} đơn chờ xác nhận` : 'Tất cả đã xử lý')
              : 'Chưa có đơn hàng mới'}
          </p>
        </div>

        <div className="bg-surface rounded-xl border border-border-herbal/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Doanh Thu Thu Được</span>
            <span className="material-symbols-outlined text-[#8a7258] text-[1.25rem]">payments</span>
          </div>
          <span className="font-serif text-3xl font-bold text-primary">{formatCurrency(totalRevenue)}</span>
          <p className="text-[11px] text-on-surface-variant mt-1">
            {totalRevenue > 0 ? 'Từ các đơn hàng thành công' : 'Chưa phát sinh doanh thu'}
          </p>
        </div>

        <div className="bg-surface rounded-xl border border-border-herbal/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Cảnh Báo Tồn Kho</span>
            <span className="material-symbols-outlined text-[#8a7258] text-[1.25rem]">inventory_2</span>
          </div>
          <span className="font-serif text-3xl font-bold text-primary">
            {lowStockCount > 0 ? `${lowStockCount} Vị` : 'Đầy Đủ'}
          </span>
          <p className="text-[11px] text-amber-700 mt-1">
            {lowStockCount > 0 ? `${lowStockCount} vị còn dưới 20 gói` : 'Kho hàng dồi dào'}
          </p>
        </div>
      </div>

      {/* 3. Thanh Chuyển Tab: KHO HÀNG & DƯỢC LIỆU vs HÓA ĐƠN BÁN HÀNG */}
      <div className="eco-rise-2 flex items-center justify-between border-b border-border-herbal mb-6">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`pb-3 px-2 sm:px-4 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'products'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[1.125rem]">inventory</span>
            <span>Kho Hàng & Dược Liệu ({products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-2 sm:px-4 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[1.125rem]">receipt_long</span>
            <span>Quản Lý Hóa Đơn ({orders.length})</span>
            {pendingOrdersCount > 0 && (
              <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {pendingOrdersCount}
              </span>
            )}
          </button>
        </div>

        {/* Nút hành động nhanh bên phải của Tab */}
        {activeTab === 'products' && (
          <button
            type="button"
            onClick={handleOpenAddProduct}
            className="mb-2 px-4 py-2 bg-[#cbb07c] hover:bg-[#dfc492] text-[#14261a] text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>+ Thêm Dược Liệu Mới</span>
          </button>
        )}
      </div>

      {/* =========================================================================
          NỘI DUNG TAB 1: KHO HÀNG & DƯỢC LIỆU (CHỈNH SỬA TỒN KHO, GIÁ, THÊM SẢN PHẨM)
          ========================================================================= */}
      {activeTab === 'products' && (
        <div className="eco-rise-3 bg-surface rounded-2xl border border-border-herbal overflow-hidden shadow-xs mb-8">
          <div className="p-4 sm:p-5 border-b border-border-herbal flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-low">
            <div>
              <h3 className="font-serif text-lg font-bold text-primary">Danh Sách Dược Liệu & Điều Chỉnh Kho</h3>
              <p className="text-xs text-on-surface-variant">
                Bạn có thể bấm <strong>"Sửa Nhanh"</strong> để đổi giá và tồn kho trực tiếp trên bảng, hoặc <strong>"Chi Tiết"</strong> để sửa toàn bộ thông tin.
              </p>
            </div>
            <Link
              to="/san-pham"
              className="text-xs font-semibold text-primary hover:text-secondary flex items-center gap-1 shrink-0"
            >
              <span>Xem trên gian hàng</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container text-on-surface-variant uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Ảnh & Mã</th>
                  <th className="py-3 px-4">Tên Dược Liệu</th>
                  <th className="py-3 px-4">Quy Cách</th>
                  <th className="py-3 px-4">Giá Bán Lẻ (đ)</th>
                  <th className="py-3 px-4">Số Lượng Tồn Kho</th>
                  <th className="py-3 px-4">Trạng Thái</th>
                  <th className="py-3 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-herbal">
                {products.map((item) => {
                  const isEditing = editingId === item.id;

                  return (
                    <tr key={item.id} className="hover:bg-surface-container-low/60 transition-colors">
                      {/* Ảnh & Mã */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={item.thumbnail_url || '/images/products/bai-thuoc-7-vi.jpg'}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover border border-border-herbal shadow-2xs"
                          />
                          <span className="font-mono text-outline font-semibold">#{item.id}</span>
                        </div>
                      </td>

                      {/* Tên */}
                      <td className="py-3.5 px-4 font-semibold text-primary max-w-[200px]">
                        <span className="block line-clamp-2">{item.name}</span>
                        <span className="text-[10px] text-secondary">{item.category_name}</span>
                      </td>

                      {/* Quy cách */}
                      <td className="py-3.5 px-4 text-on-surface-variant">{item.unit}</td>

                      {/* Giá tiền (Hỗ trợ inline edit) */}
                      <td className="py-3.5 px-4">
                        {isEditing ? (
                          <input
                            type="number"
                            step="1000"
                            min="1000"
                            value={inlinePrice}
                            onChange={(e) => setInlinePrice(e.target.value)}
                            className="w-28 px-2 py-1 bg-surface border-2 border-primary rounded text-xs font-bold text-primary focus:outline-none"
                          />
                        ) : (
                          <span className="font-serif font-bold text-primary text-sm">
                            {formatCurrency(item.price)}
                          </span>
                        )}
                      </td>

                      {/* Số lượng tồn kho (Hỗ trợ inline edit) */}
                      <td className="py-3.5 px-4">
                        {isEditing ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min="0"
                              value={inlineStock}
                              onChange={(e) => setInlineStock(e.target.value)}
                              className="w-20 px-2 py-1 bg-surface border-2 border-primary rounded text-xs font-bold text-primary focus:outline-none"
                            />
                            <span className="text-[11px] text-on-surface-variant">gói</span>
                          </div>
                        ) : (
                          <span className="font-semibold text-on-surface">
                            {item.stock} <span className="text-[11px] text-on-surface-variant font-normal">gói/túi</span>
                          </span>
                        )}
                      </td>

                      {/* Trạng thái tự động */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'Còn hàng'
                              ? 'bg-green-100 text-green-800'
                              : item.status === 'Sắp hết'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* Thao tác */}
                      <td className="py-3.5 px-4 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleSaveInlineEdit(item.id)}
                              className="p-1.5 bg-green-600 hover:bg-green-700 text-white rounded shadow-xs"
                              title="Lưu thay đổi"
                            >
                              <span className="material-symbols-outlined text-sm">check</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="p-1.5 bg-surface-container hover:bg-surface-container-high text-outline rounded"
                              title="Hủy"
                            >
                              <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => handleStartInlineEdit(item)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-primary hover:bg-surface-container rounded transition-colors"
                              title="Sửa nhanh giá và tồn kho"
                            >
                              Sửa Nhanh
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenEditProduct(item)}
                              className="p-1.5 text-primary hover:bg-surface-container rounded transition-colors"
                              title="Chỉnh sửa chi tiết"
                            >
                              <span className="material-symbols-outlined text-sm">edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(item)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
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

      {/* =========================================================================
          NỘI DUNG TAB 2: QUẢN LÝ HÓA ĐƠN & CHI TIẾT ĐƠN HÀNG
          ========================================================================= */}
      {activeTab === 'orders' && (
        <div className="eco-rise-3 bg-surface rounded-2xl border border-border-herbal overflow-hidden shadow-xs mb-8">
          {/* Header Tab Hóa Đơn & Bộ Lọc */}
          <div className="p-4 sm:p-5 border-b border-border-herbal flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-low">
            <div>
              <h3 className="font-serif text-lg font-bold text-primary">Danh Sách Hóa Đơn & Đơn Hàng</h3>
              <p className="text-xs text-on-surface-variant">
                Bấm vào <strong>"Xem Chi Tiết"</strong> để kiểm tra danh sách món, địa chỉ khách và in hóa đơn bán lẻ.
              </p>
            </div>

            {/* Bộ lọc trạng thái đơn */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { label: 'Tất Cả', value: 'all' },
                { label: 'Chờ Xác Nhận', value: 'PENDING' },
                { label: 'Đang Giao', value: 'SHIPPING' },
                { label: 'Đã Thanh Toán', value: 'PAID' },
                { label: 'Hoàn Tất', value: 'COMPLETED' },
              ].map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setOrderFilter(f.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    orderFilter === f.value
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'bg-surface text-on-surface-variant hover:bg-surface-container border border-border-herbal/60'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Nội dung danh sách Hóa Đơn hoặc Màn hình trống nếu chưa có đơn */}
          {orders.length === 0 ? (
            <div className="py-16 px-6 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-outline mb-4">
                <span className="material-symbols-outlined text-[2.25rem]">inbox</span>
              </div>
              <h4 className="font-serif text-lg font-bold text-primary mb-1">
                Chưa Có Đơn Hàng Nào Phát Sinh
              </h4>
              <p className="text-xs text-on-surface-variant max-w-md leading-relaxed mb-6">
                Hiện tại tiệm chưa tiếp nhận đơn hàng nào. Khi khách hàng đặt đơn trên trang web (qua giỏ hàng & thanh toán), hóa đơn và thông tin chi tiết sẽ tự động hiển thị tại đây.
              </p>
              <Link
                to="/san-pham"
                className="px-5 py-2.5 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all inline-flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">shopping_bag</span>
                <span>Xem Cửa Hàng & Thử Đặt Đơn</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-container text-on-surface-variant uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Mã Hóa Đơn</th>
                    <th className="py-3 px-4">Khách Hàng</th>
                    <th className="py-3 px-4">Ngày Đặt</th>
                    <th className="py-3 px-4">Phương Thức</th>
                    <th className="py-3 px-4">Tổng Tiền</th>
                    <th className="py-3 px-4">Trạng Thái Đơn</th>
                    <th className="py-3 px-4 text-right">Chi Tiết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-herbal">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-on-surface-variant">
                        Không tìm thấy hóa đơn nào phù hợp với bộ lọc.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.order_code} className="hover:bg-surface-container-low/60 transition-colors">
                        {/* Mã Hóa Đơn */}
                        <td className="py-3.5 px-4 font-mono font-bold text-primary">
                          #{order.order_code}
                        </td>

                        {/* Khách hàng */}
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-primary block">{order.customer_name}</span>
                          <span className="text-[11px] text-on-surface-variant">{order.customer_phone}</span>
                        </td>

                        {/* Ngày đặt */}
                        <td className="py-3.5 px-4 text-on-surface-variant">
                          {order.created_at ? new Date(order.created_at).toLocaleDateString('vi-VN') : 'Mới đây'}
                        </td>

                        {/* Phương thức thanh toán */}
                        <td className="py-3.5 px-4">
                          <span className="font-medium text-on-surface">
                            {order.payment_method === 'VIETQR' ? 'VietQR SePay' : 'Tiền mặt (COD)'}
                          </span>
                          <span
                            className={`block text-[10px] font-bold ${
                              order.payment_status === 'PAID' ? 'text-green-700' : 'text-amber-700'
                            }`}
                          >
                            {order.payment_status === 'PAID' ? '• Đã thanh toán' : '• Chưa thanh toán'}
                          </span>
                        </td>

                        {/* Tổng tiền */}
                        <td className="py-3.5 px-4 font-serif font-bold text-primary text-sm">
                          {formatCurrency(order.total || 0)}
                        </td>

                        {/* Trạng thái đơn hàng */}
                        <td className="py-3.5 px-4">{getOrderStatusBadge(order.order_status)}</td>

                        {/* Nút Xem Chi Tiết */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleViewInvoice(order)}
                            className="px-3 py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-on-primary font-bold text-xs rounded-lg transition-all inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-sm">visibility</span>
                            <span>Xem Hóa Đơn</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal 1: Thêm mới hoặc Chỉnh sửa Dược Liệu */}
      <ProductFormModal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        productToEdit={productToEdit}
        onSave={handleSaveProduct}
      />

      {/* Modal 2: Xem Chi Tiết Hóa Đơn & Cập Nhật Trạng Thái */}
      <InvoiceDetailModal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Toast thông báo nhanh */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[120] bg-primary text-on-primary px-5 py-3 rounded-lg shadow-xl border border-primary-container flex items-center gap-2.5 animate-bounce">
          <span className="material-symbols-outlined text-green-400 text-[1.25rem]">check_circle</span>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
