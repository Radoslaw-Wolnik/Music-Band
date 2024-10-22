# Band Management System API Documentation

## Table of Contents
1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Events](#events)
4. [Tickets](#tickets)
5. [Merchandise](#merchandise)
6. [Blog Posts](#blog-posts)
7. [Band Members](#band-members)
8. [Fan Meetings](#fan-meetings)
9. [Subscriptions](#subscriptions)
10. [Analytics](#analytics)
11. [Notifications](#notifications)
12. [Calendar](#calendar)

## Authentication

### Register User
```http
POST /api/auth/register
```
**Body:**
```typescript
{
  email: string;
  password: string;
  name: string;
  surname: string;
  username: string;
  role?: UserRole; // Defaults to FAN
}
```
**Response:** `201 Created`
```typescript
{
  message: string;
  user: {
    id: number;
    email: string;
    username: string;
    role: UserRole;
  }
}
```

### Login
```http
POST /api/auth/login
```
**Body:**
```typescript
{
  email: string;
  password: string;
}
```
**Response:** `200 OK`
```typescript
{
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    subscriptionTier?: SubscriptionTier;
  };
  token: string;
}
```

## User Management

### Get User Profile
```http
GET /api/user/profile
```
**Response:** `200 OK`
```typescript
{
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
```

### Update Profile
```http
PUT /api/user/profile
```
**Body:**
```typescript
{
  name?: string;
  profilePicture?: string;
}
```

### Upload Profile Picture
```http
POST /api/user/profile-picture
```
**Body:** `FormData`
- file: Image file

## Events

### Create Event
```http
POST /api/events
```
**Body:**
```typescript
{
  name: string;
  description: string;
  date: string;
  endDate: string;
  venueId: number;
  ticketPrices: {
    [key: string]: number;
  };
  eventPlan?: {
    time: string;
    name: string;
  }[];
  defaultPhoto?: string;
  isPatronOnly: boolean;
}
```

### Get Events
```http
GET /api/events
```
**Query Parameters:**
- page?: number
- limit?: number
- search?: string
- venueId?: number
- startDate?: string
- endDate?: string

**Response:** `200 OK`
```typescript
{
  events: Event[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
  };
}
```

### Get Event Details
```http
GET /api/events/{id}
```
**Response:** `200 OK`
```typescript
{
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
  ticketPrices: {
    [key: string]: number;
  };
  eventPlan: {
    time: Date;
    name: string;
  }[];
  defaultPhoto?: string;
  isPatronOnly: boolean;
}
```

## Tickets

### Purchase Ticket
```http
POST /api/tickets
```
**Body:**
```typescript
{
  eventId: number;
  seat: string;
  quantity: number;
}
```

### Get User Tickets
```http
GET /api/tickets
```
**Query Parameters:**
- page?: number
- limit?: number

**Response:** `200 OK`
```typescript
{
  tickets: {
    id: number;
    event: {
      name: string;
      date: Date;
      venue: {
        name: string;
        address: string;
      };
    };
    seat: string;
    price: number;
    status: TicketStatus;
    purchasedAt: Date;
  }[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
  };
}
```

### Group Ticket Purchase
```http
POST /api/tickets/group-purchase
```
**Body:**
```typescript
{
  eventId: number;
  purchases: {
    seat: string;
    quantity: number;
  }[];
}
```

### Refund Ticket
```http
POST /api/tickets/{id}/refund
```

## Merchandise

### List Merchandise
```http
GET /api/merch
```
**Response:** `200 OK`
```typescript
{
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
}[]
```

### Purchase Merchandise
```http
POST /api/merch/purchase
```
**Body:**
```typescript
{
  itemId: number;
  quantity: number;
}
```

## Blog Posts

### Create Blog Post
```http
POST /api/blog-posts
```
**Body:**
```typescript
{
  title: string;
  content: string;
  photos?: string[];
  videos?: string[];
  accessTier: SubscriptionTier;
}
```

### Get Blog Posts
```http
GET /api/blog-posts
```
**Query Parameters:**
- page?: number
- limit?: number
- search?: string
- accessTier?: SubscriptionTier

**Response:** `200 OK`
```typescript
{
  posts: {
    id: number;
    title: string;
    content: string;
    photos: string[];
    videos: string[];
    accessTier: SubscriptionTier;
    author: {
      id: number;
      username: string;
      profilePicture?: string;
    };
    createdAt: Date;
  }[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
  };
}
```

## Band Members

### Get Band Member Profile
```http
GET /api/band-members/{id}
```
**Response:** `200 OK`
```typescript
{
  id: number;
  user: {
    name: string;
    username: string;
    profilePicture?: string;
  };
  instrument?: string;
  bio?: string;
}
```

### Update Band Member Profile
```http
PUT /api/band-members/{id}
```
**Body:**
```typescript
{
  instrument?: string;
  bio?: string;
}
```

## Fan Meetings

### Create Fan Meeting
```http
POST /api/fan-meetings
```
**Body:**
```typescript
{
  date: string;
  description: string;
  maxAttendees: number;
}
```

### Get Fan Meetings
```http
GET /api/fan-meetings
```
**Query Parameters:**
- page?: number
- limit?: number

## Subscriptions

### Create Subscription
```http
POST /api/subscriptions
```
**Body:**
```typescript
{
  tier: SubscriptionTier;
}
```

### Update Subscription
```http
PUT /api/subscriptions/{id}
```
**Body:**
```typescript
{
  tier: SubscriptionTier;
}
```

## Analytics

### Get Analytics
```http
GET /api/analytics
```
**Query Parameters:**
- startDate?: string
- endDate?: string

**Response:** `200 OK`
```typescript
{
  ticketSales: {
    totalRevenue: number;
    totalSold: number;
  };
  merchSales: {
    totalRevenue: number;
    totalSold: number;
  };
  subscriberGrowth: {
    [SubscriptionTier]: number;
  };
}
```

## Notifications

### Get User Notifications
```http
GET /api/notifications
```
**Query Parameters:**
- page?: number
- limit?: number

**Response:** `200 OK`
```typescript
{
  notifications: {
    id: number;
    message: string;
    isRead: boolean;
    createdAt: Date;
  }[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
  };
}
```

### Create Notification
```http
POST /api/notifications
```
**Body:**
```typescript
{
  message: string;
  userIds: number[];
}
```

## Calendar

### Get Calendar Events
```http
GET /api/calendar
```
**Query Parameters:**
- month: string
- year: string

**Response:** `200 OK`
```typescript
{
  id: number;
  name: string;
  description: string;
  date: Date;
  endDate: Date;
  venue: {
    name: string;
    address: string;
  };
}[]
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```typescript
{
  error: string;
}
```

### 401 Unauthorized
```typescript
{
  error: string;
}
```

### 403 Forbidden
```typescript
{
  error: string;
}
```

### 404 Not Found
```typescript
{
  error: string;
}
```

### 500 Internal Server Error
```typescript
{
  error: "Internal server error";
}
```