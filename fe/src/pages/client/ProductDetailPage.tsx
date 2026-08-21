import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/button/button";
import bookApi, { type Book } from "../../api/book.api";
import formatPrice from "../../utils/format";

export default function ProductDetailPage() {
  const params = useParams();
  const navigate = useNavigate();

  const bookPath = params["*"] || "";
  const normalizedUrl = bookPath.startsWith("/") ? bookPath : `/${bookPath}`;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        setBook(response?.data || null);

        if (!response?.data) {
          setError("Không tìm thấy sách tương ứng.");
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Không thể tải dữ liệu sách.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadBook();

    return () => {
      isMounted = false;
    };
  }, [bookPath, normalizedUrl]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface px-6 py-16 text-on-surface">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="h-[540px] animate-pulse bg-surface-container-low" />
          <div className="space-y-4 pt-6">
            <div className="h-4 w-32 animate-pulse bg-surface-container-low" />
            <div className="h-16 w-4/5 animate-pulse bg-surface-container-low" />
            <div className="h-6 w-1/2 animate-pulse bg-surface-container-low" />
            <div className="h-28 w-full animate-pulse bg-surface-container-low" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-surface px-6 py-16 text-on-surface">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center text-center">
          <p className="mb-4 font-sans text-label-md uppercase tracking-[0.28em] text-on-surface-variant">
            Book detail
          </p>
          <h1 className="font-serif text-4xl text-on-surface">
            {error || "Không thể tải sách này."}
          </h1>
          <p className="mt-4 max-w-xl text-body-md text-on-surface-variant">
            Đường dẫn sách có thể không hợp lệ, hoặc sách đã bị gỡ khỏi hệ thống.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button type="button" variant="primary" onClick={() => navigate("/")}>
              Về trang chủ
            </Button>
            <Button type="button" variant="secondary" onClick={() => window.location.reload()}>
              Tải lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const hasDiscount = typeof book.compareAtPrice === "number" && book.compareAtPrice > book.price;

  return (
    <div className="min-h-screen bg-surface px-6 py-10 text-on-surface lg:px-12">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="bg-surface-container-low p-4 shadow-[0_30px_80px_rgba(0,0,0,0.08)] lg:p-6">
          <div className="aspect-[2/3] overflow-hidden bg-surface-container-high">
            <img
              src={book.imageurl || "/default-book.jpg"}
              alt={book.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col justify-center py-4 lg:py-10">
          <p className="font-sans text-label-md uppercase tracking-[0.28em] text-on-surface-variant">
            {book.categoryname || "Book detail"}
          </p>
          <h1 className="mt-4 font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-none text-on-surface">
            {book.title}
          </h1>
          <p className="mt-5 font-sans text-lg text-on-surface-variant">
            Bởi {book.author}
          </p>

          <div className="mt-8 flex flex-wrap items-end gap-4">
            <span className="font-serif text-4xl text-primary">
              {formatPrice(book.price)}
            </span>
            {hasDiscount && (
              <span className="mb-1 font-sans text-lg text-on-surface-variant line-through">
                {formatPrice(book.compareAtPrice)}
              </span>
            )}
          </div>

          <p className="mt-8 max-w-2xl text-body-md leading-relaxed text-on-surface-variant">
            {book.description || "Chưa có mô tả cho cuốn sách này."}
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="bg-surface-container-low p-5">
              <p className="font-sans text-label-sm uppercase tracking-[0.2em] text-on-surface-variant">
                Nhà xuất bản
              </p>
              <p className="mt-2 font-serif text-2xl text-on-surface">
                {book.publishername || "Đang cập nhật"}
              </p>
            </div>
            <div className="bg-surface-container-low p-5">
              <p className="font-sans text-label-sm uppercase tracking-[0.2em] text-on-surface-variant">
                Số lượng
              </p>
              <p className="mt-2 font-serif text-2xl text-on-surface">
                {typeof book.stock === "number" ? `${book.stock} cuốn` : "Đang cập nhật"}
              </p>
            </div>
            <div className="bg-surface-container-low p-5">
              <p className="font-sans text-label-sm uppercase tracking-[0.2em] text-on-surface-variant">
                Số trang
              </p>
              <p className="mt-2 font-serif text-2xl text-on-surface">
                {typeof book.pages === "number" ? `${book.pages} trang` : "Đang cập nhật"}
              </p>
            </div>
            <div className="bg-surface-container-low p-5">
              <p className="font-sans text-label-sm uppercase tracking-[0.2em] text-on-surface-variant">
                Năm phát hành
              </p>
              <p className="mt-2 font-serif text-2xl text-on-surface">
                {book.releaseyear || "Đang cập nhật"}
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button type="button" variant="primary" onClick={() => navigate("/")}>
              Tiếp tục khám phá
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
              Quay lại danh sách
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}