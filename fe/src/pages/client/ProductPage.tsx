import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useBook from "../../hooks/useBook";
import BookCardSkeleton from "../../components/skeleton/book-card-skeleton";
import ErrorPage from "../ErrorPage";
import Header from "../../components/layout/header";

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

  if(error){
    return (
        <ErrorPage />
    )
  }

  return(
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-gray-800 relative">
      <div className="absolute top-0 left-0 w-full z-50">
        <Header />
      </div>

      <main>
        {/*Breadcrumbs*/}
      </main>
    </div>
  )
}

