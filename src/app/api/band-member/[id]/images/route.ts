// src/app/api/band-members/[id]/images/route.ts
/*
For future when every band member has a page with changable content by them insted of just instrument and bio

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
      throw new UnauthorizedError('Only band members and managers can upload band member page images');
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      throw new BadRequestError('No file provided');
    }

    const bandMemberId = parseInt(params.id);
    const bandMember = await prisma.bandMember.findUnique({ where: { id: bandMemberId } });

    if (!bandMember) {
      throw new NotFoundError('Band member not found');
    }

    // Check if the current user is the band member or a manager
    if (session.user.role === UserRole.BAND_MEMBER && bandMember.userId !== parseInt(session.user.id)) {
      throw new UnauthorizedError('You can only upload images to your own band member page');
    }

    const fileUrl = await uploadFile(file, 'band-members', bandMemberId);

    // Assuming we have a 'pageImages' field in the BandMember model
    const updatedBandMember = await prisma.bandMember.update({
      where: { id: bandMemberId },
      data: {
        pageImages: {
          push: fileUrl,
        },
      },
    });

    logger.info('Band member page image uploaded', { bandMemberId, userId: session.user.id });
    return NextResponse.json({ pageImages: updatedBandMember.pageImages });
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof BadRequestError || error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error uploading band member page image', { error, bandMemberId: params.id });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

*/