import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Star,
  CheckCircle2,
  Instagram,
  Youtube,
  Twitter,
  Users,
  TrendingUp,
  DollarSign,
  ShoppingCart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { listingsApi, marketplaceApi } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface Creator {
  id: string;
  userId: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  verified: boolean;
  isVerified?: boolean;
  rating: number;
  reviewCount: number;
  followers: number;
  engagement: number;
  categories: string[];
  platforms: any[];
  portfolio: any[];
  pricing: {
    post: number;
    story: number;
    video: number;
    reel: number;
  };
  completedCampaigns: number;
  responseTime: string;
  listings: Array<{
    id: string;
    title: string;
    price: number;
    platform: string[];
  }>;
}

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  platform: string[];
  reach?: number;
  engagement?: number;
  creator: {
    id: string;
    displayName?: string;
    avatar?: string;
    isVerified: boolean;
  };
}

const platforms = [
  { id: 'instagram', label: 'Instagram', icon: Instagram },
  { id: 'youtube', label: 'YouTube', icon: Youtube },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'twitter', label: 'Twitter/X', icon: Twitter },
];

export default function Discover() {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('creators');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Creators state
  const [creators, setCreators] = useState<Creator[]>([]);
  const [creatorsLoading, setCreatorsLoading] = useState(false);
  
  // Listings state
  const [listings, setListings] = useState<Listing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  
  // Filters
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);

  useEffect(() => {
    if (activeTab === 'creators') {
      loadCreators();
    } else {
      loadListings();
    }
  }, [activeTab, searchQuery, verifiedOnly, selectedPlatforms]);

  const loadCreators = async () => {
    setCreatorsLoading(true);
    try {
      const params: any = {};
      if (searchQuery) params.search = searchQuery;
      if (verifiedOnly) params.verified = 'true';
      
      const creatorsData = await marketplaceApi.getCreators(params);
      // Transform API response to match local Creator type
      const transformedCreators = Array.isArray(creatorsData) 
        ? creatorsData.map((c: any) => ({
            id: c.id,
            userId: c.id,
            name: c.displayName || 'Creator',
            username: c.email?.split('@')[0] || 'user',
            avatar: c.avatar || '',
            bio: c.bio || '',
            verified: c.isVerified || false,
            isVerified: c.isVerified || false,
            rating: 0,
            reviewCount: 0,
            followers: 0,
            engagement: 0,
            categories: [],
            platforms: [],
            portfolio: [],
            pricing: { post: 0, story: 0, video: 0, reel: 0 },
            completedCampaigns: 0,
            responseTime: '',
            listings: [],
          }))
        : [];
      setCreators(transformedCreators);
    } catch (error) {
      console.error('Failed to load creators:', error);
      toast({
        title: 'Failed to load creators',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setCreatorsLoading(false);
    }
  };

  const loadListings = async () => {
    setListingsLoading(true);
    try {
      const params: any = { status: 'ACTIVE' };
      if (searchQuery) params.search = searchQuery;
      if (selectedPlatforms.length > 0) params.platform = selectedPlatforms[0];
      if (priceRange[0] > 0) params.minPrice = priceRange[0];
      if (priceRange[1] < 10000) params.maxPrice = priceRange[1];
      
      const data = await listingsApi.getAll(params);
      setListings(data);
    } catch (error) {
      console.error('Failed to load listings:', error);
    } finally {
      setListingsLoading(false);
    }
  };

  const handleAddToCart = (listing: Listing) => {
    addItem({
      creatorId: listing.creator.id,
      creatorName: listing.creator.displayName || 'Creator',
      creatorAvatar: listing.creator.avatar || '',
      serviceType: listing.platform[0] as any,
      price: listing.price,
    });
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const clearFilters = () => {
    setVerifiedOnly(false);
    setSelectedPlatforms([]);
    setPriceRange([0, 10000]);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-muted/30 pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Discover</h1>
          <p className="text-muted-foreground">
            Find creators and services for your campaigns
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search creators or services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="space-y-6 mt-6">
                {/* Verified Only */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="verified"
                    checked={verifiedOnly}
                    onCheckedChange={(checked) => setVerifiedOnly(checked as boolean)}
                  />
                  <Label htmlFor="verified">Verified creators only</Label>
                </div>

                {/* Platforms */}
                <div>
                  <Label className="mb-3 block">Platforms</Label>
                  <div className="space-y-2">
                    {platforms.map((platform) => (
                      <div key={platform.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={platform.id}
                          checked={selectedPlatforms.includes(platform.id)}
                          onCheckedChange={() => togglePlatform(platform.id)}
                        />
                        <Label htmlFor={platform.id}>{platform.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range (for services) */}
                {activeTab === 'services' && (
                  <div>
                    <Label className="mb-3 block">
                      Price Range: ${priceRange[0]} - ${priceRange[1]}
                    </Label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={10000}
                      step={100}
                      className="mt-2"
                    />
                  </div>
                )}

                <Button onClick={clearFilters} variant="outline" className="w-full">
                  Clear Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <Button variant="outline" onClick={() => navigate('/cart')}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Cart
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="creators">Creators</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>

          {/* Creators Tab */}
          <TabsContent value="creators">
            {creatorsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : creators.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No creators found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {creators.map((creator) => (
                  <motion.div
                    key={creator.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer"
                          onClick={() => navigate(`/creators/${creator.id}`)}>
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <Avatar className="w-16 h-16">
                            <AvatarImage src={creator.avatar} />
                            <AvatarFallback>
                              {creator.name?.charAt(0) || 'C'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">
                                {creator.name || 'Creator'}
                              </h3>
                              {creator.isVerified && (
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {creator.bio || 'No bio available'}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {creator.listings.length > 0 && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-2">
                              {creator.listings.length} service(s) available
                            </p>
                            <div className="flex gap-2 flex-wrap">
                              {creator.listings.slice(0, 2).map((listing) => (
                                <Badge key={listing.id} variant="outline" className="text-xs">
                                  ${listing.price}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            {listingsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : listings.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No services found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={listing.creator.avatar} />
                              <AvatarFallback>
                                {listing.creator.displayName?.charAt(0) || 'C'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-sm">
                                  {listing.creator.displayName || 'Creator'}
                                </p>
                                {listing.creator.isVerified && (
                                  <CheckCircle2 className="w-3 h-3 text-primary" />
                                )}
                              </div>
                              <div className="flex gap-1 mt-1">
                                {listing.platform.slice(0, 2).map((p) => (
                                  <Badge key={p} variant="outline" className="text-xs">
                                    {p}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <CardTitle className="text-lg">{listing.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col">
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                          {listing.description}
                        </p>

                        {(listing.reach || listing.engagement) && (
                          <div className="flex gap-4 text-xs text-muted-foreground mb-4">
                            {listing.reach && (
                              <div className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                {listing.reach.toLocaleString()} reach
                              </div>
                            )}
                            {listing.engagement && (
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                {listing.engagement}% engagement
                              </div>
                            )}
                          </div>
                        )}

                        <div className="mt-auto pt-4 border-t">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-5 h-5 text-primary" />
                              <span className="text-2xl font-bold">${listing.price}</span>
                            </div>
                            <Button onClick={() => handleAddToCart(listing)}>
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
