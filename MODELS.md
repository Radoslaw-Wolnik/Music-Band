# Data Models

This document describes the data models used in the Music Band Website application.

## User

Represents registered users of the application.

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
  posts           BlogPost[]
  subscription    Subscription?
  notifications   Notification[]
}

enum UserRole {
  FAN
  PATRON
  BAND_MEMBER
  MANAGER
}
```

## BandMember

Represents additional information for users who are band members.

```prisma
model BandMember {
  id              Int       @id @default(autoincrement())
  userId          Int       @unique
  user            User      @relation(fields: [userId], references: [id])
  instrument      String?
  bio             String?
  practices       Practice[]
}
```

## Patron

Represents additional information for users who are patrons.

```prisma
model Patron {
  id              Int       @id @default(autoincrement())
  userId          Int       @unique
  user            User      @relation(fields: [userId], references: [id])
  subscriptionId  Int
  subscription    Subscription @relation(fields: [subscriptionId], references: [id])
}
```

## Subscription

Represents a user's subscription details.

```prisma
model Subscription {
  id              Int       @id @default(autoincrement())
  userId          Int       @unique
  user            User      @relation(fields: [userId], references: [id])
  tier            SubscriptionTier
  startDate       DateTime
  endDate         DateTime
  patrons         Patron[]
}

enum SubscriptionTier {
  FREE
  BASIC
  PREMIUM
}
```

## Venue

Represents locations where events take place.

```prisma
model Venue {
  id              Int       @id @default(autoincrement())
  name            String
  address         String
  capacity        Int
  layout          Json
  events          Event[]
}
```

## Event

Represents music events or concerts.

```prisma
model Event {
  id              Int       @id @default(autoincrement())
  venueId         Int
  venue           Venue     @relation(fields: [venueId], references: [id])
  name            String
  description     String
  date            DateTime
  endDate         DateTime
  ticketPrices    Json
  tickets         Ticket[]
  eventPlan       EventPlanItem[]
  defaultPhoto    String?
  isPatronOnly    Boolean   @default(false)
}
```

## EventPlanItem

Represents individual items in an event's schedule.

```prisma
model EventPlanItem {
  id              Int       @id @default(autoincrement())
  eventId         Int
  event           Event     @relation(fields: [eventId], references: [id])
  time            DateTime
  name            String
}
```

## Ticket

Represents tickets purchased for events.

```prisma
model Ticket {
  id              Int       @id @default(autoincrement())
  eventId         Int
  event           Event     @relation(fields: [eventId], references: [id])
  userId          Int
  user            User      @relation(fields: [userId], references: [id])
  seat            String?
  price           Float
  purchasedAt     DateTime  @default(now())
  status          TicketStatus @default(ACTIVE)
}

enum TicketStatus {
  ACTIVE
  REFUNDED
  USED
}
```

## Practice

Represents band practice sessions.

```prisma
model Practice {
  id              Int       @id @default(autoincrement())
  bandMemberId    Int
  bandMember      BandMember @relation(fields: [bandMemberId], references: [id])
  date            DateTime
  duration        Int
  notes           String?
}
```

## BlogPost

Represents blog posts or news articles.

```prisma
model BlogPost {
  id              Int       @id @default(autoincrement())
  userId          Int
  user            User      @relation(fields: [userId], references: [id])
  title           String
  content         String
  photos          String[]
  videos          String[]
  accessTier      SubscriptionTier
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

## MerchItem

Represents merchandise items available for purchase.

```prisma
model MerchItem {
  id              Int       @id @default(autoincrement())
  name            String
  description     String
  price           Float
  stock           Int
  image           String?
  purchases       MerchPurchase[]
}
```

## MerchPurchase

Represents a purchase of a merchandise item.

```prisma
model MerchPurchase {
  id              Int       @id @default(autoincrement())
  merchItemId     Int
  merchItem       MerchItem @relation(fields: [merchItemId], references: [id])
  userId          Int
  user            User      @relation(fields: [userId], references: [id])
  quantity        Int
  totalPrice      Float
  createdAt       DateTime  @default(now())
}
```

## FanMeeting

Represents fan meetings or events.

```prisma
model FanMeeting {
  id              Int       @id @default(autoincrement())
  date            DateTime
  description     String
  maxAttendees    Int
  attendees       User[]
}
```

## Notification

Represents notifications sent to users.

```prisma
model Notification {
  id              Int       @id @default(autoincrement())
  userId          Int
  user            User      @relation(fields: [userId], references: [id])
  message         String
  isRead          Boolean   @default(false)
  createdAt       DateTime  @default(now())
}
```

## MainPage

Represents the content of the main page.

```prisma
model MainPage {
  id              Int       @id @default(autoincrement())
  content         Json
  updatedAt       DateTime  @updatedAt
}
```

These models define the structure of the data used in the Music Band Website application. They are implemented using Prisma ORM and correspond to tables in the PostgreSQL database.