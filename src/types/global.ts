// src/types/custom.ts

import { User, Event, BlogPost, Ticket, UserRole, SubscriptionTier, TicketStatus } from './prisma';

// Basic user info for public display
export type PublicUserInfo = Pick<User, 'id' | 'username' | 'name' | 'profilePicture' | 'role' | 'createdAt'>;

// User info for authenticated users (excludes password and sensitive data)
export type AuthenticatedUser = Omit<User, 'password' | 'tokens'> & {
  subscription?: {
    tier: SubscriptionTier;
    endDate: Date;
  };
};

// User info for JWT token payload
export type JWTPayload = {
  id: string;
  email: string;
  role: UserRole;
  subscriptionTier?: SubscriptionTier;
};

// Event info without sensitive data
export type PublicEventInfo = Omit<Event, 'ticketPrices'> & {
  venue: {
    id: number;
    name: string;
    address: string;
  };
};

// Event info with ticket prices (for authenticated users)
export type AuthenticatedEventInfo = PublicEventInfo & {
  ticketPrices: Record<string, number>;
};

export type TicketPrices = Record<string, number>;

// Blog post for public view
export type PublicBlogPost = Omit<BlogPost, 'updatedAt'> & {
  author: PublicUserInfo;
};

// Simplified ticket info for user's view
export type UserTicket = Pick<Ticket, 'id' | 'seat' | 'price' | 'status' | 'purchasedAt'> & {
  event: Pick<Event, 'id' | 'name' | 'date' | 'endDate'>;
};

export type FormattedTicket = {
  id: number;
  eventName: string;
  eventDate: Date;
  eventEndDate: Date;
  venue: {
    name: string;
    address: string;
  };
  seat: string;
  price: number;
  purchasedAt: Date;
  status: TicketStatus;
  user: {
    id: number;
    name: string | null;
    email: string;
  };
};


// Subscription info
export type SubscriptionInfo = {
  id: number;
  userId: number;
  tier: SubscriptionTier;
  startDate: Date;
  endDate: Date;
};

// Notification type
export type SmallNotification = {
  id: number;
  userId: number;
  message: string;
  isRead: boolean;
  createdAt: Date;
};

// Analytics data type
export type AnalyticsData = {
  ticketSales: {
    totalRevenue: number;
    totalSold: number;
  };
  merchSales: {
    totalRevenue: number;
    totalSold: number;
  };
  subscriberGrowth: Record<SubscriptionTier, number>;
};



export { UserRole, SubscriptionTier, TicketStatus };