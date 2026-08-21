import { useState } from "react";
import { dashboardMetrics, orderSeeds, salesByMonth, topCategories, currencyVnd } from "./admin.data";

const statusLabel: Record<string, string> = {
  pending: "Chờ xử lý", processing: "Đang xử lý",
  shipping: "Đang giao", delivered: "Đã giao", cancelled: "Đã huỷ",
};
const statusStyle: Record<string, { bg: string; color: string }> = {
  pending:    { bg: "#fef3c7", color: "#92400e" },
  processing: { bg: "#dbeafe", color: "#1e40af" },
  shipping:   { bg: "#ede9fe", color: "#5b21b6" },
  delivered:  { bg: "#d1fae5", color: "#065f46" },
  cancelled:  { bg: "#fee2e2", color: "#991b1b" },
};

const catColors = ["#059669", "#0d9488", "#0891b2", "#2563eb", "#7c3aed"];

export default function AdminHomepage() {
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);
  const maxRev = Math.max(...salesByMonth.map((s) => s.revenue));
  const latestOrders = orderSeeds.slice(0, 5);

  // Get current hour for greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "buổi sáng" : hour < 18 ? "buổi chiều" : "buổi tối";

  const card: React.CSSProperties = {
    background: "#fff", borderRadius: 14, padding: "20px 24px",
    border: "1px solid #ece9e2", boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

      {/* ── Greeting row ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", letterSpacing: "-0.5px" }}>
            Chào {greeting}, Quản trị viên.
          </h1>
          <p style={{ marginTop: 4, fontSize: 13, color: "#9ca3af" }}>
            Tổng quan hoạt động kinh doanh hôm nay.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", border: "1px solid #d1cdc5", borderRadius: 8, padding: "9px 16px", fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer" }}>
            Xuất báo cáo
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 6, background: "#1a3d2b", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>
            + Thêm sách mới
          </button>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {dashboardMetrics.map((m) => (
          <div key={m.label} style={card}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9ca3af" }}>{m.label}</p>
            <p style={{ marginTop: 10, fontSize: 26, fontWeight: 800, color: "#111827", letterSpacing: "-0.5px" }}>{m.value}</p>
            <p style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: m.trendUp ? "#059669" : "#dc2626" }}>
              {m.trend} so với tháng trước
            </p>
          </div>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>

        {/* Revenue bar chart */}
        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Phân tích doanh thu</p>
              <p style={{ marginTop: 2, fontSize: 12, color: "#9ca3af" }}>Đơn vị: triệu VND · Hover để xem chi tiết</p>
            </div>
          </div>

          {/* Bars */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 180, padding: "0 4px" }}>
            {salesByMonth.map((item) => {
              const pct = Math.round((item.revenue / maxRev) * 100);
              const isHov = hoveredBar === item.month;
              return (
                <div
                  key={item.month}
                  style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, position: "relative", cursor: "default" }}
                  onMouseEnter={() => setHoveredBar(item.month)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {/* Tooltip */}
                  {isHov && (
                    <div style={{
                      position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)",
                      background: "#111827", borderRadius: 8, padding: "8px 12px", zIndex: 10, whiteSpace: "nowrap",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.2)"
                    }}>
                      <p style={{ fontSize: 11, color: "#34d399", fontWeight: 600 }}>{item.month}</p>
                      <p style={{ fontSize: 15, color: "#fff", fontWeight: 800 }}>{item.revenue}M</p>
                      <div style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "5px solid #111827" }} />
                    </div>
                  )}
                  {/* Bar */}
                  <div style={{ width: "100%", flex: 1, display: "flex", alignItems: "flex-end" }}>
                    <div style={{
                      width: "100%", borderRadius: "6px 6px 0 0",
                      height: `${pct}%`, minHeight: 6,
                      background: isHov ? "#34d399" : "#1a3d2b",
                      transition: "all 0.2s ease",
                      transform: isHov ? "scaleX(1.05)" : "scaleX(1)",
                    }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 500, color: isHov ? "#1a3d2b" : "#9ca3af" }}>{item.month}</span>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div style={{ display: "flex", gap: 24, marginTop: 20, paddingTop: 16, borderTop: "1px solid #f3f4f6" }}>
            <div>
              <p style={{ fontSize: 11, color: "#9ca3af" }}>Tổng 6 tháng</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{salesByMonth.reduce((a, b) => a + b.revenue, 0)}M VND</p>
            </div>
            <div>
              <p style={{ fontSize: 11, color: "#9ca3af" }}>Trung bình / tháng</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{Math.round(salesByMonth.reduce((a, b) => a + b.revenue, 0) / salesByMonth.length)}M VND</p>
            </div>
          </div>
        </div>

        {/* Top categories */}
        <div style={card}>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 6 }}>Sách bán chạy</p>
          <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 20 }}>Top danh mục theo doanh số</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {topCategories.map((cat, idx) => {
              const isHov = hoveredCat === cat.name;
              return (
                <div
                  key={cat.name}
                  style={{ cursor: "default", padding: "8px 10px", borderRadius: 8, background: isHov ? "#f9fafb" : "transparent", transition: "background 0.15s" }}
                  onMouseEnter={() => setHoveredCat(cat.name)}
                  onMouseLeave={() => setHoveredCat(null)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: catColors[idx], transform: isHov ? "scale(1.4)" : "scale(1)", transition: "transform 0.2s" }} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{cat.name}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: catColors[idx] }}>{cat.percent}%</span>
                  </div>
                  <div style={{ height: 6, background: "#f3f4f6", borderRadius: 99 }}>
                    <div style={{
                      height: 6, borderRadius: 99, background: catColors[idx],
                      width: `${isHov ? Math.min(cat.percent + 3, 100) : cat.percent}%`,
                      transition: "width 0.4s ease",
                    }} />
                  </div>
                  {isHov && (
                    <p style={{ marginTop: 5, fontSize: 11, color: "#9ca3af" }}>
                      ~{Math.round((salesByMonth.reduce((a,b)=>a+b.revenue,0) * cat.percent) / 100)}M VND doanh số
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Recent Orders ── */}
      <div style={{ ...card, padding: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: "1px solid #f3f4f6" }}>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Đơn hàng gần đây</p>
            <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{latestOrders.length} đơn mới nhất</p>
          </div>
          <button style={{ fontSize: 12, fontWeight: 600, color: "#1a3d2b", background: "none", border: "none", cursor: "pointer" }}>
            Xem tất cả →
          </button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #f3f4f6", background: "#fafafa" }}>
              {["Mã đơn", "Khách hàng", "Ngày đặt", "Tổng tiền", "Trạng thái"].map((h) => (
                <th key={h} style={{ padding: "10px 24px", textAlign: "left", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {latestOrders.map((order, i) => {
              const s = statusStyle[order.status] ?? { bg: "#f3f4f6", color: "#6b7280" };
              return (
                <tr key={order.id} style={{ borderBottom: i < latestOrders.length - 1 ? "1px solid #f9fafb" : "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "14px 24px", fontFamily: "monospace", fontSize: 13, fontWeight: 600, color: "#374151" }}>#{order.id}</td>
                  <td style={{ padding: "14px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#1a3d2b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                        {order.customerName.split(" ").slice(-2).map((w: string) => w[0]).join("").toUpperCase()}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{order.customerName}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 24px", fontSize: 13, color: "#6b7280" }}>{order.createdAt}</td>
                  <td style={{ padding: "14px 24px", fontSize: 13, fontWeight: 700, color: "#111827" }}>{currencyVnd(order.amount)}</td>
                  <td style={{ padding: "14px 24px" }}>
                    <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600, background: s.bg, color: s.color }}>
                      {statusLabel[order.status]}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
