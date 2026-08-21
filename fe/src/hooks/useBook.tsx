import {useState, useEffect} from 'react';
import bookApi from '../api/book.api';
import type { Book } from '../api/book.api';

export default function useBook() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);
    const [topSellingLoading, setTopSellingLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);
    const [topSellingBooks, setTopSellingBooks] = useState<Book[]>([]);
    const [newBooks, setNewBooks] = useState<Book[]>([]);

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await bookApi.getBooks({ limit: 12 });
                setBooks(response.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const fetchFavoriteBooks = async () => {
        try {
            setLoading(true)
            const response = await bookApi.getFavoriteBooks();
            setFavoriteBooks(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        }
        finally{
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
    }

    useEffect(() => {
        fetchFavoriteBooks();
        fetchTopSellingBooks();
        fecthNewBooks();
    }, []);

    return { books, loading, topSellingLoading, error, favoriteBooks, topSellingBooks, newBooks };
}