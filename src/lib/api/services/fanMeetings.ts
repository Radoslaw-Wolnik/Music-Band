// src/lib/api/services/fanMeetings.ts
import { apiClient } from '../client';
import type { ApiResponse, PaginatedResponse } from '../types/common';

export async function getFanMeetings(page: number = 1, limit: number = 10) {
  try {
    const response = await apiClient.get('/api/fan-meetings', {
      params: { page, limit },
    });
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.error || 'Failed to fetch fan meetings' };
  }
}

export async function createFanMeeting(data: {
  date: string;
  description: string;
  maxAttendees: number;
}) {
  try {
    const response = await apiClient.post('/api/fan-meetings', data);
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.error || 'Failed to create fan meeting' };
  }
}