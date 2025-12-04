import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  Users, 
  TrendingUp, 
  Shield, 
  Zap,
  Star,
  CheckCircle2,
  Play,
  ArrowUpRight,
  Globe,
  BarChart3,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DemoModal } from '@/components/DemoModal';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.12
    }
  }
};

const features = [
  {
    icon: Users,
    title: 'AI-Powered Matching',
    description: 'Smart algorithms connect you with creators who perfectly align with your brand values.',
    gradient: 'from-blue-500/20 to-cyan-500/20'
  },
  {
    icon: TrendingUp,
    title: 'Virality Tracking',
    description: 'Real-time analytics and predictive virality scoring to maximize campaign impact.',
    gradient: 'from-purple-500/20 to-pink-500/20'
  },
  {
    icon: Shield,
    title: 'Secure Escrow',
    description: 'Built-in payment protection ensures safe transactions for everyone.',
    gradient: 'from-emerald-500/20 to-teal-500/20'
  },
  {
    icon: Zap,
    title: 'Instant Workflow',
    description: 'Streamlined collaboration with in-app messaging and file sharing.',
    gradient: 'from-orange-500/20 to-amber-500/20'
  },
];

const stats = [
  { value: '50K+', label: 'Active Creators', icon: Users },
  { value: '$10M+', label: 'Paid to Creators', icon: BarChart3 },
  { value: '5K+', label: 'Brands Trust Us', icon: Globe },
  { value: '98%', label: 'Satisfaction', icon: Star },
];

const testimonials = [
  {
    content: "ViralForge transformed how we run influencer campaigns. The virality tracking is game-changing!",
    author: 'Sarah Chen',
    role: 'Marketing Director',
    company: 'TechStartup',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    rating: 5,
  },
  {
    content: "As a creator, I've tripled my brand partnerships. The platform makes everything seamless.",
    author: 'Marcus Johnson',
    role: 'Content Creator',
    company: '500K+ followers',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    rating: 5,
  },
  {
    content: "The escrow feature gives me complete peace of mind. I know I'll get paid for my work.",
    author: 'Emma Davis',
    role: 'Micro-Influencer',
    company: 'Lifestyle Niche',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    rating: 5,
  },
];

const pricingPlans = [
  {
    name: 'Starter',
    price: 0,
    description: 'Perfect for getting started',
    features: [
      'Create profile & portfolio',
      'Apply to 5 campaigns/month',
      'Basic analytics',
      'In-app messaging',
    ],
    cta: 'Start Free',
    popular: false,
  },
  {
    name: 'Pro',
    price: 49,
    description: 'For serious creators & brands',
    features: [
      'Everything in Starter',
      'Unlimited applications',
      'Advanced analytics',
      'Priority support',
      'Verified badge',
      'Early access',
    ],
    cta: 'Get Pro',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 199,
    description: 'For agencies & large teams',
    features: [
      'Everything in Pro',
      'Unlimited team members',
      'Custom integrations',
      'Dedicated manager',
      'API access',
      'White-label options',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

// Floating shapes for hero background
const FloatingShape = ({ className, delay = 0 }: { className: string; delay?: number }) => (
  <motion.div
    className={`absolute rounded-full blur-3xl opacity-30 ${className}`}
    animate={{
      y: [0, -30, 0],
      x: [0, 15, 0],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
  />
);

export default function Landing() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <div className="overflow-hidden">
      <DemoModal open={isDemoOpen} onOpenChange={setIsDemoOpen} />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-mesh" />
        <FloatingShape className="w-[600px] h-[600px] bg-primary/30 -top-48 -right-48" delay={0} />
        <FloatingShape className="w-[500px] h-[500px] bg-accent/40 -bottom-32 -left-32" delay={2} />
        <FloatingShape className="w-[400px] h-[400px] bg-info/20 top-1/3 right-1/4" delay={4} />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="max-w-5xl mx-auto text-center"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="mb-8">
              <Badge variant="outline" className="px-4 py-2 text-sm font-medium border-primary/30 bg-primary/5">
                <Sparkles className="w-4 h-4 mr-2 text-primary" />
                Trusted by 5,000+ brands worldwide
              </Badge>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight font-display"
            >
              Where Creators &{' '}
              <span className="gradient-text-hero">Brands</span>
              <br />
              Go Viral Together
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              The all-in-one marketplace connecting micro-influencers with brands. 
              Launch campaigns, track virality, and grow together.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link to="/auth?mode=signup">
                <Button variant="hero" size="xl" className="w-full sm:w-auto group">
                  Start For Free
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="xl" 
                className="w-full sm:w-auto gap-2 bg-background/50 backdrop-blur-sm border-border/50 hover:bg-background/80"
                onClick={() => setIsDemoOpen(true)}
              >
                <Play className="w-5 h-5 fill-current" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              variants={fadeInUp}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={index} 
                  className="glass-card p-5 text-center"
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                  <div className="text-2xl md:text-3xl font-bold gradient-text font-display">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-primary"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative" id="features">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <Badge variant="outline" className="mb-4 px-3 py-1">
              <Zap className="w-3 h-3 mr-1" />
              Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display">
              Everything You Need to{' '}
              <span className="gradient-text">Go Viral</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful tools for creators and brands to collaborate, create, and measure success.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className={`h-full card-hover border-0 bg-gradient-to-br ${feature.gradient} backdrop-blur-sm`}>
                  <CardContent className="p-8">
                    <div className="w-14 h-14 rounded-2xl bg-background/80 flex items-center justify-center mb-6 shadow-lg">
                      <feature.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 font-display">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <Badge variant="outline" className="mb-4 px-3 py-1">
              <Star className="w-3 h-3 mr-1 fill-warning text-warning" />
              Testimonials
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display">
              Loved by <span className="gradient-text">Creators & Brands</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands already winning with ViralForge.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="h-full card-hover border-0 bg-card shadow-soft-lg">
                  <CardContent className="p-8">
                    <div className="flex gap-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-warning text-warning" />
                      ))}
                    </div>
                    <p className="text-foreground mb-8 text-lg leading-relaxed">"{testimonial.content}"</p>
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12 ring-2 ring-border">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                        <AvatarFallback>{testimonial.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{testimonial.author}</div>
                        <div className="text-sm text-muted-foreground">
                          {testimonial.role} · {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32 relative" id="pricing">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <Badge variant="outline" className="mb-4 px-3 py-1">
              <Lock className="w-3 h-3 mr-1" />
              Pricing
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display">
              Simple, Transparent <span className="gradient-text">Pricing</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start free and scale as you grow. No hidden fees, ever.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className={`h-full relative ${plan.popular ? 'border-primary shadow-glow bg-gradient-to-b from-primary/5 to-transparent' : 'border-0 shadow-soft-lg'}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground shadow-lg">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-8">
                    <h3 className="text-xl font-semibold mb-2 font-display">{plan.name}</h3>
                    <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>
                    <div className="mb-8">
                      <span className="text-5xl font-bold font-display">${plan.price}</span>
                      {plan.price > 0 && <span className="text-muted-foreground">/month</span>}
                    </div>
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to={plan.name === 'Enterprise' ? '/pricing/enterprise' : '/auth?mode=signup'}>
                      <Button 
                        variant={plan.popular ? 'hero' : 'outline'} 
                        className="w-full"
                        size="lg"
                      >
                        {plan.cta}
                        <ArrowUpRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5" />
        <FloatingShape className="w-[400px] h-[400px] bg-primary/20 top-0 -right-32" delay={0} />
        <FloatingShape className="w-[300px] h-[300px] bg-accent/30 -bottom-16 -left-16" delay={1} />
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge variant="outline" className="mb-6 px-3 py-1">
              <Sparkles className="w-3 h-3 mr-1" />
              Get Started Today
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-display">
              Ready to <span className="gradient-text">Go Viral</span>?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of creators and brands already growing with ViralForge.
              Start for free, no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth?mode=signup">
                <Button variant="hero" size="xl" className="group">
                  Create Free Account
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/discover">
                <Button variant="outline" size="xl" className="bg-background/50 backdrop-blur-sm">
                  Browse Marketplace
                  <ArrowUpRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
