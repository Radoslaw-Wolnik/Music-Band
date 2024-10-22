// src/lib/api/services/auth.ts
import { apiClient } from '../client';
import type { ApiResponse } from '../types/common';
import type {RegisterRequest, LoginRequest, AuthResponse} from '../types/auth'

export const authService = {
  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.post<AuthResponse>('/api/auth/register', data);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.error || 'Registration failed' };
    }
  },

  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.post<AuthResponse>('/api/auth/login', data);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.error || 'Login failed' };
    }
  },

  async logout(): Promise<void> {
    localStorage.removeItem('token');
  },
};
