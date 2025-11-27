import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { User, UserRole, RefreshToken } from '@prisma/client';
import prisma from '../config/database';
import env from '../config/env';
import { AuthenticationError, ConflictError, NotFoundError } from '../utils/errors';

// Password hashing with Argon2
// OWASP: Argon2 is the recommended password hashing algorithm (resistant to GPU attacks)
export const hashPassword = async (password: string): Promise<string> => {
  return argon2.hash(password, {
    type: argon2.argon2id, // Hybrid approach (resistant to both side-channel and GPU attacks)
    memoryCost: 65536, // 64 MB
    timeCost: 3, // 3 iterations
    parallelism: 4, // 4 threads
  });
};

export const verifyPassword = async (
  hash: string,
  password: string
): Promise<boolean> => {
  return argon2.verify(hash, password);
};

// JWT token generation
export const generateTokens = (user: { id: string; email: string; role: UserRole }) => {
  const accessToken = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );
  
  const refreshToken = jwt.sign(
    { userId: user.id },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN }
  );
  
  return { accessToken, refreshToken };
};

// Store refresh token in database
export const storeRefreshToken = async (
  userId: string,
  token: string
): Promise<RefreshToken> => {
  const decoded = jwt.decode(token) as { exp: number };
  const expiresAt = new Date(decoded.exp * 1000);
  
  return prisma.refreshToken.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });
};

// Verify refresh token
export const verifyRefreshToken = async (
  token: string
): Promise<{ userId: string; email: string; role: UserRole }> => {
  try {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string };
    
    // Check if token exists in database and is not revoked
    const refreshToken = await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });
    
    if (!refreshToken || refreshToken.revokedAt) {
      throw new AuthenticationError('Invalid refresh token');
    }
    
    if (refreshToken.expiresAt < new Date()) {
      throw new AuthenticationError('Refresh token expired');
    }
    
    if (!refreshToken.user.isActive) {
      throw new AuthenticationError('User is inactive');
    }
    
    return {
      userId: refreshToken.user.id,
      email: refreshToken.user.email,
      role: refreshToken.user.role,
    };
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AuthenticationError('Invalid refresh token');
    }
    throw error;
  }
};

// Revoke refresh token
export const revokeRefreshToken = async (token: string): Promise<void> => {
  await prisma.refreshToken.updateMany({
    where: { token },
    data: { revokedAt: new Date() },
  });
};

// Revoke all user's refresh tokens
export const revokeAllUserTokens = async (userId: string): Promise<void> => {
  await prisma.refreshToken.updateMany({
    where: {
      userId,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
};

// Register new user
export const registerUser = async (
  email: string,
  password: string,
  role: UserRole = UserRole.CREATOR,
  additionalData?: {
    firstName?: string;
    lastName?: string;
    displayName?: string;
  }
): Promise<User> => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  
  if (existingUser) {
    throw new ConflictError('User with this email already exists');
  }
  
  // Hash password
  const passwordHash = await hashPassword(password);
  
  // Create user
  return prisma.user.create({
    data: {
      email,
      passwordHash,
      role,
      ...additionalData,
    },
  });
};

// Login user
export const loginUser = async (
  email: string,
  password: string
): Promise<{ user: User; accessToken: string; refreshToken: string }> => {
  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });
  
  if (!user) {
    throw new AuthenticationError('Invalid email or password');
  }
  
  if (!user.passwordHash) {
    throw new AuthenticationError('Password login not available. Please use OAuth.');
  }
  
  // Verify password
  const isValid = await verifyPassword(user.passwordHash, password);
  
  if (!isValid) {
    throw new AuthenticationError('Invalid email or password');
  }
  
  if (!user.isActive) {
    throw new AuthenticationError('Account is inactive');
  }
  
  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });
  
  // Generate tokens
  const { accessToken, refreshToken } = generateTokens({
    id: user.id,
    email: user.email,
    role: user.role,
  });
  
  // Store refresh token
  await storeRefreshToken(user.id, refreshToken);
  
  return { user, accessToken, refreshToken };
};

// Generate email verification token
export const generateEmailVerificationToken = (userId: string): string => {
  return jwt.sign(
    { userId, type: 'email_verification' },
    env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Verify email
export const verifyEmail = async (token: string): Promise<User> => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      userId: string;
      type: string;
    };
    
    if (decoded.type !== 'email_verification') {
      throw new AuthenticationError('Invalid token type');
    }
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
    
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    if (user.emailVerified) {
      throw new ConflictError('Email already verified');
    }
    
    return prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AuthenticationError('Invalid or expired verification token');
    }
    throw error;
  }
};

// Generate password reset token
export const generatePasswordResetToken = (userId: string): string => {
  return jwt.sign(
    { userId, type: 'password_reset' },
    env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// Reset password
export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<void> => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      userId: string;
      type: string;
    };
    
    if (decoded.type !== 'password_reset') {
      throw new AuthenticationError('Invalid token type');
    }
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
    
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    // Hash new password
    const passwordHash = await hashPassword(newPassword);
    
    // Update password and revoke all tokens
    await Promise.all([
      prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      }),
      revokeAllUserTokens(user.id),
    ]);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AuthenticationError('Invalid or expired reset token');
    }
    throw error;
  }
};

