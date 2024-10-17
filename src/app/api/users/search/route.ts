// src/app/api/user/search/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from '@/lib/prisma';
import { UnauthorizedError, BadRequestError } from '@/lib/errors';
import logger from '@/lib/logger';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError('You must be logged in to search users');
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    
    if (!query) {
      throw new BadRequestError("Search query is required");
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: 'insensitive' } },
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        username: true,
        name: true,
        profilePicture: true,
      },
      take: 10,
    });

    logger.info('User search performed', { userId: session.user.id, query });
    return NextResponse.json(users);
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof BadRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Unhandled error in user search', { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}