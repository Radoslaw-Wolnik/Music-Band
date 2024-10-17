import { NextRequest } from 'next/server';

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationResult {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function getPaginationParams(req: NextRequest): PaginationParams {
  const searchParams = req.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  return { page, limit };
}

export function getPaginationData(total: number, page: number, limit: number): PaginationResult {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    totalItems: total,
    itemsPerPage: limit,
    totalPages,
    currentPage: page,
    hasNextPage,
    hasPrevPage,
  };
}