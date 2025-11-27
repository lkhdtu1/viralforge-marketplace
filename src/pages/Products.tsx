import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Search, 
  MessageSquare, 
  TrendingUp, 
  Shield,
  Zap,
  Users,
  CreditCard,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Target,
  Globe,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const products = [
  {
    icon: Search,
    name: 'Creator Discovery',
    tagline: 'Find your perfect match',
    description: 'AI-powered matching algorithm that connects brands with creators based on audience demographics, engagement rates, content style, and brand alignment.',
    features: [
      'Advanced filtering by niche, location, audience size',
      'Engagement and virality score metrics',
      'Portfolio and past campaign reviews',
      'Real-time availability status',
      'Saved searches and alerts',
    ],
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800',
    gradient: 'from-blue-500/10 to-cyan-500/10',
  },
  {
    icon: Zap,
    name: 'Campaign Builder',
    tagline: 'Launch in minutes',
    description: 'Intuitive campaign creation tool with step-by-step guidance. Create briefs, set budgets, upload creatives, and launch campaigns faster than ever.',
    features: [
      '5-step guided campaign setup',
      'Pre-built templates for common campaigns',
      'Multi-platform distribution tracking',
      'Collaborative brief editing',
      'Automated creator invitations',
    ],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    gradient: 'from-purple-500/10 to-pink-500/10',
  },
  {
    icon: BarChart3,
    name: 'Analytics & Insights',
    tagline: 'Data-driven decisions',
    description: 'Comprehensive analytics dashboard with real-time tracking of campaign performance, virality scoring, and ROI calculations.',
    features: [
      'Real-time performance dashboards',
      'Virality score algorithm',
      'Engagement rate tracking',
      'ROI and conversion metrics',
      'Competitor benchmarking',
      'Custom report generation',
    ],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    gradient: 'from-green-500/10 to-emerald-500/10',
  },
  {
    icon: MessageSquare,
    name: 'Collaboration Hub',
    tagline: 'Seamless communication',
    description: 'Built-in messaging, file sharing, and collaboration tools. Keep all campaign communication in one place with thread organization and notifications.',
    features: [
      'Real-time messaging with read receipts',
      'File and media sharing',
      'Campaign-specific conversation threads',
      'Smart notifications and reminders',
      'Video call integration',
    ],
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800',
    gradient: 'from-orange-500/10 to-red-500/10',
  },
  {
    icon: Shield,
    name: 'Secure Escrow',
    tagline: 'Protected payments',
    description: 'Industry-leading payment protection system. Funds are held securely until deliverables are approved, ensuring safety for both parties.',
    features: [
      'Automated escrow fund holding',
      'Milestone-based payment releases',
      'Dispute resolution system',
      'Multi-currency support',
      'Invoice and receipt generation',
      'Tax documentation',
    ],
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
    gradient: 'from-indigo-500/10 to-violet-500/10',
  },
  {
    icon: Users,
    name: 'Portfolio & Profiles',
    tagline: 'Showcase your work',
    description: 'Beautiful, customizable profiles for creators to showcase their best work, stats, and testimonials. Get discovered by your ideal brand partners.',
    features: [
      'Customizable portfolio layouts',
      'Performance statistics display',
      'Client testimonials and ratings',
      'Media kit export',
      'Social media integration',
      'Verification badges',
    ],
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
    gradient: 'from-teal-500/10 to-cyan-500/10',
  },
];

const integrations = [
  { name: 'Instagram', icon: '📷' },
  { name: 'TikTok', icon: '🎵' },
  { name: 'YouTube', icon: '▶️' },
  { name: 'Twitter', icon: '🐦' },
  { name: 'LinkedIn', icon: '💼' },
  { name: 'Stripe', icon: '💳' },
  { name: 'PayPal', icon: '💰' },
  { name: 'Slack', icon: '💬' },
];

const stats = [
  { icon: Clock, value: '10x', label: 'Faster Campaign Launch' },
  { icon: Target, value: '95%', label: 'Match Accuracy' },
  { icon: TrendingUp, value: '3.5x', label: 'Average ROI' },
  { icon: Globe, value: '120+', label: 'Countries Supported' },
];

export default function Products() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center pt-16 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                <Sparkles className="w-4 h-4" />
                All-in-One Platform
              </span>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Powerful Tools for{' '}
              <span className="gradient-text">Creator Success</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Everything you need to discover, collaborate, and succeed with influencer 
              marketing. Built for creators and brands who want results.
            </p>

            <Link to="/auth?mode=signup">
              <Button variant="hero" size="xl">
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Showcase */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Complete <span className="gradient-text">Product Suite</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Six powerful products working together to transform your influencer marketing
            </p>
          </motion.div>

          <div className="space-y-24">
            {products.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className={`grid md:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                    <Badge className="mb-4" variant="outline">
                      <product.icon className="w-3 h-3 mr-1" />
                      {product.name}
                    </Badge>
                    <h3 className="text-3xl font-bold mb-2">{product.tagline}</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {product.description}
                    </p>
                    <ul className="space-y-2">
                      {product.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={index % 2 === 1 ? 'md:order-1' : ''}>
                    <div className={`relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br ${product.gradient}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-80 object-cover"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Carousel */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Seamless <span className="gradient-text">Integrations</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with all your favorite platforms and tools
            </p>
          </motion.div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 2000,
              }),
            ]}
            className="w-full max-w-4xl mx-auto"
          >
            <CarouselContent>
              {integrations.map((integration, index) => (
                <CarouselItem key={index} className="basis-1/3 md:basis-1/4 lg:basis-1/6">
                  <Card className="card-hover border-0 shadow-soft">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-2">{integration.icon}</div>
                      <div className="text-sm font-medium">{integration.name}</div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your{' '}
              <span className="gradient-text">Marketing?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of creators and brands already succeeding with ViralForge.
              Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth?mode=signup">
                <Button variant="hero" size="xl">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button variant="hero-outline" size="xl">
                  Browse Creators
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
