// src/lib/api/services/tickets.ts
import { apiClient } from '../client';
import type { ApiResponse } from '../types/common';

export const ticketService = {
    async purchaseTicket(eventId: number, seat: string, quantity: number) {
      try {
        const response = await apiClient.post('/api/tickets', {
          eventId,
          seat,
          quantity,
        });
        return { data: response.data };
      } catch (error: any) {
        return { error: error.response?.data?.error || 'Failed to purchase ticket' };
      }
    },
  
    async purchaseGroupTickets(eventId: number, purchases: Array<{ seat: string; quantity: number }>) {
      try {
        const response = await apiClient.post('/api/tickets/group-purchase', {
          eventId,
          purchases,
        });
        return { data: response.data };
      } catch (error: any) {
        return { error: error.response?.data?.error || 'Failed to purchase tickets' };
      }
    },
  
    async getUserTickets(page: number = 1, limit: number = 10) {
      try {
        const response = await apiClient.get('/api/tickets', {
          params: { page, limit },
        });
        return { data: response.data };
      } catch (error: any) {
        return { error: error.response?.data?.error || 'Failed to fetch tickets' };
      }
    },
  
    async refundTicket(ticketId: number) {
      try {
        const response = await apiClient.post(`/api/tickets/${ticketId}/refund`);
        return { data: response.data };
      } catch (error: any) {
        return { error: error.response?.data?.error || 'Failed to refund ticket' };
      }
    },
  };