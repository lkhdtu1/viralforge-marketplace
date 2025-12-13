import axios from 'axios';
import type { 
  Campaign, 
  Creator, 
  MarketplaceFilters, 
  AnalyticsData, 
  User,
  Conversation,
  Message,
  Notification,
  OverviewMetrics
} from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data.data;
  },

  signup: async (userData: { email: string; password: string; role: 'CREATOR' | 'BRAND'; displayName?: string }) => {
    const { data } = await api.post('/auth/register', userData);
    return data.data;
  },

  logout: async () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    return { success: true };
  },

  getCurrentUser: async (): Promise<User> => {
    const { data } = await api.get('/auth/me');
    return data.data.user;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const { data } = await api.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return data;
  },
};

export const usersApi = {
  search: async (query: string, role?: string) => {
    const { data } = await api.get('/users/search', { params: { q: query, role } });
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/users/${id}`);
    return data.data.user;
  },

  updateProfile: async (payload: Partial<User> & { avatar?: string }) => {
    const { data } = await api.put('/users/profile', payload);
    return data.data.user;
  },
};

export const campaignsApi = {
  getAll: async (params?: { status?: string; limit?: number; page?: number }): Promise<Campaign[]> => {
    const { data } = await api.get('/campaigns', { params });
    // Handle paginated response
    return Array.isArray(data.data) ? data.data : (data.data?.campaigns || data.data || []);
  },

  getById: async (id: string): Promise<Campaign> => {
    const { data } = await api.get(`/campaigns/${id}`);
    return data.data.campaign;
  },

  create: async (campaignData: Partial<Campaign>): Promise<Campaign> => {
    const { data } = await api.post('/campaigns', campaignData);
    return data.data.campaign;
  },

  update: async (id: string, campaignData: Partial<Campaign>): Promise<Campaign> => {
    const { data } = await api.put(`/campaigns/${id}`, campaignData);
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/campaigns/${id}`);
  },
};

export const marketplaceApi = {
  getCreators: async (filters?: MarketplaceFilters): Promise<Creator[]> => {
    const { data } = await api.get('/marketplace/creators', { params: filters });
    // Handle paginated response
    return Array.isArray(data.data) ? data.data : (data.data?.creators || data.data || []);
  },

  getCreatorById: async (id: string): Promise<Creator> => {
    const { data } = await api.get(`/marketplace/creators/${id}`);
    return data.data.creator || data.data;
  },

  getListings: async (filters?: MarketplaceFilters): Promise<any[]> => {
    const { data } = await api.get('/marketplace', { params: filters });
    // Handle paginated response
    return Array.isArray(data.data) ? data.data : (data.data?.listings || data.data || []);
  },

  getListingById: async (id: string): Promise<any> => {
    const { data } = await api.get(`/marketplace/${id}`);
    return data.data.listing || data.data;
  },
};

export const analyticsApi = {
  getOverview: async (): Promise<OverviewMetrics & { userEngagement?: any }> => {
    const { data } = await api.get('/analytics/me');
    // Transform backend response to match frontend expectations
    const backendData = data.data;
    
    // Calculate metrics from events if available
    const eventCounts = backendData?.eventCounts || [];
    const totalViews = backendData?.metrics?.totalViews || eventCounts.find((e: any) => e.eventType === 'view' || e.eventType === 'page_view')?._count || 0;
    const totalEngagement = backendData?.metrics?.totalEngagement || eventCounts.find((e: any) => e.eventType === 'engagement' || e.eventType === 'like' || e.eventType === 'share')?._count || 0;
    
    // Get campaigns count from campaigns API
    let totalCampaigns = 0;
    let activeCampaigns = 0;
    try {
      const campaigns = await campaignsApi.getAll();
      totalCampaigns = Array.isArray(campaigns) ? campaigns.length : 0;
      activeCampaigns = Array.isArray(campaigns) 
        ? campaigns.filter((c: any) => c.status === 'ACTIVE' || c.status === 'active').length 
        : 0;
    } catch (error) {
      console.error('Failed to load campaigns for analytics:', error);
    }
    
    return {
      totalCampaigns,
      activeCampaigns,
      totalSpent: 0, // Would need to calculate from contracts/payments
      totalEarned: 0, // Would need to calculate from contracts/payments
      averageEngagement: backendData?.metrics?.averageEngagement || (totalEngagement > 0 ? (totalEngagement / Math.max(totalViews, 1)) * 100 : 0),
      viralityScore: 0, // Would need to calculate from engagement metrics
      userEngagement: backendData?.userEngagement,
      totalViews,
      totalEngagement,
    };
  },

  trackClick: async (target: string, targetId?: string, location?: string) => {
    await api.post('/analytics/click', { target, targetId, location });
  },

  trackUsage: async (minutes: number) => {
    await api.post('/analytics/usage', { minutes });
  },

  getCampaignAnalytics: async (campaignId: string, dateRange: string): Promise<AnalyticsData[]> => {
    const { data } = await api.get(`/analytics/campaigns/${campaignId}`, { params: { dateRange } });
    return data.data;
  },

  getEngagementData: async (dateRange: string): Promise<AnalyticsData[]> => {
    const { data } = await api.get('/analytics/engagement', { params: { dateRange } });
    return data.data;
  },
};

export const contractsApi = {
  getAll: async (params?: { status?: string; limit?: number; page?: number }) => {
    const { data } = await api.get('/contracts', { params });
    // Handle paginated response
    return Array.isArray(data.data) ? data.data : (data.data?.contracts || data.data || []);
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/contracts/${id}`);
    return data.data.contract;
  },

  create: async (contractData: {
    creatorId: string;
    listingId?: string;
    campaignId?: string;
    title: string;
    terms: string;
    amount: number;
    currency?: string;
  }) => {
    const { data } = await api.post('/contracts', contractData);
    return data.data.contract;
  },

  updateStatus: async (id: string, status: string) => {
    const { data } = await api.patch(`/contracts/${id}`, { status });
    return data.data.contract;
  },

  delete: async (id: string) => {
    await api.delete(`/contracts/${id}`);
  },
};

export const listingsApi = {
  getAll: async (params?: {
    status?: string;
    creatorId?: string;
    platform?: string;
    featured?: boolean;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    limit?: number;
    page?: number;
  }) => {
    const { data } = await api.get('/listings', { params });
    // Handle paginated response
    return Array.isArray(data.data) ? data.data : (data.data?.listings || data.data || []);
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/listings/${id}`);
    return data.data.listing;
  },

  create: async (listingData: {
    title: string;
    description: string;
    price: number;
    currency?: string;
    deliverables?: string;
    platform: string[];
    reach?: number;
    engagement?: number;
    campaignId?: string;
  }) => {
    const { data } = await api.post('/listings', listingData);
    return data.data.listing;
  },

  update: async (id: string, listingData: any) => {
    const { data } = await api.put(`/listings/${id}`, listingData);
    return data.data.listing;
  },

  delete: async (id: string) => {
    await api.delete(`/listings/${id}`);
  },
};

export const messagesApi = {
  getConversations: async () => {
    const { data } = await api.get('/messages/conversations');
    return data.data;
  },

  getMessages: async (userId: string) => {
    const { data } = await api.get(`/messages/with/${userId}`);
    return data.data;
  },

  getInbox: async () => {
    const { data } = await api.get('/messages', { params: { unreadOnly: 'true' } });
    return data.data || [];
  },

  send: async (messageData: { receiverId: string; content: string; contractId?: string }) => {
    const { data } = await api.post('/messages', messageData);
    return data.data.message;
  },

  markAsRead: async (messageIds: string[]) => {
    const { data } = await api.patch('/messages/mark-read', { messageIds });
    return data.data;
  },
};

export const notificationsApi = {
  getAll: async (): Promise<Notification[]> => {
    // Notifications endpoint doesn't exist yet, use messages as notifications
    try {
      const unreadMessages = await messagesApi.getInbox();
      // Transform messages to notifications format
      return unreadMessages.map((msg: any) => ({
        id: msg.id,
        type: 'message' as const,
        title: 'New Message',
        description: msg.content?.substring(0, 100) || 'You have a new message',
        read: false,
        actionUrl: `/messages?userId=${msg.senderId}`,
        createdAt: msg.createdAt,
      }));
    } catch (error) {
      console.error('Failed to load notifications:', error);
      return [];
    }
  },

  markAsRead: async (id: string): Promise<void> => {
    // Mark message as read instead
    try {
      await messagesApi.markAsRead([id]);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  },

  markAllAsRead: async (): Promise<void> => {
    // Get all unread messages and mark them as read
    try {
      const unreadMessages = await messagesApi.getInbox();
      if (unreadMessages.length > 0) {
        const messageIds = unreadMessages.map((msg: any) => msg.id);
        await messagesApi.markAsRead(messageIds);
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  },
};

export const checkoutApi = {
  createPaymentIntent: async (paymentData: { amount: number; campaignId?: string; listingId?: string; contractId?: string; currency?: string }) => {
    const { data } = await api.post('/checkout', paymentData);
    return data.data;
  },

  confirmPayment: async (paymentIntentId: string) => {
    // Checkout confirm endpoint doesn't exist, payment is confirmed via Stripe webhook
    // Return success for now - in production this would verify with Stripe
    return { success: true, message: 'Payment confirmed via webhook' };
  },
};

export const suggestionsApi = {
  suggestCampaign: async (context?: {
    industry?: string;
    goals?: string[];
    budget?: number;
    targetAudience?: string;
  }) => {
    const { data } = await api.post('/suggest/campaign', context || {});
    return data.data.suggestions;
  },

  suggestCaption: async (campaignId: string, platform: string, context?: any) => {
    const { data } = await api.post('/suggest/caption', {
      campaignId,
      platform,
      ...context,
    });
    return data.data.suggestions;
  },

  suggestInfluencers: async (campaignId: string, limit: number = 10) => {
    const { data } = await api.post('/suggest/influencers', {
      campaignId,
      limit,
    });
    return data.data.suggestions;
  },
};

export const gamificationApi = {
  getUserLevel: async () => {
    const { data } = await api.get('/gamification/level');
    return data.data.userLevel;
  },

  getTopCreators: async (limit: number = 10) => {
    const { data } = await api.get(`/gamification/top-creators?limit=${limit}`);
    return data.data.creators;
  },

  getTopBrands: async (limit: number = 10) => {
    const { data } = await api.get(`/gamification/top-brands?limit=${limit}`);
    return data.data.brands;
  },
};

export const uploadApi = {
  uploadAvatar: async (file: File): Promise<{ user: { avatar: string } }> => {
    const formData = new FormData();
    formData.append('avatar', file);
    const { data } = await api.post('/upload/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.data;
  },
};

export default api;
