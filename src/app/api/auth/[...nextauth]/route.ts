// src/app/api/auth/[...nextauth]/route.ts

import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';
import { UnauthorizedError } from '@/lib/errors';
import logger from '@/lib/logger';
import { User, UserRole } from '@/types';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new UnauthorizedError("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
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
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as UserRole;
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

import NextAuth from 'next-auth';
export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };