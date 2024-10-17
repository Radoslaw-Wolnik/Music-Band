import { z } from 'zod';
import { UserRole, SubscriptionTier } from '@/types';

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  surname: z.string().min(2),
  username: z.string().min(3).max(20),
  role: z.nativeEnum(UserRole).optional().default(UserRole.FAN),
});

export const subscriptionSchema = z.object({
  tier: z.nativeEnum(SubscriptionTier),
});

export const ticketPricesSchema = z.record(z.string(), z.number().positive());


export const eventPlanItemSchema = z.object({
  time: z.string().datetime(),
  name: z.string().min(1, "Event plan item name is required"),
});

export const eventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().datetime(),
  endDate: z.string().datetime(),
  venueId: z.number().int().positive(),
  ticketPrices: ticketPricesSchema,
  eventPlan: z.array(eventPlanItemSchema).optional(),
  defaultPhoto: z.string().optional(),
  isPatronOnly: z.boolean().default(false),
});

export const ticketPurchaseSchema = z.object({
  eventId: z.number().int().positive(),
  seat: z.string(),
  quantity: z.number().int().positive().max(20),
});

export const groupTicketPurchaseSchema = z.object({
  eventId: z.number().int().positive(),
  purchases: z.array(z.object({
    seat: z.string(),
    quantity: z.number().int().positive(),
  })).min(1).refine(purchases => {
    const totalQuantity = purchases.reduce((sum, purchase) => sum + purchase.quantity, 0);
    return totalQuantity <= 20;
  }, { message: "Total quantity must not exceed 20 tickets" }),
});


// Add more schemas as needed

export type UserInput = z.infer<typeof userSchema>;
export type SubscriptionInput = z.infer<typeof subscriptionSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type TicketPurchaseInput = z.infer<typeof ticketPurchaseSchema>;
export type GroupTicketPurchaseInput = z.infer<typeof groupTicketPurchaseSchema>;
