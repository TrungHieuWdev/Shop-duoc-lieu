import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: JSON.parse(localStorage.getItem('nganha_herbal_cart') || '[]'),
  cartBounceTick: 0,

  // Kích hoạt rung giỏ hàng 1 nhịp khi hàng rơi vào giỏ
  triggerCartBounce: () => {
    set((state) => ({ cartBounceTick: state.cartBounceTick + 1 }));
  },

  // Thêm sản phẩm vào giỏ hàng
  addItem: (product, quantity = 1) => {
    const currentItems = get().items;
    const existingIndex = currentItems.findIndex((item) => item.id === product.id);

    let updatedItems;
    if (existingIndex > -1) {
      updatedItems = [...currentItems];
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: updatedItems[existingIndex].quantity + quantity,
      };
    } else {
      updatedItems = [
        ...currentItems,
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          price: Number(product.price),
          unit: product.unit || 'Gói',
          thumbnail_url: product.thumbnail_url || product.image_url || '/images/placeholder.jpg',
          quantity,
        },
      ];
    }

    localStorage.setItem('nganha_herbal_cart', JSON.stringify(updatedItems));
    set({ items: updatedItems });
  },

  // Cập nhật số lượng
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }

    const updatedItems = get().items.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );

    localStorage.setItem('nganha_herbal_cart', JSON.stringify(updatedItems));
    set({ items: updatedItems });
  },

  // Xóa sản phẩm khỏi giỏ
  removeItem: (productId) => {
    const updatedItems = get().items.filter((item) => item.id !== productId);
    localStorage.setItem('nganha_herbal_cart', JSON.stringify(updatedItems));
    set({ items: updatedItems });
  },

  // Xóa sạch giỏ hàng (sau khi thanh toán thành công)
  clearCart: () => {
    localStorage.removeItem('nganha_herbal_cart');
    set({ items: [] });
  },

  // Tính tổng số món
  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  // Tính tổng tiền tạm tính
  getSubtotal: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
}));

