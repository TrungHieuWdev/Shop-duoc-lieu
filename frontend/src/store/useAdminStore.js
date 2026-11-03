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

// Trạng thái tính toán tự động dựa trên tồn kho
const computeStatus = (stock) => {
  const s = Number(stock);
  if (s <= 0) return 'Hết hàng';
  if (s <= 20) return 'Sắp hết';
  return 'Còn hàng';
};

export const useAdminStore = create((set, get) => ({
  products: JSON.parse(localStorage.getItem('nganha_admin_products') || JSON.stringify(DEFAULT_PRODUCTS)),
  orders: getSavedOrders(),

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

