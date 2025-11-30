import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase,
  TrendingUp,
  DollarSign,
  Star,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  MessageSquare,
  Calendar,
  BarChart3,
  Zap,
  ShoppingBag,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const earningsData = [
  { name: 'Jan', earnings: 2400 },
  { name: 'Feb', earnings: 3200 },
  { name: 'Mar', earnings: 2800 },
  { name: 'Apr', earnings: 4100 },
  { name: 'May', earnings: 3800 },
  { name: 'Jun', earnings: 5200 },
  { name: 'Jul', earnings: 4900 },
];

const recentOrders = [
  { id: '1', brand: 'TechCo', service: 'Instagram Story', status: 'completed', amount: 250, date: '2024-03-15' },
  { id: '2', brand: 'FashionBrand', service: 'YouTube Video', status: 'in-progress', amount: 800, date: '2024-03-18' },
  { id: '3', brand: 'FoodApp', service: 'TikTok Video', status: 'pending', amount: 400, date: '2024-03-20' },
  { id: '4', brand: 'HealthCo', service: 'Blog Post', status: 'completed', amount: 350, date: '2024-03-12' },
];

const statusIcons = {
  completed: CheckCircle2,
  'in-progress': Clock,
  pending: AlertCircle,
};

const statusColors: Record<string, string> = {
  completed: 'bg-success/10 text-success border-success/20',
  'in-progress': 'bg-primary/10 text-primary border-primary/20',
  pending: 'bg-warning/10 text-warning border-warning/20',
};

export default function CreatorDashboard() {
  const statCards = [
    {
      title: 'Total Earnings',
      value: '$12,450',
      change: '+18%',
      trend: 'up',
      icon: DollarSign,
    },
    {
      title: 'Active Projects',
      value: 8,
      change: '+3',
      trend: 'up',
      icon: Briefcase,
    },
    {
      title: 'Profile Views',
      value: '2.4K',
      change: '+12%',
      trend: 'up',
      icon: TrendingUp,
    },
    {
      title: 'Rating',
      value: '4.9',
      change: '+0.2',
      trend: 'up',
      icon: Star,
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">Creator Dashboard</h1>
            <p className="text-muted-foreground">Track your earnings and manage projects</p>
          </div>
          <div className="flex gap-3">
            <Link to="/orders">
              <Button variant="outline">
                <ShoppingBag className="w-4 h-4" />
                My Orders
              </Button>
            </Link>
            <Link to="/products">
              <Button variant="hero">
                <Plus className="w-4 h-4" />
                Add Service
              </Button>
            </Link>
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
          {/* Earnings Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Earnings Overview</CardTitle>
                <CardDescription>Your monthly earnings trend</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={earningsData}>
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
                      <Line 
                        type="monotone" 
                        dataKey="earnings" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/products" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Service
                  </Button>
                </Link>
                <Link to="/orders" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    View Orders
                  </Button>
                </Link>
                <Link to="/messages" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    View Messages
                  </Button>
                </Link>
                <Link to="/settings" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    My Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Orders</CardTitle>
                <CardDescription>Latest bookings from brands</CardDescription>
              </div>
              <Link to="/orders">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => {
                  const StatusIcon = statusIcons[order.status as keyof typeof statusIcons];
                  return (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${order.brand}`} />
                          <AvatarFallback>{order.brand[0]}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <h3 className="font-medium truncate">{order.brand}</h3>
                          <p className="text-sm text-muted-foreground">{order.service}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className={statusColors[order.status]}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {order.status}
                        </Badge>
                        <div className="text-right hidden sm:block">
                          <div className="font-medium">${order.amount}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(order.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
