// src/app/api/user/profile/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from '@/lib/prisma';
import { UnauthorizedError, NotFoundError, BadRequestError } from '@/lib/errors';
import logger from '@/lib/logger';
import { User } from '@/types';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError('You must be logged in to view your profile');
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) },
      include: {
        bandMember: true,
        patron: {
          include: {
            subscription: true
          }
        },
        tickets: {
          include: {
            event: true
          }
        },
        posts: true,
      }
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    logger.info('User fetched own profile', { userId: session.user.id });
    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error fetching user profile', { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError('You must be logged in to update your profile');
    }

    const { name, profilePicture } = await req.json();

    if (!name) {
      throw new BadRequestError('Name is required');
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(session.user.id) },
      data: { name, profilePicture },
    });

    logger.info('User updated profile', { userId: session.user.id });
    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof BadRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error updating user profile', { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}