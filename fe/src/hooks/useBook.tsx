import { useState, useEffect } from "react";
import bookApi from "../api/book.api";
import type { Book, Category } from "../api/book.api";

export default function useBook(categorySlug?: string) {
  const [books, setBooks] = useState<Book[]>([]);
  const [booksLoading, setBooksLoading] = useState(false); // chỉ cho book list
  const [loading, setLoading] = useState(false);           // cho categories, favorites...
  const [topSellingLoading, setTopSellingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);
  const [topSellingBooks, setTopSellingBooks] = useState<Book[]>([]);
  const [newBooks, setNewBooks] = useState<Book[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      setBooksLoading(true);
      setError(null);
      try {
        const params: { limit: number; category?: string } = { limit: 8 };
        if (categorySlug) params.category = categorySlug;
        const response = await bookApi.getBooks(params);
        setBooks(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setBooksLoading(false);
      }
    };

    fetchBooks();
  }, [categorySlug]);

  const fetchFavoriteBooks = async () => {
    try {
      setLoading(true);
      const response = await bookApi.getFavoriteBooks();
      setFavoriteBooks(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchTopSellingBooks = async () => {
    setTopSellingLoading(true);
    try {
      const response = await bookApi.getTopSellingBooks({ limit: 4 });
      setTopSellingBooks(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setTopSellingLoading(false);
    }
  };

  const fecthNewBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookApi.getNewBooks();
      setNewBooks(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

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
    fetchFavoriteBooks();
    fetchTopSellingBooks();
    fecthNewBooks();
    fetchCategories();
  }, []);

  return {
    books,
    booksLoading,
    loading,
    topSellingLoading,
    error,
    favoriteBooks,
    topSellingBooks,
    newBooks,
    categories,
  };
}
