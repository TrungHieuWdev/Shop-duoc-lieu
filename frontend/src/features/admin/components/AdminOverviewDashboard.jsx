import React, { useState, useMemo } from 'react';
import { formatCurrency } from '@/utils/formatCurrency';

// Dữ liệu mô phỏng dự phóng kinh doanh năm 2026 chuẩn mực
const PROJECTION_DATA_7_DAYS = [
  { label: 'Thứ 2', date: '28/10', orders: 4, revenue: 850000, cogs: 390000, profit: 460000 },
  { label: 'Thứ 3', date: '29/10', orders: 6, revenue: 1420000, cogs: 650000, profit: 770000 },
  { label: 'Thứ 4', date: '30/10', orders: 5, revenue: 1150000, cogs: 520000, profit: 630000 },
  { label: 'Thứ 5', date: '31/10', orders: 8, revenue: 1980000, cogs: 880000, profit: 1100000 },
  { label: 'Thứ 6', date: '01/11', orders: 9, revenue: 2350000, cogs: 1050000, profit: 1300000 },
  { label: 'Thứ 7', date: '02/11', orders: 14, revenue: 3620000, cogs: 1620000, profit: 2000000 },
  { label: 'Chủ Nhật', date: '03/11', orders: 12, revenue: 3180000, cogs: 1420000, profit: 1760000 },
];

export const AdminOverviewDashboard = ({ orders, products, onNavigateTab }) => {
  const [timeRange, setTimeRange] = useState('7days'); // 'today' | '7days' | '30days'
  const [viewMode, setViewMode] = useState(orders.length > 0 ? 'real' : 'real'); // 'real' | 'projected'
  const [activeHoverIdx, setActiveHoverIdx] = useState(null);

  // Tính toán dữ liệu thực tế từ danh sách đơn hàng
  const realChartData = useMemo(() => {
    // 7 ngày gần nhất
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
      const dayName = i === 0 ? 'Hôm nay' : `T.${d.getDay() === 0 ? 'CN' : d.getDay() + 1}`;
      
      // Lọc các đơn hàng trong ngày này
      const dayOrders = orders.filter((o) => {
        if (!o.created_at) return false;
        const od = new Date(o.created_at);
        return od.toDateString() === d.toDateString();
      });

      const dayRevenue = dayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      // Ước tính giá vốn hàng bán ~45%
      const dayCogs = Math.round(dayRevenue * 0.45);
      const dayProfit = dayRevenue - dayCogs;

      days.push({
        label: dayName,
        date: dateStr,
        orders: dayOrders.length,
        revenue: dayRevenue,
        cogs: dayCogs,
        profit: dayProfit,
      });
    }
    return days;
  }, [orders]);

  const chartData = viewMode === 'real' ? realChartData : PROJECTION_DATA_7_DAYS;

  // Tính toán các chỉ số KPI
  const totalOrders = chartData.reduce((s, it) => s + it.orders, 0);
  const totalRevenue = chartData.reduce((s, it) => s + it.revenue, 0);
  const totalProfit = chartData.reduce((s, it) => s + it.profit, 0);
  const totalCogs = chartData.reduce((s, it) => s + it.cogs, 0);
  const netMargin = totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0;
  const aov = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // Tìm giá trị max để scale biểu đồ
  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 1000000);
  const maxOrders = Math.max(...chartData.map((d) => d.orders), 5);

  return (
    <div className="space-y-4 w-full">
      {/* 1. Header Bảng Điều Khiển & Bộ Chuyển Đổi Dữ Liệu */}
      <div className="bg-white border border-border-herbal p-3 sm:p-4 shadow-xs rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">analytics</span>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-primary">
              Báo Cáo Hiệu Suất Đơn Hàng &amp; Lợi Nhuận Thuần 2026
            </h2>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Đối soát trực tiếp giữa <strong>Doanh Thu Bán Lẻ</strong>, <strong>Giá Vốn Dược Liệu</strong> và <strong>Lợi Nhuận Thuần Thực Nhận</strong>
          </p>
        </div>

        {/* Nút chuyển đổi chế độ xem */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('real')}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all cursor-pointer ${
              viewMode === 'real'
                ? 'bg-[#1d3527] text-[#d4b986] border-[#1d3527]'
                : 'bg-white text-on-surface-variant hover:bg-surface-container border-border-herbal'
            }`}
          >
            Số Liệu Thực Tế ({orders.length} Đơn)
          </button>
          <button
            type="button"
            onClick={() => setViewMode('projected')}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all cursor-pointer ${
              viewMode === 'projected'
                ? 'bg-[#1d3527] text-[#d4b986] border-[#1d3527]'
                : 'bg-white text-on-surface-variant hover:bg-surface-container border-border-herbal'
            }`}
          >
            Mô Phỏng 2026
          </button>
        </div>
      </div>

      {/* 2. 4 THẺ CHỈ SỐ KPI CHUẨN 2026 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* KPI 1: Đơn Hàng Mới */}
        <div className="bg-white border border-border-herbal p-3.5 shadow-xs rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-secondary">
              Số Đơn Hàng Mới
            </span>
            <span className="material-symbols-outlined text-[#8a7258] text-lg">receipt_long</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-primary">
              {totalOrders}
            </span>
            <span className="text-xs font-bold text-green-700">Đơn hàng</span>
          </div>
          <p className="text-[11px] text-on-surface-variant truncate">
            {orders.length === 0 && viewMode === 'real'
              ? 'Chưa có đơn phát sinh'
              : `${totalOrders} đơn tiếp nhận trong kỳ`}
          </p>
        </div>

        {/* KPI 2: Tổng Doanh Thu */}
        <div className="bg-white border border-border-herbal p-3.5 shadow-xs rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-secondary">
              Tổng Doanh Thu
            </span>
            <span className="material-symbols-outlined text-[#8a7258] text-lg">payments</span>
          </div>
          <div className="font-serif text-xl sm:text-2xl font-extrabold text-primary truncate">
            {formatCurrency(totalRevenue)}
          </div>
          <p className="text-[11px] text-on-surface-variant truncate">
            {totalRevenue > 0 ? 'Giá trị bán lẻ trước chi phí' : '0 đ thực nhận'}
          </p>
        </div>

        {/* KPI 3: Lợi Nhuận Thuần (Pure Net Profit) - TÂM ĐIỂM YÊU CẦU */}
        <div className="bg-[#faf8f5] border-2 border-[#d4b986] p-3.5 shadow-xs rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#8a7258]">
              Lợi Nhuận Thuần (Net Profit)
            </span>
            <span className="material-symbols-outlined text-[#8a7258] text-lg">savings</span>
          </div>
          <div className="font-serif text-xl sm:text-2xl font-extrabold text-green-800 truncate">
            {formatCurrency(totalProfit)}
          </div>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="px-1.5 py-0.2 bg-green-100 text-green-800 font-bold font-mono rounded-md">
              Biên lãi {netMargin}%
            </span>
            <span className="text-on-surface-variant text-[10px]">thực nhận về túi</span>
          </div>
        </div>

        {/* KPI 4: Giá Trị Đơn Trung Bình (AOV) */}
        <div className="bg-white border border-border-herbal p-3.5 shadow-xs rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-secondary">
              Giá Trị Đơn TB (AOV)
            </span>
            <span className="material-symbols-outlined text-[#8a7258] text-lg">shopping_cart_checkout</span>
          </div>
          <div className="font-serif text-xl sm:text-2xl font-extrabold text-primary truncate">
            {formatCurrency(aov)}
          </div>
          <p className="text-[11px] text-on-surface-variant truncate">
            {aov > 0 ? 'Trung bình mỗi lượt khách mua' : 'Chưa có giao dịch'}
          </p>
        </div>
      </div>

      {/* 3. BIỂU ĐỒ LỢI NHUẬN THUẦN & ĐƠN HÀNG MỚI CHUẨN 2026 */}
      <div className="bg-white border border-border-herbal p-3.5 sm:p-5 shadow-xs rounded-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-herbal pb-3">
          <div>
            <h3 className="font-serif text-base font-bold text-primary flex items-center gap-2">
              <span>Biểu Đồ Doanh Thu, Lợi Nhuận Thuần &amp; Xu Hướng Đơn Mới</span>
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 bg-[#14261a] text-[#cbb07c]">
                Chuẩn 2026
              </span>
            </h3>
            <p className="text-xs text-on-surface-variant">
              Rê chuột hoặc chạm vào từng cột mốc để xem chi tiết doanh thu và tiền lãi thuần
            </p>
          </div>

          {/* Chú thích biểu đồ (Legend) */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-[#14261a]"></span>
              <span className="text-on-surface font-medium">Doanh thu bán lẻ</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-[#cbb07c]"></span>
              <span className="text-on-surface font-bold text-green-900">Lợi nhuận thuần</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-1 bg-amber-600 inline-block"></span>
              <span className="text-on-surface font-medium">Số đơn hàng mới</span>
            </div>
          </div>
        </div>

        {/* KHUNG BIỂU ĐỒ SVG INTERACTIVE TỰ CO GIÃN 100% RESPONSIVE */}
        <div className="relative pt-4 pb-2">
          {viewMode === 'real' && orders.length === 0 ? (
            <div className="py-14 text-center text-xs text-on-surface-variant flex flex-col items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-outline mb-2">bar_chart</span>
              <p className="font-bold text-primary text-sm">Chưa Phát Sinh Đơn Hàng Mới Trong Kho</p>
              <p className="text-[11px] max-w-md text-on-surface-variant mt-1 leading-relaxed">
                Biểu đồ đang phản ánh chính xác dữ liệu thực tế (0 đơn). Bấm nút <strong>"Mô Phỏng 2026"</strong> ở trên để xem trực quan biểu đồ hoạt động khi có đơn hàng, hoặc thử đặt đơn trên gian hàng!
              </p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto scrollbar-none">
              <div className="min-w-[580px] h-64 sm:h-72 relative flex flex-col justify-end">
                {/* Lưới trục Y (Grid Lines) */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-outline font-mono border-b border-border-herbal">
                  <div className="border-b border-dashed border-border-herbal/60 pb-1 flex justify-between">
                    <span>{formatCurrency(maxRevenue)}</span>
                    <span>{maxOrders} đơn</span>
                  </div>
                  <div className="border-b border-dashed border-border-herbal/60 pb-1 flex justify-between">
                    <span>{formatCurrency(Math.round(maxRevenue * 0.66))}</span>
                    <span>{Math.round(maxOrders * 0.66)} đơn</span>
                  </div>
                  <div className="border-b border-dashed border-border-herbal/60 pb-1 flex justify-between">
                    <span>{formatCurrency(Math.round(maxRevenue * 0.33))}</span>
                    <span>{Math.round(maxOrders * 0.33)} đơn</span>
                  </div>
                  <div className="flex justify-between text-outline">
                    <span>0 đ</span>
                    <span>0 đơn</span>
                  </div>
                </div>

                {/* Các cột hiển thị (Bar columns) */}
                <div className="relative z-10 h-full flex items-end justify-between px-4 sm:px-8">
                  {chartData.map((item, idx) => {
                    const revHeightPercent = Math.max(8, Math.round((item.revenue / maxRevenue) * 85));
                    const profitHeightPercent = Math.max(4, Math.round((item.profit / maxRevenue) * 85));
                    const isHovered = activeHoverIdx === idx;

                    return (
                      <div
                        key={idx}
                        onMouseEnter={() => setActiveHoverIdx(idx)}
                        onMouseLeave={() => setActiveHoverIdx(null)}
                        className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer relative"
                      >
                        {/* Tooltip khi hover/chạm */}
                        {isHovered && (
                          <div className="absolute -top-16 z-30 bg-[#14261a] text-white p-2 shadow-xl border border-[#cbb07c] rounded-none text-xs whitespace-nowrap min-w-[150px] animate-fade-in pointer-events-none">
                            <div className="font-bold text-[#cbb07c] border-b border-white/20 pb-1 mb-1 flex justify-between">
                              <span>{item.label} ({item.date})</span>
                              <span>{item.orders} đơn</span>
                            </div>
                            <div className="flex justify-between text-[11px]">
                              <span className="text-[#a3b899]">Doanh thu:</span>
                              <span className="font-bold">{formatCurrency(item.revenue)}</span>
                            </div>
                            <div className="flex justify-between text-[11px] text-green-300 font-bold">
                              <span>Lãi thuần:</span>
                              <span>+{formatCurrency(item.profit)}</span>
                            </div>
                          </div>
                        )}

                        {/* Cụm 2 cột: Cột Doanh Thu & Cột Lợi Nhuận Thuần */}
                        <div className="flex items-end gap-1 sm:gap-1.5 h-full w-full justify-center">
                          {/* Cột 1: Doanh thu (Xanh rừng đậm) */}
                          <div
                            style={{ height: `${revHeightPercent}%` }}
                            className={`w-4 sm:w-6 bg-[#14261a] transition-all rounded-none ${
                              isHovered ? 'bg-[#22442d]' : ''
                            }`}
                            title={`Doanh thu: ${formatCurrency(item.revenue)}`}
                          ></div>

                          {/* Cột 2: Lợi nhuận thuần (Vàng rơm / Gold) */}
                          <div
                            style={{ height: `${profitHeightPercent}%` }}
                            className={`w-4 sm:w-6 bg-[#cbb07c] transition-all rounded-none ${
                              isHovered ? 'bg-[#dfc492]' : ''
                            }`}
                            title={`Lợi nhuận thuần: ${formatCurrency(item.profit)}`}
                          ></div>
                        </div>

                        {/* Điểm chỉ số đơn hàng mới (Line marker) */}
                        <div
                          style={{ bottom: `${Math.max(10, Math.round((item.orders / maxOrders) * 75))}%` }}
                          className="absolute w-3 h-3 bg-amber-600 border-2 border-white rounded-none z-20 shadow-xs"
                          title={`${item.orders} đơn hàng mới`}
                        ></div>

                        {/* Nhãn trục X */}
                        <div className="pt-2 text-center text-xs font-semibold text-primary">
                          <span className="block text-[11px] font-bold">{item.label}</span>
                          <span className="block text-[9px] text-outline font-mono">{item.date}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. PHÂN TÍCH CƠ CẤU LỢI NHUẬN & TOP DƯỢC LIỆU SINH LỜI CAO NHẤT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Khối Trái: Cơ Cấu Chi Phí & Lợi Nhuận Thuần */}
        <div className="lg:col-span-5 bg-white border border-border-herbal p-4 shadow-xs rounded-xl space-y-3">
          <div className="flex items-center justify-between border-b border-border-herbal pb-2">
            <h4 className="font-serif text-sm font-bold text-primary uppercase tracking-wider">
              Phân Rã Cơ Cấu Lợi Nhuận Thuần
            </h4>
            <span className="text-xs font-mono font-bold text-green-700">{netMargin}% Net</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div>
              <div className="flex justify-between text-primary font-medium mb-1">
                <span>1. Doanh thu gộp bán lẻ:</span>
                <span className="font-bold">{formatCurrency(totalRevenue)} (100%)</span>
              </div>
              <div className="w-full h-2 bg-[#1d3527] rounded-full"></div>
            </div>

            <div>
              <div className="flex justify-between text-on-surface-variant mb-1">
                <span>2. Giá vốn dược liệu (COGS):</span>
                <span className="font-mono text-red-700">-{formatCurrency(totalCogs)} (~45%)</span>
              </div>
              <div className="w-full h-2 bg-red-200 rounded-full"></div>
            </div>

            <div>
              <div className="flex justify-between text-on-surface-variant mb-1">
                <span>3. Chi phí bao bì túi zip &amp; tem nhãn:</span>
                <span className="font-mono text-amber-700">-{formatCurrency(Math.round(totalRevenue * 0.05))} (~5%)</span>
              </div>
              <div className="w-full h-2 bg-amber-200 rounded-full"></div>
            </div>

            <div className="pt-2 border-t border-border-herbal/70 flex justify-between items-center text-sm font-bold text-primary">
              <span className="text-green-800">Lợi Nhuận Thuần Thực Nhận:</span>
              <span className="font-serif text-base text-green-800">+{formatCurrency(totalProfit)}</span>
            </div>
          </div>
        </div>

        {/* Khối Phải: Top Dược Liệu Sinh Lời Cao Nhất */}
        <div className="lg:col-span-7 bg-white border border-border-herbal p-4 shadow-xs rounded-xl space-y-3">
          <div className="flex items-center justify-between border-b border-border-herbal pb-2">
            <h4 className="font-serif text-sm font-bold text-primary uppercase tracking-wider">
              Top Dược Liệu Sinh Lời Cao Nhất Tiệm Ngân Hà
            </h4>
            <button
              type="button"
              onClick={() => onNavigateTab('products')}
              className="text-xs text-[#8a7258] hover:text-primary font-semibold hover:underline"
            >
              Xem tất cả kho &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#14261a]/5 text-primary text-[10px] uppercase font-bold border-b border-border-herbal">
                <tr>
                  <th className="py-2 px-2.5">Vị Dược Liệu</th>
                  <th className="py-2 px-2.5 text-right">Giá Bán</th>
                  <th className="py-2 px-2.5 text-right">Giá Vốn Ước Tính</th>
                  <th className="py-2 px-2.5 text-right">Lãi Thuần/Gói</th>
                  <th className="py-2 px-2.5 text-center">Tồn Kho</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-herbal/50">
                {products.slice(0, 5).map((p) => {
                  const estimatedCost = Math.round(p.price * 0.45);
                  const itemProfit = p.price - estimatedCost;
                  return (
                    <tr key={p.id} className="hover:bg-surface-container-low/40">
                      <td className="py-2 px-2.5 font-medium text-primary">
                        <span className="line-clamp-1">{p.name}</span>
                        <span className="text-[10px] text-outline font-normal font-mono">#{p.id}</span>
                      </td>
                      <td className="py-2 px-2.5 text-right font-bold text-primary">{formatCurrency(p.price)}</td>
                      <td className="py-2 px-2.5 text-right text-outline">{formatCurrency(estimatedCost)}</td>
                      <td className="py-2 px-2.5 text-right font-bold text-green-700 font-mono">
                        +{formatCurrency(itemProfit)}
                      </td>
                      <td className="py-2 px-2.5 text-center font-semibold text-primary">
                        {p.stock} gói
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

