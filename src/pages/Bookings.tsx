import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, Clock, DollarSign, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { contractsApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Booking {
  id: string;
  title: string;
  creator?: {
    id: string;
    displayName?: string;
    avatar?: string;
  };
  brand?: {
    id: string;
    displayName?: string;
    avatar?: string;
  };
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function Bookings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const loadBookings = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const contracts = await contractsApi.getAll();
        setBookings(Array.isArray(contracts) ? contracts : []);
      } catch (error: any) {
        console.error('Failed to load bookings:', error);
        toast({
          title: 'Failed to load bookings',
          description: error.response?.data?.error?.message || 'Please try again later',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, [user, toast]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string }> = {
      PENDING: { variant: 'outline', label: 'Pending' },
      ACCEPTED: { variant: 'default', label: 'Accepted' },
      IN_PROGRESS: { variant: 'default', label: 'In Progress' },
      COMPLETED: { variant: 'default', label: 'Completed' },
      CANCELLED: { variant: 'destructive', label: 'Cancelled' },
      REJECTED: { variant: 'destructive', label: 'Rejected' },
    };
    
    const statusInfo = statusMap[status] || { variant: 'secondary' as const, label: status };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'ACCEPTED':
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'CANCELLED':
      case 'REJECTED':
        return <XCircle className="w-5 h-5 text-destructive" />;
      default:
        return <AlertCircle className="w-5 h-5 text-warning" />;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true;
    return booking.status === activeTab.toUpperCase();
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen bg-muted/30 pt-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Briefcase className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
          <h1 className="text-3xl font-bold mb-2">No bookings yet</h1>
          <p className="text-muted-foreground mb-6">
            {user?.role === 'brand' 
              ? 'Your campaign applications and contracts will appear here'
              : 'Your service bookings and contracts will appear here'}
          </p>
          <Link to={user?.role === 'brand' ? '/campaigns' : '/marketplace'}>
            <Button variant="hero" size="lg">
              {user?.role === 'brand' ? 'Browse Campaigns' : 'Browse Marketplace'}
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pt-16">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Service Bookings</h1>
            <p className="text-muted-foreground">
              Manage your contracts and service agreements
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All ({bookings.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredBookings.map((booking) => {
                const partner = user?.role === 'brand' ? booking.creator : booking.brand;
                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="card-hover">
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <Link to={partner ? `/creators/${partner.id}` : '#'}>
                            <Avatar className="w-16 h-16 shrink-0">
                              <AvatarImage src={partner?.avatar} alt={partner?.displayName} />
                              <AvatarFallback className="text-xl">
                                {partner?.displayName?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                          </Link>

                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <Link to={partner ? `/creators/${partner.id}` : '#'}>
                                  <h3 className="font-semibold hover:text-primary transition-colors">
                                    {booking.title}
                                  </h3>
                                </Link>
                                {partner && (
                                  <p className="text-sm text-muted-foreground">
                                    {user?.role === 'brand' ? 'Creator' : 'Brand'}: {partner.displayName || 'User'}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(booking.status)}
                                {getStatusBadge(booking.status)}
                              </div>
                            </div>

                            <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                <span className="font-medium text-foreground">
                                  {booking.currency} {booking.amount.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {new Date(booking.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>
                                  Updated {new Date(booking.updatedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/orders`)}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
