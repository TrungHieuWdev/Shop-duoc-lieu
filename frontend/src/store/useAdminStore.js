import { create } from 'zustand';

// Danh sách dược liệu mẫu ban đầu
const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: 'Bài Thuốc Xông Tắm Tổng Hợp 7 Vị Thảo Dược (Phơi Khô)',
    slug: 'bai-thuoc-xong-tam-tong-hop-7-vi-thao-duoc',
    category_slug: 'bai-thuoc-xong-tam',
    category_name: 'Bài Thuốc Xông Tắm',
    unit: 'Gói 1 nồi xông (150g)',
    price: 50000,
    original_price: 65000,
    stock: 120,
    status: 'Còn hàng',
    thumbnail_url: '/images/products/bai-thuoc-7-vi.jpg',
  },
  {
    id: 2,
    name: 'Lá Đinh Lăng Phơi Khô',
    slug: 'la-dinh-lang-phoi-kho-200g',
    category_slug: 'duoc-lieu-le',
    category_name: 'Dược Liệu Lẻ',
    unit: 'Túi zip 200g',
    price: 50000,
    original_price: 65000,
    stock: 45,
    status: 'Còn hàng',
    thumbnail_url: '/images/herbs/dinh-lang.jpg',
  },
  {
    id: 3,
    name: 'Gừng Phơi Khô (Gừng Sẻ Thái Lát)',
    slug: 'gung-se-phoi-kho-thai-lat-200g',
    category_slug: 'duoc-lieu-le',
    category_name: 'Dược Liệu Lẻ',
    unit: 'Túi zip 200g',
    price: 40000,
    original_price: 50000,
    stock: 60,
    status: 'Còn hàng',
    thumbnail_url: '/images/herbs/gung-kho.jpg',
  },
  {
    id: 4,
    name: 'Lá Sả Phơi Khô (Cắt Khúc)',
    slug: 'la-sa-phoi-kho-thai-khuc-200g',
    category_slug: 'duoc-lieu-le',
    category_name: 'Dược Liệu Lẻ',
    unit: 'Túi zip 200g',
    price: 30000,
    original_price: 40000,
    stock: 85,
    status: 'Còn hàng',
    thumbnail_url: '/images/herbs/sa-chanh.jpg',
  },
  {
    id: 5,
    name: 'Lá Trầu Không Phơi Khô',
    slug: 'la-trau-khong-phoi-kho-150g',
    category_slug: 'duoc-lieu-le',
    category_name: 'Dược Liệu Lẻ',
    unit: 'Túi zip 150g',
    price: 45000,
    original_price: 55000,
    stock: 32,
    status: 'Còn hàng',
    thumbnail_url: '/images/herbs/la-trau-khong.jpg',
  },
  {
    id: 6,
    name: 'Lá Ngải Cứu Nếp Phơi Khô',
    slug: 'la-ngai-cuu-nep-phoi-kho-200g',
    category_slug: 'duoc-lieu-le',
    category_name: 'Dược Liệu Lẻ',
    unit: 'Túi zip 200g',
    price: 35000,
    original_price: 45000,
    stock: 70,
    status: 'Còn hàng',
    thumbnail_url: '/images/herbs/ngai-cuu.jpg',
  },
  {
    id: 7,
    name: 'Lá Bưởi Phơi Khô',
    slug: 'la-buoi-phoi-kho-thom-150g',
    category_slug: 'duoc-lieu-le',
    category_name: 'Dược Liệu Lẻ',
    unit: 'Túi zip 150g',
    price: 35000,
    original_price: 45000,
    stock: 28,
    status: 'Còn hàng',
    thumbnail_url: '/images/herbs/la-buoi.jpg',
  },
  {
    id: 8,
    name: 'Hoa Hồng Phơi Khô (Nụ & Cánh)',
    slug: 'hoa-hong-phoi-kho-100g',
    category_slug: 'duoc-lieu-le',
    category_name: 'Dược Liệu Lẻ',
    unit: 'Túi zip 100g',
    price: 55000,
    original_price: 70000,
    stock: 15,
    status: 'Sắp hết',
    thumbnail_url: '/images/herbs/hoa-hong.jpg',
  },
];

// Hàm lấy danh sách đơn hàng thực tế (Mặc định rỗng: chưa có đơn hàng nào phát sinh)
const getSavedOrders = () => {
  try {
    const raw = localStorage.getItem('nganha_admin_orders');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Loại bỏ triệt để các đơn hàng ảo trước đây nếu còn lưu trong trình duyệt
    const mockOrderCodes = ['NH-8492', 'NH-5120', 'NH-3841', 'NH-2195'];
    const realOrders = parsed.filter((o) => !mockOrderCodes.includes(o.order_code));
    localStorage.setItem('nganha_admin_orders', JSON.stringify(realOrders));
    return realOrders;
  } catch (e) {
    return [];
  }
};

// Danh sách phiếu kiểm kho ban đầu
const DEFAULT_AUDIT_LOGS = [
  {
    code: 'KK000001',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    balanced_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    creator: 'Quản Trị Viên Ngân Hà',
    balancer: 'Quản Trị Viên Ngân Hà',
    status: 'Đã cân bằng kho',
    total_diff: 0,
    total_diff_value: 0,
    total_increase: 0,
    total_decrease: 0,
    note: 'Phiếu kiểm kho định kỳ đầu kỳ - Cân bằng 8 vị dược liệu bản địa',
    items: [
      { product_id: 1, name: 'Bài Thuốc Xông Tắm Tổng Hợp 7 Vị', unit: 'Gói 150g', system_stock: 120, actual_stock: 120, diff: 0, price: 50000 },
      { product_id: 2, name: 'Lá Đinh Lăng Phơi Khô', unit: 'Túi 200g', system_stock: 45, actual_stock: 45, diff: 0, price: 50000 },
      { product_id: 3, name: 'Gừng Phơi Khô (Gừng Sẻ Thái Lát)', unit: 'Túi 200g', system_stock: 60, actual_stock: 60, diff: 0, price: 40000 },
      { product_id: 4, name: 'Lá Sả Phơi Khô (Cắt Khúc)', unit: 'Túi 200g', system_stock: 85, actual_stock: 85, diff: 0, price: 30000 },
      { product_id: 5, name: 'Lá Trầu Không Phơi Khô', unit: 'Túi 150g', system_stock: 32, actual_stock: 32, diff: 0, price: 45000 },
      { product_id: 6, name: 'Lá Ngải Cứu Nếp Phơi Khô', unit: 'Túi 200g', system_stock: 70, actual_stock: 70, diff: 0, price: 35000 },
      { product_id: 7, name: 'Lá Bưởi Phơi Khô', unit: 'Túi 150g', system_stock: 28, actual_stock: 28, diff: 0, price: 35000 },
      { product_id: 8, name: 'Hoa Hồng Phơi Khô (Nụ & Cánh)', unit: 'Túi 100g', system_stock: 15, actual_stock: 15, diff: 0, price: 55000 },
    ],
  },
];

const getSavedAuditLogs = () => {
  try {
    const raw = localStorage.getItem('nganha_admin_audit_logs');
    if (!raw) return DEFAULT_AUDIT_LOGS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_AUDIT_LOGS;
  } catch (e) {
    return DEFAULT_AUDIT_LOGS;
  }
};

// Cài đặt mặc định của hệ thống
const DEFAULT_SETTINGS = {
  bank_id: 'MB', // Mã ngân hàng VietQR (e.g. MB, VCB, TCB, ACB, BIDV, ICB, VPB, TPB, STB, VIB)
  bank_name: 'MBBank (Quân Đội)',
  bank_account: '0983124567', // Số tài khoản ngân hàng
  account_name: 'TIỆM THẢO MỘC NGÂN HÀ', // Tên chủ tài khoản
  admin_email: 'hieunedz@gmail.com', // Gmail chủ tiệm để nhận thông tin đơn hàng đi đơn
  default_shipping_fee: 30000, // Phí ship mặc định
  free_shipping_threshold: 350000, // Ngưỡng miễn phí ship
};

const getSavedSettings = () => {
  try {
    const raw = localStorage.getItem('nganha_shop_settings');
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    const merged = { ...DEFAULT_SETTINGS, ...parsed };
    // Tự động nâng cấp nếu đang lưu email mẫu cũ
    if (!merged.admin_email || merged.admin_email === 'tiemthaomocnganha@gmail.com') {
      merged.admin_email = 'hieunedz@gmail.com';
    }
    return merged;
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
};

// Trạng thái tính toán tự động dựa trên tồn kho
const computeStatus = (stock) => {
  const s = Number(stock);
  if (s <= 0) return 'Hết hàng';
  if (s <= 20) return 'Sắp hết';
  return 'Còn hàng';
};

const getSavedProducts = () => {
  try {
    const raw = localStorage.getItem('nganha_admin_products');
    if (!raw) return DEFAULT_PRODUCTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PRODUCTS;
  } catch (e) {
    return DEFAULT_PRODUCTS;
  }
};

export const useAdminStore = create((set, get) => ({
  products: getSavedProducts(),
  orders: getSavedOrders(),
  auditLogs: getSavedAuditLogs(),
  settings: getSavedSettings(),

  // Cập nhật cài đặt ngân hàng & phí ship
  updateSettings: (newSettings) => {
    const updated = { ...get().settings, ...newSettings };
    localStorage.setItem('nganha_shop_settings', JSON.stringify(updated));
    set({ settings: updated });
    return updated;
  },

  // 1. Cập nhật thông tin dược liệu (giá tiền, số lượng tồn kho, tên, quy cách, trạng thái)
  updateProduct: (id, updatedFields) => {
    const products = get().products.map((p) => {
      if (p.id === id) {
        const stock = updatedFields.stock !== undefined ? Number(updatedFields.stock) : p.stock;
        return {
          ...p,
          ...updatedFields,
          stock,
          status: computeStatus(stock),
          price: updatedFields.price !== undefined ? Number(updatedFields.price) : p.price,
        };
      }
      return p;
    });

    localStorage.setItem('nganha_admin_products', JSON.stringify(products));
    set({ products });
  },

  // 1b. Cân bằng tồn kho nhanh (Quick Balance)
  rebalanceStock: (id, actualStock, note) => {
    const targetProduct = get().products.find((p) => p.id === id);
    if (!targetProduct) return;

    const oldStock = targetProduct.stock;
    const newStock = Number(actualStock);
    const diff = newStock - oldStock;

    // Cập nhật tồn kho sản phẩm
    get().updateProduct(id, { stock: newStock });

    // Tự động ghi nhật ký phiếu kiểm kho
    const code = `KK${String(Date.now()).slice(-6)}`;
    const newLog = {
      code,
      created_at: new Date().toISOString(),
      balanced_at: new Date().toISOString(),
      creator: 'Quản Trị Viên Ngân Hà',
      balancer: 'Quản Trị Viên Ngân Hà',
      status: 'Đã cân bằng kho',
      total_diff: diff,
      total_diff_value: diff * targetProduct.price,
      total_increase: diff > 0 ? diff : 0,
      total_decrease: diff < 0 ? Math.abs(diff) : 0,
      note: note || `Cân bằng nhanh tồn kho dược liệu #${id} (${targetProduct.name}): ${oldStock} ➔ ${newStock} gói`,
      items: [
        {
          product_id: targetProduct.id,
          name: targetProduct.name,
          unit: targetProduct.unit,
          system_stock: oldStock,
          actual_stock: newStock,
          diff,
          price: targetProduct.price,
        },
      ],
    };

    const updatedLogs = [newLog, ...get().auditLogs];
    localStorage.setItem('nganha_admin_audit_logs', JSON.stringify(updatedLogs));
    set({ auditLogs: updatedLogs });
  },

  // 1c. Thêm phiếu kiểm kho hoàn chỉnh (Multiple items audit)
  addAuditLog: (logData) => {
    const updatedLogs = [logData, ...get().auditLogs];
    localStorage.setItem('nganha_admin_audit_logs', JSON.stringify(updatedLogs));

    // Nếu phiếu ở trạng thái Đã cân bằng thì cập nhật tồn kho tất cả sản phẩm trong phiếu
    if (logData.status === 'Đã cân bằng kho' && Array.isArray(logData.items)) {
      logData.items.forEach((item) => {
        if (item.product_id && item.actual_stock !== undefined) {
          get().updateProduct(item.product_id, { stock: Number(item.actual_stock) });
        }
      });
    }

    set({ auditLogs: updatedLogs });
  },

  // 1d. Cân bằng một phiếu kiểm kho đã lưu tạm
  balanceAuditSheet: (code) => {
    const target = get().auditLogs.find((l) => l.code === code);
    if (!target) return;

    const updatedLogs = get().auditLogs.map((l) => {
      if (l.code === code) {
        return {
          ...l,
          status: 'Đã cân bằng kho',
          balanced_at: new Date().toISOString(),
          balancer: 'Quản Trị Viên Ngân Hà',
        };
      }
      return l;
    });

    if (Array.isArray(target.items)) {
      target.items.forEach((item) => {
        if (item.product_id && item.actual_stock !== undefined) {
          get().updateProduct(item.product_id, { stock: Number(item.actual_stock) });
        }
      });
    }

    localStorage.setItem('nganha_admin_audit_logs', JSON.stringify(updatedLogs));
    set({ auditLogs: updatedLogs });
  },

  // 1e. Xóa phiếu kiểm kho
  deleteAuditSheet: (code) => {
    const updatedLogs = get().auditLogs.filter((l) => l.code !== code);
    localStorage.setItem('nganha_admin_audit_logs', JSON.stringify(updatedLogs));
    set({ auditLogs: updatedLogs });
  },

  // 2. Thêm dược liệu mới vào cửa hàng
  addProduct: (productData) => {
    const products = get().products;
    const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    const stock = Number(productData.stock || 0);

    const newProduct = {
      id: newId,
      name: productData.name.trim(),
      slug: productData.slug || `duoc-lieu-${newId}`,
      category_slug: productData.category_slug || 'duoc-lieu-le',
      category_name: productData.category_slug === 'bai-thuoc-xong-tam' ? 'Bài Thuốc Xông Tắm' : 'Dược Liệu Lẻ',
      unit: productData.unit?.trim() || 'Túi zip 200g',
      price: Number(productData.price || 0),
      original_price: Number(productData.original_price || productData.price || 0),
      stock,
      status: computeStatus(stock),
      thumbnail_url: productData.thumbnail_url || '/images/products/bai-thuoc-7-vi.jpg',
    };

    const updated = [newProduct, ...products];
    localStorage.setItem('nganha_admin_products', JSON.stringify(updated));
    set({ products: updated });
    return newProduct;
  },

  // 3. Xóa dược liệu
  deleteProduct: (id) => {
    const products = get().products.filter((p) => p.id !== id);
    localStorage.setItem('nganha_admin_products', JSON.stringify(products));
    set({ products });
  },

  // 4. Khôi phục danh mục mẫu ban đầu
  resetDefaultProducts: () => {
    localStorage.setItem('nganha_admin_products', JSON.stringify(DEFAULT_PRODUCTS));
    set({ products: DEFAULT_PRODUCTS });
  },

  // 5. Cập nhật trạng thái đơn hàng (PENDING -> CONFIRMED -> SHIPPING -> COMPLETED -> CANCELLED)
  updateOrderStatus: (orderCode, newStatus, paymentStatus) => {
    const orders = get().orders.map((o) => {
      if (o.order_code === orderCode) {
        return {
          ...o,
          order_status: newStatus,
          payment_status: paymentStatus || o.payment_status,
        };
      }
      return o;
    });

    localStorage.setItem('nganha_admin_orders', JSON.stringify(orders));
    set({ orders });
  },

  // 6. Thêm hóa đơn mới khi khách hàng đặt đơn
  addOrder: (orderData) => {
    const orders = [orderData, ...get().orders];
    localStorage.setItem('nganha_admin_orders', JSON.stringify(orders));
    set({ orders });
  },

  // 7. Xóa sạch hóa đơn (đưa về 0 đơn thực tế)
  clearAllOrders: () => {
    localStorage.removeItem('nganha_admin_orders');
    set({ orders: [] });
  },
}));

