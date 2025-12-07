import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase,
  TrendingUp,
  DollarSign,
  Plus,
  ArrowUpRight,
  MessageSquare,
  Calendar,
  Eye,
  Zap,
  CheckCircle2,
  Clock,
  AlertCircle,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { campaignsApi, contractsApi, listingsApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import type { Campaign } from '@/types';

export default function CreatorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [activeContracts, setActiveContracts] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        const [campaignsData, contractsData, listingsData] = await Promise.all([
          campaignsApi.getAll({ status: 'ACTIVE', limit: 10 }),
          contractsApi.getAll({ limit: 100 }).catch(() => []),
          listingsApi.getAll({ creatorId: user.id }).catch(() => [])
        ]);
        
        setCampaigns(Array.isArray(campaignsData) ? campaignsData : []);
        
        const contractsArray = Array.isArray(contractsData) ? contractsData : [];
        setContracts(contractsArray);
        
        // Filter contracts for this creator
        const myContracts = contractsArray.filter((c: any) => c.creatorId === user.id);
        setActiveContracts(myContracts.filter((c: any) => 
          ['PENDING', 'ACCEPTED', 'IN_PROGRESS'].includes(c.status)
        ).length);
        
        // Calculate total earnings from completed contracts
        const earnings = myContracts
          .filter((c: any) => c.status === 'COMPLETED')
          .reduce((sum: number, c: any) => sum + (Number(c.amount) || 0), 0);
        setTotalEarnings(earnings);
        
        setListings(Array.isArray(listingsData) ? listingsData : []);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [user]);

  const statCards = [
    {
      title: 'Total Earnings',
      value: `$${totalEarnings.toLocaleString()}`,
      change: '+0%',
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: 'Active Contracts',
      value: activeContracts.toString(),
      change: '+0',
      icon: Briefcase,
      color: 'text-blue-600',
    },
    {
      title: 'My Services',
      value: listings.length.toString(),
      change: 'Active',
      icon: Package,
      color: 'text-purple-600',
    },
    {
      title: 'Available Campaigns',
      value: campaigns.length.toString(),
      change: 'New',
      icon: Zap,
      color: 'text-orange-600',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Creator Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.displayName || 'Creator'}! Browse campaigns and manage your services.
          </p>
        </div>

        {/* Quick Feature Cards for Creators */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="border-primary/20 hover:border-primary/40 transition-colors cursor-pointer" onClick={() => navigate('/services/manage')}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Manage Services</p>
                  <p className="text-xs text-muted-foreground">Create & edit services</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-primary/20 hover:border-primary/40 transition-colors cursor-pointer" onClick={() => navigate('/campaigns')}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Browse Campaigns</p>
                  <p className="text-xs text-muted-foreground">Apply to opportunities</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-primary/20 hover:border-primary/40 transition-colors cursor-pointer" onClick={() => navigate('/bookings')}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">My Contracts</p>
                  <p className="text-xs text-muted-foreground">View bookings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change} from last month</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Available Campaigns */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Available Campaigns</CardTitle>
                <CardDescription>Browse and apply to brand campaigns</CardDescription>
              </div>
              <Button onClick={() => navigate('/campaigns')}>
                View All
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {campaigns.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No active campaigns available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {campaigns.slice(0, 5).map((campaign) => (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/campaigns/${campaign.id}`)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{campaign.title}</h3>
                        <Badge>{campaign.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {campaign.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-6 ml-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Budget</p>
                        <p className="font-semibold">${campaign.budget.toLocaleString()}</p>
                      </div>
                      {campaign.deadline && (
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Deadline</p>
                          <p className="font-semibold text-sm">
                            {new Date(campaign.deadline).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      <Button size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>My Listings</CardTitle>
              <CardDescription>Manage your service offerings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Package className="w-12 h-12 mx-auto mb-4 text-primary opacity-50" />
                <p className="text-muted-foreground mb-4">Create and manage your services</p>
                <Button onClick={() => navigate('/services/manage')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Manage Services
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Contracts</CardTitle>
              <CardDescription>Active and pending contracts</CardDescription>
            </CardHeader>
            <CardContent>
              {contracts.filter((c: any) => c.creatorId === user?.id).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No contracts yet</p>
                  <p className="text-sm mt-2">Apply to campaigns to get started</p>
                  <Button variant="outline" className="mt-4" onClick={() => navigate('/campaigns')}>
                    Browse Campaigns
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {contracts
                    .filter((c: any) => c.creatorId === user?.id)
                    .slice(0, 3)
                    .map((contract: any) => (
                      <div key={contract.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{contract.title}</p>
                          <p className="text-xs text-muted-foreground">${contract.amount}</p>
                        </div>
                        <Badge variant={contract.status === 'ACCEPTED' ? 'default' : 'secondary'}>
                          {contract.status}
                        </Badge>
                      </div>
                    ))}
                  <Button variant="outline" className="w-full mt-2" onClick={() => navigate('/bookings')}>
                    View All Contracts
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Messages Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Messages</CardTitle>
            <CardDescription>Communication with brands</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No messages</p>
              <Button variant="outline" className="mt-4" onClick={() => navigate('/messages')}>
                View Messages
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
