// src/app/api/merch/[id]/images/route.ts

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

    if (!session || session.user.role !== UserRole.MANAGER) {
      throw new UnauthorizedError('Only managers can upload merch images');
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      throw new BadRequestError('No file provided');
    }

    const merchId = parseInt(params.id);
    const merchItem = await prisma.merchItem.findUnique({ where: { id: merchId } });

    if (!merchItem) {
      throw new NotFoundError('Merch item not found');
    }

    const fileUrl = await uploadFile(file, 'merch', merchId);

    const updatedMerchItem = await prisma.merchItem.update({
      where: { id: merchId },
      data: { image: fileUrl },
    });

    logger.info('Merch image uploaded', { merchId, userId: session.user.id });
    return NextResponse.json({ image: updatedMerchItem.image });
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof BadRequestError || error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error uploading merch image', { error, merchId: params.id });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}