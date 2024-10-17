import cron from 'node-cron';
import prisma from './prisma';
import logger from './logger';
import { SubscriptionTier, UserRole, User, Subscription } from '@/types';

export function startBackgroundJobs() {
  // Check for expiring subscriptions daily at midnight
  cron.schedule('0 0 * * *', async () => {
    try {
      const expiringSubscriptions = await prisma.subscription.findMany({
        where: {
          endDate: {
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
          }
        },
        include: { user: true }
      });

      for (const subscription of expiringSubscriptions) {
        // Send notification to user (implement your notification system)
        logger.info(`Subscription expiring soon`, { userId: subscription.userId, subscriptionId: subscription.id });
      }
    } catch (error) {
      logger.error('Error checking expiring subscriptions', { error });
    }
  });

  // Update user roles for expired subscriptions daily at 1 AM
  cron.schedule('0 1 * * *', async () => {
    try {
      const expiredSubscriptions = await prisma.subscription.findMany({
        where: {
          endDate: { lte: new Date() },
          tier: { not: SubscriptionTier.FREE }
        },
        include: { user: true }
      });

      for (const subscription of expiredSubscriptions) {
        await prisma.user.update({
          where: { id: subscription.userId },
          data: { role: UserRole.FAN }
        });

        await prisma.subscription.update({
          where: { id: subscription.id },
          data: { tier: SubscriptionTier.FREE }
        });

        logger.info(`User role updated due to expired subscription`, { userId: subscription.userId, subscriptionId: subscription.id });
      }
    } catch (error) {
      logger.error('Error updating user roles for expired subscriptions', { error });
    }
  });

  // Clean up old logs weekly at 2 AM on Sundays
  cron.schedule('0 2 * * 0', async () => {
    try {
      // Implement log cleanup logic here
      logger.info('Old logs cleaned up');
    } catch (error) {
      logger.error('Error cleaning up old logs', { error });
    }
  });
}