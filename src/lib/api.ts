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

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    // Mock response
    return {
      user: mockUser,
      token: 'mock_jwt_token_12345',
    };
  },

  signup: async (data: { email: string; password: string; name: string; role: 'creator' | 'brand' }) => {
    return {
      user: { ...mockUser, ...data },
      token: 'mock_jwt_token_12345',
    };
  },

  oauth: async (provider: 'google' | 'apple' | 'twitter') => {
    // In real app, this would redirect to OAuth flow
    return {
      redirectUrl: `/auth/oauth/${provider}`,
    };
  },

  logout: async () => {
    localStorage.removeItem('auth_token');
    return { success: true };
  },

  getCurrentUser: async () => {
    return mockUser;
  },
};

// Campaigns API
export const campaignsApi = {
  getAll: async (status?: string): Promise<Campaign[]> => {
    // Mock delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockCampaigns.filter(c => !status || c.status === status);
  },

  getById: async (id: string): Promise<Campaign | undefined> => {
    return mockCampaigns.find(c => c.id === id);
  },

  create: async (data: Partial<Campaign>): Promise<Campaign> => {
    const newCampaign: Campaign = {
      id: `campaign_${Date.now()}`,
      title: data.title || '',
      description: data.description || '',
      brandId: mockUser.id,
      brandName: mockUser.name,
      budget: data.budget || 0,
      status: 'draft',
      category: data.category || '',
      requirements: data.requirements || [],
      deliverables: data.deliverables || [],
      deadline: data.deadline || '',
      createdAt: new Date().toISOString(),
    };
    return newCampaign;
  },

  update: async (id: string, data: Partial<Campaign>): Promise<Campaign> => {
    const campaign = mockCampaigns.find(c => c.id === id);
    if (!campaign) throw new Error('Campaign not found');
    return { ...campaign, ...data };
  },

  delete: async (id: string): Promise<void> => {
    // Mock delete
  },
};

// Marketplace API
export const marketplaceApi = {
  getCreators: async (filters?: MarketplaceFilters): Promise<Creator[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    let results = [...mockCreators];
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      results = results.filter(c => 
        c.name.toLowerCase().includes(search) ||
        c.username.toLowerCase().includes(search) ||
        c.bio.toLowerCase().includes(search)
      );
    }
    
    if (filters?.categories?.length) {
      results = results.filter(c => 
        c.categories.some(cat => filters.categories?.includes(cat))
      );
    }
    
    if (filters?.verified) {
      results = results.filter(c => c.verified);
    }
    
    if (filters?.minFollowers) {
      results = results.filter(c => c.followers >= filters.minFollowers!);
    }
    
    if (filters?.sortBy) {
      results.sort((a, b) => {
        const order = filters.sortOrder === 'desc' ? -1 : 1;
        switch (filters.sortBy) {
          case 'rating': return (a.rating - b.rating) * order;
          case 'followers': return (a.followers - b.followers) * order;
          case 'engagement': return (a.engagement - b.engagement) * order;
          default: return 0;
        }
      });
    }
    
    return results;
  },

  getCreatorById: async (id: string): Promise<Creator | undefined> => {
    return mockCreators.find(c => c.id === id);
  },
};

// Analytics API
export const analyticsApi = {
  getOverview: async (): Promise<OverviewMetrics> => {
    return {
      totalCampaigns: 24,
      activeCampaigns: 8,
      totalSpent: 45000,
      totalEarned: 62000,
      averageEngagement: 4.8,
      viralityScore: 78,
    };
  },

  getCampaignAnalytics: async (campaignId: string, dateRange: string): Promise<AnalyticsData[]> => {
    return mockAnalyticsData;
  },

  getEngagementData: async (dateRange: string): Promise<AnalyticsData[]> => {
    return mockAnalyticsData;
  },
};

// Messages API
export const messagesApi = {
  getConversations: async (): Promise<Conversation[]> => {
    return mockConversations;
  },

  getMessages: async (conversationId: string): Promise<Message[]> => {
    return mockMessages.filter(m => m.conversationId === conversationId);
  },

  sendMessage: async (conversationId: string, content: string): Promise<Message> => {
    return {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: mockUser.id,
      senderName: mockUser.name,
      content,
      timestamp: new Date().toISOString(),
      read: false,
    };
  },
};

// Notifications API
export const notificationsApi = {
  getAll: async (): Promise<Notification[]> => {
    return mockNotifications;
  },

  markAsRead: async (id: string): Promise<void> => {},

  markAllAsRead: async (): Promise<void> => {},
};

// Checkout API
export const checkoutApi = {
  createPaymentIntent: async (data: { amount: number; campaignId: string }) => {
    return {
      clientSecret: 'mock_client_secret',
      paymentIntentId: `pi_${Date.now()}`,
    };
  },

  confirmPayment: async (paymentIntentId: string) => {
    return {
      status: 'succeeded',
      transactionId: `txn_${Date.now()}`,
    };
  },
};

// Mock Data
const mockUser: User = {
  id: 'user_1',
  email: 'john@example.com',
  name: 'John Doe',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
  role: 'brand',
  verified: true,
  createdAt: '2024-01-15T10:00:00Z',
};

const mockCampaigns: Campaign[] = [
  {
    id: 'campaign_1',
    title: 'Summer Fashion Collection Launch',
    description: 'Promote our new summer collection across social media platforms',
    brandId: 'brand_1',
    brandName: 'StyleCo',
    brandLogo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
    budget: 5000,
    status: 'active',
    category: 'Fashion',
    requirements: ['Min 10k followers', 'Fashion niche', 'High engagement'],
    deliverables: ['3 Instagram posts', '5 Stories', '1 Reel'],
    deadline: '2024-12-30',
    createdAt: '2024-11-01T10:00:00Z',
    metrics: {
      impressions: 125000,
      engagements: 8500,
      clicks: 2100,
      conversions: 156,
      viralityScore: 82,
    },
  },
  {
    id: 'campaign_2',
    title: 'Tech Product Review',
    description: 'In-depth review of our latest gadget',
    brandId: 'brand_2',
    brandName: 'TechGear',
    budget: 3000,
    status: 'active',
    category: 'Technology',
    requirements: ['Tech reviewer', 'YouTube presence'],
    deliverables: ['1 YouTube video', '2 Tweets'],
    deadline: '2024-12-15',
    createdAt: '2024-11-10T10:00:00Z',
    metrics: {
      impressions: 75000,
      engagements: 4200,
      clicks: 890,
      conversions: 67,
      viralityScore: 65,
    },
  },
  {
    id: 'campaign_3',
    title: 'Fitness App Promotion',
    description: 'Showcase features of our fitness tracking app',
    brandId: 'brand_3',
    brandName: 'FitLife',
    budget: 8000,
    status: 'completed',
    category: 'Health & Fitness',
    requirements: ['Fitness influencer', 'Active lifestyle'],
    deliverables: ['4 Instagram posts', '1 IGTV'],
    deadline: '2024-10-30',
    createdAt: '2024-09-15T10:00:00Z',
    metrics: {
      impressions: 250000,
      engagements: 18000,
      clicks: 5600,
      conversions: 890,
      viralityScore: 91,
    },
  },
  {
    id: 'campaign_4',
    title: 'Organic Skincare Launch',
    description: 'Introduce our new organic skincare line',
    brandId: 'brand_4',
    brandName: 'PureGlow',
    budget: 4500,
    status: 'draft',
    category: 'Beauty',
    requirements: ['Beauty niche', 'Authentic reviews'],
    deliverables: ['2 YouTube videos', '3 Instagram posts'],
    deadline: '2025-01-15',
    createdAt: '2024-11-20T10:00:00Z',
  },
];

const mockCreators: Creator[] = [
  {
    id: 'creator_1',
    userId: 'user_c1',
    name: 'Sarah Johnson',
    username: 'sarahstyle',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    bio: 'Fashion & lifestyle content creator. Helping brands tell their story through authentic content.',
    verified: true,
    rating: 4.9,
    reviewCount: 127,
    followers: 85000,
    engagement: 6.2,
    categories: ['Fashion', 'Lifestyle', 'Beauty'],
    platforms: [
      { name: 'instagram', handle: '@sarahstyle', followers: 85000, verified: true },
      { name: 'tiktok', handle: '@sarahstyle', followers: 120000, verified: false },
    ],
    portfolio: [
      { id: 'p1', type: 'image', url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400', title: 'Summer Collection', metrics: { views: 45000, likes: 3200, comments: 89 } },
    ],
    pricing: { post: 250, story: 100, video: 500, reel: 350 },
    completedCampaigns: 45,
    responseTime: '< 2 hours',
    location: 'Los Angeles, CA',
  },
  {
    id: 'creator_2',
    userId: 'user_c2',
    name: 'Mike Chen',
    username: 'techmikereviews',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    bio: 'Tech enthusiast and reviewer. Making technology accessible for everyone.',
    verified: true,
    rating: 4.8,
    reviewCount: 89,
    followers: 250000,
    engagement: 4.5,
    categories: ['Technology', 'Gaming', 'Reviews'],
    platforms: [
      { name: 'youtube', handle: 'TechMikeReviews', followers: 250000, verified: true },
      { name: 'twitter', handle: '@techmike', followers: 45000, verified: true },
    ],
    portfolio: [],
    pricing: { post: 400, story: 150, video: 1200, reel: 600 },
    completedCampaigns: 78,
    responseTime: '< 4 hours',
    location: 'San Francisco, CA',
  },
  {
    id: 'creator_3',
    userId: 'user_c3',
    name: 'Emma Wilson',
    username: 'emmafitness',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    bio: 'Certified personal trainer sharing workout tips and healthy lifestyle content.',
    verified: true,
    rating: 4.95,
    reviewCount: 203,
    followers: 180000,
    engagement: 7.8,
    categories: ['Health & Fitness', 'Wellness', 'Nutrition'],
    platforms: [
      { name: 'instagram', handle: '@emmafitness', followers: 180000, verified: true },
      { name: 'youtube', handle: 'EmmaFitness', followers: 95000, verified: true },
    ],
    portfolio: [],
    pricing: { post: 350, story: 125, video: 800, reel: 450 },
    completedCampaigns: 112,
    responseTime: '< 1 hour',
    location: 'Miami, FL',
  },
  {
    id: 'creator_4',
    userId: 'user_c4',
    name: 'Alex Rivera',
    username: 'alexcooks',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    bio: 'Professional chef creating delicious recipes and food content for brands.',
    verified: false,
    rating: 4.7,
    reviewCount: 56,
    followers: 45000,
    engagement: 8.2,
    categories: ['Food', 'Cooking', 'Lifestyle'],
    platforms: [
      { name: 'instagram', handle: '@alexcooks', followers: 45000, verified: false },
      { name: 'tiktok', handle: '@alexcooks', followers: 78000, verified: false },
    ],
    portfolio: [],
    pricing: { post: 150, story: 60, video: 400, reel: 250 },
    completedCampaigns: 23,
    responseTime: '< 6 hours',
    location: 'New York, NY',
  },
  {
    id: 'creator_5',
    userId: 'user_c5',
    name: 'Zoe Taylor',
    username: 'zoetravels',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    bio: 'Travel photographer and storyteller. Exploring the world one destination at a time.',
    verified: true,
    rating: 4.85,
    reviewCount: 145,
    followers: 320000,
    engagement: 5.4,
    categories: ['Travel', 'Photography', 'Adventure'],
    platforms: [
      { name: 'instagram', handle: '@zoetravels', followers: 320000, verified: true },
      { name: 'youtube', handle: 'ZoeTravels', followers: 150000, verified: true },
    ],
    portfolio: [],
    pricing: { post: 500, story: 200, video: 1500, reel: 700 },
    completedCampaigns: 89,
    responseTime: '< 12 hours',
    location: 'London, UK',
  },
];

const mockAnalyticsData: AnalyticsData[] = [
  { date: '2024-11-01', impressions: 12000, engagements: 850, clicks: 210, conversions: 15, viralityScore: 72 },
  { date: '2024-11-02', impressions: 15000, engagements: 1100, clicks: 280, conversions: 22, viralityScore: 75 },
  { date: '2024-11-03', impressions: 18000, engagements: 1350, clicks: 340, conversions: 28, viralityScore: 78 },
  { date: '2024-11-04', impressions: 22000, engagements: 1600, clicks: 420, conversions: 35, viralityScore: 81 },
  { date: '2024-11-05', impressions: 19000, engagements: 1400, clicks: 380, conversions: 30, viralityScore: 79 },
  { date: '2024-11-06', impressions: 25000, engagements: 1850, clicks: 480, conversions: 42, viralityScore: 84 },
  { date: '2024-11-07', impressions: 28000, engagements: 2100, clicks: 550, conversions: 48, viralityScore: 87 },
];

const mockConversations: Conversation[] = [
  {
    id: 'conv_1',
    participants: [
      { id: 'user_1', name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
      { id: 'creator_1', name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
    ],
    lastMessage: {
      id: 'msg_1',
      conversationId: 'conv_1',
      senderId: 'creator_1',
      senderName: 'Sarah Johnson',
      content: 'Sure, I can start next week!',
      timestamp: '2024-11-25T14:30:00Z',
      read: false,
    },
    unreadCount: 2,
    campaignId: 'campaign_1',
    campaignTitle: 'Summer Fashion Collection',
  },
  {
    id: 'conv_2',
    participants: [
      { id: 'user_1', name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
      { id: 'creator_2', name: 'Mike Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
    ],
    lastMessage: {
      id: 'msg_2',
      conversationId: 'conv_2',
      senderId: 'user_1',
      senderName: 'John Doe',
      content: 'Thanks for the update!',
      timestamp: '2024-11-24T10:00:00Z',
      read: true,
    },
    unreadCount: 0,
    campaignId: 'campaign_2',
    campaignTitle: 'Tech Product Review',
  },
];

const mockMessages: Message[] = [
  { id: 'msg_1', conversationId: 'conv_1', senderId: 'user_1', senderName: 'John Doe', content: 'Hi Sarah! I loved your portfolio.', timestamp: '2024-11-25T10:00:00Z', read: true },
  { id: 'msg_2', conversationId: 'conv_1', senderId: 'creator_1', senderName: 'Sarah Johnson', content: 'Thank you! I\'d love to work on this campaign.', timestamp: '2024-11-25T10:15:00Z', read: true },
  { id: 'msg_3', conversationId: 'conv_1', senderId: 'user_1', senderName: 'John Doe', content: 'Great! When can you start?', timestamp: '2024-11-25T14:00:00Z', read: true },
  { id: 'msg_4', conversationId: 'conv_1', senderId: 'creator_1', senderName: 'Sarah Johnson', content: 'Sure, I can start next week!', timestamp: '2024-11-25T14:30:00Z', read: false },
];

const mockNotifications: Notification[] = [
  { id: 'notif_1', type: 'campaign', title: 'Campaign Update', description: 'Your Summer Fashion campaign reached 100k impressions!', read: false, actionUrl: '/dashboard/campaigns/campaign_1', createdAt: '2024-11-25T15:00:00Z' },
  { id: 'notif_2', type: 'message', title: 'New Message', description: 'Sarah Johnson sent you a message', read: false, actionUrl: '/messages/conv_1', createdAt: '2024-11-25T14:30:00Z' },
  { id: 'notif_3', type: 'payment', title: 'Payment Received', description: 'You received $500 from TechGear campaign', read: true, actionUrl: '/settings/billing', createdAt: '2024-11-24T10:00:00Z' },
  { id: 'notif_4', type: 'system', title: 'Account Verified', description: 'Your account has been verified successfully', read: true, createdAt: '2024-11-23T09:00:00Z' },
];

export default api;
