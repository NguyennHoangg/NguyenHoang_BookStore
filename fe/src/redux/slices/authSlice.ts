import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string | number;
  email: string;
  fullName?: string;
  role?: string;
  dob?: Date | string;
  gender?: boolean;
  phone?: string;
  address?: string;

}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const savedUser = localStorage.getItem('user');

const initialState: AuthState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  isLoading: false,
  error: null,
  isAuthenticated: !!savedUser,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action: Bắt đầu đăng nhập
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    // Action: Đăng nhập thành công
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    // Action: Đăng nhập thất bại
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    // Action: Đăng xuất
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;