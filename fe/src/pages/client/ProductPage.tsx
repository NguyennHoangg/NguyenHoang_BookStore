
import { useParams, useNavigate } from "react-router-dom";

import useBook from "../../hooks/useBook";
import BookCardSkeleton from "../../components/skeleton/book-card-skeleton";
import ErrorPage from "../ErrorPage";
import Layout from "../../components/layout/Layout";
import Breadcrumbs from "../../components/common/Breadscrumbs";
import CategoryFilter from "../../components/filter/CategoryFilter";
import PriceFilter from "../../components/filter/PriceFilter";
import Pagantion from "../../components/common/Pagination";
import { BookCard } from "../../components";

export default function ProductPage() {
  const { books, categories, loading, error } = useBook();
  const { url } = useParams();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <BookCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorPage />;
  }

  return (
    <Layout>
      <main className="mx-12 my-4">
        {/*Breadcrumbs*/}
        <Breadcrumbs items={["Home", "Books", url ? url : ""]} />
        <h1 className="text-4xl my-2 italic font-serif text-[#153328]">Bộ sưu tập tuyển chọn</h1>

        <div className="flex w-full gap-4">
          <div className="flex flex-col w-[20%] pb-4 px-6">
            <CategoryFilter
              categories={categories.map((category) => ({
                id: category.categoryid,
                name: category.categoryname,
                quantity: Number(category.quantity) || 0,
              }))}
              selectedCategory={url ? url : ""}
              onCategoryChange={(value) =>
                console.log("CATEGORY_FILTER", value)
              }
            />

            <PriceFilter
              currentValue=""
              onFilterChange={(value) => console.log("PRICE_FILTER", value)}
              min={100000}
              max={20000000}
            />
          </div>

          <div className="flex flex-col items-center flex-1">
            <div className="grid grid-cols-4 gap-4 w-full">
              {books.map((book) => (
                <BookCard key={book.bookid} book={book} />
              ))}
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
