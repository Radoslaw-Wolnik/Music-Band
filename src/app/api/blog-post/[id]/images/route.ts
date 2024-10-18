// src/app/api/posts/[id]/images/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { uploadFile } from '@/lib/uploadFile';
import prisma from '@/lib/prisma';
import { UnauthorizedError, BadRequestError, NotFoundError } from '@/lib/errors';
import logger from '@/lib/logger';
import { UserRole } from '@/types';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== UserRole.BAND_MEMBER && session.user.role !== UserRole.MANAGER)) {
      throw new UnauthorizedError('Only band members and managers can upload post images');
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      throw new BadRequestError('No file provided');
    }

    const postId = parseInt(params.id);
    const post = await prisma.blogPost.findUnique({ where: { id: postId } });

    if (!post) {
      throw new NotFoundError('Post not found');
    }

    const fileUrl = await uploadFile(file, 'posts', postId);

    const updatedPost = await prisma.blogPost.update({
      where: { id: postId },
      data: {
        photos: {
          push: fileUrl,
        },
      },
    });

    logger.info('Post image uploaded', { postId, userId: session.user.id });
    return NextResponse.json({ photos: updatedPost.photos });
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof BadRequestError || error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error uploading post image', { error, postId: params.id });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}