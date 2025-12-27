import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import crypto from 'crypto';
import logger from '../utils/logger';

// Ensure uploads directories exist
const avatarsDir = path.join(process.cwd(), 'uploads', 'avatars');
const listingsDir = path.join(process.cwd(), 'uploads', 'listings');

if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}
if (!fs.existsSync(listingsDir)) {
  fs.mkdirSync(listingsDir, { recursive: true });
}

// Configure multer storage for avatars
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${crypto.randomUUID()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// Configure multer storage for listings
const listingStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, listingsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${crypto.randomUUID()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// File filter for images only
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'));
  }
};

// Multer configuration
export const upload = multer({
  storage: avatarStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

// Multer configuration for listings
export const uploadListing = multer({
  storage: listingStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

// Process and optimize image
export async function processImage(filePath: string): Promise<string> {
  try {
    const processedPath = filePath.replace(path.extname(filePath), '_processed.webp');
    
    await sharp(filePath)
      .resize(400, 400, {
        fit: 'cover',
        position: 'center',
      })
      .webp({ quality: 85 })
      .toFile(processedPath);
    
    // Delete original if processed successfully
    fs.unlinkSync(filePath);
    
    return processedPath;
  } catch (error) {
    logger.error('Error processing image:', error);
    // Return original if processing fails
    return filePath;
  }
}

// Get public URL for uploaded file
export function getFileUrl(filePath: string, type: 'avatar' | 'listing' = 'avatar'): string {
  const filename = path.basename(filePath);
  const folder = type === 'listing' ? 'listings' : 'avatars';
  return `/uploads/${folder}/${filename}`;
}

// Delete file
export function deleteFile(filePath: string): void {
  try {
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (error) {
    logger.error('Error deleting file:', error);
  }
}

