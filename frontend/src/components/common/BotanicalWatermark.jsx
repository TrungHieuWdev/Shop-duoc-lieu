import React from 'react';

/**
 * Biểu tượng cây hoa thảo mộc ẩn mờ sau nền trang (Botanical Watermark)
 * Thiết kế bằng SVG vector vẽ tay thanh mảnh, hòa vào màu nền giấy kem,
 * tạo chiều sâu và chất thơ mộc mạc cho thương hiệu dược liệu.
 */
export const BotanicalWatermark = ({ className = '' }) => {
  return (
    <div
      className={`pointer-events-none select-none z-0 ${className}`}
      aria-hidden="true"
    >
      <svg
        width="260"
        height="700"
        viewBox="0 0 260 700"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-auto h-[400px] sm:h-[540px] lg:h-[660px] text-[#425740]"
      >
        {/* Thân cây chính uốn lượn tự nhiên */}
        <path
          d="M90 700C110 580 135 440 145 280C150 200 152 140 154 90"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {/* Bông hoa thảo mộc trên đỉnh thân chính */}
        <g transform="translate(154, 85)">
          <ellipse cx="0" cy="0" rx="4.5" ry="3.5" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1" />
          <path d="M0 -3.5C-1 -9 1 -9 0 -3.5Z" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.15" />
          <path d="M2.5 -2.5C6 -7 8 -5 2.5 -2.5Z" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.15" />
          <path d="M3.5 0C8 -1 9 1 3.5 0Z" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.15" />
          <path d="M2.5 2.5C7 5 5 7 2.5 2.5Z" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.15" />
          <path d="M0 3.5C1 8 -1 8 0 3.5Z" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.15" />
          <path d="M-2.5 2.5C-6 6 -8 4 -2.5 2.5Z" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.15" />
          <path d="M-3.5 0C-8 1 -9 -1 -3.5 0Z" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.15" />
          <path d="M-2.5 -2.5C-6 -6 -4 -8 -2.5 -2.5Z" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.15" />
        </g>

        {/* Nhánh phụ bên phải (tầng cao) */}
        <path
          d="M148 240C170 210 195 185 208 160"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <g transform="translate(208, 155)">
          <ellipse cx="0" cy="0" rx="3.5" ry="3" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="0.9" />
          <path d="M0 -3C-1 -7 1 -7 0 -3Z" stroke="currentColor" strokeWidth="0.9" />
          <path d="M2 -2C5 -5 6 -3 2 -2Z" stroke="currentColor" strokeWidth="0.9" />
          <path d="M3 0C6 -0.5 6 1.5 3 0Z" stroke="currentColor" strokeWidth="0.9" />
          <path d="M2 2C5 4 3 6 2 2Z" stroke="currentColor" strokeWidth="0.9" />
          <path d="M-2 2C-5 5 -6 3 -2 2Z" stroke="currentColor" strokeWidth="0.9" />
          <path d="M-3 0C-6 0.5 -6 -1.5 -3 0Z" stroke="currentColor" strokeWidth="0.9" />
        </g>

        {/* Nhánh phụ bên trái (tầng giữa) */}
        <path
          d="M138 360C105 320 80 270 72 230"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <g transform="translate(72, 226)">
          <path d="M0 4C-3 0 -2 -5 0 -8C2 -5 3 0 0 4Z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1" />
          <circle cx="0" cy="-9" r="1.2" fill="currentColor" />
        </g>

        {/* Nhánh phụ bên phải (tầng thấp) */}
        <path
          d="M125 470C155 435 180 395 192 355"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <g transform="translate(192, 350)">
          <path d="M0 4C-2.5 0 -2 -4 0 -7C2 -4 2.5 0 0 4Z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1" />
        </g>

        {/* Các cặp lá thảo mộc mọc dọc thân chính */}
        {/* Cặp lá 1 (gần ngọn) */}
        <path d="M152 140C165 135 174 140 178 148C168 150 158 147 152 140Z" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1" />
        <path d="M150 160C136 155 128 160 124 168C134 170 144 167 150 160Z" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1" />

        {/* Cặp lá 2 */}
        <path d="M144 290C164 280 176 288 182 298C168 302 154 298 144 290Z" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1" />
        <path d="M141 315C122 308 112 316 106 328C120 330 132 325 141 315Z" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1" />

        {/* Cặp lá 3 */}
        <path d="M132 410C156 398 172 408 178 422C160 426 144 420 132 410Z" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.1" />
        <path d="M128 435C104 425 90 435 84 450C102 452 116 446 128 435Z" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.1" />

        {/* Cặp lá 4 */}
        <path d="M118 520C148 505 166 518 174 535C152 540 132 532 118 520Z" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.2" />
        <path d="M112 550C85 538 70 552 62 570C84 572 100 564 112 550Z" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.2" />

        {/* Cặp lá gốc */}
        <path d="M102 620C136 602 158 618 166 638C140 644 118 635 102 620Z" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.3" />
        <path d="M96 645C65 630 48 646 38 668C64 670 82 660 96 645Z" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    </div>
  );
};

