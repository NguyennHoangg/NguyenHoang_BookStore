import Card from "../card/card";
import formatPrice from "../../utils/format";
import type { Book } from "../../api/book.api";

interface BookCardProps {
  book: Book;
  className?: string;
  onClick?: () => void;
  featured?: boolean;
}

export default function BookCard({ book, className, onClick, featured = false }: BookCardProps) {
  const showComparePrice =
    typeof book.compareAtPrice === "number" && book.compareAtPrice > book.price;

  return (
    <Card
      elevated={featured}
      clickable={Boolean(onClick)}
      onClick={onClick}
      padding={false}
      className={`group flex h-full flex-col ${className || ""}`}
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-surface-container-high">
        <img
          src={book.imageurl || "/default-book.jpg"}
          alt={book.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {book.categoryname && (
            <span className="bg-surface/90 px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-on-surface">
              {book.categoryname}
            </span>
          )}
          {!book.isactive && (
            <span className="bg-error/90 px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-white">
              Tạm ngưng
            </span>
          )}
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 text-white">
          <div className="min-w-0">
            <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-white/70">
              Tác giả
            </p>
            <p className="mt-1 truncate font-serif text-xl font-bold leading-tight">
              {book.author}
            </p>
          </div>
          <span className="shrink-0 border border-white/20 bg-white/10 px-3 py-2 font-sans text-[10px] uppercase tracking-[0.22em] backdrop-blur-sm">
            Chi tiết
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="space-y-3">
          {/* Chiều cao cố định = 2 dòng, responsive theo font-size */}
          <h3 className="line-clamp-2 h-[3rem] sm:h-[3.5rem] md:h-[4rem] font-serif text-lg sm:text-xl md:text-2xl leading-tight text-on-surface transition-colors group-hover:text-primary">
            {book.title}
          </h3>
          {/* Chiều cao cố định = 2 dòng text-sm leading-relaxed */}
          <p className="line-clamp-2 h-10 text-sm leading-relaxed text-on-surface-variant">
            {book.description || `Nhà xuất bản ${book.publishername || "Bookstore"}`}
          </p>
        </div>

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-outline-variant/40 pt-5">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-on-surface-variant">
              Giá bán
            </p>
            <div className="mt-2 flex flex-wrap items-baseline gap-3">
              <span className="font-serif text-2xl text-primary">
                {formatPrice(book.price)}
              </span>
              {showComparePrice && (
                <span className="font-sans text-sm text-on-surface-variant line-through">
                  {formatPrice(book.compareAtPrice)}
                </span>
              )}
            </div>
          </div>

          <div className="text-right">
            <p className="font-sans text-[10px] uppercase tracking-[0.22em] text-on-surface-variant">
              {book.publishername || "Bookstore"}
            </p>
            <p className="mt-1 font-serif text-sm italic text-on-surface-variant">
              {featured ? "Đề xuất nổi bật" : "Xem sản phẩm"}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}