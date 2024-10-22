// src/lib/api/services/practices.ts
import { apiClient } from '../client';
import type { ApiResponse, PaginatedResponse } from '../types/common';

interface Practice {
    id: number;
    bandMemberId: number;
    date: Date;
    duration: number;
    notes?: string;
  }
  
  export const practiceService = {
    async getPractices(page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<Practice>>> {
      try {
        const response = await apiClient.get('/api/practices', {
          params: { page, limit },
        });
        return { data: response.data };
      } catch (error: any) {
        return { error: error.response?.data?.error || 'Failed to fetch practices' };
      }
    },
  
    async createPractice(data: {
      date: string;
      duration: number;
      notes?: string;
    }): Promise<ApiResponse<Practice>> {
      try {
        const response = await apiClient.post('/api/practices', data);
        return { data: response.data };
      } catch (error: any) {
        return { error: error.response?.data?.error || 'Failed to create practice' };
      }
    },
  
    async updatePractice(id: number, data: {
      date?: string;
      duration?: number;
      notes?: string;
    }): Promise<ApiResponse<Practice>> {
      try {
        const response = await apiClient.put(`/api/practices/${id}`, data);
        return { data: response.data };
      } catch (error: any) {
        return { error: error.response?.data?.error || 'Failed to update practice' };
      }
    },
  
    async deletePractice(id: number): Promise<ApiResponse<void>> {
      try {
        await apiClient.delete(`/api/practices/${id}`);
        return {};
      } catch (error: any) {
        return { error: error.response?.data?.error || 'Failed to delete practice' };
      }
    },
  };