import { useEffect, useState } from "react";
import bookApi from "../api/book.api";
import type { Book } from "../api/book.api";



export default function useHomeData() {
    // ── Trang chủ ──
  const [loading, setLoading] = useState(false);
  const [topSellingLoading, setTopSellingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);
  const [topSellingBooks, setTopSellingBooks] = useState<Book[]>([]);
  const [newBooks, setNewBooks] = useState<Book[]>([]);
  


  // ── Fetch dữ liệu trang chủ ──
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


   useEffect(() => {
    fetchFavoriteBooks();
    fetchTopSellingBooks();
    fecthNewBooks();

  }, []);


  return {
    favoriteBooks,
    topSellingBooks,
    newBooks,
    loading,
    topSellingLoading,
    error
  }

}