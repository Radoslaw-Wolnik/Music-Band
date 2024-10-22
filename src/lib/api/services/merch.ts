// src/lib/api/services/merch.ts
import { apiClient } from '../client';
import type { ApiResponse } from '../types/common';

export async function getMerchItems() {
  try {
    const response = await apiClient.get('/api/merch');
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.error || 'Failed to fetch merch items' };
  }
}

export async function createMerchItem(data: {
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
}) {
  try {
    const response = await apiClient.post('/api/merch', data);
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.error || 'Failed to create merch item' };
  }
}

export async function purchaseMerch(itemId: number, quantity: number) {
  try {
    const response = await apiClient.post('/api/merch/purchase', {
      itemId,
      quantity,
    });
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.error || 'Failed to purchase merch' };
  }
}