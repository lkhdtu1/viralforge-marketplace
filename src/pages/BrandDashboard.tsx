import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Megaphone,
  TrendingUp,
  DollarSign,
  Users,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Eye,
  MessageSquare,
  Calendar,
  BarChart3,
  Zap,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { campaignsApi, analyticsApi, contractsApi, marketplaceApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import type { Campaign, OverviewMetrics } from '@/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const chartData = [
  { name: 'Mon', impressions: 4000, engagements: 2400 },
  { name: 'Tue', impressions: 3000, engagements: 1398 },
  { name: 'Wed', impressions: 5000, engagements: 3800 },
  { name: 'Thu', impressions: 2780, engagements: 1908 },
  { name: 'Fri', impressions: 6890, engagements: 4800 },
  { name: 'Sat', impressions: 4390, engagements: 2800 },
  { name: 'Sun', impressions: 5490, engagements: 4300 },
];

const statusColors: Record<string, string> = {
  active: 'bg-success/10 text-success border-success/20',
  draft: 'bg-muted text-muted-foreground border-border',
  completed: 'bg-primary/10 text-primary border-primary/20',
  paused: 'bg-warning/10 text-warning border-warning/20',
};

export default function BrandDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [contracts, setContracts] = useState<any[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user || user.role !== 'brand') return;
      
      try {
        const [campaignsData, metricsData, contractsData] = await Promise.all([
          campaignsApi.getAll({ limit: 100 }),
          analyticsApi.getOverview().catch(() => null),
          contractsApi.getAll({ limit: 100 }).catch(() => [])
        ]);
        
        // Filter campaigns by current user (brand)
        const userCampaigns = Array.isArray(campaignsData) 
          ? campaignsData.filter((c: any) => c.brandId === user.id || c.brand?.id === user.id)
          : [];
        
        setCampaigns(userCampaigns);
        setMetrics(metricsData);
        
        // Filter contracts for this brand
        const brandContracts = Array.isArray(contractsData)
          ? contractsData.filter((c: any) => c.brandId === user.id)
          : [];
        setContracts(brandContracts);
        
        // Calculate total spent
        const spent = brandContracts
          .filter((c: any) => ['ACCEPTED', 'IN_PROGRESS', 'COMPLETED'].includes(c.status))
          .reduce((sum: number, c: any) => sum + (Number(c.amount) || 0), 0);
        setTotalSpent(spent);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [user]);

  const statCards = [
    {
      title: 'Total Campaigns',
      value: campaigns.length,
      change: '+12%',
      trend: 'up',
      icon: Megaphone,
    },
    {
      title: 'Active Campaigns',
      value: campaigns.filter((c: any) => c.status === 'ACTIVE' || c.status === 'active').length,
      change: '+5%',
      trend: 'up',
      icon: TrendingUp,
    },
    {
      title: 'Total Spent',
      value: `$${totalSpent.toLocaleString()}`,
      change: '+23%',
      trend: 'up',
      icon: DollarSign,
    },
    {
      title: 'Active Contracts',
      value: contracts.filter((c: any) => 
        ['PENDING', 'ACCEPTED', 'IN_PROGRESS'].includes(c.status)
      ).length,
      change: '+2',
      trend: 'up',
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Brand Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.displayName || 'Brand'}! Manage your campaigns and discover creators.
              </p>
            </div>
            <Link to="/campaigns/new">
              <Button variant="hero" size="lg" className="w-full md:w-auto">
                <Plus className="w-5 h-5 mr-2" />
                Create New Campaign
              </Button>
            </Link>
          </div>
          
          {/* Quick Feature Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Card className="border-primary/20 hover:border-primary/40 transition-colors cursor-pointer" onClick={() => navigate('/campaigns/new')}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Megaphone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Create Campaign</p>
                    <p className="text-xs text-muted-foreground">Launch a new campaign</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-primary/20 hover:border-primary/40 transition-colors cursor-pointer" onClick={() => navigate('/discover')}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Find Creators</p>
                    <p className="text-xs text-muted-foreground">Discover influencers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-primary/20 hover:border-primary/40 transition-colors cursor-pointer" onClick={() => navigate('/analytics')}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">View Analytics</p>
                    <p className="text-xs text-muted-foreground">Track performance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className={`flex items-center text-sm ${stat.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                      {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {stat.change}
                    </div>
                  </div>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.title}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Overview</CardTitle>
                <CardDescription>Weekly impressions and engagements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="impressionsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="engagementsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="name" className="text-xs fill-muted-foreground" />
                      <YAxis className="text-xs fill-muted-foreground" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '0.75rem'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="impressions" 
                        stroke="hsl(var(--primary))" 
                        fillOpacity={1}
                        fill="url(#impressionsGradient)" 
                        strokeWidth={2}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="engagements" 
                        stroke="hsl(var(--accent))" 
                        fillOpacity={1}
                        fill="url(#engagementsGradient)" 
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Brand Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">Brand Features</CardTitle>
                <CardDescription>Everything you need to grow</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/campaigns/new" className="block">
                  <Button variant="default" className="w-full justify-start bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Campaign
                  </Button>
                </Link>
                <Link to="/discover" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Discover Creators
                  </Button>
                </Link>
                <Link to="/marketplace" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Zap className="w-4 h-4 mr-2" />
                    Browse Marketplace
                  </Button>
                </Link>
                <Link to="/messages" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Messages
                  </Button>
                </Link>
                <Link to="/analytics" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics
                  </Button>
                </Link>
                <Link to="/bookings" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Briefcase className="w-4 h-4 mr-2" />
                    My Contracts
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* My Campaigns Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">My Campaigns</CardTitle>
                <CardDescription>Manage and track your campaigns</CardDescription>
              </div>
              <div className="flex gap-2">
                <Link to="/campaigns/new">
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    New Campaign
                  </Button>
                </Link>
                <Link to="/campaigns">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowUpRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {campaigns.length === 0 ? (
                <div className="text-center py-12">
                  <Megaphone className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first campaign to start working with creators
                  </p>
                  <Link to="/campaigns/new">
                    <Button variant="hero">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Campaign
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {campaigns.slice(0, 5).map((campaign) => (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Megaphone className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-medium truncate">{campaign.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{campaign.deadline ? new Date(campaign.deadline).toLocaleDateString() : 'No deadline'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className={statusColors[campaign.status]}>
                        {campaign.status}
                      </Badge>
                      <div className="text-right hidden sm:block">
                        <div className="font-medium">${campaign.budget.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Budget</div>
                      </div>
                      {campaign.metrics && (
                        <div className="hidden md:flex items-center gap-2">
                          <div className="text-right">
                            <div className="font-medium">{campaign.metrics.viralityScore}</div>
                            <div className="text-sm text-muted-foreground">Virality</div>
                          </div>
                          <Progress value={campaign.metrics.viralityScore} className="w-16" />
                        </div>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover">
                          <DropdownMenuItem onClick={() => navigate(`/campaigns/${campaign.id}`)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/campaigns/${campaign.id}/analytics`)}>
                            <BarChart3 className="w-4 h-4 mr-2" />
                            View Analytics
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Contracts Section */}
        {contracts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-6"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Active Contracts</CardTitle>
                    <CardDescription>Contracts with creators</CardDescription>
                  </div>
                  <Link to="/bookings">
                    <Button variant="ghost" size="sm">
                      View All
                      <ArrowUpRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {contracts
                    .filter((c: any) => ['PENDING', 'ACCEPTED', 'IN_PROGRESS'].includes(c.status))
                    .slice(0, 5)
                    .map((contract: any) => (
                      <div key={contract.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Users className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{contract.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {contract.creator?.displayName || 'Creator'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-semibold">${contract.amount}</p>
                            <Badge variant={contract.status === 'ACCEPTED' ? 'default' : 'secondary'}>
                              {contract.status}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/messages?userId=${contract.creatorId}`)}
                          >
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
