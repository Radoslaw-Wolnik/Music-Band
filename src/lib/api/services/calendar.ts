// src/lib/api/services/calendar.ts
import { apiClient } from '../client';
import type { ApiResponse } from '../types/common';

interface CalendarEvent {
    id: number;
    name: string;
    description: string;
    date: Date;
    endDate: Date;
    venue: {
      name: string;
      address: string;
    };
  }
  
  export const calendarService = {
    async getEvents(month: string, year: string): Promise<ApiResponse<CalendarEvent[]>> {
      try {
        const response = await apiClient.get('/api/calendar', {
          params: { month, year },
        });
        return { data: response.data };
      } catch (error: any) {
        return { error: error.response?.data?.error || 'Failed to fetch calendar events' };
      }
    },
  };
  