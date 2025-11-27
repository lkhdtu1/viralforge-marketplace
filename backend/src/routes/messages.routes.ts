import { Router } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { authenticate } from '../middleware/auth';
import { validate, sanitizeInput } from '../middleware/validation';
import { pagination, paginatedResponse } from '../middleware/pagination';
import { NotFoundError, AuthorizationError } from '../utils/errors';
import { rateLimiter } from '../middleware/security';

const router = Router();

// Validation schemas
const createMessageSchema = z.object({
  body: z.object({
    receiverId: z.string().uuid(),
    contractId: z.string().uuid().optional(),
    subject: z.string().max(200).optional(),
    content: z.string().min(1).max(5000),
  }),
});

const markReadSchema = z.object({
  body: z.object({
    messageIds: z.array(z.string().uuid()),
  }),
});

// Send message
router.post(
  '/',
  authenticate,
  rateLimiter,
  sanitizeInput,
  validate(createMessageSchema),
  async (req, res, next) => {
    try {
      const senderId = req.user!.id;
      const { receiverId, contractId, subject, content } = req.body;
      
      // Verify receiver exists
      const receiver = await prisma.user.findUnique({
        where: { id: receiverId },
      });
      
      if (!receiver) {
        throw new NotFoundError('Receiver not found');
      }
      
      // Verify contract if provided
      if (contractId) {
        const contract = await prisma.contract.findUnique({
          where: { id: contractId },
        });
        
        if (!contract) {
          throw new NotFoundError('Contract not found');
        }
        
        // Verify user is part of contract
        if (contract.brandId !== senderId && contract.creatorId !== senderId) {
          throw new AuthorizationError('Not authorized to send message for this contract');
        }
      }
      
      const message = await prisma.message.create({
        data: {
          senderId,
          receiverId,
          contractId,
          subject,
          content,
        },
        include: {
          sender: {
            select: {
              id: true,
              displayName: true,
              avatar: true,
            },
          },
          receiver: {
            select: {
              id: true,
              displayName: true,
              avatar: true,
            },
          },
        },
      });
      
      res.status(201).json({
        success: true,
        data: { message },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get user's messages (inbox)
router.get('/', authenticate, pagination, async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const paginationParams = req.pagination!;
    const { unreadOnly, contractId } = req.query;
    
    const where: any = {
      receiverId: userId,
    };
    
    if (unreadOnly === 'true') {
      where.isRead = false;
    }
    
    if (contractId) {
      where.contractId = contractId as string;
    }
    
    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where,
        skip: paginationParams.skip,
        take: paginationParams.limit,
        orderBy: { createdAt: 'desc' },
        include: {
          sender: {
            select: {
              id: true,
              displayName: true,
              avatar: true,
            },
          },
        },
      }),
      prisma.message.count({ where }),
    ]);
    
    res.json(paginatedResponse(messages, total, paginationParams));
  } catch (error) {
    next(error);
  }
});

// Get sent messages
router.get('/sent', authenticate, pagination, async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const paginationParams = req.pagination!;
    
    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: { senderId: userId },
        skip: paginationParams.skip,
        take: paginationParams.limit,
        orderBy: { createdAt: 'desc' },
        include: {
          receiver: {
            select: {
              id: true,
              displayName: true,
              avatar: true,
            },
          },
        },
      }),
      prisma.message.count({ where: { senderId: userId } }),
    ]);
    
    res.json(paginatedResponse(messages, total, paginationParams));
  } catch (error) {
    next(error);
  }
});

// Get message by ID
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    
    const message = await prisma.message.findUnique({
      where: { id },
      include: {
        sender: {
          select: {
            id: true,
            displayName: true,
            avatar: true,
          },
        },
        receiver: {
          select: {
            id: true,
            displayName: true,
            avatar: true,
          },
        },
      },
    });
    
    if (!message) {
      throw new NotFoundError('Message not found');
    }
    
    // Check authorization
    if (message.senderId !== userId && message.receiverId !== userId) {
      throw new AuthorizationError('Not authorized to view this message');
    }
    
    // Mark as read if receiver
    if (message.receiverId === userId && !message.isRead) {
      await prisma.message.update({
        where: { id },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });
      message.isRead = true;
      message.readAt = new Date();
    }
    
    res.json({
      success: true,
      data: { message },
    });
  } catch (error) {
    next(error);
  }
});

// Mark messages as read
router.patch(
  '/mark-read',
  authenticate,
  sanitizeInput,
  validate(markReadSchema),
  async (req, res, next) => {
    try {
      const userId = req.user!.id;
      const { messageIds } = req.body;
      
      // Verify all messages belong to user
      const messages = await prisma.message.findMany({
        where: {
          id: { in: messageIds },
          receiverId: userId,
        },
      });
      
      if (messages.length !== messageIds.length) {
        throw new AuthorizationError('Some messages not found or not authorized');
      }
      
      await prisma.message.updateMany({
        where: {
          id: { in: messageIds },
          receiverId: userId,
        },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });
      
      res.json({
        success: true,
        message: 'Messages marked as read',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete message
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    
    const message = await prisma.message.findUnique({
      where: { id },
    });
    
    if (!message) {
      throw new NotFoundError('Message not found');
    }
    
    // Only sender can delete
    if (message.senderId !== userId) {
      throw new AuthorizationError('Not authorized to delete this message');
    }
    
    await prisma.message.delete({
      where: { id },
    });
    
    res.json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;

