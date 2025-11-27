import { hashPassword, verifyPassword, generateTokens } from '../services/auth.service';
import { UserRole } from '@prisma/client';

describe('Auth Service', () => {
  describe('Password Hashing', () => {
    it('should hash password correctly', async () => {
      const password = 'TestPassword123!';
      const hash = await hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(50); // Argon2 hashes are long
    });
    
    it('should verify correct password', async () => {
      const password = 'TestPassword123!';
      const hash = await hashPassword(password);
      
      const isValid = await verifyPassword(hash, password);
      expect(isValid).toBe(true);
    });
    
    it('should reject incorrect password', async () => {
      const password = 'TestPassword123!';
      const wrongPassword = 'WrongPassword123!';
      const hash = await hashPassword(password);
      
      const isValid = await verifyPassword(hash, wrongPassword);
      expect(isValid).toBe(false);
    });
  });
  
  describe('Token Generation', () => {
    it('should generate access and refresh tokens', () => {
      const user = {
        id: 'test-user-id',
        email: 'test@example.com',
        role: UserRole.CREATOR,
      };
      
      const { accessToken, refreshToken } = generateTokens(user);
      
      expect(accessToken).toBeDefined();
      expect(refreshToken).toBeDefined();
      expect(accessToken).not.toBe(refreshToken);
    });
  });
});

