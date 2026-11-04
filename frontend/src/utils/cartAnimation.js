import { useCartStore } from '@/store/useCartStore';

/**
 * Hiệu ứng đơn hàng/thảo mộc bay thu nhỏ vào giỏ hàng và kích hoạt giỏ hàng rung lên 1 nhịp
 * @param {Object} options
 * @param {HTMLElement} options.sourceElement - Thẻ xuất phát (ảnh sản phẩm hoặc nút bấm)
 * @param {string} options.imageUrl - Link ảnh sản phẩm bay vào giỏ
 * @param {Function} [options.onComplete] - Callback khi đơn hàng đáp vào giỏ
 */
export const flyItemToCart = ({ sourceElement, imageUrl, onComplete }) => {
  if (typeof window === 'undefined') {
    useCartStore.getState().triggerCartBounce();
    onComplete?.();
    return;
  }

  // 1. Tìm biểu tượng giỏ hàng trên thanh Header
  const cartBtn =
    document.getElementById('header-cart-btn') ||
    document.querySelector('[data-cart-btn]') ||
    document.querySelector('a[href="/gio-hang"]');

  if (!cartBtn) {
    useCartStore.getState().triggerCartBounce();
    onComplete?.();
    return;
  }

  // 2. Lấy tọa độ xuất phát (từ ảnh/nút sản phẩm) và tọa độ đích (biểu tượng giỏ hàng)
  const targetRect = cartBtn.getBoundingClientRect();
  const startRect = sourceElement ? sourceElement.getBoundingClientRect() : null;

  // Tọa độ tâm xuất phát
  const startX =
    startRect && startRect.width > 0
      ? startRect.left + startRect.width / 2
      : window.innerWidth / 2;
  const startY =
    startRect && startRect.height > 0
      ? startRect.top + startRect.height / 2
      : window.innerHeight / 2;

  // Tọa độ tâm giỏ hàng
  const targetX = targetRect.left + targetRect.width / 2;
  const targetY = targetRect.top + targetRect.height / 2;

  // 3. Tạo thẻ bay (Flyer Node) - tự động co gọn trên điện thoại
  const flyer = document.createElement('div');
  const flyerSize = window.innerWidth < 640 ? 48 : 68; // Kích thước bong bóng xem trước (px)

  flyer.style.position = 'fixed';
  flyer.style.left = `${startX}px`;
  flyer.style.top = `${startY}px`;
  flyer.style.width = `${flyerSize}px`;
  flyer.style.height = `${flyerSize}px`;
  flyer.style.marginLeft = `-${flyerSize / 2}px`;
  flyer.style.marginTop = `-${flyerSize / 2}px`;
  flyer.style.borderRadius = '9999px';
  flyer.style.overflow = 'hidden';
  flyer.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.45), 0 0 15px rgba(203, 176, 124, 0.6)';
  flyer.style.border = '2.5px solid #cbb07c';
  flyer.style.backgroundColor = '#fbf9f2';
  flyer.style.zIndex = '999999';
  flyer.style.pointerEvents = 'none';
  flyer.style.willChange = 'transform, opacity';

  // Hiển thị hình ảnh hoặc icon thảo mộc
  if (imageUrl) {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = 'Sản phẩm thảo mộc';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    flyer.appendChild(img);
  } else {
    const fallback = document.createElement('div');
    fallback.style.width = '100%';
    fallback.style.height = '100%';
    fallback.style.display = 'flex';
    fallback.style.alignItems = 'center';
    fallback.style.justifyContent = 'center';
    fallback.style.backgroundColor = '#14261a';
    fallback.style.color = '#cbb07c';
    fallback.style.fontSize = '24px';
    fallback.innerHTML = '🌿';
    flyer.appendChild(fallback);
  }

  document.body.appendChild(flyer);

  // 4. Tính toán khoảng cách di chuyển
  const deltaX = targetX - startX;
  const deltaY = targetY - startY;

  // Điểm uốn cong hình parabol: vọt nhẹ lên trên tạo cảm giác tự nhiên như ném vào giỏ
  const arcLift = Math.min(Math.abs(deltaY) * 0.25 + 40, 110);
  const midX = deltaX * 0.45;
  const midY = deltaY < 0 ? deltaY * 0.45 - arcLift : -arcLift;

  // Quỹ đạo Keyframes mượt mà bằng Web Animations API
  const keyframes = [
    {
      transform: 'translate(0px, 0px) scale(0.65) rotate(0deg)',
      opacity: 0.9,
    },
    {
      offset: 0.16,
      // Nảy nhẹ phóng to ban đầu để người dùng nhận biết sản phẩm bắt đầu bay
      transform: 'translate(0px, -20px) scale(1.15) rotate(-8deg)',
      opacity: 1,
    },
    {
      offset: 0.52,
      // Đạt đỉnh parabol ở giữa đoạn đường, bắt đầu thu nhỏ
      transform: `translate(${midX}px, ${midY}px) scale(0.8) rotate(${deltaX > 0 ? 14 : -14}deg)`,
      opacity: 0.95,
    },
    {
      offset: 0.85,
      // Lao nhanh về phía giỏ hàng và thu nhỏ mạnh
      transform: `translate(${deltaX * 0.88}px, ${deltaY * 0.88}px) scale(0.35) rotate(${deltaX > 0 ? 25 : -25}deg)`,
      opacity: 0.8,
    },
    {
      // Chạm chính xác tâm giỏ hàng: thu bé li ti và tan vào giỏ
      transform: `translate(${deltaX}px, ${deltaY}px) scale(0.08) rotate(${deltaX > 0 ? 35 : -35}deg)`,
      opacity: 0,
    },
  ];

  const duration = 680; // ms
  let isFinished = false;

  const handleFinish = () => {
    if (isFinished) return;
    isFinished = true;
    if (flyer.parentNode) {
      flyer.remove();
    }
    // Kích hoạt rung giỏ hàng lên 1 nhịp và gọi callback
    useCartStore.getState().triggerCartBounce();
    onComplete?.();
  };

  try {
    const animation = flyer.animate(keyframes, {
      duration,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'forwards',
    });
    animation.onfinish = handleFinish;
  } catch (err) {
    // Trình duyệt cũ không hỗ trợ animate()
    handleFinish();
  }

  // Backup phòng trường hợp gián đoạn
  setTimeout(handleFinish, duration + 100);
};

