import axiosClient from './axiosClient';

// Định nghĩa các interfaces/types cho request và response
export interface LoginPayload {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  identifier: "EMAIL" | "PHONE";
  identifierValue: string;
  password?: string;
  fullName: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    id: string | number;
    email: string;
    fullname: string;
    role: string;
    phone: string;
    address: string;
    dob: string;
    gender: string;
    isactive: boolean;
  };
  token: {
    accessToken: string;
    expiresIn: string;
  };
}

const authApi = {
  login(payload: LoginPayload): Promise<AuthResponse> {
    const url = '/auth/login';
    // Ép kiểu (cast) về Promise<AuthResponse> do interceptor đã trả về response.data
    return axiosClient.post(url, payload) as Promise<AuthResponse>;
  },

  register(payload: RegisterPayload): Promise<AuthResponse> {
    const url = '/auth/register';
    return axiosClient.post(url, payload) as Promise<AuthResponse>;
  },

  refreshToken() {
    const url = '/auth/refresh';
    return axiosClient.post(url);
  }
};

export default authApi;
