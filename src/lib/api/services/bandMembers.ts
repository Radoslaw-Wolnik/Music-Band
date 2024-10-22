// src/lib/api/services/bandMembers.ts
import { apiClient } from '../client';
import type { ApiResponse } from '../types/common';

interface BandMemberProfile {
  id: number;
  user: {
    name: string;
    username: string;
    profilePicture?: string;
  };
  instrument?: string;
  bio?: string;
}

export async function getBandMember(id: number) {
  try {
    const response = await apiClient.get(`/api/band-members/${id}`);
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.error || 'Failed to fetch band member' };
  }
}

export async function updateBandMember(id: number, data: {
  instrument?: string;
  bio?: string;
}) {
  try {
    const response = await apiClient.put(`/api/band-members/${id}`, data);
    return { data: response.data };
  } catch (error: any) {
    return { error: error.response?.data?.error || 'Failed to update band member' };
  }
}
