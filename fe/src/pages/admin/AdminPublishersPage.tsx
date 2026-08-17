import { useState, type FormEvent } from "react";
import { buildId, publisherSeeds, type Publisher } from "./admin.data";

const empty = { name: "", headquarters: "", establishedYear: "", publishedTitles: "" };
const card: React.CSSProperties = { background: "#fff", borderRadius: 14, border: "1px solid #ece9e2", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" };
const inp: React.CSSProperties = { width: "100%", boxSizing: "border-box", borderRadius: 8, border: "1.5px solid #e5e0d8", padding: "10px 14px", fontSize: 13.5, color: "#111827", background: "#fafaf9", outline: "none" };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b7280" }}>{label}</label>
      {children}
    </div>
  );
}

export default function AdminPublishersPage() {
  const [publishers, setPublishers] = useState<Publisher[]>(publisherSeeds);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const clearForm = () => { setForm(empty); setEditingId(null); setShowForm(false); };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name.trim() || !form.headquarters.trim()) return;
    const payload: Publisher = { id: editingId ?? buildId("PUB"), name: form.name.trim(), headquarters: form.headquarters.trim(), establishedYear: Number(form.establishedYear), publishedTitles: Number(form.publishedTitles) };
    if (editingId) setPublishers((p) => p.map((x) => (x.id === editingId ? payload : x)));
    else setPublishers((p) => [payload, ...p]);
    clearForm();
  };

  const onEdit = (pub: Publisher) => {
    setEditingId(pub.id);
    setForm({ name: pub.name, headquarters: pub.headquarters, establishedYear: String(pub.establishedYear), publishedTitles: String(pub.publishedTitles) });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", letterSpacing: "-0.5px" }}>Nhà xuất bản</h1>
          <p style={{ marginTop: 4, fontSize: 13, color: "#9ca3af" }}>Thêm, chỉnh sửa thông tin nhà xuất bản</p>
        </div>
        <button onClick={() => { setEditingId(null); setForm(empty); setShowForm((s) => !s); }} style={{ background: "#1a3d2b", border: "none", borderRadius: 9, padding: "10px 20px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>
          {showForm && !editingId ? "✕ Đóng" : "+ Thêm NXB"}
        </button>
      </div>

      {/* Stat row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {[
          { label: "Tổng số NXB", value: publishers.length },
          { label: "TP. Hồ Chí Minh", value: publishers.filter((p) => p.headquarters.includes("Hồ Chí Minh") || p.headquarters.includes("HCM")).length },
          { label: "Hà Nội", value: publishers.filter((p) => p.headquarters.includes("Hà Nội") || p.headquarters.includes("Hanoi")).length },
        ].map((s) => (
          <div key={s.label} style={{ ...card, padding: "18px 22px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9ca3af" }}>{s.label}</p>
            <p style={{ marginTop: 8, fontSize: 28, fontWeight: 800, color: "#111827" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <div style={{ ...card, padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "18px 24px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{editingId ? "Chỉnh sửa NXB" : "Nhà xuất bản mới"}</p>
              <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{editingId ? `ID: ${editingId}` : "Điền thông tin bên dưới"}</p>
            </div>
            {editingId && <span style={{ fontSize: 11, fontWeight: 700, background: "#fef3c7", color: "#92400e", padding: "3px 10px", borderRadius: 99 }}>Đang sửa</span>}
          </div>
          <form onSubmit={onSubmit} style={{ padding: 24 }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: 16, alignItems: "flex-end" }}>
              <Field label="Tên NXB *">
                <input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} placeholder="Ví dụ: Nhà Nam" style={inp}
                  onFocus={(e) => { e.target.style.borderColor = "#1a3d2b"; e.target.style.background = "#fff"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#e5e0d8"; e.target.style.background = "#fafaf9"; }} />
              </Field>
              <Field label="Trụ sở *">
                <input value={form.headquarters} onChange={(e) => setForm((s) => ({ ...s, headquarters: e.target.value }))} placeholder="Hà Nội..." style={inp}
                  onFocus={(e) => { e.target.style.borderColor = "#1a3d2b"; e.target.style.background = "#fff"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#e5e0d8"; e.target.style.background = "#fafaf9"; }} />
              </Field>
              <Field label="Năm thành lập">
                <input value={form.establishedYear} onChange={(e) => setForm((s) => ({ ...s, establishedYear: e.target.value }))} placeholder="2005" type="number" min={1900} style={inp}
                  onFocus={(e) => { e.target.style.borderColor = "#1a3d2b"; e.target.style.background = "#fff"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#e5e0d8"; e.target.style.background = "#fafaf9"; }} />
              </Field>
              <Field label="Số đầu sách">
                <input value={form.publishedTitles} onChange={(e) => setForm((s) => ({ ...s, publishedTitles: e.target.value }))} placeholder="1500" type="number" min={0} style={inp}
                  onFocus={(e) => { e.target.style.borderColor = "#1a3d2b"; e.target.style.background = "#fff"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#e5e0d8"; e.target.style.background = "#fafaf9"; }} />
              </Field>
              <div style={{ display: "flex", gap: 8, paddingBottom: 1 }}>
                <button type="submit" style={{ borderRadius: 8, background: "#1a3d2b", border: "none", padding: "10px 20px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", whiteSpace: "nowrap" }}>
                  {editingId ? "Cập nhật" : "Lưu mới"}
                </button>
                {editingId && <button type="button" onClick={clearForm} style={{ borderRadius: 8, background: "#f5f3ef", border: "1px solid #e5e0d8", padding: "10px 14px", fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer" }}>Huỷ</button>}
              </div>
            </div>
          </form>
        </div>
      )}

      <div style={{ ...card, padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #f3f4f6" }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Danh sách NXB <span style={{ fontSize: 13, fontWeight: 400, color: "#9ca3af" }}>({publishers.length})</span></p>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #f3f4f6", background: "#fafaf9" }}>
              {["Nhà xuất bản", "Trụ sở", "Năm thành lập", "Số đầu sách", "Thao tác"].map((h) => (
                <th key={h} style={{ padding: "11px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {publishers.map((pub, i) => {
              const hue = pub.name.charCodeAt(0) * 53 % 360;
              return (
                <tr key={pub.id} style={{ borderBottom: i < publishers.length - 1 ? "1px solid #f9fafb" : "none", background: editingId === pub.id ? "#fffbeb" : "transparent" }}
                  onMouseEnter={(e) => { if (editingId !== pub.id) e.currentTarget.style.background = "#fafaf9"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = editingId === pub.id ? "#fffbeb" : "transparent"; }}
                >
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: `hsl(${hue},40%,70%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                        {pub.name[0]}
                      </div>
                      <div>
                        <p style={{ fontSize: 13.5, fontWeight: 600, color: "#111827" }}>{pub.name}</p>
                        <p style={{ fontSize: 11, color: "#9ca3af", fontFamily: "monospace" }}>{pub.id}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: "#374151" }}>{pub.headquarters}</td>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: "#374151" }}>{pub.establishedYear}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600, background: "#f3f4f6", color: "#374151" }}>{pub.publishedTitles.toLocaleString("vi-VN")} đầu sách</span>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => onEdit(pub)} style={{ borderRadius: 6, background: "transparent", border: "1px solid #e5e0d8", padding: "5px 12px", fontSize: 12, fontWeight: 600, color: "#374151", cursor: "pointer" }}>Sửa</button>
                      <button onClick={() => setPublishers((p) => p.filter((x) => x.id !== pub.id))} style={{ borderRadius: 6, background: "#fee2e2", border: "none", padding: "5px 12px", fontSize: 12, fontWeight: 600, color: "#991b1b", cursor: "pointer" }}>Xoá</button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {publishers.length === 0 && <tr><td colSpan={5} style={{ padding: "48px 20px", textAlign: "center", fontSize: 13, color: "#9ca3af" }}>Chưa có nhà xuất bản nào.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
