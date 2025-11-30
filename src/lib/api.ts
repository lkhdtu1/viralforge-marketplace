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
};

export const campaignsApi = {
  getAll: async (params?: { status?: string; limit?: number; page?: number }): Promise<Campaign[]> => {
    const { data } = await api.get('/campaigns', { params });
    return data.data;
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
    const { data } = await api.get('/marketplace', { params: filters });
    return data.data;
  },

  getCreatorById: async (id: string): Promise<Creator> => {
    const { data } = await api.get(`/marketplace/${id}`);
    return data.data;
  },
};

export const analyticsApi = {
  getOverview: async (): Promise<OverviewMetrics> => {
    const { data } = await api.get('/analytics/me');
    return data.data;
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
    return data.data;
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
    return data.data;
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

  send: async (messageData: { receiverId: string; content: string; contractId?: string }) => {
    const { data } = await api.post('/messages', messageData);
    return data.data.message;
  },

  markAsRead: async (messageIds: string[]) => {
    const { data } = await api.patch('/messages/read', { messageIds });
    return data.data;
  },
};

export const notificationsApi = {
  getAll: async (): Promise<Notification[]> => {
    const { data } = await api.get('/notifications');
    return data.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await api.patch('/notifications/read-all');
  },
};

export const checkoutApi = {
  createPaymentIntent: async (paymentData: { amount: number; campaignId: string }) => {
    const { data } = await api.post('/checkout', paymentData);
    return data.data;
  },

  confirmPayment: async (paymentIntentId: string) => {
    const { data } = await api.post('/checkout/confirm', { paymentIntentId });
    return data.data;
  },
};

export default api;
