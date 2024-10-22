// src/lib/api/services/venues.ts
import { apiClient } from '../client';
import type { ApiResponse } from '../types/common';
interface Venue {
    id: number;
    name: string;
    address: string;
    capacity: number;
    layout: any;
  }
  
  export const venueService = {
    async getVenues(): Promise<ApiResponse<Venue[]>> {
      try {
        const response = await apiClient.get('/api/venues');
        return { data: response.data };
      } catch (error: any) {
        return { error: error.response?.data?.error || 'Failed to fetch venues' };
      }
    },
  
    async createVenue(data: {
      name: string;
      address: string;
      capacity: number;
      layout: any;
    }): Promise<ApiResponse<Venue>> {
      try {
        const response = await apiClient.post('/api/venues', data);
        return { data: response.data };
      } catch (error: any) {
        return { error: error.response?.data?.error || 'Failed to create venue' };
      }
    },
  
    async updateVenue(id: number, data: Partial<Venue>): Promise<ApiResponse<Venue>> {
      try {
        const response = await apiClient.put(`/api/venues/${id}`, data);
        return { data: response.data };
      } catch (error: any) {
        return { error: error.response?.data?.error || 'Failed to update venue' };
      }
    },
  
    async deleteVenue(id: number): Promise<ApiResponse<void>> {
      try {
        await apiClient.delete(`/api/venues/${id}`);
        return {};
      } catch (error: any) {
        return { error: error.response?.data?.error || 'Failed to delete venue' };
      }
    },
  
    async updateVenueLayout(id: number, layout: any): Promise<ApiResponse<Venue>> {
      try {
        const response = await apiClient.put(`/api/venues/${id}/layout`, { layout });
        return { data: response.data };
      } catch (error: any) {
        return { error: error.response?.data?.error || 'Failed to update venue layout' };
      }
    },
  };
  