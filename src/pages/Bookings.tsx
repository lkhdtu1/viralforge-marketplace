import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Trash2, Plus, Minus, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCart } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';
import { contractsApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function Bookings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { items, removeItem, updateQuantity, total, itemCount, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const contractPromises = items.map(item =>
        contractsApi.create({
          creatorId: item.creatorId,
          title: `${item.serviceType} Service`,
          terms: `Deliver ${item.quantity} ${item.serviceType}(s) as agreed`,
          amount: item.price * item.quantity,
          currency: 'USD',
        })
      );

      await Promise.all(contractPromises);
      
      toast({
        title: 'Bookings confirmed!',
        description: `${items.length} service(s) booked. Check your orders page.`,
      });
      
      clearCart();
      navigate('/orders');
    } catch (error: any) {
      toast({
        title: 'Booking failed',
        description: error.response?.data?.message || 'Failed to create contracts',
        variant: 'destructive',
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-muted/30 pt-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Calendar className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
          <h1 className="text-3xl font-bold mb-2">No bookings yet</h1>
          <p className="text-muted-foreground mb-6">
            Browse the marketplace and book creator services
          </p>
          <Link to="/marketplace">
            <Button variant="hero" size="lg">
              Browse Creators
              <ArrowRight className="w-4 h-4 ml-2" />
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Service Bookings</h1>
              <p className="text-muted-foreground">{itemCount} service{itemCount !== 1 ? 's' : ''} selected</p>
            </div>
            <Button variant="outline" onClick={clearCart}>
              Clear All
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="card-hover">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <Link to={`/creators/${item.creatorId}`}>
                          <Avatar className="w-20 h-20 shrink-0">
                            <AvatarImage src={item.creatorAvatar} alt={item.creatorName} />
                            <AvatarFallback className="text-xl">
                              {item.creatorName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </Link>

                        <div className="flex-1">
                          <Link to={`/creators/${item.creatorId}`}>
                            <h3 className="font-semibold hover:text-primary transition-colors">
                              {item.creatorName}
                            </h3>
                          </Link>
                          <Badge variant="secondary" className="mt-1 capitalize">
                            {item.serviceType}
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-2">
                            ${item.price} per {item.serviceType}
                          </p>

                          <div className="flex items-center gap-4 mt-4">
                            <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-bold">${item.price * item.quantity}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">${total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Platform Fee (5%)</span>
                      <span className="font-medium">${(total * 0.05).toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>${(total * 1.05).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    variant="hero" 
                    size="lg" 
                    className="w-full"
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                  >
                    {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Secure checkout • Money-back guarantee
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
