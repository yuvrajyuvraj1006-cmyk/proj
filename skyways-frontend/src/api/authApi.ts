import api from './apiConfig';
import type { ApiResponse, AuthResponse, LoginRequest, RegisterRequest, UserProfile } from '../types';

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<ApiResponse<AuthResponse>>('/auth/login', data).then((r) => r.data.data),

  register: (data: RegisterRequest) =>
    api.post<ApiResponse<AuthResponse>>('/auth/register', data).then((r) => r.data.data),

  getProfile: () =>
    api.get<ApiResponse<UserProfile>>('/users/me').then((r) => r.data.data),

  updateProfile: (data: Partial<UserProfile>) =>
    api.put<ApiResponse<UserProfile>>('/users/me', data).then((r) => r.data.data),
};
