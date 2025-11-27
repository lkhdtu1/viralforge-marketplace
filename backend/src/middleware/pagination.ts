import { Request, Response, NextFunction } from 'express';

// Pagination middleware
// Adds pagination parameters to request
export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

declare global {
  namespace Express {
    interface Request {
      pagination?: PaginationParams;
    }
  }
}

export const pagination = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  const skip = (page - 1) * limit;
  
  req.pagination = {
    page,
    limit,
    skip,
  };
  
  next();
};

// Pagination response helper
export const paginatedResponse = <T>(
  data: T[],
  total: number,
  pagination: PaginationParams
) => {
  return {
    success: true,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.ceil(total / pagination.limit),
      hasNext: pagination.page * pagination.limit < total,
      hasPrev: pagination.page > 1,
    },
  };
};

