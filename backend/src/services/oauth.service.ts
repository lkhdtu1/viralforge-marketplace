import { User, UserRole } from '@prisma/client';
import prisma from '../config/database';
import { generateTokens, storeRefreshToken } from './auth.service';
import { ConflictError } from '../utils/errors';

// OAuth user creation/retrieval
export const findOrCreateOAuthUser = async (
  provider: 'google' | 'twitter' | 'apple',
  providerId: string,
  email: string,
  profileData: {
    firstName?: string;
    lastName?: string;
    displayName?: string;
    avatar?: string;
  }
): Promise<User> => {
  // Check if user exists with this OAuth ID
  const providerField = `${provider}Id` as 'googleId' | 'twitterId' | 'appleId';
  let user = await prisma.user.findUnique({
    where: { [providerField]: providerId },
  });
  
  if (user) {
    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });
    return user;
  }
  
  // Check if user exists with this email
  user = await prisma.user.findUnique({
    where: { email },
  });
  
  if (user) {
    // Link OAuth account to existing user
    return prisma.user.update({
      where: { id: user.id },
      data: {
        [providerField]: providerId,
        emailVerified: true, // OAuth emails are pre-verified
        lastLoginAt: new Date(),
        ...(profileData.avatar && !user.avatar ? { avatar: profileData.avatar } : {}),
      },
    });
  }
  
  // Create new user
  return prisma.user.create({
    data: {
      email,
      [providerField]: providerId,
      emailVerified: true,
      role: UserRole.CREATOR,
      ...profileData,
      lastLoginAt: new Date(),
    },
  });
};

// Generate tokens for OAuth user
export const handleOAuthLogin = async (user: User) => {
  const { accessToken, refreshToken } = generateTokens({
    id: user.id,
    email: user.email,
    role: user.role,
  });
  
  await storeRefreshToken(user.id, refreshToken);
  
  return { user, accessToken, refreshToken };
};

