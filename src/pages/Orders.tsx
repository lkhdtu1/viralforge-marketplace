import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Download,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Order {
  id: string;
  orderNumber: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  services: { type: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
  deliverables?: { name: string; url: string }[];
}

const mockOrders: Order[] = [
  {
    id: 'order_1',
    orderNumber: 'ORD-2024-001',
    creatorId: 'creator_1',
    creatorName: 'Sarah Johnson',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    services: [
      { type: 'post', quantity: 3, price: 250 },
      { type: 'story', quantity: 5, price: 100 },
    ],
    total: 1250,
    status: 'completed',
    createdAt: '2024-11-20T10:00:00Z',
    completedAt: '2024-11-25T15:30:00Z',
    deliverables: [
      { name: 'Instagram Post 1', url: '#' },
      { name: 'Instagram Post 2', url: '#' },
      { name: 'Instagram Post 3', url: '#' },
    ],
  },
  {
    id: 'order_2',
    orderNumber: 'ORD-2024-002',
    creatorId: 'creator_2',
    creatorName: 'Mike Chen',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    services: [{ type: 'video', quantity: 1, price: 1200 }],
    total: 1200,
    status: 'in-progress',
    createdAt: '2024-11-22T14:00:00Z',
  },
  {
    id: 'order_3',
    orderNumber: 'ORD-2024-003',
    creatorId: 'creator_3',
    creatorName: 'Emma Wilson',
    creatorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    services: [
      { type: 'reel', quantity: 2, price: 450 },
    ],
    total: 900,
    status: 'pending',
    createdAt: '2024-11-26T09:00:00Z',
  },
];

const statusConfig = {
  pending: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10' },
  'in-progress': { icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  completed: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10' },
  cancelled: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
};

export default function Orders() {
  const [filter, setFilter] = useState<string>('all');

  const filteredOrders = filter === 'all' 
    ? mockOrders 
    : mockOrders.filter(o => o.status === filter);

  return (
    <div className="min-h-screen bg-muted/30 pt-16">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground mb-8">Track and manage your creator bookings</p>

          <Tabs value={filter} onValueChange={setFilter} className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value={filter} className="space-y-4">
              {filteredOrders.length === 0 ? (
                <Card className="p-12 text-center">
                  <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                  <p className="text-muted-foreground">
                    {filter === 'all' 
                      ? "You haven't placed any orders yet" 
                      : `No ${filter} orders`}
                  </p>
                </Card>
              ) : (
                filteredOrders.map((order, index) => {
                  const StatusIcon = statusConfig[order.status].icon;
                  
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="card-hover">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row gap-6">
                            <Avatar className="w-16 h-16 shrink-0">
                              <AvatarImage src={order.creatorAvatar} alt={order.creatorName} />
                              <AvatarFallback>{order.creatorName.charAt(0)}</AvatarFallback>
                            </Avatar>

                            <div className="flex-1 space-y-3">
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <div>
                                  <h3 className="font-semibold text-lg">{order.creatorName}</h3>
                                  <p className="text-sm text-muted-foreground">{order.orderNumber}</p>
                                </div>
                                <Badge 
                                  variant="secondary"
                                  className={`${statusConfig[order.status].bg} ${statusConfig[order.status].color}`}
                                >
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {order.status.replace('-', ' ')}
                                </Badge>
                              </div>

                              <div className="space-y-1">
                                {order.services.map((service, i) => (
                                  <p key={i} className="text-sm text-muted-foreground">
                                    {service.quantity}x {service.type} @ ${service.price} = ${service.quantity * service.price}
                                  </p>
                                ))}
                              </div>

                              <div className="flex flex-wrap items-center gap-2 pt-2">
                                <span className="text-sm text-muted-foreground">
                                  Ordered: {new Date(order.createdAt).toLocaleDateString()}
                                </span>
                                {order.completedAt && (
                                  <>
                                    <span className="text-muted-foreground">•</span>
                                    <span className="text-sm text-muted-foreground">
                                      Completed: {new Date(order.completedAt).toLocaleDateString()}
                                    </span>
                                  </>
                                )}
                              </div>

                              <div className="flex flex-wrap gap-2 pt-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Details
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Order Details</DialogTitle>
                                      <DialogDescription>{order.orderNumber}</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div>
                                        <h4 className="font-medium mb-2">Services</h4>
                                        {order.services.map((service, i) => (
                                          <div key={i} className="flex justify-between text-sm">
                                            <span>{service.quantity}x {service.type}</span>
                                            <span>${service.quantity * service.price}</span>
                                          </div>
                                        ))}
                                        <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                                          <span>Total</span>
                                          <span>${order.total}</span>
                                        </div>
                                      </div>
                                      {order.deliverables && (
                                        <div>
                                          <h4 className="font-medium mb-2">Deliverables</h4>
                                          <div className="space-y-2">
                                            {order.deliverables.map((file, i) => (
                                              <Button key={i} variant="outline" size="sm" className="w-full justify-between">
                                                {file.name}
                                                <Download className="w-4 h-4" />
                                              </Button>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <Button variant="outline" size="sm">
                                  <MessageSquare className="w-4 h-4 mr-2" />
                                  Message Creator
                                </Button>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-2xl font-bold">${order.total}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
