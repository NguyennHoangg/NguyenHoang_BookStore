import { useDispatch, useSelector } from "react-redux";
import authApi, { type LoginPayload, type RegisterPayload } from "../api/authApi";
import { loginStart, loginSuccess, loginFailure, logout as logoutAction } from "../redux/slices/authSlice";
import type { RootState } from "../redux/store";

// Hàm helper để set cookie
const setCookie = (name: string, value: string, days = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

// Hàm helper để xoá cookie
const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=${new Date(0).toUTCString()};path=/`;
};

export default function useAuth() {
  const dispatch = useDispatch();
  const { user, isLoading: loading } = useSelector((state: RootState) => state.auth);

  const login = async (payload: LoginPayload) => {
    try {
      dispatch(loginStart());
      const res = await authApi.login(payload);
      
      if (res.success) {
        // 1. Lưu token vào Cookie (Frontend tự quản lý Access Token)
        setCookie('access_token', res.token.accessToken, 7);
        
        // 2. Lưu thông tin user vào Redux store
        dispatch(loginSuccess({
          id: res.data.id,
          email: res.data.email,
          fullName: res.data.fullname,
          gender: Boolean(res.data.gender),
          phone: res.data.phone,
          role: res.data.role,
          address: res.data.address,
          dob: res.data.dob,
        }));
        
        return { success: true };
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      // Backend trả về shape: { success: false, error: { code, message, ... } }
      const axiosError = error as { error?: { code?: string; message?: string } };
      const errorCode = axiosError?.error?.code ?? null;
      const backendMessage = axiosError?.error?.message ?? errorMessage ?? "Đăng nhập thất bại";

      console.error("Login failed:", errorCode, backendMessage);
      dispatch(loginFailure(backendMessage));
      return { success: false, error: backendMessage, errorCode };
    }
  };

  const logout = () => {
    deleteCookie('access_token');
    dispatch(logoutAction());
  };

  const register = async (payload: RegisterPayload) => {
    try {
      dispatch(loginStart());
      const res = await authApi.register(payload);

      if (res.success) {
        // 1. Lưu token vào Cookie (giống login)
        setCookie('access_token', res.token.accessToken, 7);

        // 2. Lưu thông tin user vào Redux store
        dispatch(loginSuccess({
          id: res.data.id,
          email: res.data.email,
          fullName: res.data.fullname,
          gender: Boolean(res.data.gender),
          phone: res.data.phone,
          role: res.data.role,
          address: res.data.address,
          dob: res.data.dob,
        }));

        return { success: true };
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const axiosError = error as { error?: { code?: string; message?: string; details?: Array<{field: string; message: string}> } };
      const errorCode = axiosError?.error?.code ?? null;
      const details = axiosError?.error?.details ?? null;
      const backendMessage = axiosError?.error?.message ?? errorMessage ?? "Đăng ký thất bại";

      console.error("Register failed:", errorCode, backendMessage);
      dispatch(loginFailure(backendMessage));
      return { success: false, error: backendMessage, errorCode, details };
    }
  };

  return { user, login, logout, register, loading };
}
