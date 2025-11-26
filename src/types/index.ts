// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'creator' | 'brand' | 'admin';
  verified: boolean;
  createdAt: string;
}

// Campaign types
export interface Campaign {
  id: string;
  title: string;
  description: string;
  brandId: string;
  brandName: string;
  brandLogo?: string;
  budget: number;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  category: string;
  requirements: string[];
  deliverables: string[];
  deadline: string;
  createdAt: string;
  metrics?: CampaignMetrics;
}

export interface CampaignMetrics {
  impressions: number;
  engagements: number;
  clicks: number;
  conversions: number;
  viralityScore: number;
}

// Creator types
export interface Creator {
  id: string;
  userId: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  followers: number;
  engagement: number;
  categories: string[];
  platforms: Platform[];
  portfolio: PortfolioItem[];
  pricing: {
    post: number;
    story: number;
    video: number;
    reel: number;
  };
  completedCampaigns: number;
  responseTime: string;
  location?: string;
}

export interface Platform {
  name: 'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'linkedin';
  handle: string;
  followers: number;
  verified: boolean;
}

export interface PortfolioItem {
  id: string;
  type: 'image' | 'video' | 'link';
  url: string;
  thumbnail?: string;
  title: string;
  metrics?: {
    views: number;
    likes: number;
    comments: number;
  };
}

// Message types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: Attachment[];
}

export interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  lastMessage?: Message;
  unreadCount: number;
  campaignId?: string;
  campaignTitle?: string;
}

export interface Attachment {
  id: string;
  type: 'image' | 'file' | 'link';
  url: string;
  name: string;
  size?: number;
}

// Payment types
export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  method: 'card' | 'paypal' | 'bank';
  createdAt: string;
  campaignId?: string;
}

export interface EscrowTransaction {
  id: string;
  campaignId: string;
  amount: number;
  status: 'held' | 'released' | 'disputed' | 'refunded';
  createdAt: string;
  releasedAt?: string;
  milestone?: string;
}

// Analytics types
export interface AnalyticsData {
  date: string;
  impressions: number;
  engagements: number;
  clicks: number;
  conversions: number;
  viralityScore: number;
}

export interface OverviewMetrics {
  totalCampaigns: number;
  activeCampaigns: number;
  totalSpent: number;
  totalEarned: number;
  averageEngagement: number;
  viralityScore: number;
}

// Notification types
export interface Notification {
  id: string;
  type: 'campaign' | 'message' | 'payment' | 'system';
  title: string;
  description: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

// Filter types
export interface MarketplaceFilters {
  search?: string;
  categories?: string[];
  platforms?: string[];
  minFollowers?: number;
  maxFollowers?: number;
  minEngagement?: number;
  maxBudget?: number;
  verified?: boolean;
  sortBy?: 'rating' | 'followers' | 'engagement' | 'price';
  sortOrder?: 'asc' | 'desc';
}

// Campaign builder types
export interface CampaignDraft {
  brief: {
    title: string;
    description: string;
    category: string;
    requirements: string[];
    deliverables: string[];
  };
  creatives: {
    guidelines: string;
    examples: string[];
    doList: string[];
    dontList: string[];
  };
  distribution: {
    platforms: string[];
    targetAudience: string;
    regions: string[];
    timeline: {
      start: string;
      end: string;
    };
  };
  budget: {
    total: number;
    perCreator: number;
    escrowEnabled: boolean;
    milestones: {
      name: string;
      percentage: number;
    }[];
  };
}
