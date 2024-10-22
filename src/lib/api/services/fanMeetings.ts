// src/lib/api/services/fanMeetings.ts
import { apiClient } from '../client';
import type { ApiResponse, PaginatedResponse } from '../types/common';

interface FanMeeting {
    id: number;
    date: Date;
    description: string;
    maxAttendees: number;
    currentAttendees: number;
  }
  
  export const fanMeetingService = {
    async getFanMeetings(page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<FanMeeting>>> {
      try {
        const response = await apiClient.get('/api/fan-meetings', {
          params: { page, limit },
        });
        return { data: response.data };
      } catch (error: any) {
        return { error: error.response?.data?.error || 'Failed to fetch fan meetings' };
      }
    },
  
    async createFanMeeting(data: {
      date: string;
      description: string;
      maxAttendees: number;
    }): Promise<ApiResponse<FanMeeting>> {
      try {
        const response = await apiClient.post('/api/fan-meetings', data);
        return { data: response.data };
      } catch (error: any) {
        return { error: error.response?.data?.error || 'Failed to create fan meeting' };
      }
    },
  };