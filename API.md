# API Documentation

This document provides details on the available API endpoints for the Music Band Website.

## Table of Contents

1. [Authentication](#authentication)
2. [Users](#users)
3. [Events](#events)
4. [Tickets](#tickets)
5. [Merchandise](#merchandise)
6. [Band Members](#band-members)
7. [Practices](#practices)
8. [Blog Posts](#blog-posts)
9. [Fan Meetings](#fan-meetings)
10. [Analytics](#analytics)

## Authentication

### Register a new user

```
POST /api/auth/register
```

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

### Login

```
POST /api/auth/login
```

Request body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

## Users

### Get user profile

```
GET /api/user/profile
```

### Update user profile

```
PUT /api/user/profile
```

Request body:
```json
{
  "name": "Updated Name",
  "profilePicture": "https://example.com/profile.jpg"
}
```

## Events

### Get all events

```
GET /api/events
```

### Create a new event

```
POST /api/events
```

Request body:
```json
{
  "name": "Concert Name",
  "description": "Event description",
  "date": "2023-07-01T20:00:00Z",
  "endDate": "2023-07-01T23:00:00Z",
  "venueId": 1,
  "ticketPrices": {
    "VIP": 100,
    "General": 50
  },
  "defaultPhoto": "https://example.com/event.jpg",
  "isPatronOnly": false
}
```

### Get event details

```
GET /api/events/{id}
```

### Update an event

```
PUT /api/events/{id}
```

Request body: (same as create event)

### Delete an event

```
DELETE /api/events/{id}
```

## Tickets

### Purchase tickets

```
POST /api/tickets
```

Request body:
```json
{
  "eventId": 1,
  "seat": "VIP",
  "quantity": 2
}
```

### Get user's tickets

```
GET /api/tickets
```

### Refund a ticket

```
POST /api/tickets/{id}/refund
```

## Merchandise

### Get all merchandise items

```
GET /api/merch
```

### Create a new merchandise item

```
POST /api/merch
```

Request body:
```json
{
  "name": "T-Shirt",
  "description": "Band logo t-shirt",
  "price": 25.99,
  "stock": 100,
  "image": "https://example.com/tshirt.jpg"
}
```

### Update a merchandise item

```
PUT /api/merch/{id}
```

Request body: (same as create merchandise item)

### Delete a merchandise item

```
DELETE /api/merch/{id}
```

### Purchase merchandise

```
POST /api/merch/purchase
```

Request body:
```json
{
  "itemId": 1,
  "quantity": 2
}
```

## Band Members

### Get all band members

```
GET /api/band-members
```

### Get band member profile

```
GET /api/band-members/{id}
```

### Update band member profile

```
PUT /api/band-members/{id}
```

Request body:
```json
{
  "instrument": "Guitar",
  "bio": "Lead guitarist of the band"
}
```

## Practices

### Get all practices

```
GET /api/practices
```

### Schedule a practice

```
POST /api/practices
```

Request body:
```json
{
  "date": "2023-07-05T18:00:00Z",
  "duration": 120,
  "notes": "Rehearsal for upcoming concert"
}
```

### Update a practice

```
PUT /api/practices/{id}
```

Request body: (same as schedule practice)

### Delete a practice

```
DELETE /api/practices/{id}
```

## Blog Posts

### Get all blog posts

```
GET /api/blog-posts
```

### Create a new blog post

```
POST /api/blog-posts
```

Request body:
```json
{
  "title": "New Album Announcement",
  "content": "We're excited to announce our new album...",
  "photos": ["https://example.com/album-cover.jpg"],
  "videos": ["https://youtube.com/watch?v=..."],
  "accessTier": "PREMIUM"
}
```

### Get blog post details

```
GET /api/blog-posts/{id}
```

### Update a blog post

```
PUT /api/blog-posts/{id}
```

Request body: (same as create blog post)

### Delete a blog post

```
DELETE /api/blog-posts/{id}
```

## Fan Meetings

### Get all fan meetings

```
GET /api/fan-meetings
```

### Create a new fan meeting

```
POST /api/fan-meetings
```

Request body:
```json
{
  "date": "2023-07-15T19:00:00Z",
  "description": "Meet and greet with the band",
  "maxAttendees": 50
}
```

### Get fan meeting details

```
GET /api/fan-meetings/{id}
```

### Update a fan meeting

```
PUT /api/fan-meetings/{id}
```

Request body: (same as create fan meeting)

### Delete a fan meeting

```
DELETE /api/fan-meetings/{id}
```

## Analytics

### Get analytics data

```
GET /api/analytics
```

Query parameters:
- `startDate`: Start date for the analytics period (ISO 8601 format)
- `endDate`: End date for the analytics period (ISO 8601 format)

Response body:
```json
{
  "ticketSales": {
    "totalRevenue": 5000,
    "totalSold": 100
  },
  "merchSales": {
    "totalRevenue": 2500,
    "totalSold": 50
  },
  "subscriberGrowth": {
    "BASIC": 20,
    "PREMIUM": 10
  }
}
```

This API documentation covers the main endpoints of the Music Band Website. Make sure to implement proper authentication and authorization for these endpoints in your application.