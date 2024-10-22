import { SubscriptionTier, UserRole } from '@prisma/client';
// src/lib/api/types/user.ts
export interface UserProfile {
    id: number;
    email: string;
    name: string;
    surname: string;
    username: string;
    profilePicture?: string;
    role: UserRole;
    bandMember?: {
      id: number;
      instrument: string;
      bio: string;
    };
    subscription?: {
      tier: SubscriptionTier;
      startDate: Date;
      endDate: Date;
    };
  }
  
  export interface UpdateProfileRequest {
    name?: string;
    profilePicture?: string;
  }