// src/app/api/auth/register/route.ts

import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';
import { BadRequestError, ConflictError } from '@/lib/errors';
import logger from '@/lib/logger';
import { UserRole } from '@/types';

export async function POST(req: Request) {
  try {
    const { email, password, name, role } = await req.json();

    if (!email || !password) {
      throw new BadRequestError("Email and password are required");
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new ConflictError("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role as UserRole || UserRole.FAN,
      },
    });

    logger.info('New user registered', { userId: user.id, role: user.role });

    return NextResponse.json({ 
      message: "User registered successfully",
      user: { id: user.id, email: user.email, role: user.role }
    }, { status: 201 });
  } catch (error) {
    if (error instanceof BadRequestError || error instanceof ConflictError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    logger.error('Error in user registration', { error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}