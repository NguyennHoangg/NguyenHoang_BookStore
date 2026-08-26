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

        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          {book.categoryname && (
            <span className="bg-surface/90 px-2 py-0.5 font-sans text-[9px] font-semibold uppercase tracking-[0.18em] text-on-surface">
              {book.categoryname}
            </span>
          )}
          {!book.isactive && (
            <span className="bg-error/90 px-2 py-0.5 font-sans text-[9px] font-semibold uppercase tracking-[0.18em] text-white">
              Tạm ngưng
            </span>
          )}
        </div>

        <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between gap-2 text-white">
          <div className="min-w-0">
            <p className="font-sans text-[9px] uppercase tracking-[0.22em] text-white/70">
              Tác giả
            </p>
            <p className="mt-0.5 truncate font-serif text-sm font-bold leading-tight">
              {book.author}
            </p>
          </div>
          <span className="shrink-0 border border-white/20 bg-white/10 px-2 py-1 font-sans text-[9px] uppercase tracking-[0.18em] backdrop-blur-sm">
            Chi tiết
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <div className="space-y-1">
          <h3 className="line-clamp-2 h-[2.5rem] font-serif text-sm leading-tight text-on-surface transition-colors group-hover:text-primary">
            {book.title}
          </h3>
          <p className="line-clamp-1 h-5 text-xs leading-relaxed text-on-surface-variant">
            {book.description || `Nhà xuất bản ${book.publishername || "Bookstore"}`}
          </p>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 border-t border-outline-variant/40 pt-2">
          <div>
            <p className="font-sans text-[9px] uppercase tracking-[0.18em] text-on-surface-variant">
              Giá bán
            </p>
            <div className="mt-1 flex flex-wrap items-baseline gap-2">
              <span className="font-serif text-base text-primary">
                {formatPrice(book.price)}
              </span>
              {showComparePrice && (
                <span className="font-sans text-xs text-on-surface-variant line-through">
                  {formatPrice(book.compareAtPrice)}
                </span>
              )}
            </div>
          </div>

          <div className="text-right">
            <p className="font-sans text-[9px] uppercase tracking-[0.18em] text-on-surface-variant">
              {book.publishername || "Bookstore"}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}