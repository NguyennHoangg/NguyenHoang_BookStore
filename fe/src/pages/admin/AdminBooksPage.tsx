import { useMemo, useState, type FormEvent } from "react";
import { bookSeeds, buildId, currencyVnd, type ManagedBook } from "./admin.data";

const empty: { title: string; author: string; publisher: string; category: string; price: string; stock: string; status: ManagedBook["status"] } =
  { title: "", author: "", publisher: "", category: "", price: "", stock: "", status: "active" };

const statusCfg: Record<ManagedBook["status"], { bg: string; color: string; label: string }> = {
  active:   { bg: "#d1fae5", color: "#065f46", label: "Còn hàng" },
  inactive: { bg: "#fee2e2", color: "#991b1b", label: "Tạm ẩn" },
};

const card: React.CSSProperties = {
  background: "#fff", borderRadius: 14, border: "1px solid #ece9e2",
  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
};

const inp: React.CSSProperties = {
  width: "100%", boxSizing: "border-box", borderRadius: 8,
  border: "1.5px solid #e5e0d8", padding: "10px 14px",
  fontSize: 13.5, color: "#111827", background: "#fafaf9",
  outline: "none", transition: "border-color 0.15s, background 0.15s",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b7280" }}>{label}</label>
      {children}
    </div>
  );
}

export default function AdminBooksPage() {
  const [books, setBooks] = useState<ManagedBook[]>(bookSeeds);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [keyword, setKeyword] = useState("");
  const [showForm, setShowForm] = useState(false);

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    if (!kw) return books;
    return books.filter((b) =>
      [b.title, b.author, b.publisher, b.category].join(" ").toLowerCase().includes(kw),
    );
  }, [books, keyword]);

  const resetForm = () => { setForm(empty); setEditingId(null); setShowForm(false); };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload: ManagedBook = {
      id: editingId ?? buildId("BK"),
      title: form.title.trim(), author: form.author.trim(),
      publisher: form.publisher.trim(), category: form.category.trim(),
      price: Number(form.price), stock: Number(form.stock), status: form.status,
    };
    if (!payload.title || !payload.author || !payload.publisher || !payload.category) return;
    if (editingId) setBooks((p) => p.map((b) => (b.id === editingId ? payload : b)));
    else setBooks((p) => [payload, ...p]);
    resetForm();
  };

  const handleEdit = (book: ManagedBook) => {
    setEditingId(book.id);
    setForm({ title: book.title, author: book.author, publisher: book.publisher, category: book.category, price: String(book.price), stock: String(book.stock), status: book.status });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const stats = [
    { label: "Tổng số đầu sách", value: books.length },
    { label: "Cần nhập thêm", value: books.filter((b) => b.stock < 30).length },
    { label: "Doanh thu tháng", value: "84.5M" },
    { label: "Đang khuyến mãi", value: books.filter((b) => b.status === "active").length },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", letterSpacing: "-0.5px" }}>Quản lý Sách</h1>
          <p style={{ marginTop: 4, fontSize: 12.5, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
            Kho lưu trữ hiện tại & Tồn kho
          </p>
        </div>
        <button
          onClick={() => { setEditingId(null); setForm(empty); setShowForm((s) => !s); }}
          style={{ background: "#1a3d2b", border: "none", borderRadius: 9, padding: "10px 20px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}
        >
          {showForm && !editingId ? "✕ Đóng" : "+ Thêm sách mới"}
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {stats.map((s, i) => (
          <div key={s.label} style={{ ...card, padding: "18px 22px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9ca3af" }}>{s.label}</p>
            <p style={{ marginTop: 8, fontSize: 28, fontWeight: 800, color: i === 1 ? "#dc2626" : "#111827" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Form panel (collapsible) ── */}
      {showForm && (
        <div style={{ ...card, padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "18px 24px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{editingId ? "Chỉnh sửa sách" : "Thêm sách mới"}</p>
              <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{editingId ? `ID: ${editingId}` : "Điền đầy đủ thông tin"}</p>
            </div>
            {editingId && <span style={{ fontSize: 11, fontWeight: 700, background: "#fef3c7", color: "#92400e", padding: "3px 10px", borderRadius: 99 }}>Đang sửa</span>}
          </div>

          <form onSubmit={handleSubmit} style={{ padding: 24 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 16 }}>
              <Field label="Tên sách *">
                <input value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} placeholder="Nhập tên sách..." style={inp}
                  onFocus={(e) => { e.target.style.borderColor = "#1a3d2b"; e.target.style.background = "#fff"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#e5e0d8"; e.target.style.background = "#fafaf9"; }} />
              </Field>
              <Field label="Tác giả *">
                <input value={form.author} onChange={(e) => setForm((s) => ({ ...s, author: e.target.value }))} placeholder="Tên tác giả..." style={inp}
                  onFocus={(e) => { e.target.style.borderColor = "#1a3d2b"; e.target.style.background = "#fff"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#e5e0d8"; e.target.style.background = "#fafaf9"; }} />
              </Field>
              <Field label="Nhà xuất bản *">
                <input value={form.publisher} onChange={(e) => setForm((s) => ({ ...s, publisher: e.target.value }))} placeholder="Tên NXB..." style={inp}
                  onFocus={(e) => { e.target.style.borderColor = "#1a3d2b"; e.target.style.background = "#fff"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#e5e0d8"; e.target.style.background = "#fafaf9"; }} />
              </Field>
              <Field label="Danh mục *">
                <input value={form.category} onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))} placeholder="Văn học, Kỹ năng..." style={inp}
                  onFocus={(e) => { e.target.style.borderColor = "#1a3d2b"; e.target.style.background = "#fff"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#e5e0d8"; e.target.style.background = "#fafaf9"; }} />
              </Field>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 16, alignItems: "flex-end" }}>
              <Field label="Giá bán (VND)">
                <input value={form.price} onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))} placeholder="150000" type="number" min={0} style={inp}
                  onFocus={(e) => { e.target.style.borderColor = "#1a3d2b"; e.target.style.background = "#fff"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#e5e0d8"; e.target.style.background = "#fafaf9"; }} />
              </Field>
              <Field label="Tồn kho">
                <input value={form.stock} onChange={(e) => setForm((s) => ({ ...s, stock: e.target.value }))} placeholder="50" type="number" min={0} style={inp}
                  onFocus={(e) => { e.target.style.borderColor = "#1a3d2b"; e.target.style.background = "#fff"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#e5e0d8"; e.target.style.background = "#fafaf9"; }} />
              </Field>
              <Field label="Trạng thái">
                <select value={form.status} onChange={(e) => setForm((s) => ({ ...s, status: e.target.value as ManagedBook["status"] }))} style={inp}>
                  <option value="active">Đang bán</option>
                  <option value="inactive">Tạm ẩn</option>
                </select>
              </Field>
              <div style={{ display: "flex", gap: 8 }}>
                <button type="submit" style={{ borderRadius: 8, background: "#1a3d2b", border: "none", padding: "10px 20px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", whiteSpace: "nowrap" }}>
                  {editingId ? "Cập nhật" : "Lưu mới"}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForm} style={{ borderRadius: 8, background: "#f5f3ef", border: "1px solid #e5e0d8", padding: "10px 16px", fontSize: 13, fontWeight: 600, color: "#374151", cursor: "pointer" }}>Huỷ</button>
                )}
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ── Filter + Search ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 10 }}>
          <select style={{ borderRadius: 8, border: "1px solid #e5e0d8", padding: "8px 14px", fontSize: 13, color: "#374151", background: "#fff", outline: "none", cursor: "pointer" }}>
            <option>Tất cả Thể loại</option>
          </select>
          <select style={{ borderRadius: 8, border: "1px solid #e5e0d8", padding: "8px 14px", fontSize: 13, color: "#374151", background: "#fff", outline: "none", cursor: "pointer" }}>
            <option>Trạng thái</option>
            <option value="active">Đang bán</option>
            <option value="inactive">Tạm ẩn</option>
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, color: "#9ca3af" }}>Hiện {filtered.length} / {books.length} kết quả</span>
          <input
            value={keyword} onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm kiếm..."
            style={{ borderRadius: 8, border: "1px solid #e5e0d8", padding: "8px 14px", fontSize: 13, color: "#374151", background: "#fff", outline: "none", width: 220 }}
          />
        </div>
      </div>

      {/* ── Table ── */}
      <div style={{ ...card, padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #f3f4f6", background: "#fafaf9" }}>
              {["Tiêu đề & Tác giả", "Thể loại", "Tồn kho", "Giá bán", "Trạng thái", "Thao tác"].map((h) => (
                <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((book, i) => {
              const sc = statusCfg[book.status];
              return (
                <tr
                  key={book.id}
                  style={{ borderBottom: i < filtered.length - 1 ? "1px solid #f9fafb" : "none", background: editingId === book.id ? "#fffbeb" : "transparent", transition: "background 0.1s" }}
                  onMouseEnter={(e) => { if (editingId !== book.id) e.currentTarget.style.background = "#fafaf9"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = editingId === book.id ? "#fffbeb" : "transparent"; }}
                >
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 36, height: 48, borderRadius: 4, background: `hsl(${book.title.charCodeAt(0) * 5 % 360},40%,75%)`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>
                        {book.title[0]}
                      </div>
                      <div>
                        <p style={{ fontSize: 13.5, fontWeight: 600, color: "#111827" }}>{book.title}</p>
                        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{book.author}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#6b7280" }}>{book.category}</span>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: 13.5, fontWeight: 600, color: book.stock < 30 ? "#dc2626" : "#111827" }}>{book.stock}</td>
                  <td style={{ padding: "14px 20px", fontSize: 13.5, fontWeight: 600, color: "#111827" }}>{currencyVnd(book.price)}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600, background: sc.bg, color: sc.color }}>{sc.label}</span>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => handleEdit(book)} style={{ borderRadius: 6, background: "transparent", border: "1px solid #e5e0d8", padding: "5px 12px", fontSize: 12, fontWeight: 600, color: "#374151", cursor: "pointer" }}>Sửa</button>
                      <button onClick={() => { setBooks((p) => p.filter((b) => b.id !== book.id)); if (editingId === book.id) resetForm(); }} style={{ borderRadius: 6, background: "#fee2e2", border: "none", padding: "5px 12px", fontSize: 12, fontWeight: 600, color: "#991b1b", cursor: "pointer" }}>Xoá</button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ padding: "48px 20px", textAlign: "center", fontSize: 13, color: "#9ca3af" }}>Không tìm thấy sách.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
