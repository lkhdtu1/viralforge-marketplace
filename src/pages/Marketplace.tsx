import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Star,
  CheckCircle2,
  Instagram,
  Youtube,
  Twitter,
  Users,
  TrendingUp,
  MessageSquare,
  Heart,
  MapPin,
  Clock,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
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
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { marketplaceApi } from '@/lib/api';
import type { Creator, MarketplaceFilters } from '@/types';

const categories = [
  'Fashion', 'Technology', 'Health & Fitness', 'Beauty', 'Food', 
  'Travel', 'Lifestyle', 'Gaming', 'Education', 'Business'
];

const platforms = [
  { id: 'instagram', label: 'Instagram', icon: Instagram },
  { id: 'youtube', label: 'YouTube', icon: Youtube },
  { id: 'tiktok', label: 'TikTok', icon: () => <span className="text-sm font-bold">TT</span> },
  { id: 'twitter', label: 'Twitter/X', icon: Twitter },
];

const formatFollowers = (count: number) => {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
  return count.toString();
};

export default function Marketplace() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<MarketplaceFilters>({
    categories: [],
    platforms: [],
    minFollowers: 0,
    verified: false,
    sortBy: 'rating',
    sortOrder: 'desc',
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const loadCreators = async () => {
      setIsLoading(true);
      try {
        const data = await marketplaceApi.getCreators({
          ...filters,
          search: searchQuery,
        });
        setCreators(data);
      } catch (error) {
        console.error('Failed to load creators:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCreators();
  }, [filters, searchQuery]);

  const handleCategoryToggle = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories?.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...(prev.categories || []), category]
    }));
  };

  const handlePlatformToggle = (platform: string) => {
    setFilters(prev => ({
      ...prev,
      platforms: prev.platforms?.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...(prev.platforms || []), platform]
    }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      platforms: [],
      minFollowers: 0,
      verified: false,
      sortBy: 'rating',
      sortOrder: 'desc',
    });
  };

  const activeFiltersCount = 
    (filters.categories?.length || 0) + 
    (filters.platforms?.length || 0) + 
    (filters.verified ? 1 : 0) +
    (filters.minFollowers && filters.minFollowers > 0 ? 1 : 0);

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Categories</Label>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={filters.categories?.includes(category) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => handleCategoryToggle(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Platforms */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Platforms</Label>
        <div className="space-y-2">
          {platforms.map((platform) => (
            <div key={platform.id} className="flex items-center space-x-2">
              <Checkbox
                id={platform.id}
                checked={filters.platforms?.includes(platform.id)}
                onCheckedChange={() => handlePlatformToggle(platform.id)}
              />
              <label
                htmlFor={platform.id}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <platform.icon className="w-4 h-4" />
                {platform.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Followers Range */}
      <div>
        <Label className="text-sm font-medium mb-3 block">
          Minimum Followers: {formatFollowers(filters.minFollowers || 0)}
        </Label>
        <Slider
          value={[filters.minFollowers || 0]}
          onValueChange={([value]) => setFilters(prev => ({ ...prev, minFollowers: value }))}
          max={500000}
          step={10000}
          className="w-full"
        />
      </div>

      {/* Verified Only */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="verified"
          checked={filters.verified}
          onCheckedChange={(checked) => setFilters(prev => ({ ...prev, verified: !!checked }))}
        />
        <label htmlFor="verified" className="flex items-center gap-2 text-sm cursor-pointer">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          Verified creators only
        </label>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30 pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Creator Marketplace</h1>
          <p className="text-muted-foreground">
            Find the perfect creators for your next campaign
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search creators by name, niche, or keywords..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select
              value={filters.sortBy}
              onValueChange={(value: 'rating' | 'followers' | 'engagement') => 
                setFilters(prev => ({ ...prev, sortBy: value }))
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="followers">Most Followers</SelectItem>
                <SelectItem value="engagement">Best Engagement</SelectItem>
              </SelectContent>
            </Select>

            {/* Mobile Filter Button */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden relative">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Refine your creator search
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {filters.categories?.map((category) => (
              <Badge key={category} variant="secondary" className="pr-1">
                {category}
                <button
                  onClick={() => handleCategoryToggle(category)}
                  className="ml-1 p-0.5 hover:bg-muted rounded"
                  aria-label={`Remove ${category} filter`}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {filters.platforms?.map((platform) => (
              <Badge key={platform} variant="secondary" className="pr-1">
                {platforms.find(p => p.id === platform)?.label}
                <button
                  onClick={() => handlePlatformToggle(platform)}
                  className="ml-1 p-0.5 hover:bg-muted rounded"
                  aria-label={`Remove ${platform} filter`}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {filters.verified && (
              <Badge variant="secondary" className="pr-1">
                Verified only
                <button
                  onClick={() => setFilters(prev => ({ ...prev, verified: false }))}
                  className="ml-1 p-0.5 hover:bg-muted rounded"
                  aria-label="Remove verified filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        )}

        <div className="flex gap-6">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden md:block w-64 shrink-0">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold">Filters</h2>
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear all
                    </Button>
                  )}
                </div>
                <FilterContent />
              </CardContent>
            </Card>
          </aside>

          {/* Creator Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="h-80 animate-pulse bg-muted" />
                ))}
              </div>
            ) : creators.length === 0 ? (
              <Card className="p-12 text-center">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No creators found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search query
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {creators.map((creator, index) => (
                  <motion.div
                    key={creator.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link to={`/creators/${creator.id}`}>
                      <Card className="h-full card-hover overflow-hidden group">
                        <CardContent className="p-0">
                          {/* Cover/Avatar Section */}
                          <div className="relative h-24 bg-gradient-to-br from-primary/20 to-accent/20">
                            <Avatar className="absolute -bottom-8 left-4 w-16 h-16 border-4 border-card shadow-lg">
                              <AvatarImage src={creator.avatar} alt={creator.name} />
                              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                                {creator.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            {creator.verified && (
                              <div className="absolute top-3 right-3">
                                <Badge className="bg-primary/90">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Verified
                                </Badge>
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="pt-10 px-4 pb-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold group-hover:text-primary transition-colors">
                                  {creator.name}
                                </h3>
                                <p className="text-sm text-muted-foreground">@{creator.username}</p>
                              </div>
                              <div className="flex items-center gap-1 text-warning">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="text-sm font-medium">{creator.rating}</span>
                              </div>
                            </div>

                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {creator.bio}
                            </p>

                            {/* Categories */}
                            <div className="flex flex-wrap gap-1 mb-3">
                              {creator.categories.slice(0, 2).map((category) => (
                                <Badge key={category} variant="secondary" className="text-xs">
                                  {category}
                                </Badge>
                              ))}
                              {creator.categories.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{creator.categories.length - 2}
                                </Badge>
                              )}
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-2 pt-3 border-t">
                              <div className="text-center">
                                <div className="font-semibold text-sm">
                                  {formatFollowers(creator.followers)}
                                </div>
                                <div className="text-xs text-muted-foreground">Followers</div>
                              </div>
                              <div className="text-center">
                                <div className="font-semibold text-sm">
                                  {creator.engagement}%
                                </div>
                                <div className="text-xs text-muted-foreground">Engagement</div>
                              </div>
                              <div className="text-center">
                                <div className="font-semibold text-sm">
                                  ${creator.pricing.post}
                                </div>
                                <div className="text-xs text-muted-foreground">Per Post</div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
