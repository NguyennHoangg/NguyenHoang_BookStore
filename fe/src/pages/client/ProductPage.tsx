
import { useSearchParams } from "react-router-dom";

import useBook from "../../hooks/useBook";
import BookCardSkeleton from "../../components/skeleton/book-card-skeleton";
import ErrorPage from "../ErrorPage";
import Layout from "../../components/layout/Layout";
import Breadcrumbs from "../../components/common/Breadscrumbs";
import CategoryFilter from "../../components/filter/CategoryFilter";
import PriceFilter from "../../components/filter/PriceFilter";
import Pagantion from "../../components/common/Pagination";
import { BookCard } from "../../components";
import RatingFilter from "../../components/filter/RatingFilter";

export default function ProductPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const slug = searchParams.get("category") ?? undefined;

  const { books, categories, booksLoading, error } = useBook(slug);

  const handleCategoryChange = (categorySlug: string) => {
    setSearchParams(categorySlug ? { category: categorySlug } : {});
  };

  if (error) {
    return <ErrorPage />;
  }

  return (
    <Layout>
      <main className="mx-12 my-4">
        {/*Breadcrumbs*/}
        <Breadcrumbs items={["Home", "Books", slug ? categories.find((category) => category.slug === slug)?.categoryname : "Tất cả danh mục sách"]} />
        <h1 className="text-4xl my-2 italic font-serif text-[#153328]">Bộ sưu tập tuyển chọn</h1>

        <div className="flex w-full gap-4">
          <div className="flex flex-col w-[20%] pb-4 px-6">
            <CategoryFilter
              categories={categories.map((category) => ({
                id: category.categoryid,
                slug: category.slug,
                name: category.categoryname,
                quantity: Number(category.quantity) || 0,
              }))}
              selectedCategory={slug ?? ""}
              onCategoryChange={handleCategoryChange}
            />

            <PriceFilter
              currentValue=""
              onFilterChange={(value) => console.log("PRICE_FILTER", value)}
              min={100000}
              max={20000000}
            />

            <RatingFilter
              currentRating={0}
              onFilterChange={(rating) => console.log("RATING_FILTER", rating)}
            />
          </div>

          <div className="flex flex-col items-center flex-1">
            <div className="flex justify-end w-full mb-4">
              <select className="border border-gray-300 rounded-md py-1 px-2 bg-gray-300 text-black">
                <option value="">Sắp xếp theo</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="name-asc">Tên A-Z</option>
                <option value="name-desc">Tên Z-A</option>
              </select>
            </div>
            <div className="grid grid-cols-4 gap-4 w-full">
              {booksLoading
                ? Array.from({ length: 8 }).map((_, i) => <BookCardSkeleton key={i} />)
                : books.map((book) => <BookCard key={book.bookid} book={book} />)
              }
            </div>
            <Pagantion
              currentPage={2}
              totalPages={80}
              onPageChange={() => console.log("click")}
            />
          </div>
        </div>

      </main>
    </Layout>
  );
}
