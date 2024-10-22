// src/lib/api/index.ts
// Type exports
export * from './types/common';
export * from './types/auth';
export * from './types/user';
export * from './types/events';

// Base client
export { apiClient } from './client';

// Service function exports
export {
  getAnalytics,
} from './services/analytics';

export {
  register,
  login,
  logout,
} from './services/auth';

export {
  getBandMember,
  updateBandMember,
} from './services/bandMembers';

export {
  createBlogPost,
  getBlogPosts,
  getBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from './services/blog';

export {
  getCalendarEvents,
} from './services/calendar';

export {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from './services/events';

export {
  getFanMeetings,
  createFanMeeting,
} from './services/fanMeetings';

export {
  getMerchItems,
  createMerchItem,
  purchaseMerch,
} from './services/merch';

export {
  getNotifications,
  createNotification,
} from './services/notifications';

export {
  getPractices,
  createPractice,
  updatePractice,
  deletePractice,
} from './services/practices';

export {
  createSubscription,
  updateSubscription,
  cancelSubscription,
} from './services/subscriptions';

export {
  purchaseTicket,
  purchaseGroupTickets,
  getUserTickets,
  refundTicket,
} from './services/tickets';

export {
  getUserProfile,
  updateUserProfile,
  uploadUserProfilePicture,
} from './services/user';

export {
  getVenues,
  createVenue,
  updateVenue,
  deleteVenue,
  updateVenueLayout,
} from './services/venues';