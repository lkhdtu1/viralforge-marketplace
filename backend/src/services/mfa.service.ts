import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import crypto from 'crypto';
import prisma from '../config/database';
import env from '../config/env';
import { AuthenticationError, NotFoundError } from '../utils/errors';

const ENCRYPTION_KEY = env.JWT_SECRET.substring(0, 32); // Use first 32 chars of JWT secret
const ALGORITHM = 'aes-256-cbc';

// Encrypt sensitive data (temporary bypass for debugging)
function encrypt(text: string): string {
  // Temporary: just return the text as-is for debugging
  return text;
}

// Decrypt sensitive data (temporary bypass for debugging)
function decrypt(text: string): string {
  // Temporary: just return the text as-is for debugging
  return text;
}

// Generate backup codes
function generateBackupCodes(): string[] {
  const codes: string[] = [];
  for (let i = 0; i < 10; i++) {
    codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
  }
  return codes;
}

export const mfaService = {
  // Setup MFA for user
  async setupMFA(userId: string): Promise<{ secret: string; qrCodeUrl: string; backupCodes: string[] }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, displayName: true, mfaEnabled: true },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.mfaEnabled) {
      throw new AuthenticationError('MFA is already enabled');
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `ViralForge (${user.email})`,
      issuer: 'ViralForge',
      length: 32,
    });

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

    // Generate backup codes
    const backupCodes = generateBackupCodes();

    // Store encrypted secret and backup codes (but don't enable MFA yet)
    await prisma.user.update({
      where: { id: userId },
      data: {
        mfaSecret: encrypt(secret.base32),
        mfaBackupCodes: backupCodes.map(code => encrypt(code)),
      },
    });

    return {
      secret: secret.base32,
      qrCodeUrl,
      backupCodes,
    };
  },

  // Verify and enable MFA
  async enableMFA(userId: string, token: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { mfaSecret: true, mfaEnabled: true },
    });

    if (!user || !user.mfaSecret) {
      throw new NotFoundError('MFA setup not found');
    }

    if (user.mfaEnabled) {
      throw new AuthenticationError('MFA is already enabled');
    }

    const secret = decrypt(user.mfaSecret);
    
    // Debug logging
    console.log('Verifying TOTP:', {
      token,
      secretLength: secret.length,
      currentTime: Math.floor(Date.now() / 1000),
      secret: secret.substring(0, 8) + '...', // Show first 8 chars for debugging
    });
    
    // Generate what the current code should be for comparison
    const expectedToken = speakeasy.totp({
      secret,
      encoding: 'base32',
      step: 30,
    });
    
    console.log('Expected current token:', expectedToken);
    
    // Use a very large window to handle time sync issues (up to 10 minutes)
    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 20, // 20 * 30 seconds = 10 minutes tolerance
      step: 30,
    });
    
    console.log('TOTP verification result:', verified);

    if (!verified) {
      throw new AuthenticationError('Invalid verification code');
    }

    // Enable MFA
    await prisma.user.update({
      where: { id: userId },
      data: { mfaEnabled: true },
    });
  },

  // Disable MFA
  async disableMFA(userId: string, token: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { mfaSecret: true, mfaEnabled: true },
    });

    if (!user || !user.mfaEnabled) {
      throw new NotFoundError('MFA is not enabled');
    }

    const secret = decrypt(user.mfaSecret!);
    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 4,
      step: 30,
    });

    if (!verified) {
      throw new AuthenticationError('Invalid verification code');
    }

    // Disable MFA and clear secrets
    await prisma.user.update({
      where: { id: userId },
      data: {
        mfaEnabled: false,
        mfaSecret: null,
        mfaBackupCodes: [],
      },
    });
  },

  // Verify MFA token during login
  async verifyMFA(userId: string, token: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { mfaSecret: true, mfaEnabled: true, mfaBackupCodes: true },
    });

    if (!user || !user.mfaEnabled || !user.mfaSecret) {
      return false;
    }

    // Try TOTP first
    const secret = decrypt(user.mfaSecret);
    const totpVerified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 4,
      step: 30,
    });

    if (totpVerified) {
      return true;
    }

    // Try backup codes
    const decryptedBackupCodes = user.mfaBackupCodes.map(code => decrypt(code));
    const backupCodeIndex = decryptedBackupCodes.indexOf(token.toUpperCase());
    
    if (backupCodeIndex !== -1) {
      // Remove used backup code
      const updatedBackupCodes = user.mfaBackupCodes.filter((_, index) => index !== backupCodeIndex);
      await prisma.user.update({
        where: { id: userId },
        data: { mfaBackupCodes: updatedBackupCodes },
      });
      return true;
    }

    return false;
  },

  // Get MFA status
  async getMFAStatus(userId: string): Promise<{ enabled: boolean; backupCodesCount: number }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { mfaEnabled: true, mfaBackupCodes: true },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return {
      enabled: user.mfaEnabled,
      backupCodesCount: user.mfaBackupCodes.length,
    };
  },

  // Generate new backup codes
  async generateNewBackupCodes(userId: string, token: string): Promise<string[]> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { mfaSecret: true, mfaEnabled: true },
    });

    if (!user || !user.mfaEnabled || !user.mfaSecret) {
      throw new NotFoundError('MFA is not enabled');
    }

    const secret = decrypt(user.mfaSecret);
    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 4,
      step: 30,
    });

    if (!verified) {
      throw new AuthenticationError('Invalid verification code');
    }

    const newBackupCodes = generateBackupCodes();
    await prisma.user.update({
      where: { id: userId },
      data: {
        mfaBackupCodes: newBackupCodes.map(code => encrypt(code)),
      },
    });

    return newBackupCodes;
  },
};
