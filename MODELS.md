# Music Band Website Models Documentation

This document provides an overview of the data models used in the Music Band Website application.

## Table of Contents
1. [User](#user)
2. [Event](#event)
3. [Venue](#venue)
4. [Ticket](#ticket)
5. [MerchItem](#merchitem)
6. [BandMember](#bandmember)
7. [Patron](#patron)
8. [Practice](#practice)
9. [Post](#post)

## User

The User model represents registered users of the application.

```prisma
model User {
  id              Int       @id @default(autoincrement())
  email           String    @unique
  password        String
  role            UserRole
  name            String?
  profilePicture  String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  bandMember      BandMember?
  patron          Patron?
  tickets         Ticket[]
  posts           Post[]
}

enum UserRole {
  FAN
  PATRON
  BAND_MEMBER
  MANAGER
}
```

## Event
The Event model represents music events or concerts.
``` prisma
model Event {
  id              Int       @id @default(autoincrement())
  venueId         Int
  venue           Venue     @relation(fields: [venueId], references: [id])
  name            String
  description     String
  date            DateTime
  ticketPrices    Json
  tickets         Ticket[]
}
```

## Venue
The Venue model represents locations where events take place.
``` prisma
model Venue {
  id              Int       @id @default(autoincrement())
  name            String
  address         String
  capacity        Int
  layout          Json
  events          Event[]
}
```

## Other models ...
``` prisma 

```