// src/lib/api/services/auth.ts
import { apiClient } from '../client';
import type { ApiResponse } from '../types/common';
import type {RegisterRequest, LoginRequest, AuthResponse} from '../types/auth'

export async function register(data: RegisterRequest) {
  try {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', data);
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.error || 'Registration failed' };
  }
}

export async function login(data: LoginRequest) {
  try {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', data);
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.error || 'Login failed' };
  }
}

export function logout(): void {
  localStorage.removeItem('token');
}
