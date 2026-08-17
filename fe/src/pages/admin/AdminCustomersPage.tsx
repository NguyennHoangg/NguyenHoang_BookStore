import { useMemo, useState } from "react";
import { currencyVnd, customerSeeds, type Customer } from "./admin.data";

const card: React.CSSProperties = { background: "#fff", borderRadius: 14, border: "1px solid #ece9e2", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" };

export default function AdminCustomersPage() {
  const [keyword, setKeyword] = useState("");
  const [customers] = useState<Customer[]>(customerSeeds);

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    if (!kw) return customers;
    return customers.filter((c) => [c.fullName, c.email, c.phone, c.city].join(" ").toLowerCase().includes(kw));
  }, [customers, keyword]);

  const stats = [
    { label: "Total Registered", value: customers.length, sub: "+12% from last month" },
    { label: "Loyal Members", value: customers.filter((c) => c.totalOrders >= 5).length, sub: "Tier: 'Khách hàng thân thiết'" },
    { label: "Avg. Lifetime Value", value: currencyVnd(Math.round(customers.reduce((a, c) => a + c.totalSpent, 0) / customers.length)), sub: "Across all segments" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", letterSpacing: "-0.5px" }}>Quản lý Khách hàng</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <input
            value={keyword} onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search customers..."
            style={{ borderRadius: 8, border: "1px solid #e5e0d8", padding: "9px 14px", fontSize: 13, color: "#374151", background: "#fff", outline: "none", width: 220 }}
          />
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ ...card, padding: "22px 24px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#9ca3af" }}>{s.label}</p>
            <p style={{ marginTop: 10, fontSize: 30, fontWeight: 800, color: "#111827" }}>{s.value}</p>
            <p style={{ marginTop: 6, fontSize: 12, color: "#9ca3af" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ ...card, padding: 0, overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid #f3f4f6" }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>
            Registered Customers
            <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 400, color: "#9ca3af" }}>({filtered.length})</span>
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ borderRadius: 7, border: "1px solid #e5e0d8", background: "#fff", padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "#374151", cursor: "pointer" }}>Filter</button>
            <button style={{ borderRadius: 7, border: "1px solid #e5e0d8", background: "#fff", padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "#374151", cursor: "pointer" }}>Export</button>
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #f3f4f6", background: "#fafaf9" }}>
              {["Customer", "Contact Info", "Total Orders", "Lifetime Value"].map((h) => (
                <th key={h} style={{ padding: "11px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => {
              const initials = c.fullName.split(" ").slice(-2).map((w: string) => w[0]).join("").toUpperCase();
              const hue = c.fullName.charCodeAt(0) * 37 % 360;
              return (
                <tr
                  key={c.id}
                  style={{ borderBottom: i < filtered.length - 1 ? "1px solid #f9fafb" : "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#fafaf9")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: "50%", background: `hsl(${hue},45%,65%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                        {initials}
                      </div>
                      <div>
                        <p style={{ fontSize: 13.5, fontWeight: 600, color: "#111827" }}>{c.fullName}</p>
                        <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          Member Since {new Date().getFullYear()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <p style={{ fontSize: 13, color: "#374151" }}>{c.email}</p>
                    <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{c.phone}</p>
                  </td>
                  <td style={{ padding: "16px 20px", fontSize: 13.5, fontWeight: 600, color: "#374151" }}>{c.totalOrders} Orders</td>
                  <td style={{ padding: "16px 20px", fontSize: 13.5, fontWeight: 700, color: "#1a3d2b" }}>{currencyVnd(c.totalSpent)}</td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={4} style={{ padding: "48px 20px", textAlign: "center", fontSize: 13, color: "#9ca3af" }}>Không tìm thấy khách hàng.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
