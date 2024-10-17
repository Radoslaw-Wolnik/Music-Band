// app/types/custom.ts (or global.ts, depending on what you prefer)
import { User, Event, BlogPost, Ticket } from './prisma';

// Smaller type excluding sensitive data from User
export type UserWithoutSensitiveData = Omit<User, 'password' | 'tokens'>;

// Basic info for User (for frontend display purposes)
export type BasicUserInfo = Pick<User, 'id' | 'email' | 'name' | 'profilePicture'>;

// Event without plan items (if you don't need them in some contexts)
export type EventWithoutPlan = Omit<Event, 'eventPlan'>;

// BlogPost for public view (no updatedAt field)
export type BlogPostPublic = Omit<BlogPost, 'updatedAt'>;

// Ticket without price and seat (for frontend display)
export type SimpleTicket = Pick<Ticket, 'id' | 'status' | 'purchasedAt'>;
