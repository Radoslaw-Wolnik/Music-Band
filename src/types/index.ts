import { Prisma } from '@prisma/client'

export type User = Prisma.UserGetPayload<{}>
export type BandMember = Prisma.BandMemberGetPayload<{}>
export type Patron = Prisma.PatronGetPayload<{}>
export type Subscription = Prisma.SubscriptionGetPayload<{}>
export type Venue = Prisma.VenueGetPayload<{}>
export type Event = Prisma.EventGetPayload<{}>
export type EventPlanItem = Prisma.EventPlanItemGetPayload<{}>
export type Ticket = Prisma.TicketGetPayload<{}>
export type Practice = Prisma.PracticeGetPayload<{}>
export type BlogPost = Prisma.BlogPostGetPayload<{}>
export type MerchItem = Prisma.MerchItemGetPayload<{}>
export type MerchPurchase = Prisma.MerchPurchaseGetPayload<{}>
export type FanMeeting = Prisma.FanMeetingGetPayload<{}>
export type Notification = Prisma.NotificationGetPayload<{}>
export type MainPage = Prisma.MainPageGetPayload<{}>

export { UserRole, SubscriptionTier, TicketStatus } from '@prisma/client'