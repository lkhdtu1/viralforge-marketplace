import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  Briefcase
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usersApi, listingsApi } from '@/lib/api';
import { Image3D } from '@/components/Image3D';

const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  tiktok: () => <span className="font-bold">TT</span>,
  linkedin: () => <span className="font-bold">in</span>,
};

export default function CreatorProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [creator, setCreator] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const loadCreator = async () => {
      if (!id) return;
      try {
        const [userData, listingsData] = await Promise.all([
          usersApi.getById(id),
          listingsApi.getAll({ creatorId: id, status: 'ACTIVE' })
        ]);
        setCreator(userData);
        setListings(listingsData);
      } catch (error) {
        console.error('Failed to load creator:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCreator();
  }, [id]);


  if (!creator) {
    return (
      <div className="min-h-screen bg-muted/30 pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Creator Not Found</h1>
          <Button onClick={() => navigate('/discover')}>Back to Discover</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pt-16">
      <div className="bg-gradient-to-br from-primary/20 to-accent/20 py-12">
        <div className="container mx-auto px-4">
          <Button variant="ghost" size="sm" className="mb-6" onClick={() => navigate('/discover')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Discover
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-start gap-6"
          >
            {creator.avatar ? (
              <Image3D
                src={creator.avatar}
                alt={creator.displayName || 'Creator'}
                className="w-32 h-32 rounded-full border-4 border-background shadow-xl"
                intensity="medium"
                enableHover={true}
              />
            ) : (
              <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
                <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                  {creator.displayName?.charAt(0) || 'C'}
                </AvatarFallback>
              </Avatar>
            )}

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{creator.displayName || 'Creator'}</h1>
                {creator.isVerified && (
                  <Badge className="bg-primary">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-foreground mb-4 max-w-2xl">{creator.bio || 'No bio available'}</p>

              <div className="flex flex-wrap gap-3 mb-4">
                <Button onClick={handleContact} className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Creator
                </Button>
                {creator.website && (
                  <Button variant="outline" asChild>
                    <a href={creator.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Website
                    </a>
                  </Button>
                )}
              </div>

              {creator.socialLinks && (
                <div className="flex gap-2">
                  {Object.entries(creator.socialLinks).map(([platform, url]) => {
                    if (!url) return null;
                    const Icon = platformIcons[platform];
                    return Icon ? (
                      <Button key={platform} variant="outline" size="icon" asChild>
                        <a href={url as string} target="_blank" rel="noopener noreferrer">
                          <Icon className="w-4 h-4" />
                        </a>
                      </Button>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Services */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Services</h2>
        {listings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">No services available</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing: any) => (
              <Card key={listing.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{listing.title}</CardTitle>
                  <div className="flex gap-1 mt-2">
                    {listing.platform.map((p: string) => (
                      <Badge key={p} variant="outline" className="text-xs">{p}</Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {listing.description}
                  </p>
                  {(listing.reach || listing.engagement) && (
                    <div className="flex gap-4 text-xs text-muted-foreground mb-4">
                      {listing.reach && (
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {listing.reach.toLocaleString()} reach
                        </span>
                      )}
                      {listing.engagement && (
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {listing.engagement}% engagement
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-5 h-5 text-primary" />
                      <span className="text-2xl font-bold">${listing.price}</span>
                    </div>
                    <Button onClick={() => handleBook(listing)} className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all">
                      <Briefcase className="w-4 h-4 mr-2" />
                      Book Service
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
