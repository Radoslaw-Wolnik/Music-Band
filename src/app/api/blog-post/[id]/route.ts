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
    let userTier: SubscriptionTier = SubscriptionTier.FREE;

    if (session?.user.role === UserRole.PATRON) {
      const subscription = await prisma.subscription.findFirst({ 
        where: { userId: parseInt(session.user.id) } 
      });
      userTier = subscription?.tier ?? SubscriptionTier.FREE;
    }

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

    logger.info('Blog post fetched', { postId: post.id, userId: session?.user.id });
    return NextResponse.json(post);
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error fetching blog post', { error, postId: params.id });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== UserRole.BAND_MEMBER && session.user.role !== UserRole.MANAGER)) {
      throw new UnauthorizedError('Only band members and managers can update blog posts');
    }

    const { title, content, photos, videos, accessTier } = await req.json();

    if (!title || !content || !accessTier) {
      throw new BadRequestError('Missing required fields');
    }

    const updatedPost = await prisma.blogPost.update({
      where: { id: parseInt(params.id) },
      data: {
        title,
        content,
        photos,
        videos,
        accessTier,
      },
    });

    logger.info('Blog post updated', { postId: updatedPost.id, userId: session.user.id });
    return NextResponse.json(updatedPost);
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof BadRequestError || error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error updating blog post', { error, postId: params.id });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== UserRole.BAND_MEMBER && session.user.role !== UserRole.MANAGER)) {
      throw new UnauthorizedError('Only band members and managers can delete blog posts');
    }

    const deletedPost = await prisma.blogPost.delete({
      where: { id: parseInt(params.id) },
    });

    logger.info('Blog post deleted', { postId: deletedPost.id, userId: session.user.id });
    return NextResponse.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error deleting blog post', { error, postId: params.id });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}