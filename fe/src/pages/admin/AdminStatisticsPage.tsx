import { useState } from "react";
import { salesByMonth, topCategories, currencyVnd, orderSeeds } from "./admin.data";

const maxRev = Math.max(...salesByMonth.map((s) => s.revenue));
const totalRev = salesByMonth.reduce((a, b) => a + b.revenue, 0);
const catColors = ["#059669", "#0d9488", "#0891b2", "#2563eb", "#7c3aed"];

const card: React.CSSProperties = { background: "#fff", borderRadius: 14, border: "1px solid #ece9e2", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" };

export default function AdminStatisticsPage() {
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);

  // Status distribution
  const totalOrders = orderSeeds.length;
  const statusCounts = orderSeeds.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusList = [
    { label: "Hoàn tất", val: statusCounts.delivered || 0, color: "#059669" },
    { label: "Đang xử lý/Giao", val: (statusCounts.processing || 0) + (statusCounts.shipping || 0), color: "#2563eb" },
    { label: "Chờ xử lý", val: statusCounts.pending || 0, color: "#d97706" },
    { label: "Đã huỷ", val: statusCounts.cancelled || 0, color: "#dc2626" },
  ];

  const summaryCards = [
    { label: "Tổng doanh thu 6T", value: `${totalRev}M`, sub: "VND" },
    { label: "Trung bình / tháng", value: `${Math.round(totalRev / salesByMonth.length)}M`, sub: "VND" },
    { label: "Tháng cao nhất", value: `${maxRev}M`, sub: salesByMonth.find((s) => s.revenue === maxRev)?.month },
    { label: "Tổng đơn hàng", value: "1,284", sub: "Trong 6 tháng qua" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", letterSpacing: "-0.5px" }}>Thống kê Chi tiết</h1>
          <p style={{ marginTop: 4, fontSize: 13, color: "#9ca3af" }}>Báo cáo tổng hợp doanh thu, sản phẩm và tình trạng đơn hàng</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ borderRadius: 8, background: "#fff", border: "1px solid #e5e0d8", padding: "9px 16px", fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer" }}>In báo cáo</button>
          <button style={{ borderRadius: 8, background: "#1a3d2b", border: "none", padding: "9px 16px", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer" }}>Xuất Excel</button>
        </div>
      </div>

      {/* Summary row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {summaryCards.map((s) => (
          <div key={s.label} style={{ ...card, padding: "18px 22px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9ca3af" }}>{s.label}</p>
            <p style={{ marginTop: 8, fontSize: 28, fontWeight: 800, color: "#111827" }}>{s.value}</p>
            <p style={{ marginTop: 4, fontSize: 12, color: "#9ca3af" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Main charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
        
        {/* Revenue chart */}
        <div style={{ ...card, padding: 28, display: "flex", flexDirection: "column" }}>
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Doanh thu theo tháng</p>
            <p style={{ fontSize: 12, color: "#9ca3af" }}>Biểu đồ cột hiển thị doanh thu 6 tháng gần nhất (Đơn vị: triệu VND)</p>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 220, padding: "0 8px" }}>
            {salesByMonth.map((item) => {
              const pct = Math.round((item.revenue / maxRev) * 100);
              const isHov = hoveredBar === item.month;
              return (
                <div
                  key={item.month}
                  style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, position: "relative", cursor: "default" }}
                  onMouseEnter={() => setHoveredBar(item.month)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {isHov && (
                    <div style={{ position: "absolute", bottom: "calc(100% + 12px)", left: "50%", transform: "translateX(-50%)", background: "#111827", borderRadius: 10, padding: "10px 16px", textAlign: "center", zIndex: 10, whiteSpace: "nowrap", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
                      <p style={{ fontSize: 12, color: "#34d399", fontWeight: 700 }}>{item.month}</p>
                      <p style={{ fontSize: 18, color: "#fff", fontWeight: 800, marginTop: 2 }}>{item.revenue}M VND</p>
                      <div style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "6px solid #111827" }} />
                    </div>
                  )}
                  <div style={{ width: "100%", flex: 1, display: "flex", alignItems: "flex-end" }}>
                    <div style={{
                      width: "100%", borderRadius: "6px 6px 0 0", minHeight: 6,
                      height: `${pct}%`,
                      background: isHov ? "#34d399" : "#1a3d2b",
                      transition: "background 0.2s, transform 0.2s",
                      transform: isHov ? "scaleX(1.1)" : "scaleX(1)",
                    }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: isHov ? "#1a3d2b" : "#9ca3af" }}>{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Breakdown side panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Top categories */}
          <div style={{ ...card, padding: 24 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 20 }}>Top danh mục sách</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {topCategories.slice(0, 4).map((cat, idx) => {
                const color = catColors[idx % catColors.length];
                const isHov = hoveredCat === cat.name;
                return (
                  <div
                    key={cat.name}
                    style={{ cursor: "default" }}
                    onMouseEnter={() => setHoveredCat(cat.name)}
                    onMouseLeave={() => setHoveredCat(null)}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{cat.name}</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color }}>{cat.percent}%</span>
                    </div>
                    <div style={{ height: 6, background: "#f3f4f6", borderRadius: 99 }}>
                      <div style={{ height: 6, borderRadius: 99, background: color, width: `${isHov ? Math.min(cat.percent + 4, 100) : cat.percent}%`, transition: "width 0.3s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status distribution */}
          <div style={{ ...card, padding: 24, flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 20 }}>Tỉ lệ đơn hàng hiện tại</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {statusList.map((s) => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color }} />
                    <span style={{ fontSize: 13, color: "#4b5563" }}>{s.label}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>
                    {totalOrders > 0 ? Math.round((s.val / totalOrders) * 100) : 0}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed data table */}
      <div style={{ ...card, padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Bảng phân tích chi tiết theo tháng</p>
          <button style={{ background: "none", border: "none", color: "#1a3d2b", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Xem đầy đủ →</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#fafaf9", borderBottom: "1px solid #f3f4f6" }}>
              {["Kỳ báo cáo", "Doanh thu", "Tăng trưởng", "Đơn thành công", "Khách hàng mới"].map((h) => (
                <th key={h} style={{ padding: "12px 24px", textAlign: "left", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...salesByMonth].reverse().map((item, idx, arr) => {
              const prev = arr[idx + 1];
              const growth = prev ? ((item.revenue - prev.revenue) / prev.revenue) * 100 : 0;
              const isUp = growth > 0;
              const mockOrders = Math.floor(item.revenue * 3.5);
              const mockCustomers = Math.floor(item.revenue * 0.8);
              return (
                <tr key={item.month} style={{ borderBottom: idx < arr.length - 1 ? "1px solid #f9fafb" : "none" }}>
                  <td style={{ padding: "14px 24px", fontSize: 13.5, fontWeight: 700, color: "#374151" }}>Tháng {item.month.replace("T", "")}/2024</td>
                  <td style={{ padding: "14px 24px", fontSize: 14, fontWeight: 800, color: "#111827" }}>{item.revenue},000,000 ₫</td>
                  <td style={{ padding: "14px 24px" }}>
                    {prev ? (
                      <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 4, fontSize: 12, fontWeight: 700, background: isUp ? "#d1fae5" : "#fee2e2", color: isUp ? "#059669" : "#dc2626" }}>
                        {isUp ? "↑" : "↓"} {Math.abs(growth).toFixed(1)}%
                      </span>
                    ) : <span style={{ fontSize: 12, color: "#9ca3af" }}>-</span>}
                  </td>
                  <td style={{ padding: "14px 24px", fontSize: 13, color: "#4b5563" }}>{mockOrders.toLocaleString()} đơn</td>
                  <td style={{ padding: "14px 24px", fontSize: 13, color: "#4b5563" }}>+{mockCustomers}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
