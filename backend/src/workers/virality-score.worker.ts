import { Queue, Worker } from 'bullmq';
import prisma from '../config/database';
import env from '../config/env';
import logger from '../utils/logger';

// Redis connection for BullMQ
const connection = {
  host: process.env.REDIS_URL?.replace('redis://', '').split(':')[0] || 'localhost',
  port: parseInt(process.env.REDIS_URL?.split(':')[1] || '6379'),
};

// Queue for virality score computation
export const viralityScoreQueue = new Queue('virality-score', { connection });

/**
 * Virality Score Algorithm
 * 
 * The virality score combines three key metrics:
 * 
 * 1. Share Rate (SR): Percentage of users who shared content
 *    SR = (Number of shares / Number of views) * 100
 *    Weight: 40%
 * 
 * 2. Engagement Per User (EPU): Average engagement per unique user
 *    EPU = (Total engagements / Unique users) * 100
 *    Engagements include: likes, comments, saves, clicks
 *    Weight: 40%
 * 
 * 3. Velocity (V): Rate of growth in engagement over time
 *    V = (Recent engagements - Previous engagements) / Time period
 *    Recent = last 24 hours, Previous = 24-48 hours ago
 *    Weight: 20%
 * 
 * Final Score = (SR * 0.4) + (EPU * 0.4) + (V * 0.2)
 * 
 * Score is normalized to 0-100 scale
 */
const calculateViralityScore = async (userId: string, periodDays: number = 7): Promise<number> => {
  const periodStart = new Date();
  periodStart.setDate(periodStart.getDate() - periodDays);
  
  // Get analytics events for the period
  const events = await prisma.analyticsEvent.findMany({
    where: {
      userId,
      createdAt: { gte: periodStart },
    },
    orderBy: { createdAt: 'asc' },
  });
  
  // Calculate metrics
  const views = events.filter(e => e.eventType === 'page_view' || e.eventType === 'campaign_view').length;
  const shares = events.filter(e => e.eventType === 'share').length;
  const engagements = events.filter(e => 
    ['like', 'comment', 'save', 'click', 'engagement'].includes(e.eventType)
  ).length;
  
  // Get unique users (sessions)
  const uniqueSessions = new Set(events.map(e => e.sessionId).filter(Boolean));
  const uniqueUsers = uniqueSessions.size || 1; // Avoid division by zero
  
  // 1. Share Rate (0-100)
  const shareRate = views > 0 ? (shares / views) * 100 : 0;
  // Cap at 100
  const normalizedShareRate = Math.min(shareRate, 100);
  
  // 2. Engagement Per User (0-100)
  // Normalize: assume 10+ engagements per user is excellent (100 points)
  const engagementPerUser = engagements / uniqueUsers;
  const normalizedEPU = Math.min((engagementPerUser / 10) * 100, 100);
  
  // 3. Velocity
  // Compare recent 24h vs previous 24h
  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last48h = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  
  const recentEngagements = events.filter(e => 
    e.createdAt >= last24h && 
    ['like', 'comment', 'save', 'click', 'engagement'].includes(e.eventType)
  ).length;
  
  const previousEngagements = events.filter(e => 
    e.createdAt >= last48h && 
    e.createdAt < last24h &&
    ['like', 'comment', 'save', 'click', 'engagement'].includes(e.eventType)
  ).length;
  
  // Velocity: growth rate (can be negative)
  const velocity = previousEngagements > 0 
    ? ((recentEngagements - previousEngagements) / previousEngagements) * 100
    : recentEngagements > 0 ? 100 : 0;
  
  // Normalize velocity to 0-100 (negative becomes 0, high growth caps at 100)
  const normalizedVelocity = Math.max(0, Math.min(velocity, 100));
  
  // Calculate final score
  const score = (normalizedShareRate * 0.4) + (normalizedEPU * 0.4) + (normalizedVelocity * 0.2);
  
  return Math.round(score * 100) / 100; // Round to 2 decimal places
};

// Worker to process virality score jobs
export const viralityScoreWorker = new Worker(
  'virality-score',
  async (job) => {
    const { userId, periodDays } = job.data;
    
    logger.info(`Computing virality score for user ${userId}`);
    
    const score = await calculateViralityScore(userId, periodDays || 7);
    
    // Get period dates
    const periodEnd = new Date();
    const periodStart = new Date();
    periodStart.setDate(periodStart.getDate() - (periodDays || 7));
    
    // Get metrics breakdown
    const events = await prisma.analyticsEvent.findMany({
      where: {
        userId,
        createdAt: { gte: periodStart, lte: periodEnd },
      },
    });
    
    const views = events.filter(e => e.eventType === 'page_view' || e.eventType === 'campaign_view').length;
    const shares = events.filter(e => e.eventType === 'share').length;
    const engagements = events.filter(e => 
      ['like', 'comment', 'save', 'click', 'engagement'].includes(e.eventType)
    ).length;
    const uniqueSessions = new Set(events.map(e => e.sessionId).filter(Boolean)).size;
    
    const metrics = {
      views,
      shares,
      engagements,
      uniqueUsers: uniqueSessions,
      shareRate: views > 0 ? (shares / views) * 100 : 0,
      engagementPerUser: uniqueSessions > 0 ? engagements / uniqueSessions : 0,
    };
    
    // Store virality score history
    await prisma.viralityScoreHistory.create({
      data: {
        userId,
        score,
        metrics,
        periodStart,
        periodEnd,
      },
    });
    
    logger.info(`Virality score computed for user ${userId}: ${score}`);
    
    return { score, metrics };
  },
  { connection }
);

// Schedule periodic virality score computation
export const scheduleViralityScoreComputation = async () => {
  // Get all creators
  const creators = await prisma.user.findMany({
    where: { role: 'CREATOR' },
    select: { id: true },
  });
  
  // Add jobs for each creator
  for (const creator of creators) {
    await viralityScoreQueue.add(
      'compute-virality-score',
      { userId: creator.id, periodDays: 7 },
      {
        repeat: {
          pattern: '0 0 * * *', // Daily at midnight
        },
      }
    );
  }
  
  logger.info(`Scheduled virality score computation for ${creators.length} creators`);
};

// Process batch of users
export const processBatchViralityScores = async (batchSize: number = 100) => {
  const users = await prisma.user.findMany({
    where: { role: 'CREATOR' },
    take: batchSize,
    select: { id: true },
  });
  
  for (const user of users) {
    await viralityScoreQueue.add('compute-virality-score', {
      userId: user.id,
      periodDays: 7,
    });
  }
  
  logger.info(`Queued ${users.length} virality score computations`);
};

