import axiosClient from "./axiosClient";

export interface Book {
    bookid: string;
    title: string;
    author: string;
    price: number | string;
    compareatprice: number | string;
    imageurl: string;
    url: string;
    description?: string;
    isactive: boolean;
    createdAt: string;
    categoryname: string;
    publishername: string;
    stock?: number;
    pages?: number;
    releaseyear?: number;
    discount?: number | string;
    rating?: number | string;
    soldcount?: number;
}


export interface GetBooksResponse {
    success: boolean;
    data: Book[];
    pagination: {
        nextCursor: string | null;
        hasNextPage: boolean;
        limit: number;
    };
}

export interface GetFavoriteBooksResponse {
    success: boolean;
    data: Book[];
}

export interface GetTopSellingBooksResponse {
    success: boolean;
    data: Book[];
}

export interface GetBooksByCategoryResponse {
    success: boolean;
    data: Book[];
}

export interface GetNewBooks {
    success: boolean;
    data: Book[];
}

export interface Category {
    categoryid: string;
    categoryname: string;
    description: string;
    slug: string;
    quantity: string; // PostgreSQL COUNT trả về bigint dạng string
}

export interface GetCategoriesResponse {
    success: boolean;
    data: Category[];
}

const bookApi = {
    getBooks(params: { limit?: number; cursor?: string; sortBy?: string; category?: string }): Promise<GetBooksResponse> {
        const url = '/books';
        return axiosClient.get(url, { params }) as Promise<GetBooksResponse>;
    },

    getBookByURL(url: string): Promise<Book | null> {
        const normalizedUrl = url.replace(/^\/+/, "");
        const endpoint = `/books/${normalizedUrl}`;
        return axiosClient.get(endpoint) as Promise<Book | null>;
    },

    getFavoriteBooks(): Promise<GetFavoriteBooksResponse> {
        const url = '/books/favorites';
        return axiosClient.get(url) as Promise<GetFavoriteBooksResponse>;
    },

    getTopSellingBooks(params: { limit?: number } = {}): Promise<GetTopSellingBooksResponse> {
        const url = '/books/top-selling';
        return axiosClient.get(url, { params }) as Promise<GetTopSellingBooksResponse>;
    },

    getNewBooks() : Promise<GetNewBooks> {
        const url = '/books/new-books';
        return axiosClient.get(url) as Promise<GetNewBooks>;
    },

    getCategories() : Promise<GetCategoriesResponse> {
        const url = '/books/categories';
        return axiosClient.get(url) as Promise<GetCategoriesResponse>;
    },
};

export default bookApi;  