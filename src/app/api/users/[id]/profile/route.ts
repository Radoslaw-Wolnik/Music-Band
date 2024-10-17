// src/app/api/user/[id]/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { NotFoundError } from '@/lib/errors';
import logger from '@/lib/logger';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const userId = parseInt(params.id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        name: true,
        profilePicture: true,
        createdAt: true,
        role: true,
        posts: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: {
            posts: true,
            tickets: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    logger.info('User profile fetched', { profileId: userId });
    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in fetching user profile', { error, userId: params.id });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}