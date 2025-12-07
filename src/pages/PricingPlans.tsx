import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  CheckCircle2, 
  ArrowRight, 
  Star,
  Zap,
  Crown,
  Building2,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const plans = {
  starter: {
    icon: Star,
    name: 'Starter',
    price: 0,
    description: 'Perfect for creators just getting started with brand partnerships',
    userType: 'For Creators',
    features: [
      'Create professional profile & portfolio',
      'Apply to 5 campaigns per month',
      'Basic performance analytics',
      'In-app messaging with brands',
      'Secure payment processing',
      'Community support',
    ],
    limits: [
      '5 campaign applications/month',
      'Standard support (48hr response)',
      'Basic profile customization',
    ],
    cta: 'Start Free',
    ctaLink: '/auth?mode=signup',
    popular: false,
    gradient: 'from-blue-500/10 to-cyan-500/10',
  },
  pro: {
    icon: Zap,
    name: 'Pro',
    price: 49,
    description: 'For serious creators and growing brands ready to scale partnerships',
    userType: 'For Creators & Brands',
    features: [
      'Everything in Starter, plus:',
      'Unlimited campaign applications',
      'Verified creator/brand badge',
      'Advanced analytics & virality tracking',
      'Priority support (24hr response)',
      'Early access to new campaigns',
      'Custom portfolio themes',
      'Weekly performance reports',
      'Media kit generator',
      'Direct brand/creator outreach',
    ],
    limits: [],
    cta: 'Start Pro Trial',
    ctaLink: '/auth?mode=signup&plan=pro',
    popular: true,
    gradient: 'from-purple-500/10 to-pink-500/10',
  },
  enterprise: {
    icon: Building2,
    name: 'Enterprise',
    price: 199,
    description: 'For agencies and large brands managing multiple campaigns at scale',
    userType: 'For Agencies & Large Brands',
    features: [
      'Everything in Pro, plus:',
      'Unlimited team members',
      'Custom API integrations',
      'Dedicated account manager',
      'White-label campaign pages',
      'Custom contract templates',
      'Bulk creator outreach (up to 100/day)',
      'Advanced team collaboration',
      'Priority platform features',
      'Custom analytics dashboards',
      'Quarterly strategy sessions',
      'SLA-backed uptime guarantee',
    ],
    limits: [],
    cta: 'Contact Sales',
    ctaLink: '/auth?mode=signup&plan=enterprise',
    popular: false,
    gradient: 'from-orange-500/10 to-red-500/10',
  },
};

const faqs = [
  {
    question: "Can I switch plans anytime?",
    answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any payments.",
  },
  {
    question: "Is there a contract or commitment?",
    answer: "No contracts required. All plans are month-to-month and you can cancel anytime with no penalties.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and can arrange invoicing for Enterprise customers.",
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a 14-day money-back guarantee on all paid plans. If you're not satisfied, we'll refund your payment.",
  },
];

export default function PricingPlans() {
  const { planType } = useParams<{ planType?: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const selectedPlan = planType && planType in plans ? plans[planType as keyof typeof plans] : null;

  const handlePlanClick = (planKey: string, planLink: string) => {
    // If user is already authenticated, check their current plan
    if (isAuthenticated) {
      // Default all users are on Starter (free) plan
      const currentPlan = 'starter';
      
      if (planKey === 'starter') {
        // Already on free plan
        toast({
          title: 'You\'re on the Starter plan',
          description: 'You already have access to all Starter features.',
        });
        navigate('/dashboard');
      } else if (planKey === 'pro') {
        // Upgrade to Pro
        toast({
          title: 'Upgrade to Pro',
          description: 'Redirecting to checkout...',
        });
        // In production, redirect to Stripe checkout
        setTimeout(() => {
          toast({
            title: 'Checkout Coming Soon',
            description: 'Payment integration will be available soon. Contact support for manual upgrade.',
          });
        }, 1000);
        navigate('/dashboard');
      } else if (planKey === 'enterprise') {
        // Enterprise - contact sales
        toast({
          title: 'Enterprise Plan',
          description: 'Please contact our sales team for enterprise pricing.',
        });
        navigate('/contact');
      }
      return;
    }
    // If not authenticated, navigate to signup with plan parameter
    navigate(planLink);
  };

  // If specific plan is selected, show detailed view
  if (selectedPlan) {
    const Icon = selectedPlan.icon;
    return (
      <div className="min-h-screen pt-16">
        <section className="py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto"
            >
              <Link to="/pricing" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
                ← Back to all plans
              </Link>

              <Card className={`border-0 shadow-2xl bg-gradient-to-br ${selectedPlan.gradient} relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                
                <CardHeader className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    {selectedPlan.popular && (
                      <Badge variant="default">Most Popular</Badge>
                    )}
                  </div>
                  <CardTitle className="text-3xl">{selectedPlan.name}</CardTitle>
                  <Badge variant="outline" className="w-fit">{selectedPlan.userType}</Badge>
                  <p className="text-muted-foreground mt-2">{selectedPlan.description}</p>
                </CardHeader>

                <CardContent className="relative space-y-8">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold">${selectedPlan.price}</span>
                      {selectedPlan.price > 0 && (
                        <span className="text-muted-foreground">/month</span>
                      )}
                    </div>
                    {selectedPlan.price === 0 && (
                      <p className="text-sm text-muted-foreground mt-1">Free forever, no credit card required</p>
                    )}
                    {selectedPlan.price > 0 && (
                      <p className="text-sm text-muted-foreground mt-1">Billed monthly, cancel anytime</p>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">What's included:</h3>
                    <ul className="space-y-3">
                      {selectedPlan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {selectedPlan.limits.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-4">Plan limits:</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {selectedPlan.limits.map((limit, i) => (
                          <li key={i}>• {limit}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button 
                    variant="hero" 
                    size="xl"
                    className="w-full"
                    onClick={() => handlePlanClick(planType!, selectedPlan.ctaLink)}
                  >
                    {selectedPlan.cta}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  // Show all plans comparison
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                <Sparkles className="w-4 h-4" />
                Simple, Transparent Pricing
              </span>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Choose the <span className="gradient-text">Perfect Plan</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground">
              Start free and scale as you grow. No hidden fees, cancel anytime.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-12 -mt-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {Object.entries(plans).map(([key, plan], index) => {
              const Icon = plan.icon;
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`h-full relative ${plan.popular ? 'border-primary shadow-glow' : 'border-0 shadow-soft'}`}>
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge variant="default">Most Popular</Badge>
                      </div>
                    )}
                    <CardContent className="p-6 space-y-6">
                      <div>
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                        <Badge variant="outline" className="mb-2 text-xs">{plan.userType}</Badge>
                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                      </div>

                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold">${plan.price}</span>
                          {plan.price > 0 && (
                            <span className="text-muted-foreground">/month</span>
                          )}
                        </div>
                      </div>

                      <ul className="space-y-3">
                        {plan.features.slice(0, 5).map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <div className="space-y-3">
                        <Link to={`/pricing/${key}`}>
                          <Button 
                            variant="outline" 
                            className="w-full"
                          >
                            View Details
                          </Button>
                        </Link>
                        <Button 
                          variant={plan.popular ? 'hero' : 'default'} 
                          className="w-full"
                          onClick={() => handlePlanClick(key, plan.ctaLink)}
                        >
                          {plan.cta}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-soft">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
