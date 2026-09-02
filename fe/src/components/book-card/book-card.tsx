import Card from "../card/card";
import formatPrice from "../../utils/format";
import type { Book } from "../../api/book.api";
import { ShoppingCartIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

interface BookCardProps {
  book: Book;
  className?: string;
  onClick?: () => void;
  featured?: boolean;
}

export default function BookCard({ book, className, onClick, featured = false }: BookCardProps) {
  const compareatprice = parseFloat(String(book.compareatprice));
  const price = parseFloat(String(book.price));
  const discount = parseFloat(String(book.discount ?? 0));
  const showComparePrice = !isNaN(compareatprice) && compareatprice > price;
  const showDiscount = !isNaN(discount) && discount > 0;

  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/book/${book.url}`);
    onClick?.();
  }
  return (
    <Card
      elevated={featured}
      clickable={Boolean(onClick)}
      onClick={handleClick}
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

        <div className="relative mt-auto overflow-hidden border-t border-outline-variant/40 pt-2" style={{ height: "3.5rem" }}>
          {/* Giá bán — trượt xuống & mờ đi khi hover */}
          <div className="absolute inset-x-0 top-0 flex items-end justify-between gap-2 transition-all duration-300 group-hover:translate-y-4 group-hover:opacity-0">
            <div>
              <p className="font-sans text-[9px] uppercase tracking-[0.18em] text-on-surface-variant">
                Giá bán
              </p>
              <div className="mt-1 flex flex-wrap items-baseline gap-2">
                <span className="font-serif text-base text-primary">
                  {formatPrice(price)}
                </span>
                {showComparePrice && (
                  <span className="font-sans text-xs text-on-surface-variant line-through">
                    {formatPrice(compareatprice)}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">
                Giảm giá
              </p>
              <div className="mt-1 flex flex-wrap items-baseline gap-2">
                {showDiscount && (
                  <span className="font-sans text-xs font-semibold text-error">
                    -{discount.toFixed(0)}%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 2 button — ẩn bên dưới, trượt lên khi hover */}
          <div className="absolute inset-x-0 top-5 flex translate-y-6 items-center gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-primary px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-80"
              onClick={(e) => e.stopPropagation()}
            >
              <ShoppingBagIcon className="h-3.5 w-3.5" />
              Mua ngay
            </button>
            <button
              className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-primary px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-primary transition-opacity hover:bg-primary/10"
              onClick={(e) => e.stopPropagation()}
            >
              <ShoppingCartIcon className="h-3.5 w-3.5" />
              Giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}