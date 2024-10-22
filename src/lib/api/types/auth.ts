// src/lib/api/types/auth.ts
import { UserRole, SubscriptionTier } from '@prisma/client';

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  surname: string;
  username: string;
  role?: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    subscriptionTier?: SubscriptionTier;
  };
  token: string;
}