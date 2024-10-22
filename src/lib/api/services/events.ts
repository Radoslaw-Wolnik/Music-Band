// src/lib/api/services/events.ts
import { apiClient } from '../client';
import type { CreateEventRequest, EventResponse, } from '../types/events';
import type { ApiResponse, PaginatedResponse } from '../types/common';

export async function createEvent(data: CreateEventRequest) {
  try {
    const response = await apiClient.post<EventResponse>('/api/events', data);
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.error || 'Failed to create event' };
  }
}

export async function getEvents(params?: {
  page?: number;
  limit?: number;
  search?: string;
  venueId?: number;
  startDate?: string;
  endDate?: string;
}) {
  try {
    const response = await apiClient.get('/api/events', { params });
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.error || 'Failed to fetch events' };
  }
}

export async function getEventById(id: number) {
  try {
    const response = await apiClient.get(`/api/events/${id}`);
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.error || 'Failed to fetch event' };
  }
}

export async function updateEvent(id: number, data: Partial<CreateEventRequest>) {
  try {
    const response = await apiClient.put(`/api/events/${id}`, data);
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.error || 'Failed to update event' };
  }
}

export async function deleteEvent(id: number) {
  try {
    await apiClient.delete(`/api/events/${id}`);
    return {};
  } catch (error: any) {
    return { error: error.response?.data?.error || 'Failed to delete event' };
  }
}