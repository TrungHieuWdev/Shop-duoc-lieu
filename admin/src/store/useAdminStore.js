import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const DEFAULT_PRODUCTS = [
  {
    id: 9,
    name: 'Thảo Dược Dưỡng Nữ',
    slug: 'thao-duoc-duong-nu',
    category_slug: 'bai-thuoc-xong-tam',
    category_name: 'Bài Thuốc Xông Tắm',
    unit: '1 bịch (5 gói nhỏ)',
    price: 60000,
    original_price: 75000,
    stock: 80,
    status: 'Còn hàng',
    thumbnail_url: '/images/products/thao-duoc-duong-nu.jpg',
  },
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
];

const DEFAULT_SETTINGS = {
  bank_id: 'MB',
  bank_name: 'MBBank (Quân Đội)',
  bank_account: '0983124567',
  account_name: 'TIỆM THẢO DƯỢC NGÂN HÀ',
  admin_email: 'hieunedz@gmail.com',
  shop_sender_email: 'nganhashop995@gmail.com',
  zalo_phone: '0901378425',
  default_shipping_fee: 30000,
  free_shipping_threshold: 350000,
};

const computeStatus = (stock) => {
  const s = Number(stock);
  if (s <= 0) return 'Hết hàng';
  if (s <= 20) return 'Sắp hết';
  return 'Còn hàng';
};

export const useAdminStore = create((set, get) => ({
  products: DEFAULT_PRODUCTS,
  orders: [],
  auditLogs: [],
  settings: DEFAULT_SETTINGS,
  isSyncing: false,

  hydrateFromSupabase: async () => {
    if (!isSupabaseConfigured || !supabase) return;
    set({ isSyncing: true });
    try {
      const [prodRes, ordRes, setRes, logRes] = await Promise.all([
        supabase.from('products').select('*').order('id', { ascending: true }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('shop_settings').select('*').eq('id', 1).maybeSingle(),
        supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(100),
      ]);

      set({
        products: Array.isArray(prodRes.data) && prodRes.data.length > 0 ? prodRes.data : get().products,
        orders: Array.isArray(ordRes.data) ? ordRes.data : get().orders,
        settings: setRes.data ? { ...DEFAULT_SETTINGS, ...setRes.data } : get().settings,
        auditLogs: Array.isArray(logRes.data) ? logRes.data : get().auditLogs,
        isSyncing: false,
      });
    } catch {
      set({ isSyncing: false });
    }
  },

  updateSettings: async (newSettings) => {
    const updated = { ...get().settings, ...newSettings };
    set({ settings: updated });
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('shop_settings')
        .upsert({
          id: 1,
          bank_id: updated.bank_id,
          bank_name: updated.bank_name,
          bank_account: updated.bank_account,
          account_name: updated.account_name,
          admin_email: updated.admin_email,
          shop_sender_email: updated.shop_sender_email,
          zalo_phone: updated.zalo_phone,
          default_shipping_fee: Number(updated.default_shipping_fee) || 0,
          free_shipping_threshold: Number(updated.free_shipping_threshold) || 0,
          updated_at: new Date().toISOString(),
        });
      if (error) {
        console.error('Lỗi lưu shop_settings lên Supabase:', error);
        throw new Error(error.message || 'Không thể lưu cài đặt lên Supabase.');
      }
    }
    return updated;
  },

  updateProduct: async (id, updatedFields) => {
    const products = get().products.map((p) => {
      if (p.id === id) {
        const merged = { ...p, ...updatedFields };
        if (updatedFields.stock !== undefined && updatedFields.status === undefined) {
          merged.status = computeStatus(updatedFields.stock);
        }
        return merged;
      }
      return p;
    });
    set({ products });
    if (isSupabaseConfigured && supabase) {
      const target = products.find((p) => p.id === id);
      if (target) {
        await supabase.from('products').update({
          name: target.name,
          category_slug: target.category_slug,
          category_name: target.category_name,
          unit: target.unit,
          price: Number(target.price) || 0,
          original_price: Number(target.original_price) || null,
          stock: Number(target.stock) || 0,
          status: target.status,
          thumbnail_url: target.thumbnail_url,
          updated_at: new Date().toISOString(),
        }).eq('id', id);
      }
    }
  },

  adjustStock: async (id, delta, reason = 'Điều chỉnh kho thủ công') => {
    const target = get().products.find((p) => p.id === id);
    if (!target) return;
    const newStock = Math.max(0, (Number(target.stock) || 0) + Number(delta));
    await get().updateProduct(id, { stock: newStock, status: computeStatus(newStock) });
    await get().addAuditLog({
      action_type: delta >= 0 ? 'NHAP_KHO' : 'XUAT_KHO',
      actor: 'Admin',
      detail: `${target.name}: ${delta >= 0 ? '+' : ''}${delta} (${reason}) -> Tồn: ${newStock}`,
    });
  },

  bulkRestock: async (restockItems, reason = 'Nhập kho định kỳ') => {
    for (const item of restockItems) {
      await get().adjustStock(item.id, item.quantity, reason);
    }
  },

  addProduct: async (newProduct) => {
    const stock = Number(newProduct.stock) || 0;
    const slug =
      newProduct.slug ||
      `${(newProduct.name || 'san-pham')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
    const payload = {
      ...newProduct,
      slug,
      stock,
      status: computeStatus(stock),
      price: Number(newProduct.price) || 0,
      original_price: Number(newProduct.original_price) || Number(newProduct.price) || 0,
    };

    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('products').insert(payload).select().single();
      if (data) {
        set({ products: [data, ...get().products] });
        return;
      }
    }
    set({ products: [{ id: Date.now(), ...payload }, ...get().products] });
  },

  deleteProduct: async (id) => {
    set({ products: get().products.filter((p) => p.id !== id) });
    if (isSupabaseConfigured && supabase) {
      await supabase.from('products').delete().eq('id', id);
    }
  },

  resetProducts: async () => {
    set({ products: DEFAULT_PRODUCTS });
  },

  updateOrderStatus: async (orderCode, newStatus) => {
    const orders = get().orders.map((o) =>
      o.order_code === orderCode
        ? {
            ...o,
            order_status: newStatus,
            payment_status: newStatus === 'COMPLETED' ? 'PAID' : o.payment_status,
          }
        : o
    );
    set({ orders });
    if (isSupabaseConfigured && supabase) {
      const updates = { order_status: newStatus };
      if (newStatus === 'COMPLETED') updates.payment_status = 'PAID';
      await supabase.from('orders').update(updates).eq('order_code', orderCode);
    }
  },

  addAuditLog: async (log) => {
    const entry = {
      id: Date.now(),
      created_at: new Date().toISOString(),
      ...log,
    };
    set({ auditLogs: [entry, ...get().auditLogs.slice(0, 99)] });
    if (isSupabaseConfigured && supabase) {
      await supabase.from('audit_logs').insert({
        action_type: log.action_type,
        actor: log.actor || 'Admin',
        detail: log.detail,
      });
    }
  },

  clearOrders: async () => {
    set({ orders: [] });
  },
}));

