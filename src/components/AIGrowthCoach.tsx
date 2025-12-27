import { useState, useEffect, useCallback } from 'react';
import { Sparkles, TrendingUp, AlertCircle, Lightbulb, X, ChevronRight, MessageSquare, Zap, Target, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { suggestionsApi, gamificationApi, campaignsApi, listingsApi, analyticsApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useEngagementTracking } from '@/hooks/useEngagementTracking';

interface Suggestion {
  type: 'action' | 'warning' | 'tip';
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function AIGrowthCoach() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { trackClick } = useEngagementTracking();
  const [isOpen, setIsOpen] = useState(true);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userLevel, setUserLevel] = useState<any>(null);
  const [engagementStats, setEngagementStats] = useState<any>(null);

  useEffect(() => {
    loadSuggestions();
    loadUserLevel();
    loadEngagementStats();
    
    // Refresh suggestions every 5 minutes
    const interval = setInterval(() => {
      loadSuggestions();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [user]);

  const loadEngagementStats = async () => {
    if (!user) return;
    
    try {
      const data = await analyticsApi.getOverview();
      setEngagementStats(data.userEngagement);
    } catch (error) {
      console.error('Error loading engagement stats:', error);
    }
  };

  const handleSuggestionClick = useCallback((suggestion: Suggestion) => {
    trackClick('ai_suggestion', suggestion.title, window.location.pathname);
    if (suggestion.action) {
      suggestion.action.onClick();
    }
  }, [trackClick]);

  const loadSuggestions = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const newSuggestions: Suggestion[] = [];

      if (user.role === 'brand' || user.role === 'BRAND') {
        // Check for low campaign performance
        try {
          const campaigns = await campaignsApi.getAll({ status: 'ACTIVE' });
          const campaignsArray = Array.isArray(campaigns) ? campaigns : [];
          
          if (campaignsArray.length === 0) {
            newSuggestions.push({
              type: 'action',
              title: 'Create Your First Campaign',
              description: 'Start connecting with creators to promote your brand',
              action: {
                label: 'Create Campaign',
                onClick: () => (window.location.href = '/campaigns/new'),
              },
            });
          }

          // Check for inactive campaigns
          const inactiveCampaigns = campaignsArray.filter(
            (c: any) => c.status === 'PAUSED' || c.status === 'paused'
          );
          if (inactiveCampaigns.length > 0) {
            newSuggestions.push({
              type: 'warning',
              title: 'You Have Paused Campaigns',
              description: `${inactiveCampaigns.length} campaign(s) are paused. Consider reactivating them.`,
              action: {
                label: 'View Campaigns',
                onClick: () => (window.location.href = '/campaigns'),
              },
            });
          }
        } catch (error) {
          console.error('Error loading campaigns:', error);
        }

        // AI-powered campaign suggestions
        try {
          const aiSuggestions = await suggestionsApi.suggestCampaign();
          if (aiSuggestions && aiSuggestions.length > 0) {
            newSuggestions.push({
              type: 'tip',
              title: 'AI Campaign Idea',
              description: aiSuggestions[0].reasoning || 'Consider launching a new campaign to reach more audiences',
              action: {
                label: 'Get Suggestions',
                onClick: () => {
                  toast({
                    title: 'AI Suggestions',
                    description: 'Check the campaign builder for AI-powered suggestions',
                  });
                },
              },
            });
          }
        } catch (error) {
          console.error('Error loading AI suggestions:', error);
        }
      } else {
        // Creator suggestions
        try {
          const listings = await listingsApi.getAll();
          const listingsArray = Array.isArray(listings) ? listings : [];
          
          if (listingsArray.length === 0) {
            newSuggestions.push({
              type: 'action',
              title: 'Create Service Listings',
              description: 'Add service listings to start receiving campaign offers',
              action: {
                label: 'Create Listing',
                onClick: () => (window.location.href = '/services/manage'),
              },
            });
          }

          // Check for available campaigns
          const campaigns = await campaignsApi.getAll({ status: 'ACTIVE' });
          const campaignsArray = Array.isArray(campaigns) ? campaigns : [];
          
          if (campaignsArray.length > 0) {
            newSuggestions.push({
              type: 'tip',
              title: 'New Campaigns Available',
              description: `There are ${campaignsArray.length} active campaigns you can apply to`,
              action: {
                label: 'Browse Campaigns',
                onClick: () => (window.location.href = '/campaigns'),
              },
            });
          }
        } catch (error) {
          console.error('Error loading creator data:', error);
        }
      }

      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserLevel = async () => {
    if (!user) return;

    try {
      const level = await gamificationApi.getUserLevel();
      setUserLevel(level);
    } catch (error) {
      console.error('Error loading user level:', error);
    }
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed right-6 bottom-32 z-30"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        AI Coach
      </Button>
    );
  }

  return (
    <motion.div
      initial={{ x: 400 }}
      animate={{ x: 0 }}
      exit={{ x: 400 }}
        className="fixed right-6 bottom-32 z-30 w-96 max-h-[80vh] overflow-y-auto"
    >
      <Card className="shadow-2xl border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">AI Growth Coach</CardTitle>
                <CardDescription>Your personal assistant</CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* User Level & Engagement */}
          <div className="space-y-3">
            {userLevel && (
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Level {userLevel.level}</span>
                  <Badge variant="secondary">{userLevel.title}</Badge>
                </div>
                <div className="w-full bg-background rounded-full h-2 mb-1">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{
                      width: `${(userLevel.xp / (userLevel.xp + userLevel.xpToNext)) * 100}%`,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{userLevel.xp} XP</span>
                  <span>{userLevel.xpToNext} XP to next level</span>
                </div>
                {userLevel.rank > 0 && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Rank #{userLevel.rank} {user?.role === 'CREATOR' ? 'Creator' : 'Brand'}
                  </div>
                )}
              </div>
            )}

            {/* Engagement Stats */}
            {engagementStats && (
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-3 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Your Activity</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Logins:</span>
                    <span className="ml-1 font-semibold">{engagementStats.loginCount || 0}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Clicks:</span>
                    <span className="ml-1 font-semibold">{engagementStats.totalClicks || 0}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Usage:</span>
                    <span className="ml-1 font-semibold">{engagementStats.dailyUsageMinutes || 0}m</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Streak:</span>
                    <span className="ml-1 font-semibold">{engagementStats.streakDays || 0} days</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
              <p className="text-sm">Loading suggestions...</p>
            </div>
          ) : suggestions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">You're doing great! No suggestions at the moment.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold mb-2">Suggestions</h3>
              <AnimatePresence>
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Card className={`${
                      suggestion.type === 'warning' ? 'border-warning/50 bg-warning/5' :
                      suggestion.type === 'tip' ? 'border-primary/50 bg-primary/5' :
                      'border-border'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            suggestion.type === 'warning' ? 'bg-warning/20' :
                            suggestion.type === 'tip' ? 'bg-primary/20' :
                            'bg-success/20'
                          }`}>
                            {suggestion.type === 'warning' ? (
                              <AlertCircle className="w-4 h-4 text-warning" />
                            ) : suggestion.type === 'tip' ? (
                              <Lightbulb className="w-4 h-4 text-primary" />
                            ) : (
                              <TrendingUp className="w-4 h-4 text-success" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm mb-1">{suggestion.title}</h4>
                            <p className="text-xs text-muted-foreground mb-2">
                              {suggestion.description}
                            </p>
                            {suggestion.action && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="w-full"
                              >
                                {suggestion.action.label}
                                <ChevronRight className="w-3 h-3 ml-1" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => window.location.href = '/chat'}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat with AI
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

