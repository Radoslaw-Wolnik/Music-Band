# Music Band Website API Documentation

## Table of Contents
1. [Authentication](#authentication)
2. [Events](#events)
3. [Venues](#venues)
4. [Tickets](#tickets)
5. [Merchandise](#merchandise)
6. [Users](#users)

## Authentication

Most endpoints require authentication. Authentication is handled using NextAuth.js.

- 🔓 No authentication required
- 🔒 User authentication required
- 🔑 Manager authentication required

## Events

#### Get all events
```
🔓 GET /api/events
Response: [EventObject]
```
#### Create an event
```
🔑 POST /api/events
Body: { name: string, description: string, date: Date, venueId: number, ticketPrices: object }
Response: EventObject
```

## Venues

#### Get all venues
```
🔓 GET /api/venues
Response: [VenueObject]
```
#### Create a venue
```
🔑 POST /api/venues
Body: { name: string, address: string, capacity: number, layout: object }
Response: VenueObject
```

## Tickets

#### Purchase tickets
```
🔒 POST /api/tickets
Body: { eventId: number, zone: string, quantity: number }
Response: TicketObject
```

## Merchandise

#### Get all merchandise
```
🔓 GET /api/merch
Response: [MerchItemObject]
```

#### Create merchandise item
```
🔑 POST /api/merch
Body: { name: string, description: string, price: number, stock: number, image?: string }
Response: MerchItemObject
```

## Users

#### Get user profile
```
🔒 GET /api/user/profile
Response: UserObject
```
#### Update user profile
```
🔒 PUT /api/user/profile
Body: { name?: string, profilePicture?: string }
Response: UserObject
```
