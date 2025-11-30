import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  CheckCircle2,
  MapPin,
  Clock,
  Instagram,
  Youtube,
  Twitter,
  MessageSquare,
  Heart,
  Share2,
  ExternalLink,
  TrendingUp,
  Users,
  DollarSign,
  ShoppingCart
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { marketplaceApi } from '@/lib/api';
import type { Creator } from '@/types';

const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  tiktok: () => <span className="font-bold">TT</span>,
  linkedin: () => <span className="font-bold">in</span>,
};

const formatFollowers = (count: number) => {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
  return count.toString();
};

export default function CreatorProfile() {
  const { id } = useParams<{ id: string }>();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const loadCreator = async () => {
      if (!id) return;
      try {
        const data = await marketplaceApi.getCreatorById(id);
        setCreator(data || null);
      } catch (error) {
        console.error('Failed to load creator:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCreator();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 pt-16 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-muted/30 pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Creator Not Found</h1>
          <Link to="/marketplace">
            <Button variant="outline">Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pt-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/20 to-accent/20 py-12">
        <div className="container mx-auto px-4">
          <Link to="/marketplace">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketplace
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-start gap-6"
          >
            <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
              <AvatarImage src={creator.avatar} alt={creator.name} />
              <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                {creator.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{creator.name}</h1>
                {creator.verified && (
                  <Badge className="bg-primary">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mb-3">@{creator.username}</p>
              <p className="text-foreground mb-4 max-w-2xl">{creator.bio}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                {creator.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {creator.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Responds {creator.responseTime}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-warning text-warning" />
                  {creator.rating} ({creator.reviewCount} reviews)
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {creator.categories.map((category) => (
                  <Badge key={category} variant="secondary">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full md:w-auto">
              <Button variant="hero" size="lg">
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Creator
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Users className="w-6 h-6 mx-auto text-primary mb-2" />
                      <div className="text-2xl font-bold">{formatFollowers(creator.followers)}</div>
                      <div className="text-sm text-muted-foreground">Followers</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="w-6 h-6 mx-auto text-primary mb-2" />
                      <div className="text-2xl font-bold">{creator.engagement}%</div>
                      <div className="text-sm text-muted-foreground">Engagement</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <CheckCircle2 className="w-6 h-6 mx-auto text-primary mb-2" />
                      <div className="text-2xl font-bold">{creator.completedCampaigns}</div>
                      <div className="text-sm text-muted-foreground">Campaigns</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Star className="w-6 h-6 mx-auto text-warning mb-2" />
                      <div className="text-2xl font-bold">{creator.rating}</div>
                      <div className="text-sm text-muted-foreground">Rating</div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Social Platforms</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {creator.platforms.map((platform) => {
                      const Icon = platformIcons[platform.name] || ExternalLink;
                      return (
                        <div key={platform.name} className="flex items-center justify-between p-3 bg-muted rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-medium capitalize">{platform.name}</div>
                              <div className="text-sm text-muted-foreground">{platform.handle}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{formatFollowers(platform.followers)}</div>
                            <div className="text-sm text-muted-foreground">followers</div>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="portfolio">
                <Card>
                  <CardHeader>
                    <CardTitle>Portfolio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {creator.portfolio.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {creator.portfolio.map((item) => (
                          <div key={item.id} className="aspect-square bg-muted rounded-xl overflow-hidden">
                            <img
                              src={item.url}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        No portfolio items yet
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>Reviews ({creator.reviewCount})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 bg-muted rounded-xl">
                          <div className="flex items-center gap-3 mb-2">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback>B{i}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">Brand {i}</div>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, j) => (
                                  <Star key={j} className="w-3 h-3 fill-warning text-warning" />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-muted-foreground">
                            Great collaboration! Delivered high-quality content on time. Would definitely work with again.
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Pricing & Booking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(creator.pricing).map(([type, price]) => (
                  <div key={type} className="flex items-center justify-between p-3 bg-muted rounded-xl group">
                    <div>
                      <span className="capitalize font-medium">{type}</span>
                      <p className="text-sm text-muted-foreground">per {type}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">${price}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => addItem({
                          creatorId: creator.id,
                          creatorName: creator.name,
                          creatorAvatar: creator.avatar,
                          serviceType: type as 'post' | 'story' | 'video' | 'reel',
                          price: price,
                        })}
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Button variant="hero" className="flex-1" size="lg">
                    Invite to Campaign
                  </Button>
                  <Link to="/cart" className="shrink-0">
                    <Button variant="outline" size="lg">
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
