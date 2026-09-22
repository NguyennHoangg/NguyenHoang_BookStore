import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ShoppingCartIcon, ShoppingBagIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";

import bookApi, { type Book } from "../../api/book.api";
import formatPrice from "../../utils/format";
import Layout from "../../components/layout/Layout";
import Breadcrumbs from "../../components/common/Breadscrumbs";
import { BookCard } from "../../components";
import { NotificationModal } from "../../components/modals/notificationModal";

type NotifState = { message: string; type: "success" | "error" } | null;

export default function ProductDetailPage() {
  const params = useParams();
  const navigate = useNavigate();

  const bookPath = params["*"] || "";
  const normalizedUrl = bookPath.startsWith("/") ? bookPath : `/${bookPath}`;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [notif, setNotif] = useState<NotifState>(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let isMounted = true;

    const loadBook = async () => {
      if (!bookPath) {
        setLoading(false);
        setError("Không tìm thấy đường dẫn sách.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await bookApi.getBookByURL(normalizedUrl) as {
          success?: boolean;
          data?: Book | null;
        };

        if (!isMounted) return;

        const fetchedBook = response?.data || null;
        setBook(fetchedBook);

        if (!fetchedBook) {
          setError("Không tìm thấy sách tương ứng.");
          return;
        }

        // Fetch related books cùng category
        if (fetchedBook.categoryname) {
          setRelatedLoading(true);
          try {
            const relatedRes = await bookApi.getBooks({
              limit: 4,
              category: (fetchedBook as any).categoryslug ?? undefined,
            });
            if (isMounted) {
              setRelatedBooks(relatedRes.data.filter(b => b.bookid !== fetchedBook.bookid).slice(0, 4));
            }
          } catch {
            // Related books không quan trọng, không throw
          } finally {
            if (isMounted) setRelatedLoading(false);
          }
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Không thể tải dữ liệu sách.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadBook();
    window.scrollTo({ top: 0, behavior: "smooth" });

    return () => { isMounted = false; };
  }, [bookPath, normalizedUrl]);

  const handleAddToCart = () => {
    setNotif({ message: `Đã thêm "${book?.title}" vào giỏ hàng!`, type: "success" });
  };

  const handleBuyNow = () => {
    setNotif({ message: "Tính năng mua hàng sẽ sớm ra mắt!", type: "success" });
  };

  // ── Loading State ──
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-[#FDFBF7] px-4 md:px-8 lg:px-12 py-10">
          <div className="mx-auto max-w-6xl">
            <div className="h-4 w-48 animate-pulse bg-gray-200 mb-8 rounded" />
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="aspect-[2/3] animate-pulse bg-gray-200 rounded-sm" />
              <div className="space-y-5 pt-6">
                <div className="h-3 w-28 animate-pulse bg-gray-200 rounded" />
                <div className="h-16 w-4/5 animate-pulse bg-gray-200 rounded" />
                <div className="h-5 w-1/2 animate-pulse bg-gray-200 rounded" />
                <div className="h-10 w-1/3 animate-pulse bg-gray-200 rounded" />
                <div className="h-28 w-full animate-pulse bg-gray-200 rounded" />
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-20 animate-pulse bg-gray-200 rounded" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // ── Error State ──
  if (error || !book) {
    return (
      <Layout>
        <div className="min-h-screen bg-[#FDFBF7] px-6 py-16">
          <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center text-center">
            <p className="text-6xl mb-6">📕</p>
            <h1 className="font-serif text-3xl md:text-4xl text-[#153328] mb-4">
              {error || "Không thể tải sách này"}
            </h1>
            <p className="mt-2 max-w-xl text-gray-500 leading-relaxed">
              Đường dẫn sách có thể không hợp lệ, hoặc sách đã bị gỡ khỏi hệ thống.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 bg-[#153328] text-white text-sm font-medium rounded-full hover:opacity-90 transition-opacity"
              >
                Về trang chủ
              </button>
              <button
                onClick={() => navigate("/books")}
                className="px-6 py-3 border border-[#153328] text-[#153328] text-sm font-medium rounded-full hover:bg-[#153328]/5 transition-colors"
              >
                Xem tất cả sách
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const price = parseFloat(String(book.price));
  const compareAtPrice = parseFloat(String(book.compareatprice));
  const hasDiscount = !isNaN(compareAtPrice) && compareAtPrice > price;
  const discountPct = hasDiscount
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;
  const rating = typeof book.rating === "number" ? book.rating : parseFloat(String(book.rating ?? 0)) || 0;

  return (
    <Layout>
      <div className="min-h-screen bg-[#FDFBF7]">
        <main className="mx-auto max-w-6xl px-4 md:px-8 lg:px-12 py-8 md:py-12">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={["Home", "Sách", book.categoryname || "Danh mục", book.title]}
            onSelect={(item) => {
              if (item === "Home") navigate("/");
              if (item === "Sách") navigate("/books");
              if (item === book.categoryname) navigate("/books");
            }}
          />

          {/* ── Main Product Section ── */}
          <div className="mt-6 grid gap-8 lg:gap-16 lg:grid-cols-[0.9fr_1.1fr]">
            {/* Left: Image */}
            <div className="relative">
              <div className="sticky top-24">
                <div className="bg-white shadow-[0_30px_80px_rgba(0,0,0,0.08)] p-4 lg:p-6">
                  <div className="aspect-[2/3] overflow-hidden bg-gray-100">
                    <img
                      src={book.imageurl || "/default-book.jpg"}
                      alt={book.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                {hasDiscount && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    -{discountPct}%
                  </div>
                )}
              </div>
            </div>

            {/* Right: Info */}
            <div className="flex flex-col py-2 lg:py-8">
              {/* Category label */}
              <p className="text-xs tracking-[0.25em] uppercase text-gray-400 mb-3">
                {book.categoryname || "Sách"}
              </p>

              {/* Title */}
              <h1 className="font-serif text-3xl md:text-4xl lg:text-[2.8rem] leading-tight text-[#111] mb-3">
                {book.title}
              </h1>

              {/* Author */}
              <p className="text-base text-gray-500 mb-4">
                Tác giả: <span className="font-medium text-gray-700">{book.author}</span>
              </p>

              {/* Rating stars */}
              {rating > 0 && (
                <div className="flex items-center gap-1.5 mb-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarSolid
                      key={i}
                      className={`h-4 w-4 ${i < Math.round(rating) ? "text-yellow-400" : "text-gray-200"}`}
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-1">{rating.toFixed(1)}</span>
                </div>
              )}

              {/* Price */}
              <div className="flex flex-wrap items-end gap-3 mb-6 pb-6 border-b border-gray-200">
                <span className="font-serif text-3xl md:text-4xl text-[#153328]">
                  {formatPrice(price)}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(compareAtPrice)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm md:text-base leading-relaxed text-gray-600 mb-8">
                {book.description || "Chưa có mô tả cho cuốn sách này."}
              </p>

              {/* Quantity selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm text-gray-500">Số lượng:</span>
                <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="px-4 py-1.5 text-lg text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    −
                  </button>
                  <span className="px-4 py-1.5 text-sm font-medium min-w-[2.5rem] text-center">{qty}</span>
                  <button
                    onClick={() => setQty(q => Math.min(book.stock ?? 99, q + 1))}
                    className="px-4 py-1.5 text-lg text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
                {typeof book.stock === "number" && (
                  <span className="text-xs text-gray-400">({book.stock} còn lại)</span>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <button
                  onClick={handleBuyNow}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#153328] text-white py-3.5 px-6 text-sm font-semibold uppercase tracking-widest hover:bg-[#0f2319] transition-colors"
                >
                  <ShoppingBagIcon className="h-5 w-5" />
                  Mua ngay
                </button>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 border border-[#153328] text-[#153328] py-3.5 px-6 text-sm font-semibold uppercase tracking-widest hover:bg-[#153328]/5 transition-colors"
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  Thêm giỏ hàng
                </button>
              </div>

              {/* Book Details grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Nhà xuất bản", value: book.publishername || "Đang cập nhật" },
                  { label: "Số trang", value: book.pages ? `${book.pages} trang` : "Đang cập nhật" },
                  { label: "Năm phát hành", value: book.releaseyear || "Đang cập nhật" },
                  { label: "Kho hàng", value: typeof book.stock === "number" ? `${book.stock} cuốn` : "Đang cập nhật" },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white p-4 border border-gray-100">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1">{label}</p>
                    <p className="font-serif text-lg text-[#111]">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Related Books Section ── */}
          {(relatedLoading || relatedBooks.length > 0) && (
            <section className="mt-20 pt-10 border-t border-gray-200">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-2">
                    Cùng thể loại
                  </p>
                  <h2 className="text-2xl md:text-3xl font-serif italic text-[#153328]">
                    Có thể bạn cũng thích
                  </h2>
                </div>
                <button
                  onClick={() => navigate("/books")}
                  className="flex items-center gap-1 text-xs tracking-widest uppercase border-b border-black pb-1 font-semibold hover:opacity-60 transition-opacity"
                >
                  Xem tất cả
                  <ChevronRightIcon className="h-3 w-3" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {relatedLoading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="aspect-[2/3] animate-pulse bg-gray-200 rounded" />
                    ))
                  : relatedBooks.map((b) => <BookCard key={b.bookid} book={b} />)}
              </div>
            </section>
          )}
        </main>
      </div>

      {notif && (
        <NotificationModal
          message={notif.message}
          type={notif.type}
          onClose={() => setNotif(null)}
        />
      )}
    </Layout>
  );
}