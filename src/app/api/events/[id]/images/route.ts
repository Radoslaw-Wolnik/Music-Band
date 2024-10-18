// src/app/api/events/[id]/images/route.ts

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
      throw new UnauthorizedError('Only managers can upload event images');
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      throw new BadRequestError('No file provided');
    }

    const eventId = parseInt(params.id);
    const event = await prisma.event.findUnique({ where: { id: eventId } });

    if (!event) {
      throw new NotFoundError('Event not found');
    }

    const fileUrl = await uploadFile(file, 'events', eventId);

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: { defaultPhoto: fileUrl },
    });

    logger.info('Event image uploaded', { eventId, userId: session.user.id });
    return NextResponse.json({ defaultPhoto: updatedEvent.defaultPhoto });
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof BadRequestError || error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error uploading event image', { error, eventId: params.id });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}