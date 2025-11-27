import prisma from '../config/database';
import env from '../config/env';
import logger from '../utils/logger';

// Postgres full-text search
export const searchListings = async (
  query: string,
  filters?: {
    platform?: string[];
    minPrice?: number;
    maxPrice?: number;
    minEngagement?: number;
  },
  pagination?: { skip: number; take: number }
) => {
  try {
    const where: any = {
      status: 'ACTIVE',
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    };
    
    if (filters?.platform && filters.platform.length > 0) {
      where.platform = { hasSome: filters.platform };
    }
    
    if (filters?.minPrice || filters?.maxPrice) {
      where.price = {};
      if (filters.minPrice) {
        where.price.gte = filters.minPrice;
      }
      if (filters.maxPrice) {
        where.price.lte = filters.maxPrice;
      }
    }
    
    if (filters?.minEngagement) {
      where.engagement = { gte: filters.minEngagement };
    }
    
    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        skip: pagination?.skip,
        take: pagination?.take,
        orderBy: [
          { featured: 'desc' },
          { createdAt: 'desc' },
        ],
        include: {
          creator: {
            select: {
              id: true,
              displayName: true,
              avatar: true,
              isVerified: true,
            },
          },
        },
      }),
      prisma.listing.count({ where }),
    ]);
    
    return { listings, total };
  } catch (error) {
    logger.error('Error searching listings:', error);
    throw error;
  }
};

export const searchCampaigns = async (
  query: string,
  filters?: {
    status?: string;
    minBudget?: number;
    maxBudget?: number;
  },
  pagination?: { skip: number; take: number }
) => {
  try {
    const where: any = {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    };
    
    if (filters?.status) {
      where.status = filters.status;
    }
    
    if (filters?.minBudget || filters?.maxBudget) {
      where.budget = {};
      if (filters.minBudget) {
        where.budget.gte = filters.minBudget;
      }
      if (filters.maxBudget) {
        where.budget.lte = filters.maxBudget;
      }
    }
    
    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        skip: pagination?.skip,
        take: pagination?.take,
        orderBy: { createdAt: 'desc' },
        include: {
          brand: {
            select: {
              id: true,
              displayName: true,
              avatar: true,
              isVerified: true,
            },
          },
        },
      }),
      prisma.campaign.count({ where }),
    ]);
    
    return { campaigns, total };
  } catch (error) {
    logger.error('Error searching campaigns:', error);
    throw error;
  }
};

// Elasticsearch integration (optional)
let elasticsearchClient: any = null;

if (env.ELASTICSEARCH_ENABLED && env.ELASTICSEARCH_URL) {
  try {
    // Note: In production, install @elastic/elasticsearch package
    // const { Client } = require('@elastic/elasticsearch');
    // elasticsearchClient = new Client({ node: env.ELASTICSEARCH_URL });
    logger.info('Elasticsearch integration available (install @elastic/elasticsearch to enable)');
  } catch (error) {
    logger.warn('Elasticsearch not available:', error);
  }
}

// Typesense integration (optional)
let typesenseClient: any = null;

if (env.TYPESENSE_ENABLED && env.TYPESENSE_HOST) {
  try {
    // Note: In production, install typesense package
    // const Typesense = require('typesense');
    // typesenseClient = new Typesense.Client({
    //   nodes: [{
    //     host: env.TYPESENSE_HOST,
    //     port: env.TYPESENSE_PORT,
    //     protocol: env.TYPESENSE_PROTOCOL,
    //   }],
    //   apiKey: env.TYPESENSE_API_KEY,
    // });
    logger.info('Typesense integration available (install typesense to enable)');
  } catch (error) {
    logger.warn('Typesense not available:', error);
  }
}

export const searchWithElasticsearch = async (query: string, index: string) => {
  if (!elasticsearchClient) {
    throw new Error('Elasticsearch not configured');
  }
  
  // Implementation would go here
  // const result = await elasticsearchClient.search({
  //   index,
  //   body: { query: { match: { _all: query } } },
  // });
  // return result;
  
  logger.warn('Elasticsearch search not implemented');
  return { hits: [] };
};

export const searchWithTypesense = async (query: string, collection: string) => {
  if (!typesenseClient) {
    throw new Error('Typesense not configured');
  }
  
  // Implementation would go here
  // const result = await typesenseClient.collections(collection).documents().search({
  //   q: query,
  //   query_by: 'title,description',
  // });
  // return result;
  
  logger.warn('Typesense search not implemented');
  return { hits: [] };
};

