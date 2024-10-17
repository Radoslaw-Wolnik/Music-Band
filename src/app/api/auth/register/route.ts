// src/app/api/auth/register/route.ts

import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';
import { BadRequestError, ConflictError } from '@/lib/errors';
import logger from '@/lib/logger';
import { UserRole } from '@/types';
import { userSchema } from '@/lib/validationSchemas';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = userSchema.parse(body);

    const { email, password, name, surname, username, role } = validatedData;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      throw new ConflictError("Email or username already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        surname,
        username,
        role: role || UserRole.FAN,
        lastActive: new Date(),
      },
    });

    logger.info('New user registered', { userId: user.id, role: user.role });

    return NextResponse.json({ 
      message: "User registered successfully",
      user: { id: user.id, email: user.email, username: user.username, role: user.role }
    }, { status: 201 });

  } catch (error) {
    if (error instanceof BadRequestError || error instanceof ConflictError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error in user registration', { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}