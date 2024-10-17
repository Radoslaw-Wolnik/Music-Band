// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';
import { UnauthorizedError } from '@/lib/errors';
import logger from '@/lib/logger';
import { User, UserRole, SubscriptionTier } from '@/types';

declare module "next-auth" {
  interface User {
    role: UserRole;
    subscriptionTier?: SubscriptionTier;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: UserRole;
      subscriptionTier?: SubscriptionTier;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
    subscriptionTier?: SubscriptionTier;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new UnauthorizedError("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { subscription: true }
        });

        if (!user) {
          logger.warn('Login attempt with non-existent email', { email: credentials.email });
          throw new UnauthorizedError("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          logger.warn('Login attempt with invalid password', { userId: user.id });
          throw new UnauthorizedError("Invalid credentials");
        }

        logger.info('User logged in', { userId: user.id });
        return {
          id: user.id.toString(),
          email: user.email,
          role: user.role,
          subscriptionTier: user.subscription?.tier
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.subscriptionTier = user.subscriptionTier;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as UserRole;
        session.user.subscriptionTier = token.subscriptionTier as SubscriptionTier | undefined;
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };