import axiosClient from "./axiosClient";


export interface Reviews{
    fullname: string;
    rating: number;
    comment: string;
    role: string;
    avatar: string;
    bookid: string;
    title: string;
    reviewid: string;
};

export interface ResponseGetReviews {
    success: boolean;
    data: Reviews[];
}

export const userApi = {
    // axiosClient interceptor đã unwrap response.data
    // nên response ở đây là backend JSON body: { success, data }
    getReviews: async (): Promise<Reviews[]> => {
        const response = await axiosClient.get<any, ResponseGetReviews>('/users/reviews');
        return response.data;
    }
};

export default userApi;