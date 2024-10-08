// src/app/api/blog-posts/[id]/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from '@/lib/prisma';
import { UnauthorizedError, NotFoundError, BadRequestError } from '@/lib/errors';
import logger from '@/lib/logger';
import { UserRole, SubscriptionTier } from '@/types';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const userTier = session?.user.role === UserRole.PATRON
      ? (await prisma.subscription.findFirst({ where: { userId: parseInt(session.user.id) } }))?.tier
      : SubscriptionTier.FREE;

    const post = await prisma.blogPost.findUnique({
      where: { id: parseInt(params.id) },
      include: { user: true },
    });

    if (!post) {
      throw new NotFoundError('Blog post not found');
    }

    if (post.accessTier > userTier) {
      throw new UnauthorizedError('You do not have access to this blog post');
    }

    return NextResponse.json(post);
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('