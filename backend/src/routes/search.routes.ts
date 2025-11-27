import { Router } from 'express';
import { z } from 'zod';
import { searchListings, searchCampaigns } from '../services/search.service';
import { pagination, paginatedResponse } from '../middleware/pagination';
import { validate, sanitizeInput } from '../middleware/validation';
import { rateLimiter } from '../middleware/security';

const router = Router();

// Validation schemas
const searchSchema = z.object({
  query: z.object({
    q: z.string().min(1).max(200),
    type: z.enum(['listings', 'campaigns']).default('listings'),
    platform: z.string().optional(),
    minPrice: z.string().transform(Number).pipe(z.number()).optional(),
    maxPrice: z.string().transform(Number).pipe(z.number()).optional(),
    minEngagement: z.string().transform(Number).pipe(z.number()).optional(),
    status: z.string().optional(),
  }),
});

// Search endpoint
router.get(
  '/',
  pagination,
  rateLimiter,
  sanitizeInput,
  validate(searchSchema),
  async (req, res, next) => {
    try {
      const { q, type, platform, minPrice, maxPrice, minEngagement, status } = req.query;
      const paginationParams = req.pagination!;
      
      if (type === 'listings' || !type) {
        const filters: any = {};
        if (platform) {
          filters.platform = [platform as string];
        }
        if (minPrice) {
          filters.minPrice = parseFloat(minPrice as string);
        }
        if (maxPrice) {
          filters.maxPrice = parseFloat(maxPrice as string);
        }
        if (minEngagement) {
          filters.minEngagement = parseFloat(minEngagement as string);
        }
        
        const { listings, total } = await searchListings(
          q as string,
          filters,
          paginationParams
        );
        
        return res.json(paginatedResponse(listings, total, paginationParams));
      } else if (type === 'campaigns') {
        const filters: any = {};
        if (status) {
          filters.status = status as string;
        }
        
        const { campaigns, total } = await searchCampaigns(
          q as string,
          filters,
          paginationParams
        );
        
        return res.json(paginatedResponse(campaigns, total, paginationParams));
      }
      
      res.status(400).json({
        success: false,
        error: { message: 'Invalid search type' },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

