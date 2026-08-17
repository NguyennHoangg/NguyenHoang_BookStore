import { lazy, Suspense } from "react"
import { Navigate, Route, Routes } from "react-router-dom";
import PageSkeleton from "./components/skeleton/page-skeleton";

// Lazy import: chỉ load khi user truy cập route đó
const HomePage = lazy(() => import("./pages/client/HomePage"));
const LoginPage = lazy(() => import("./pages/Login"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"))
const ErrorPage = lazy(() => import("./pages/ErrorPage"))
const ProductDetailPage = lazy(() => import("./pages/client/ProductDetailPage"))
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"))
const AdminHomepage = lazy(() => import("./pages/admin/AdminHompage"))
const AdminCustomersPage = lazy(() => import("./pages/admin/AdminCustomersPage"))
const AdminStatisticsPage = lazy(() => import("./pages/admin/AdminStatisticsPage"))
const AdminOrdersPage = lazy(() => import("./pages/admin/AdminOrdersPage"))
const AdminBooksPage = lazy(() => import("./pages/admin/AdminBooksPage"))
const AdminAuthorsPage = lazy(() => import("./pages/admin/AdminAuthorsPage"))
const AdminPublishersPage = lazy(() => import("./pages/admin/AdminPublishersPage"))
const BooksPage = lazy(() => import("./pages/client/ProductPage"));




function App() {
  return (
    // Suspense bắt buộc phải bọc bên ngoài lazy component
    <Suspense fallback={<PageSkeleton type="products" lines={10} />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/book/*" element={<ProductDetailPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminHomepage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
          <Route path="statistics" element={<AdminStatisticsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="books" element={<AdminBooksPage />} />
          <Route path="authors" element={<AdminAuthorsPage />} />
          <Route path="publishers" element={<AdminPublishersPage />} />
        </Route>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}

export default App
