import { useState, useEffect, useCallback } from "react";
import bookApi from "../api/book.api";
import type { Book, Category } from "../api/book.api";

export type SortBy = "default" | "price_asc" | "price_desc" | "newest" | "title_asc";

export interface BookFilters {
  sortBy?: SortBy;
  priceRange?: [number, number] | null;
  rating?: number | null;
}

export default function useBook(categorySlug?: string, filters?: BookFilters) {
  const { sortBy = "default", priceRange = null, rating = null } = filters ?? {};

  // ── Danh sách sách (ProductPage) ──
  const [books, setBooks] = useState<Book[]>([]);
  const [booksLoading, setBooksLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ── Fetch sách cho ProductPage ──
  const fetchBooks = useCallback(
    async (overrideCursor?: string | null) => {
      setBooksLoading(true);
      setError(null);
      try {
        const params: Parameters<typeof bookApi.getBooks>[0] = {
          limit: 12,
          cursor: overrideCursor ?? undefined,
          sortBy: sortBy !== "default" ? sortBy : undefined,
          category: categorySlug ?? undefined,
          minPrice: priceRange ? priceRange[0] : undefined,
          maxPrice: priceRange ? priceRange[1] : undefined,
          rating: rating ?? undefined,
        };
        const response = await bookApi.getBooks(params);
        // Nếu load trang mới (có cursor) → append, không thì replace
        if (overrideCursor) {
          setBooks((prev) => [...prev, ...response.data]);
        } else {
          setBooks(response.data);
        }
        setHasNextPage(response.pagination.hasNextPage);
        setNextCursor(response.pagination.nextCursor);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setBooksLoading(false);
      }
    },
    [categorySlug, sortBy, priceRange, rating]
  );

  // Reset cursor và fetch lại khi filter thay đổi
  useEffect(() => {
    setCursor(null);
    fetchBooks(null);
  }, [fetchBooks]);

  /** Tải trang tiếp theo (Load more) */
  const loadNextPage = useCallback(() => {
    if (!hasNextPage || booksLoading) return;
    const newCursor = nextCursor;
    setCursor(newCursor);
    fetchBooks(newCursor ?? undefined);
  }, [hasNextPage, booksLoading, nextCursor, fetchBooks]);


  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookApi.getCategories();
      setCategories(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);


  return {
    books,
    booksLoading,
    loading,
    error,
    categories,
    hasNextPage,
    nextCursor,
    cursor,
    loadNextPage,
  };
}
