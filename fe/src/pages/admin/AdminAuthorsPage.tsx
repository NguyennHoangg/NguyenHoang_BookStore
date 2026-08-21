import { useState, type FormEvent } from "react";
import { authorSeeds, buildId, type Author } from "./admin.data";

const empty = { name: "", country: "", birthYear: "", bookCount: "" };
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

export default function AdminAuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>(authorSeeds);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const clearForm = () => { setForm(empty); setEditingId(null); setShowForm(false); };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name.trim() || !form.country.trim()) return;
    const payload: Author = { id: editingId ?? buildId("AUTH"), name: form.name.trim(), country: form.country.trim(), birthYear: Number(form.birthYear), bookCount: Number(form.bookCount) };
    if (editingId) setAuthors((p) => p.map((a) => (a.id === editingId ? payload : a)));
    else setAuthors((p) => [payload, ...p]);
    clearForm();
  };

  const onEdit = (a: Author) => {
    setEditingId(a.id);
    setForm({ name: a.name, country: a.country, birthYear: String(a.birthYear), bookCount: String(a.bookCount) });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", letterSpacing: "-0.5px" }}>Quản lý Tác giả</h1>
          <p style={{ marginTop: 4, fontSize: 13, color: "#9ca3af" }}>Thêm, chỉnh sửa thông tin tác giả</p>
        </div>
        <button onClick={() => { setEditingId(null); setForm(empty); setShowForm((s) => !s); }} style={{ background: "#1a3d2b", border: "none", borderRadius: 9, padding: "10px 20px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>
          {showForm && !editingId ? "✕ Đóng" : "+ Thêm tác giả"}
        </button>
      </div>

      {showForm && (
        <div style={{ ...card, padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "18px 24px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{editingId ? "Chỉnh sửa tác giả" : "Tác giả mới"}</p>
              <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{editingId ? `ID: ${editingId}` : "Điền thông tin bên dưới"}</p>
            </div>
            {editingId && <span style={{ fontSize: 11, fontWeight: 700, background: "#fef3c7", color: "#92400e", padding: "3px 10px", borderRadius: 99 }}>Đang sửa</span>}
          </div>
          <form onSubmit={onSubmit} style={{ padding: 24 }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: 16, alignItems: "flex-end" }}>
              <Field label="Tên tác giả *">
                <input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} placeholder="Tên đầy đủ..." style={inp}
                  onFocus={(e) => { e.target.style.borderColor = "#1a3d2b"; e.target.style.background = "#fff"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#e5e0d8"; e.target.style.background = "#fafaf9"; }} />
              </Field>
              <Field label="Quốc gia *">
                <input value={form.country} onChange={(e) => setForm((s) => ({ ...s, country: e.target.value }))} placeholder="Việt Nam..." style={inp}
                  onFocus={(e) => { e.target.style.borderColor = "#1a3d2b"; e.target.style.background = "#fff"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#e5e0d8"; e.target.style.background = "#fafaf9"; }} />
              </Field>
              <Field label="Năm sinh">
                <input value={form.birthYear} onChange={(e) => setForm((s) => ({ ...s, birthYear: e.target.value }))} placeholder="1985" type="number" min={1900} style={inp}
                  onFocus={(e) => { e.target.style.borderColor = "#1a3d2b"; e.target.style.background = "#fff"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#e5e0d8"; e.target.style.background = "#fafaf9"; }} />
              </Field>
              <Field label="Số đầu sách">
                <input value={form.bookCount} onChange={(e) => setForm((s) => ({ ...s, bookCount: e.target.value }))} placeholder="12" type="number" min={0} style={inp}
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
          <p style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Danh sách tác giả <span style={{ fontSize: 13, fontWeight: 400, color: "#9ca3af" }}>({authors.length})</span></p>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #f3f4f6", background: "#fafaf9" }}>
              {["Tác giả", "Quốc gia", "Năm sinh", "Số sách", "Thao tác"].map((h) => (
                <th key={h} style={{ padding: "11px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {authors.map((author, i) => {
              const hue = author.name.charCodeAt(0) * 37 % 360;
              const initials = author.name.split(" ").slice(-2).map((w: string) => w[0]).join("").toUpperCase();
              return (
                <tr key={author.id} style={{ borderBottom: i < authors.length - 1 ? "1px solid #f9fafb" : "none", background: editingId === author.id ? "#fffbeb" : "transparent" }}
                  onMouseEnter={(e) => { if (editingId !== author.id) e.currentTarget.style.background = "#fafaf9"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = editingId === author.id ? "#fffbeb" : "transparent"; }}
                >
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: `hsl(${hue},45%,65%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                        {initials}
                      </div>
                      <div>
                        <p style={{ fontSize: 13.5, fontWeight: 600, color: "#111827" }}>{author.name}</p>
                        <p style={{ fontSize: 11, color: "#9ca3af", fontFamily: "monospace" }}>{author.id}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: "#374151" }}>{author.country}</td>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: "#374151" }}>{author.birthYear}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600, background: "#f3f4f6", color: "#374151" }}>{author.bookCount} sách</span>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => onEdit(author)} style={{ borderRadius: 6, background: "transparent", border: "1px solid #e5e0d8", padding: "5px 12px", fontSize: 12, fontWeight: 600, color: "#374151", cursor: "pointer" }}>Sửa</button>
                      <button onClick={() => setAuthors((p) => p.filter((a) => a.id !== author.id))} style={{ borderRadius: 6, background: "#fee2e2", border: "none", padding: "5px 12px", fontSize: 12, fontWeight: 600, color: "#991b1b", cursor: "pointer" }}>Xoá</button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {authors.length === 0 && <tr><td colSpan={5} style={{ padding: "48px 20px", textAlign: "center", fontSize: 13, color: "#9ca3af" }}>Chưa có tác giả nào.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
