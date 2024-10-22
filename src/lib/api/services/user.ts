// src/lib/api/services/user.ts
import { apiClient } from '../client';
import type { UserProfile, UpdateProfileRequest } from '../types/user';
import type { ApiResponse } from '../types/common';

export async function getUserProfile() {
  try {
    const response = await apiClient.get<UserProfile>('/api/user/profile');
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.error || 'Failed to fetch profile' };
  }
}

export async function updateUserProfile(data: UpdateProfileRequest) {
  try {
    const response = await apiClient.put<UserProfile>('/api/user/profile', data);
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.error || 'Failed to update profile' };
  }
}

export async function uploadUserProfilePicture(file: File) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/api/user/profile-picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.error || 'Failed to upload profile picture' };
  }
}
