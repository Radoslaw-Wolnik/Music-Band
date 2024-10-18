// src/app/api/user/profile-picture/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { uploadFile, deleteFile } from '@/lib/uploadFile';
import prisma from '@/lib/prisma';
import { UnauthorizedError, BadRequestError } from '@/lib/errors';
import logger from '@/lib/logger';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new UnauthorizedError('You must be logged in to upload a profile picture');
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      throw new BadRequestError('No file provided');
    }

    const userId = parseInt(session.user.id);

    // Delete the old profile picture if it exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.profilePicture) {
      await deleteFile(user.profilePicture);
    }

    const fileUrl = await uploadFile(file, 'users', userId);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { profilePicture: fileUrl },
    });

    logger.info('User uploaded new profile picture', { userId });
    return NextResponse.json({ profilePicture: updatedUser.profilePicture });
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof BadRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error uploading profile picture', { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}