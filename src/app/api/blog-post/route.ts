// src/app/api/blog-posts/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from '@/lib/prisma';
import { UnauthorizedError, BadRequestError } from '@/lib/errors';
import logger from '@/lib/logger';
import { UserRole, SubscriptionTier } from '@/types';
import { getPaginationParams, getPaginationData } from '@/lib/pagination';

export async function GET(req: NextRequest) {
  try {
    const { page, limit } = getPaginationParams(req);
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get('search');
    const accessTier = searchParams.get('accessTier') as SubscriptionTier;

    const session = await getServerSession(authOptions);
    const userTier = session?.user.role === UserRole.PATRON
      ? (await prisma.subscription.findFirst({ where: { userId: parseInt(session.user.id) } }))?.tier
      : SubscriptionTier.FREE;

    const where: any = {
      OR: [
        { accessTier: SubscriptionTier.FREE },
        { accessTier: { lte: userTier } },
      ],
    };

    if (search) {
      where.OR.push(
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      );
    }

    if (accessTier) {
      where.accessTier = accessTier;
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: { user: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.blogPost.count({ where }),
    ]);

    const paginationData = getPaginationData(total, page, limit);

    return NextResponse.json({
      posts,
      pagination: paginationData,
    });
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