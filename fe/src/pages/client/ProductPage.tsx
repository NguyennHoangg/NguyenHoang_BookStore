import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useBook from "../../hooks/useBook";
import BookCardSkeleton from "../../components/skeleton/book-card-skeleton";
import ErrorPage from "../ErrorPage";
import Layout from "../../components/layout/Layout";
import Breadcrumbs from "../../components/common/Breadscrumbs";
import CategoryFilter from "../../components/filter/CategoryFilter";
import PriceFilter from "../../components/filter/PriceFilter";
import Pagantion from "../../components/common/Pagination";

export default function ProductPage() {
  const { books, loading, error } = useBook();
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
      <main className="container mx-auto">
        {/*Breadcrumbs*/}
        <Breadcrumbs items={["Home", "Books", url ? url : ""]} />

        <div className="flex w-full gap-4">
          <div className="flex flex-col w-1/4 border pb-8">
            <CategoryFilter
              categories={[
                { id: "1", name: "Fiction", quantity: 10 },
                { id: "2", name: "Non-Fiction", quantity: 15 },
                { id: "3", name: "Science Fiction", quantity: 20 },
                { id: "4", name: "Fantasy", quantity: 25 },
                { id: "5", name: "Mystery", quantity: 30 },
                { id: "6", name: "Thriller", quantity: 35 },
                { id: "7", name: "Romance", quantity: 40 },
                { id: "8", name: "Horror", quantity: 45 },
                { id: "9", name: "Science", quantity: 50 },
                { id: "10", name: "History", quantity: 55 },
                { id: "11", name: "Biography", quantity: 60 },
                { id: "12", name: "Self-Help", quantity: 65 },
              ]}
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
          <div className="flex items-center justify-center border flex-1">
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
