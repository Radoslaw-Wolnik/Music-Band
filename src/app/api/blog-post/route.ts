// src/app/api/blog-posts/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from '@/lib/prisma';
import { UnauthorizedError, BadRequestError } from '@/lib/errors';
import logger from '@/lib/logger';
import { UserRole, SubscriptionTier } from '@/types';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userTier = session?.user.role === UserRole.PATRON
      ? (await prisma.subscription.findFirst({ where: { userId: parseInt(session.user.id) } }))?.tier
      : SubscriptionTier.FREE;

    const posts = await prisma.blogPost.findMany({
      where: {
        OR: [
          { accessTier: SubscriptionTier.FREE },
          { accessTier: { lte: userTier } },
        ],
      },
      include: { user: true },
    });

    return NextResponse.json(posts);
  } catch (error) {
    logger.error('Error fetching blog posts', { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== UserRole.BAND_MEMBER && session.user.role !== UserRole.MANAGER)) {
      throw new UnauthorizedError('Only band members and managers can create blog posts');
    }

    const { title, content, photos, videos, accessTier } = await req.json();

    if (!title || !content || !accessTier) {
      throw new BadRequestError('Missing required fields');
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        content,
        photos,
        videos,
        accessTier,
        userId: parseInt(session.user.id),
      },
    });

    logger.info('Blog post created', { postId: post.id, userId: session.user.id });
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof BadRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error creating blog post', { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}