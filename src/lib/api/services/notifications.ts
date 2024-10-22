// src/lib/api/services/notifications.ts
import { apiClient } from '../client';
import type { ApiResponse } from '../types/common';

export async function getNotifications(page: number = 1, limit: number = 10) {
  try {
    const response = await apiClient.get('/api/notifications', {
      params: { page, limit },
    });
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.error || 'Failed to fetch notifications' };
  }
}

export async function createNotification(message: string, userIds: number[]) {
  try {
    const response = await apiClient.post('/api/notifications', {
      message,
      userIds,
    });
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.error || 'Failed to create notification' };
  }
}