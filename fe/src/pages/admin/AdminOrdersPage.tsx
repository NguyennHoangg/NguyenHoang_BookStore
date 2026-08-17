import { useMemo, useState } from "react";
import { currencyVnd, orderSeeds, type OrderStatus } from "./admin.data";

const statusCfg: Record<OrderStatus, { bg: string; color: string; label: string }> = {
  pending:    { bg: "#fef3c7", color: "#92400e", label: "Chờ xử lý" },
  processing: { bg: "#dbeafe", color: "#1e40af", label: "Đang xử lý" },
  shipping:   { bg: "#ede9fe", color: "#5b21b6", label: "Đang giao" },
  delivered:  { bg: "#d1fae5", color: "#065f46", label: "Đã giao" },
  cancelled:  { bg: "#fee2e2", color: "#991b1b", label: "Đã huỷ" },
};

const payLabel: Record<string, string> = { cod: "COD", banking: "CK", card: "Thẻ" };
const TABS: Array<{ key: OrderStatus | "all"; label: string }> = [
  { key: "all", label: "Tất cả" },
  { key: "processing", label: "Đang xử lý" },
  { key: "delivered", label: "Hoàn tất" },
];

const card: React.CSSProperties = { background: "#fff", borderRadius: 14, border: "1px solid #ece9e2", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" };

export default function AdminOrdersPage() {
  const [tab, setTab] = useState<OrderStatus | "all">("all");

  const visible = useMemo(
    () => (tab === "all" ? orderSeeds : orderSeeds.filter((o) => o.status === tab)),
    [tab],
  );

  const stats = [
    { label: "Tổng đơn hàng", value: orderSeeds.length, sub: "Tất cả thời gian" },
    { label: "Đang xử lý", value: orderSeeds.filter((o) => o.status === "processing").length, sub: "Cần hoàn thiện sớm" },
    { label: "Doanh thu ngày", value: "12.5M", sub: "+8.2%" },
    { label: "Trả hàng", value: orderSeeds.filter((o) => o.status === "cancelled").length, sub: "Tỉ lệ 0.2%" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", letterSpacing: "-0.5px" }}>Quản lý Đơn hàng</h1>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ borderRadius: 8, background: "#fff", border: "1px solid #e5e0d8", padding: "9px 16px", fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer" }}>Lọc</button>
          <button style={{ borderRadius: 8, background: "#fff", border: "1px solid #e5e0d8", padding: "9px 16px", fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer" }}>Xuất File</button>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ ...card, padding: "18px 22px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9ca3af" }}>{s.label}</p>
            <p style={{ marginTop: 8, fontSize: 28, fontWeight: 800, color: "#111827" }}>{s.value}</p>
            <p style={{ marginTop: 4, fontSize: 12, color: "#9ca3af" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs + Table */}
      <div style={{ ...card, padding: 0, overflow: "hidden" }}>
        {/* Tab bar */}
        <div style={{ display: "flex", borderBottom: "1px solid #f3f4f6", padding: "0 24px", gap: 4 }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                border: "none", background: "transparent", padding: "14px 16px",
                fontSize: 13.5, fontWeight: tab === t.key ? 700 : 500,
                color: tab === t.key ? "#1a3d2b" : "#6b7280",
                borderBottom: tab === t.key ? "2px solid #1a3d2b" : "2px solid transparent",
                cursor: "pointer", transition: "all 0.15s", marginBottom: -1,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #f3f4f6", background: "#fafaf9" }}>
              {["Order ID", "Customer Name", "Date", "Total Amount", "Status", "Actions"].map((h) => (
                <th key={h} style={{ padding: "11px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((order, i) => {
              const sc = statusCfg[order.status];
              const initials = order.customerName.split(" ").slice(-2).map((w: string) => w[0]).join("").toUpperCase();
              const hue = order.customerName.charCodeAt(0) * 37 % 360;
              return (
                <tr
                  key={order.id}
                  style={{ borderBottom: i < visible.length - 1 ? "1px solid #f9fafb" : "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#fafaf9")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "14px 20px", fontFamily: "monospace", fontSize: 13, fontWeight: 600, color: "#374151" }}>#{order.id}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: `hsl(${hue},45%,65%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                        {initials}
                      </div>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: "#111827" }}>{order.customerName}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: "#6b7280" }}>{order.createdAt}</td>
                  <td style={{ padding: "14px 20px", fontSize: 13.5, fontWeight: 700, color: "#111827" }}>{currencyVnd(order.amount)}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 700, background: sc.bg, color: sc.color }}>{sc.label.toUpperCase()}</span>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <button style={{ border: "none", background: "transparent", cursor: "pointer", color: "#9ca3af", fontSize: 18, lineHeight: 1 }}>···</button>
                  </td>
                </tr>
              );
            })}
            {visible.length === 0 && (
              <tr><td colSpan={6} style={{ padding: "48px 20px", textAlign: "center", fontSize: 13, color: "#9ca3af" }}>Không có đơn hàng nào.</td></tr>
            )}
          </tbody>
        </table>

        <div style={{ padding: "12px 24px", borderTop: "1px solid #f3f4f6", fontSize: 12, color: "#9ca3af" }}>
          Hiển thị 1–{visible.length} của {visible.length} đơn hàng
        </div>
      </div>
    </div>
  );
}
