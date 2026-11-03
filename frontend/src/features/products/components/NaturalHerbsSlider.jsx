import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

/**
 * Danh sách 6 vị thảo dược tự nhiên chủ đạo kèm hình ảnh thực tế
 * và công dụng chuyên sâu từng loại.
 */
export const NATURAL_HERBS = [
  {
    id: 'trau-khong',
    name: 'Lá Trầu Phơi Khô',
    image: '/images/herbs/la-trau-khong.jpg',
    method: 'Phơi khô',
    benefits: [
      'Kháng khuẩn tự nhiên, làm sạch dịu nhẹ.',
      'Ấm kinh lạc, phòng phong hàn cho mẹ sau sinh.',
    ],
    searchKeyword: 'trầu',
  },
  {
    id: 'ngai-cuu',
    name: 'Lá Ngải Cứu Phơi Khô',
    image: '/images/herbs/ngai-cuu.jpg',
    method: 'Phơi khô',
    benefits: [
      'Ôn ấm kinh mạch, giảm nhức mỏi cơ khớp.',
      'Hoạt huyết, giúp ngủ ngon và sâu giấc.',
    ],
    searchKeyword: 'ngải',
  },
  {
    id: 'sa-chanh',
    name: 'Lá Sả Phơi Khô',
    image: '/images/herbs/sa-chanh.jpg',
    method: 'Phơi khô',
    benefits: [
      'Giải cảm, toát mồ hôi đào thải độc tố khi xông.',
      'Khử mùi tự nhiên, hương thơm ấm áp thư thái.',
    ],
    searchKeyword: 'sả',
  },
  {
    id: 'la-buoi',
    name: 'Lá Bưởi Phơi Khô',
    image: '/images/herbs/la-buoi.jpg',
    method: 'Phơi khô',
    benefits: [
      'Thông thoáng lỗ chân lông, nhẹ nhõm đầu óc.',
      'Dưỡng tóc bóng khỏe, hương thơm dân gian.',
    ],
    searchKeyword: 'bưởi',
  },
  {
    id: 'gung-kho',
    name: 'Gừng Phơi Khô',
    image: '/images/herbs/gung-kho.jpg',
    method: 'Phơi khô',
    benefits: [
      'Tính ấm, tán hàn, phòng cảm lạnh hiệu quả.',
      'Thúc đẩy lưu thông khí huyết, giữ ấm cơ thể.',
    ],
    searchKeyword: 'gừng',
  },
  {
    id: 'dinh-lang',
    name: 'Lá Đinh Lăng Phơi Khô',
    image: '/images/herbs/dinh-lang.jpg',
    method: 'Phơi khô',
    benefits: [
      'Bồi bổ khí huyết, giảm mệt mỏi suy nhược.',
      'An thần, thư giãn thần kinh và ngủ ngon.',
    ],
    searchKeyword: 'đinh lăng',
  },
  {
    id: 'hoa-hong',
    name: 'Hoa Hồng Phơi Khô',
    image: '/images/herbs/hoa-hong.jpg',
    method: 'Phơi khô',
    benefits: [
      'Dưỡng ẩm, giúp da mềm mại và sáng mịn.',
      'Hương hoa ngọt ngào, xoa dịu căng thẳng.',
    ],
    searchKeyword: 'hoa hồng',
  },
];

export const NaturalHerbsSlider = () => {
  // Tạo mảng nhân 3 lần để đạt vòng lặp vô hạn (Infinite Carousel) mượt mà tuyệt đối
  const items = [...NATURAL_HERBS, ...NATURAL_HERBS, ...NATURAL_HERBS];
  const totalOriginal = NATURAL_HERBS.length;

  const [currentIndex, setCurrentIndex] = useState(totalOriginal); // Bắt đầu ở cụm giữa
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleCards, setVisibleCards] = useState(3);

  // Trạng thái vuốt lướt tay (Touch & Mouse Drag) trực quan
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartXRef = useRef(0);

  const containerRef = useRef(null);

  // Xác định số lượng thẻ hiển thị theo kích thước màn hình
  useEffect(() => {
    const updateVisibleCards = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleCards(1);
      } else if (width < 900) {
        setVisibleCards(2);
      } else if (width < 1280) {
        setVisibleCards(3);
      } else {
        setVisibleCards(4);
      }
    };

    updateVisibleCards();
    window.addEventListener('resize', updateVisibleCards);
    return () => window.removeEventListener('resize', updateVisibleCards);
  }, []);

  // Chuyển sang thẻ tiếp theo
  const handleNext = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, []);

  // Lùi về thẻ trước
  const handlePrev = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, []);

  // Xử lý khi chạy hết ảnh -> quay lại ảnh ban đầu trong suốt, không giật
  const handleTransitionEnd = () => {
    if (currentIndex >= totalOriginal * 2) {
      // Đã trượt qua cụm thứ 2 -> nhảy về cụm thứ 1 mà không dùng hiệu ứng
      setIsTransitioning(false);
      setCurrentIndex(currentIndex - totalOriginal);
    } else if (currentIndex < totalOriginal) {
      // Đã lùi quá cụm đầu -> nhảy sang cụm thứ 2
      setIsTransitioning(false);
      setCurrentIndex(currentIndex + totalOriginal);
    }
  };

  // Tự động chuyển động ngang tuần tự sau mỗi 3.8 giây (tạm dừng khi rê chuột hoặc chạm)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      handleNext();
    }, 3800);

    return () => clearInterval(timer);
  }, [handleNext, isPaused]);

  // Xử lý lướt tay trên màn hình cảm ứng (Mobile / Tablet)
  const handleTouchStart = (e) => {
    setIsPaused(true);
    setIsDragging(true);
    dragStartXRef.current = e.touches[0].clientX;
    setDragOffset(0);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientX - dragStartXRef.current;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setIsPaused(false);
    if (dragOffset < -40) {
      handleNext();
    } else if (dragOffset > 40) {
      handlePrev();
    }
    setDragOffset(0);
  };

  // Xử lý kéo thả chuột trên máy tính (Desktop Mouse Drag)
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Chỉ nhận chuột trái
    setIsPaused(true);
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    setDragOffset(0);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const diff = e.clientX - dragStartXRef.current;
    setDragOffset(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setIsPaused(false);
    if (dragOffset < -40) {
      handleNext();
    } else if (dragOffset > 40) {
      handlePrev();
    }
    setDragOffset(0);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    } else {
      setIsPaused(false);
    }
  };

  // Tính vị trí thực tế trong 4 vị thảo dược gốc (0, 1, 2, 3) để hiển thị chấm chỉ số
  const activeRealIndex = ((currentIndex % totalOriginal) + totalOriginal) % totalOriginal;

  // Tính phần trăm dịch chuyển ngang
  const stepPercent = 100 / visibleCards;
  const transformX = -(currentIndex * stepPercent);

  return (
    <section className="bg-surface-container-low py-10 sm:py-12 px-4 sm:px-8 lg:px-12 xl:px-16 border-y border-border-herbal overflow-hidden">
      <div className="max-w-[1536px] mx-auto">
        {/* Tiêu đề & Cụm nút điều khiển */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-7 gap-3">
          <div>
            <span className="text-[0.6875rem] sm:text-xs font-semibold text-secondary uppercase tracking-widest flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[1rem] text-[#8a7258]">
                local_florist
              </span>
              Nguồn Thảo Dược Tự Nhiên
            </span>
            <h2 className="font-serif text-2xl lg:text-3xl text-primary font-bold mt-1">
              An Toàn Lành Tính
            </h2>
          </div>

          <div className="flex items-center gap-3 self-start md:self-end shrink-0">


            <Link
              to="/san-pham"
              className="text-body-sm text-secondary hover:text-primary font-medium flex items-center gap-1 ml-2 transition-colors"
            >
              <span className="hidden sm:inline">Xem tất cả sản phẩm</span>
              <span className="sm:hidden">Tất cả</span>
              <span className="material-symbols-outlined text-[1rem]">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* Khung trượt Carousel Tuần Tự (Hỗ trợ lướt tay & kéo chuột trực tiếp) */}
        <div
          className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
          onMouseEnter={() => !isDragging && setIsPaused(true)}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          ref={containerRef}
        >
          <div
            className="flex"
            style={{
              transform: isDragging
                ? `translateX(calc(${transformX}% + ${dragOffset}px))`
                : `translateX(${transformX}%)`,
              transition: isDragging || !isTransitioning
                ? 'none'
                : 'transform 700ms cubic-bezier(0.25, 1, 0.5, 1)',
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {items.map((herb, idx) => (
              <div
                key={`${herb.id}-${idx}`}
                className="shrink-0 px-2.5 sm:px-3"
                style={{ width: `${stepPercent}%` }}
              >
                <div className="group bg-surface rounded-xl overflow-hidden border border-border-herbal shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
                  {/* Khung Hình ảnh Thảo dược thực tế */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface-container-high pointer-events-none">
                    <img
                      src={herb.image}
                      alt={herb.name}
                      draggable="false"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out pointer-events-none"
                      loading="lazy"
                    />

                    {/* Huy hiệu phương pháp chế biến (chỉ hiện khi có dữ liệu) */}
                    {herb.method && (
                      <div className="absolute top-2 left-2 bg-surface/90 backdrop-blur-xs border border-border-herbal/60 rounded-full px-2 py-0.5 text-[10px] font-semibold text-primary shadow-2xs">
                        {herb.method}
                      </div>
                    )}

                    {/* Huy hiệu đặc tính (chỉ hiện khi có dữ liệu) */}
                    {herb.badge && (
                      <div className="absolute top-2 right-2 bg-[#1f3627]/90 backdrop-blur-xs text-[#cee9d4] rounded-full px-2 py-0.5 text-[10px] font-medium shadow-2xs">
                        {herb.badge}
                      </div>
                    )}
                  </div>

                  {/* Phần Nội Dung: Tên thảo dược & Danh sách công dụng riêng */}
                  <div className="px-4 pt-3 pb-4 flex flex-col flex-1">
                    {/* Tên thảo dược */}
                    <h3 className="font-serif text-base font-bold text-primary group-hover:text-secondary transition-colors">
                      {herb.name}
                    </h3>

                    {/* Tên khoa học & đặc tính dược liệu */}
                    {herb.botanicalName && (
                      <p className="text-xs text-[#8a7258] italic font-medium mt-0.5 mb-2 truncate">
                        {herb.botanicalName}
                      </p>
                    )}

                    {/* Đường phân cách thảo mộc mỏng */}
                    <div className="h-[1px] bg-gradient-to-r from-border-herbal via-border-herbal/50 to-transparent my-1"></div>

                    {/* Tiêu đề mục công dụng */}
                    <div className="mt-2 mb-1.5 flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-secondary">
                      <span className="material-symbols-outlined text-[0.875rem] text-[#8a7258]">
                        spa
                      </span>
                      <span>Công dụng</span>
                    </div>

                    {/* Danh sách công dụng chi tiết của từng loại thảo dược */}
                    <ul className="space-y-1 text-xs text-on-surface-variant flex-1">
                      {herb.benefits.map((benefit, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-1.5 leading-snug">
                          <span className="text-[#8a7258] font-bold shrink-0 mt-0.5">•</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Thanh chỉ số vị trí (Indicators) & Chú thích tương tác */}
        <div className="mt-5 flex items-center justify-center">
          <div className="flex items-center gap-2">
            {NATURAL_HERBS.map((herb, idx) => (
              <button
                key={herb.id}
                onClick={() => {
                  setIsTransitioning(true);
                  setCurrentIndex(totalOriginal + idx);
                }}
                aria-label={`Chuyển đến ${herb.name}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${activeRealIndex === idx
                  ? 'w-8 bg-primary'
                  : 'w-2 bg-border-herbal hover:bg-secondary'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NaturalHerbsSlider;

