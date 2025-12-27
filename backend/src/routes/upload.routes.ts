import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { upload, processImage, getFileUrl, deleteFile, uploadListing } from '../services/upload.service';
import prisma from '../config/database';
import logger from '../utils/logger';
import path from 'path';

const router = Router();

// Upload profile picture
router.post(
  '/avatar',
  authenticate,
  upload.single('avatar'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: { message: 'No file uploaded' },
        });
      }

      const userId = req.user!.id;
      
      // Get current user to delete old avatar
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { avatar: true },
      });

      // Process image
      const processedPath = await processImage(req.file.path);
      const fileUrl = getFileUrl(processedPath);

      // Delete old avatar if exists
      if (user?.avatar) {
        const oldFilename = path.basename(user.avatar);
        const oldPath = path.join(process.cwd(), 'uploads', 'avatars', oldFilename);
        deleteFile(oldPath);
      }

      // Update user avatar
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { avatar: fileUrl },
        select: {
          id: true,
          avatar: true,
          displayName: true,
        },
      });

      res.json({
        success: true,
        data: { user: updatedUser },
      });
    } catch (error) {
      logger.error('Error uploading avatar:', error);
      next(error);
    }
  }
);

// Upload listing image
router.post(
  '/listing-image',
  authenticate,
  uploadListing.single('image'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: { message: 'No file uploaded' },
        });
      }

      // Don't process image, use original
      const fileUrl = getFileUrl(req.file.path, 'listing');

      res.json({
        success: true,
        data: { imageUrl: fileUrl },
      });
    } catch (error) {
      logger.error('Error uploading listing image:', error);
      next(error);
    }
  }
);

// Serve uploaded files
router.get('/avatars/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(process.cwd(), 'uploads', 'avatars', filename);
  
  // Security: prevent directory traversal
  if (!filePath.startsWith(path.join(process.cwd(), 'uploads'))) {
    return res.status(403).json({
      success: false,
      error: { message: 'Forbidden' },
    });
  }

  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).json({
        success: false,
        error: { message: 'File not found' },
      });
    }
  });
});

// Serve listing images
router.get('/listings/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(process.cwd(), 'uploads', 'listings', filename);
  
  // Security: prevent directory traversal
  if (!filePath.startsWith(path.join(process.cwd(), 'uploads'))) {
    return res.status(403).json({
      success: false,
      error: { message: 'Forbidden' },
    });
  }

  // Add CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');

  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).json({
        success: false,
        error: { message: 'File not found' },
      });
    }
  });
});

export default router;

