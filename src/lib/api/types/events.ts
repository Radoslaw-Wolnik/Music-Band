// src/lib/api/types/events.ts
export interface CreateEventRequest {
    name: string;
    description: string;
    date: string;
    endDate: string;
    venueId: number;
    ticketPrices: Record<string, number>;
    eventPlan?: Array<{
      time: string;
      name: string;
    }>;
    defaultPhoto?: string;
    isPatronOnly: boolean;
  }
  
  export interface EventResponse {
    id: number;
    name: string;
    description: string;
    date: Date;
    endDate: Date;
    venue: {
      name: string;
      address: string;
      capacity: number;
    };
    ticketPrices: Record<string, number>;
    eventPlan: Array<{
      time: Date;
      name: string;
    }>;
    defaultPhoto?: string;
    isPatronOnly: boolean;
  }
  