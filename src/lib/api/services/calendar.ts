// src/lib/api/services/calendar.ts
import { apiClient } from '../client';
import type { ApiResponse } from '../types/common';

export async function getCalendarEvents(month: string, year: string) {
  try {
    const response = await apiClient.get('/api/calendar', {
      params: { month, year },
    });
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.error || 'Failed to fetch calendar events' };
  }
}
