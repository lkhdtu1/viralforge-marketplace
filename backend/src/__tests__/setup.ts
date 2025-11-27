// Test setup file
import { PrismaClient } from '@prisma/client';

// Mock Prisma for tests
jest.mock('../config/database', () => ({
  __esModule: true,
  default: new PrismaClient({
    datasources: {
      db: {
        url: process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/test',
      },
    },
  }),
}));

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-min-32-characters-long';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-min-32-characters-long';

