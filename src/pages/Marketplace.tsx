import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Instagram,
  Youtube,
  Twitter,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { listingsApi } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Image3D } from '@/components/Image3D';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  platform: string[];
  reach?: number;
  engagement?: number;
  deliverables?: string;
  creator: {
    id: string;
    displayName?: string;
    avatar?: string;
    isVerified: boolean;
  };
}

const platformIcons: Record<string, any> = {
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  tiktok: () => <span className="text-xs font-bold">TT</span>,
};

export default function Marketplace() {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  useEffect(() => {
    loadListings();
  }, [selectedPlatform, searchQuery]);

  const loadListings = async () => {
    setIsLoading(true);
    try {
      const params: any = { status: 'ACTIVE' };
      if (selectedPlatform !== 'all') params.platform = selectedPlatform;
      if (searchQuery) params.search = searchQuery;
      
      const data = await listingsApi.getAll(params);
      setListings(data);
    } catch (error) {
      console.error('Failed to load listings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBook = (listing: Listing) => {
    addItem({
      creatorId: listing.creator.id,
      creatorName: listing.creator.displayName || 'Creator',
      creatorAvatar: listing.creator.avatar || '',
      serviceType: listing.platform[0] as any,
      price: listing.price,
    });
    toast({
      title: 'Service Booked',
      description: `You've booked ${listing.title}. Check your bookings to proceed.`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Creator Marketplace</h1>
          <p className="text-muted-foreground">
            Browse and purchase creator services
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="twitter">Twitter/X</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => navigate('/bookings')}>
            <Briefcase className="w-4 h-4 mr-2" />
            My Bookings
          </Button>
        </div>

        {/* Listings Grid */}
        {listings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No listings found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or check back later
              </p>
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
                <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {listing.creator.avatar ? (
                          <Image3D
                            src={listing.creator.avatar}
                            alt={listing.creator.displayName || 'Creator'}
                            className="w-10 h-10 rounded-full"
                            intensity="low"
                            enableHover={true}
                          />
                        ) : (
                          <Avatar className="w-10 h-10">
                            <AvatarFallback>
                              {listing.creator.displayName?.charAt(0) || 'C'}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm">
                              {listing.creator.displayName || 'Creator'}
                            </p>
                            {listing.creator.isVerified && (
                              <CheckCircle2 className="w-4 h-4 text-primary" />
                            )}
                          </div>
                          <div className="flex gap-1 mt-1">
                            {listing.platform.slice(0, 3).map((p) => {
                              const Icon = platformIcons[p] || Filter;
                              return (
                                <Badge key={p} variant="outline" className="text-xs">
                                  {p}
                                </Badge>
                              );
                            })}
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
                            <TrendingUp className="w-3 h-3" />
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
                        <Button onClick={() => handleBook(listing)} className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all">
                          <Briefcase className="w-4 h-4 mr-2" />
                          Book Service
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
