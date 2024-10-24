// src/lib/api/services/practices.ts
import { apiClient } from '../client';
import type { ApiResponse, PaginatedResponse } from '../types/common';

export async function getPractices(page: number = 1, limit: number = 10) {
  try {
    const response = await apiClient.get('/api/practices', {
      params: { page, limit },
    });
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.error || 'Failed to fetch practices' };
  }
}

export async function createPractice(data: {
  date: string;
  duration: number;
  notes?: string;
}) {
  try {
    const response = await apiClient.post('/api/practices', data);
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.error || 'Failed to create practice' };
  }
}

export async function updatePractice(id: number, data: {
  date?: string;
  duration?: number;
  notes?: string;
}) {
  try {
    const response = await apiClient.put(`/api/practices/${id}`, data);
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.error || 'Failed to update practice' };
  }
}

export async function deletePractice(id: number) {
  try {
    await apiClient.delete(`/api/practices/${id}`);
    return {};
  } catch (error: any) {
    return { error: error.response?.data?.error || 'Failed to delete practice' };
  }
}