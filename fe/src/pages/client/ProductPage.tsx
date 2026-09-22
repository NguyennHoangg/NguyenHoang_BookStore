import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowDownIcon, ArrowsUpDownIcon } from "@heroicons/react/24/outline";

import useBook, { type SortBy } from "../../hooks/useBookList";
import BookCardSkeleton from "../../components/skeleton/book-card-skeleton";
import ErrorPage from "../ErrorPage";
import Layout from "../../components/layout/Layout";
import Breadcrumbs from "../../components/common/Breadscrumbs";
import CategoryFilter from "../../components/filter/CategoryFilter";
import PriceFilter from "../../components/filter/PriceFilter";
import RatingFilter from "../../components/filter/RatingFilter";
import { BookCard } from "../../components";

const SORT_OPTIONS: { value: SortBy; label: string; icon?: React.ReactNode }[] =
  [
    { value: "default", label: "Mặc định" },
    { value: "newest", label: "Mới nhất" },
    { value: "price_asc", label: "Giá tăng dần" },
    { value: "price_desc", label: "Giá giảm dần" },
    { value: "title_asc", label: "Tên A-Z" },
  ];

const PRICE_RANGE = [
  { id: 1, value: "<50", label: "< 50k", min: 0, max: 50000 },
  { id: 2, value: "50-100", label: "50k - 100k", min: 50000, max: 100000 },
  { id: 3, value: "100-200", label: "100k - 200k", min: 100000, max: 200000 },
  { id: 4, value: ">200", label: "> 200k", min: 200000, max: Infinity },
];

export default function ProductPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const slug = searchParams.get("category") ?? undefined;

  const [sortBy, setSortBy] = useState<SortBy>("default");
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [rating, setRating] = useState<number | null>(null);

  const { books, categories, booksLoading, error, hasNextPage, loadNextPage } =
    useBook(slug, {
      sortBy,
      priceRange,
      rating,
    });

  const handleCategoryChange = (categorySlug: string) => {
    setSearchParams(categorySlug ? { category: categorySlug } : {});
  };

  const handlePriceChange = (value: string) => {
    const range = PRICE_RANGE.find((r) => r.value === value);
    if (!range) return;
    setPriceRange([range.min, range.max]);
  };

  const handleRatingChange = (r: number) => {
    setRating((prev) => (prev === r ? null : r));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as SortBy);
  };

  if (error) return <ErrorPage />;

  const currentCategoryName = slug
    ? (categories.find((c) => c.slug === slug)?.categoryname ?? slug)
    : "Tất cả sách";

  return (
    <Layout>
      <div className="min-h-screen bg-[#FDFBF7]">
        <main className="mx-auto max-w-screen-2xl px-4 md:px-6 py-6 md:py-10">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={["Home", "Sách", currentCategoryName]}
            onSelect={(item) => {
              if (item === "Home") window.location.href = "/";
              if (item === "Sách") setSearchParams({});
            }}
          />

          <div className="flex items-end justify-between my-4 md:my-6 gap-4 flex-wrap">
            <h1 className="text-3xl md:text-4xl italic font-serif text-[#153328]">
              {currentCategoryName}
            </h1>
            <span className="text-sm text-gray-500">
              {booksLoading ? "Đang tải..." : `${books.length} cuốn sách`}
            </span>
          </div>

          <div className="flex w-full gap-6 md:gap-10 ">
            {/* ── Sidebar Filter ── */}
            <aside className="hidden md:flex flex-col w-[220px] shrink-0 pb-4 pr-4 border-r border-gray-200">
              <CategoryFilter
                categories={categories.map((cat) => ({
                  id: cat.categoryid,
                  slug: cat.slug,
                  name: cat.categoryname,
                  quantity: Number(cat.quantity) || 0,
                }))}
                selectedCategory={slug ?? ""}
                onCategoryChange={handleCategoryChange}
              />

              <PriceFilter
                currentValue={
                  (priceRange ? PRICE_RANGE.find((r) => r.min === priceRange[0] && r.max === priceRange[1])?.value : "") ?? ""
                }
                onFilterChange={handlePriceChange}
                options={PRICE_RANGE}
              />

              <RatingFilter
                currentRating={rating ?? 0}
                onFilterChange={handleRatingChange}
              />

              {/* Reset filter */}
              {(slug || priceRange || rating || sortBy !== "default") && (
                <button
                  onClick={() => {
                    setSearchParams({});
                    setPriceRange(null);
                    setRating(null);
                    setSortBy("default");
                  }}
                  className="mt-6 text-sm text-[#153328] underline underline-offset-2 text-left hover:opacity-70 transition-opacity"
                >
                  Xoá bộ lọc
                </button>
              )}
            </aside>

            {/* ── Main Content ── */}
            <div className="flex flex-col flex-1 min-w-0">
              {/* Sort bar */}
              <div className="flex justify-between items-center mb-5 gap-4 flex-wrap">
                {/* Mobile categories (horizontal scroll) */}
                <div className="md:hidden flex gap-2 overflow-x-auto pb-1 w-full">
                  <button
                    onClick={() => handleCategoryChange("")}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs border transition-colors ${
                      !slug
                        ? "bg-[#153328] text-white border-[#153328]"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
                  >
                    Tất cả
                  </button>
                  {categories
                    .filter((c) => Number(c.quantity) > 0)
                    .map((cat) => (
                      <button
                        key={cat.categoryid}
                        onClick={() => handleCategoryChange(cat.slug)}
                        className={`shrink-0 px-3 py-1.5 rounded-full text-xs border transition-colors ${
                          slug === cat.slug
                            ? "bg-[#153328] text-white border-[#153328]"
                            : "bg-white text-gray-700 border-gray-300"
                        }`}
                      >
                        {cat.categoryname}
                      </button>
                    ))}
                </div>

                {/* Sort select */}
                <div className="flex items-center gap-2 ml-auto">
                  <ArrowsUpDownIcon className="h-4 w-4 text-gray-500" />
                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="border border-gray-300 rounded-lg py-1.5 px-3 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#153328]/30"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active filters chips */}
              {(priceRange || (rating && rating > 0)) && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {priceRange && (
                    <span className="inline-flex items-center gap-1 bg-[#e8f0ec] text-[#153328] text-xs px-3 py-1 rounded-full">
                      Giá: {priceRange[0].toLocaleString("vi-VN")}đ –{" "}
                      {priceRange[1].toLocaleString("vi-VN")}đ
                      <button
                        onClick={() => setPriceRange(null)}
                        className="ml-1 hover:opacity-70"
                      >
                        ✕
                      </button>
                    </span>
                  )}
                  {rating !== null && rating > 0 && (
                    <span className="inline-flex items-center gap-1 bg-[#e8f0ec] text-[#153328] text-xs px-3 py-1 rounded-full">
                      Từ {rating}★ trở lên
                      <button
                        onClick={() => setRating(null)}
                        className="ml-1 hover:opacity-70"
                      >
                        ✕
                      </button>
                    </span>
                  )}
                </div>
              )}

              {/* Book grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {booksLoading && books.length === 0
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <BookCardSkeleton key={i} />
                    ))
                  : books.map((book) => (
                      <BookCard key={book.bookid} book={book} />
                    ))}
              </div>

              {/* Empty state */}
              {!booksLoading && books.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <p className="text-5xl mb-4">📚</p>
                  <h3 className="text-xl font-serif italic text-[#153328] mb-2">
                    Không tìm thấy sách
                  </h3>
                  <p className="text-sm text-gray-500">
                    Thử thay đổi bộ lọc hoặc tìm kiếm với từ khoá khác.
                  </p>
                  <button
                    onClick={() => {
                      setSearchParams({});
                      setPriceRange(null);
                      setRating(null);
                      setSortBy("default");
                    }}
                    className="mt-4 text-sm text-[#153328] underline"
                  >
                    Xoá tất cả bộ lọc
                  </button>
                </div>
              )}

              {/* Load more */}
              {hasNextPage && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={loadNextPage}
                    disabled={booksLoading}
                    className="flex items-center gap-2 px-8 py-3 border border-[#153328] text-[#153328] text-sm font-medium rounded-full hover:bg-[#153328] hover:text-white transition-all duration-200 disabled:opacity-50"
                  >
                    {booksLoading ? (
                      <>
                        <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                        Đang tải...
                      </>
                    ) : (
                      <>
                        <ArrowDownIcon className="h-4 w-4" />
                        Xem thêm sách
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}
