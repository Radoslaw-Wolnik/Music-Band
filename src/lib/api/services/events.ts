// src/lib/api/services/events.ts
import { apiClient } from '../client';
import type { CreateEventRequest, EventResponse, } from '../types/events';
import type { ApiResponse, PaginatedResponse } from '../types/common';

export const eventService = {
  async createEvent(data: CreateEventRequest): Promise<ApiResponse<EventResponse>> {
    try {
      const response = await apiClient.post<EventResponse>('/api/events', data);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.error || 'Failed to create event' };
    }
  },

  async getEvents(params?: {
    page?: number;
    limit?: number;
    search?: string;
    venueId?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<PaginatedResponse<EventResponse>>> {
    try {
      const response = await apiClient.get('/api/events', { params });
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.error || 'Failed to fetch events' };
    }
  },

  async getEventById(id: number): Promise<ApiResponse<EventResponse>> {
    try {
      const response = await apiClient.get(`/api/events/${id}`);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.error || 'Failed to fetch event' };
    }
  },

  async updateEvent(id: number, data: Partial<CreateEventRequest>): Promise<ApiResponse<EventResponse>> {
    try {
      const response = await apiClient.put(`/api/events/${id}`, data);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.error || 'Failed to update event' };
    }
  },

  async deleteEvent(id: number): Promise<ApiResponse<void>> {
    try {
      await apiClient.delete(`/api/events/${id}`);
      return {};
    } catch (error: any) {
      return { error: error.response?.data?.error || 'Failed to delete event' };
    }
  },
};