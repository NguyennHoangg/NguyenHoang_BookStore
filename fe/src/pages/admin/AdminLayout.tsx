import { NavLink, Outlet } from "react-router-dom";
import {
  Squares2X2Icon,
  BookOpenIcon,
  ShoppingCartIcon,
  UsersIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  BellIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon
} from "@heroicons/react/24/outline";

const navMain = [
  { to: "/admin/dashboard", label: "Dashboard", icon: Squares2X2Icon },
  { to: "/admin/books",     label: "Quản lý Sách", icon: BookOpenIcon },
  { to: "/admin/orders",    label: "Đơn hàng", icon: ShoppingCartIcon },
  { to: "/admin/customers", label: "Khách hàng", icon: UsersIcon },
  { to: "/admin/authors",   label: "Tác giả", icon: UserGroupIcon },
  { to: "/admin/publishers",label: "Nhà xuất bản", icon: BuildingOfficeIcon },
  { to: "/admin/statistics",label: "Thống kê", icon: ChartBarIcon },
];

const SIDEBAR = 240;

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen" style={{ background: "#f5f3ef" }}>

      {/* ──────── Sidebar ──────── */}
      <aside
        className="fixed inset-y-0 left-0 z-30 flex flex-col"
        style={{ width: SIDEBAR, background: "#f5f3ef" }}
      >
        {/* Brand */}
        <div style={{ padding: "28px 24px 20px" }}>
          <p style={{ color: "#1a3d2b", fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", fontStyle: "italic", fontFamily: "serif" }}>
            NguyenHoang
          </p>
          <p style={{ color: "#6b7280", fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 4 }}>
            Curator Admin
          </p>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "16px 16px", overflowY: "auto" }}>
          {navMain.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 12,
                borderRadius: 8,
                padding: "12px 14px",
                marginBottom: 4,
                fontSize: 13.5,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "#1a3d2b" : "#6b7280",
                background: isActive ? "#fff" : "transparent",
                boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.05)" : "none",
                transition: "all 0.15s",
                textDecoration: "none",
              })}
            >
              {({ isActive }) => (
                <>
                  <item.icon style={{ width: 20, height: 20, color: isActive ? "#1a3d2b" : "#9ca3af" }} strokeWidth={isActive ? 2 : 1.5} />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: "16px 20px 32px" }}>
          <NavLink
            to="/admin/support"
            style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#6b7280", marginBottom: 16, textDecoration: "none" }}
            onClick={(e) => e.preventDefault()}
          >
            <QuestionMarkCircleIcon style={{ width: 20, height: 20 }} />
            Hỗ trợ
          </NavLink>
          <NavLink
            to="/"
            style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#6b7280", textDecoration: "none" }}
          >
            <ArrowRightOnRectangleIcon style={{ width: 20, height: 20 }} />
            Đăng xuất
          </NavLink>
        </div>
      </aside>

      {/* ──────── Main ──────── */}
      <div className="flex min-h-screen flex-1 flex-col" style={{ paddingLeft: SIDEBAR }}>

        {/* Top bar */}
        <header
          className="sticky top-0 z-20 flex items-center justify-between"
          style={{ height: 64, background: "#f5f3ef", padding: "0 32px" }}
        >
          <p style={{ fontSize: 18, fontWeight: 700, color: "#1a3d2b" }}>
            The Modern Curator
          </p>
          <div className="flex items-center gap-5">
            {/* Search */}
            <div className="flex items-center gap-2 rounded-lg px-4 py-2" style={{ background: "#ebe9e3", width: 280 }}>
              <MagnifyingGlassIcon style={{ width: 16, height: 16, color: "#9ca3af" }} />
              <input
                placeholder="Tìm kiếm trong kho..."
                style={{ border: "none", outline: "none", background: "transparent", fontSize: 13, color: "#374151", width: "100%" }}
              />
            </div>
            
            {/* Icons */}
            <div className="flex items-center gap-3">
              <button style={{ background: "none", border: "none", cursor: "pointer" }}>
                <BellIcon style={{ width: 22, height: 22, color: "#4b5563" }} />
              </button>
              <button style={{ background: "none", border: "none", cursor: "pointer" }}>
                <Cog6ToothIcon style={{ width: 22, height: 22, color: "#4b5563" }} />
              </button>
              {/* Avatar */}
              <div
                className="flex items-center justify-center rounded-full text-white text-xs font-bold overflow-hidden ml-2"
                style={{ width: 32, height: 32, background: "#1a3d2b" }}
              >
                <img src="https://ui-avatars.com/api/?name=Admin&background=1a3d2b&color=fff" alt="Avatar" style={{ width: "100%", height: "100%" }} />
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: "32px 32px 40px" }}>
          <Outlet />
        </main>

        {/* Footer */}
        <footer
          style={{ padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <p style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>© 2024 NGUYENHOANG BOOKSTORE. EDITORIAL EXCELLENCE.</p>
          <div className="flex gap-8">
            {["Privacy Policy", "Terms of Service", "API Documentation"].map((t) => (
              <span key={t} style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer" }}>{t}</span>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}
