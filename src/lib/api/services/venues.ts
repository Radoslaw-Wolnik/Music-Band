// src/lib/api/services/venues.ts
import { apiClient } from '../client';
import type { ApiResponse } from '../types/common';
import { Venue } from '@prisma/client';

export async function getVenues() {
  try {
    const response = await apiClient.get('/api/venues');
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.error || 'Failed to fetch venues' };
  }
}

export async function createVenue(data: {
  name: string;
  address: string;
  capacity: number;
  layout: any;
}) {
  try {
    const response = await apiClient.post('/api/venues', data);
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.error || 'Failed to create venue' };
  }
}

export async function updateVenue(id: number, data: Partial<Venue>) {
  try {
    const response = await apiClient.put(`/api/venues/${id}`, data);
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.error || 'Failed to update venue' };
  }
}

export async function deleteVenue(id: number) {
  try {
    await apiClient.delete(`/api/venues/${id}`);
    return {};
  } catch (error: any) {
    return { error: error.response?.data?.error || 'Failed to delete venue' };
  }
}

export async function updateVenueLayout(id: number, layout: any) {
  try {
    const response = await apiClient.put(`/api/venues/${id}/layout`, { layout });
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.error || 'Failed to update venue layout' };
  }
}
