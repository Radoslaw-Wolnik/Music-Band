// src/lib/api/services/subscriptions.ts
import { apiClient } from '../client';
import type { ApiResponse } from '../types/common';
import { SubscriptionTier } from '@prisma/client';

export const subscriptionService = {
    async createSubscription(tier: SubscriptionTier) {
      try {
        const response = await apiClient.post('/api/subscriptions', { tier });
        return { data: response.data };
      } catch (error: any) {
        return { error: error.response?.data?.error || 'Failed to create subscription' };
      }
    },
  
    async updateSubscription(id: number, tier: SubscriptionTier) {
      try {
        const response = await apiClient.put(`/api/subscriptions/${id}`, { tier });
        return { data: response.data };
      } catch (error: any) {
        return { error: error.response?.data?.error || 'Failed to update subscription' };
      }
    },
  
    async cancelSubscription(id: number) {
      try {
        await apiClient.delete(`/api/subscriptions/${id}`);
        return {};
      } catch (error: any) {
        return { error: error.response?.data?.error || 'Failed to cancel subscription' };
      }
    },
  };