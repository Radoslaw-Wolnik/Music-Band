// src/lib/api/services/analytics.ts
import { apiClient } from '../client';
import type { ApiResponse } from '../types/common';

export async function getAnalytics(startDate?: string, endDate?: string) {
  try {
    const response = await apiClient.get('/api/analytics', {
      params: { startDate, endDate },
    });
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.error || 'Failed to fetch analytics' };
  }
}