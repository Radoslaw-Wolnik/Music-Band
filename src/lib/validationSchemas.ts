import { z } from 'zod';
import { UserRole, SubscriptionTier } from '@/types';

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  role: z.nativeEnum(UserRole),
});

export const subscriptionSchema = z.object({
  tier: z.nativeEnum(SubscriptionTier),
});

export const eventSchema = z.object({
  name: z.string().min(3),
  description: z.string(),
  date: z.date(),
  venueId: z.number().int().positive(),
  ticketPrices: z.record(z.string(), z.number().positive()),
});

// Add more schemas as needed

export type UserInput = z.infer<typeof userSchema>;
export type SubscriptionInput = z.infer<typeof subscriptionSchema>;
export type EventInput = z.infer<typeof eventSchema>;