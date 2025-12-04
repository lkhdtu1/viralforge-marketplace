import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { contractsApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Contract {
  id: string;
  title: string;
  amount: number;
  status: string;
  createdAt: string;
  completedAt?: string;
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
}

const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
  PENDING: { icon: Clock, color: 'bg-yellow-500/10 text-yellow-600', label: 'Pending' },
  SIGNED: { icon: CheckCircle2, color: 'bg-blue-500/10 text-blue-600', label: 'Signed' },
  IN_PROGRESS: { icon: Clock, color: 'bg-purple-500/10 text-purple-600', label: 'In Progress' },
  COMPLETED: { icon: CheckCircle2, color: 'bg-green-500/10 text-green-600', label: 'Completed' },
  CANCELLED: { icon: XCircle, color: 'bg-red-500/10 text-red-600', label: 'Cancelled' },
};

export default function Orders() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    try {
      const data = await contractsApi.getAll();
      setContracts(data);
    } catch (error) {
      console.error('Failed to load contracts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await contractsApi.updateStatus(id, status);
      toast({ title: `Contract ${status.toLowerCase()}` });
      loadContracts();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update contract status',
        variant: 'destructive',
      });
    }
  };

  const filteredContracts = activeTab === 'all' 
    ? contracts 
    : contracts.filter(c => c.status.toLowerCase() === activeTab);

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Orders</h1>
            <p className="text-muted-foreground">
              {user?.role === 'brand' ? 'Contracts with creators' : 'Your active contracts'}
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {filteredContracts.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                    <p className="text-muted-foreground">
                      {user?.role === 'brand'
                        ? 'Browse the marketplace to hire creators'
                        : 'Apply to campaigns or wait for brands to hire you'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredContracts.map((contract, index) => {
                    const StatusIcon = statusConfig[contract.status]?.icon || Clock;
                    const otherParty = user?.role === 'brand' ? contract.creator : contract.brand;

                    return (
                      <motion.div
                        key={contract.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card>
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={otherParty?.avatar} />
                                <AvatarFallback>
                                  {otherParty?.displayName?.charAt(0) || 'U'}
                                </AvatarFallback>
                              </Avatar>

                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h3 className="font-semibold">{contract.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                      {user?.role === 'brand' ? 'Creator: ' : 'Brand: '}
                                      {otherParty?.displayName || 'Unknown'}
                                    </p>
                                  </div>
                                  <Badge className={statusConfig[contract.status]?.color}>
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {statusConfig[contract.status]?.label || contract.status}
                                  </Badge>
                                </div>

                                <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                                  <span className="font-semibold text-foreground text-lg">
                                    ${contract.amount}
                                  </span>
                                  <span>
                                    Created {new Date(contract.createdAt).toLocaleDateString()}
                                  </span>
                                  {contract.completedAt && (
                                    <span>
                                      Completed {new Date(contract.completedAt).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>

                                <div className="flex gap-2">
                                  {contract.status === 'PENDING' && user?.role === 'creator' && (
                                    <Button 
                                      size="sm" 
                                      onClick={() => handleUpdateStatus(contract.id, 'SIGNED')}
                                    >
                                      Accept Contract
                                    </Button>
                                  )}
                                  {contract.status === 'SIGNED' && (
                                    <Button 
                                      size="sm" 
                                      onClick={() => handleUpdateStatus(contract.id, 'IN_PROGRESS')}
                                    >
                                      Start Work
                                    </Button>
                                  )}
                                  {contract.status === 'IN_PROGRESS' && user?.role === 'creator' && (
                                    <Button 
                                      size="sm" 
                                      onClick={() => handleUpdateStatus(contract.id, 'COMPLETED')}
                                    >
                                      Mark Complete
                                    </Button>
                                  )}
                                  <Button size="sm" variant="outline">
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Message
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
