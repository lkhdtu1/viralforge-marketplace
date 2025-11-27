import request from 'supertest';
import app from '../../server';

describe('API Integration Tests', () => {
  describe('Health Check', () => {
    it('should return 200 for health check', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body.status).toBe('ok');
    });
  });
  
  describe('Authentication', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'TestPassword123!',
          role: 'CREATOR',
        })
        .expect(201);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBeDefined();
    });
    
    it('should reject invalid email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'invalid-email',
          password: 'TestPassword123!',
        })
        .expect(400);
      
      expect(response.body.success).toBe(false);
    });
  });
  
  describe('Protected Routes', () => {
    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/v1/users/me')
        .expect(401);
      
      expect(response.body.success).toBe(false);
    });
  });
});

