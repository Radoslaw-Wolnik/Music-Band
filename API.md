# API Documentation

## Table of Contents
1. [Authentication](#authentication)
2. [Analytics Routes](#analytics-routes)
3. [Band Member Routes](#band-member-routes)
4. [Blog Post Routes](#blog-post-routes)
5. [Calendar Routes](#calendar-routes)
6. [Event Routes](#event-routes)
7. [Fan Meeting Routes](#fan-meeting-routes)
8. [Merchandise Routes](#merchandise-routes)
9. [Notification Routes](#notification-routes)
10. [Practice Routes](#practice-routes)
11. [Subscription Routes](#subscription-routes)
12. [Ticket Routes](#ticket-routes)
13. [User Routes](#user-routes)
14. [Venue Routes](#venue-routes)

## Authentication

Most endpoints require authentication via NextAuth.js. Authentication is handled using session tokens. When a user logs in successfully, a session will be created and managed by NextAuth.js.

Authentication requirement is indicated for each endpoint as follows:
- 🔓 No authentication required
- 🔒 Authentication required
- 🔑 Manager authentication required
- 👤 Band member authentication required
- ⭐ Patron authentication required

## Analytics Routes

### Get Analytics
```
🔑 GET /api/analytics
Query Parameters: { startDate?: string, endDate?: string }
Response: {
  ticketSales: {
    totalRevenue: number,
    totalSold: number
  },
  merchSales: {
    totalRevenue: number,
    totalSold: number
  },
  subscriberGrowth: Record<SubscriptionTier, number>
}
```

## Band Member Routes

### Get Band Member
```
🔓 GET /api/band-members/:id
Response: {
  id: number,
  user: User,
  instrument: string,
  bio: string
}
```

### Update Band Member Profile
```
👤 PUT /api/band-members/:id
Body: {
  instrument?: string,
  bio?: string
}
Response: BandMember
```

## Blog Post Routes

### Get Blog Posts
```
🔓 GET /api/blog-posts
Query Parameters: {
  page?: number,
  limit?: number,
  search?: string,
  accessTier?: SubscriptionTier
}
Response: {
  posts: BlogPost[],
  pagination: PaginationData
}
```

### Get Single Blog Post
```
🔓 GET /api/blog-posts/:id
Response: BlogPost & { user: User }
```

### Create Blog Post
```
🔒 POST /api/blog-posts
Body: {
  title: string,
  content: string,
  photos?: string[],
  videos?: string[],
  accessTier: SubscriptionTier
}
Response: BlogPost
```

### Update Blog Post
```
🔒 PUT /api/blog-posts/:id
Body: {
  title?: string,
  content?: string,
  photos?: string[],
  videos?: string[],
  accessTier?: SubscriptionTier
}
Response: BlogPost
```

### Delete Blog Post
```
🔒 DELETE /api/blog-posts/:id
Response: { message: string }
```

### Upload Blog Post Image
```
🔒 POST /api/blog-posts/:id/images
Body: FormData with 'file' field
Response: { photos: string[] }
```

## Calendar Routes

### Get Calendar Events
```
🔓 GET /api/calendar
Query Parameters: { month: string, year: string }
Response: Event[]
```

## Event Routes

### Get Events
```
🔓 GET /api/events
Query Parameters: {
  page?: number,
  limit?: number,
  search?: string,
  venueId?: string,
  startDate?: string,
  endDate?: string
}
Response: {
  events: Event[],
  pagination: PaginationData
}
```

### Get Single Event
```
🔓 GET /api/events/:id
Response: Event & {
  venue: Venue,
  eventPlan: EventPlanItem[],
  tickets: Ticket[]
}
```

### Create Event
```
🔑 POST /api/events
Body: {
  name: string,
  description: string,
  date: string,
  endDate: string,
  venueId: number,
  ticketPrices: Record<string, number>,
  eventPlan?: { time: string, name: string }[],
  defaultPhoto?: string,
  isPatronOnly: boolean
}
Response: Event
```

### Update Event
```
🔑 PUT /api/events/:id
Body: {
  name?: string,
  description?: string,
  date?: string,
  endDate?: string,
  venueId?: number,
  ticketPrices?: Record<string, number>,
  eventPlan?: { time: string, name: string }[],
  defaultPhoto?: string,
  isPatronOnly?: boolean
}
Response: Event
```

### Delete Event
```
🔑 DELETE /api/events/:id
Response: { message: string }
```

### Upload Event Image
```
🔑 POST /api/events/:id/images
Body: FormData with 'file' field
Response: { defaultPhoto: string }
```

## Fan Meeting Routes

### Get Fan Meetings
```
⭐ GET /api/fan-meetings
Query Parameters: { page?: number, limit?: number }
Response: {
  fanMeetings: FanMeeting[],
  pagination: PaginationData
}
```

### Create Fan Meeting
```
🔑 POST /api/fan-meetings
Body: {
  date: string,
  description: string,
  maxAttendees: number
}
Response: FanMeeting
```

## Merchandise Routes

### Get Merchandise Items
```
🔓 GET /api/merch
Response: MerchItem[]
```

### Create Merchandise Item
```
🔑 POST /api/merch
Body: {
  name: string,
  description: string,
  price: number,
  stock: number,
  image?: string
}
Response: MerchItem
```

### Update Merchandise Item
```
🔑 PUT /api/merch/:id
Body: {
  name?: string,
  description?: string,
  price?: number,
  stock?: number,
  image?: string
}
Response: MerchItem
```

### Delete Merchandise Item
```
🔑 DELETE /api/merch/:id
Response: { message: string }
```

### Purchase Merchandise
```
🔒 POST /api/merch/purchase
Body: {
  itemId: number,
  quantity: number
}
Response: { message: string, purchaseId: number }
```

### Upload Merchandise Image
```
🔑 POST /api/merch/:id/images
Body: FormData with 'file' field
Response: { image: string }
```

## Notification Routes

### Get Notifications
```
🔒 GET /api/notifications
Query Parameters: { page?: number, limit?: number }
Response: {
  notifications: Notification[],
  pagination: PaginationData
}
```

### Create Notification
```
🔑 POST /api/notifications
Body: {
  message: string,
  userIds: number[]
}
Response: { message: string }
```

## Practice Routes

### Get Practices
```
👤 GET /api/practices
Query Parameters: { page?: number, limit?: number }
Response: {
  practices: Practice[],
  pagination: PaginationData
}
```

### Schedule Practice
```
👤 POST /api/practices
Body: {
  date: string,
  duration: number,
  notes?: string
}
Response: Practice
```

### Update Practice
```
👤 PUT /api/practices/:id
Body: {
  date?: string,
  duration?: number,
  notes?: string
}
Response: Practice
```

### Delete Practice
```
👤 DELETE /api/practices/:id
Response: { message: string }
```

## Subscription Routes

### Get Subscription
```
🔒 GET /api/subscriptions
Response: Subscription
```

### Create Subscription
```
🔒 POST /api/subscriptions
Body: { tier: SubscriptionTier }
Response: { message: string, purchaseId: number }
```

### Update Subscription
```
🔒 PUT /api/subscriptions/:id
Body: { tier: SubscriptionTier }
Response: { message: string, purchaseId: number }
```

### Cancel Subscription
```
🔒 DELETE /api/subscriptions/:id
Response: { message: string }
```

## Ticket Routes

### Get User Tickets
```
🔒 GET /api/tickets
Query Parameters: { page?: number, limit?: number }
Response: {
  tickets: Ticket[],
  pagination: PaginationData
}
```

### Get Ticket Details
```
🔒 GET /api/tickets/:id
Response: FormattedTicket
```

### Purchase Ticket
```
🔒 POST /api/tickets
Body: {
  eventId: number,
  seat: string,
  quantity: number
}
Response: { message: string, purchaseId: number }
```

### Group Purchase Tickets
```
🔒 POST /api/tickets/group-purchase
Body: {
  eventId: number,
  purchases: { seat: string, quantity: number }[]
}
Response: { message: string, purchaseId: number }
```

### Refund Ticket
```
🔒 POST /api/tickets/:id/refund
Response: { message: string }
```

## User Routes

### Get User Profile
```
🔒 GET /api/user/profile
Response: User & {
  bandMember?: BandMember,
  patron?: Patron,
  tickets: Ticket[],
  posts: BlogPost[],
  subscription?: Subscription
}
```

### Update User Profile
```
🔒 PUT /api/user/profile
Body: {
  name?: string,
  profilePicture?: string
}
Response: User
```

### Upload Profile Picture
```
🔒 POST /api/user/profile-picture
Body: FormData with 'file' field
Response: { profilePicture: string }
```

### Search Users
```
🔒 GET /api/user/search
Query Parameters: { q: string }
Response: User[]
```

## Venue Routes

### Get Venues
```
🔓 GET /api/venues
Response: Venue[]
```

### Get Venue Details
```
🔓 GET /api/venues/:id
Response: Venue & { events: Event[] }
```

### Create Venue
```
🔑 POST /api/venues
Body: {
  name: string,
  address: string,
  capacity: number,
  layout: object
}
Response: Venue
```

### Update Venue
```
🔑 PUT /api/venues/:id
Body: {
  name?: string,
  address?: string,
  capacity?: number,
  layout?: object
}
Response: Venue
```

### Delete Venue
```
🔑 DELETE /api/venues/:id
Response: { message: string }
```

### Update Venue Layout
```
🔑 PUT /api/venues/:id/layout
Body: { layout: object }
Response: Venue
```