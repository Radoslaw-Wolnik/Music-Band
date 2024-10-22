// src/lib/api/services/blog.ts
import { apiClient } from '../client';
import type { ApiResponse } from '../types/common';
import { SubscriptionTier } from '@prisma/client';

export const blogService = {
    async createPost(data: {
      title: string;
      content: string;
      photos?: string[];
      videos?: string[];
      accessTier: SubscriptionTier;
    }) {
      try {
        const response = await apiClient.post('/api/blog-posts', data);
        return { data: response.data };
      } catch (error: any) {
        return { error: error.response?.data?.error || 'Failed to create blog post' };
      }
    },
  
    async getPosts(params?: {
      page?: number;
      limit?: number;
      search?: string;
      accessTier?: SubscriptionTier;
    }) {
      try {
        const response = await apiClient.get('/api/blog-posts', { params });
        return { data: response.data };
      } catch (error: any) {
        return { error: error.response?.data?.error || 'Failed to fetch blog posts' };
      }
    },
  
    async getPost(id: number) {
      try {
        const response = await apiClient.get(`/api/blog-posts/${id}`);
        return { data: response.data };
      } catch (error: any) {
        return { error: error.response?.data?.error || 'Failed to fetch blog post' };
      }
    },
  
    async updatePost(id: number, data: {
      title?: string;
      content?: string;
      photos?: string[];
      videos?: string[];
      accessTier?: SubscriptionTier;
    }) {
      try {
        const response = await apiClient.put(`/api/blog-posts/${id}`, data);
        return { data: response.data };
      } catch (error: any) {
        return { error: error.response?.data?.error || 'Failed to update blog post' };
      }
    },
  
    async deletePost(id: number) {
      try {
        await apiClient.delete(`/api/blog-posts/${id}`);
        return {};
      } catch (error: any) {
        return { error: error.response?.data?.error || 'Failed to delete blog post' };
      }
    },
  };
  