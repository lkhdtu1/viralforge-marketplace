import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Target, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Zap, 
  Shield, 
  Globe,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Megaphone,
  DollarSign,
  MessageSquare,
  FileText,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const pillars = [
  {
    icon: Target,
    title: 'AI-Powered Creator Matching',
    description: 'Advanced algorithms match brands with creators based on audience demographics, engagement rates, and brand alignment.',
    metrics: ['95% Match Accuracy', '3x Faster Discovery', 'Real-time Analytics'],
    gradient: 'from-blue-500/20 to-cyan-500/20'
  },
  {
    icon: TrendingUp,
    title: 'Virality Prediction Engine',
    description: 'Machine learning models predict content virality before launch, maximizing ROI and campaign success rates.',
    metrics: ['87% Prediction Accuracy', '2.5x Higher Engagement', 'ROI Optimization'],
    gradient: 'from-purple-500/20 to-pink-500/20'
  },
  {
    icon: Users,
    title: 'Community-Driven Growth',
    description: 'Build a thriving ecosystem where creators and brands collaborate, share insights, and grow together.',
    metrics: ['50K+ Active Users', '98% Satisfaction', 'Network Effects'],
    gradient: 'from-emerald-500/20 to-teal-500/20'
  },
  {
    icon: Shield,
    title: 'Secure Escrow System',
    description: 'Built-in payment protection ensures safe transactions, milestone-based payments, and dispute resolution.',
    metrics: ['100% Secure', 'Zero Fraud Cases', 'Instant Payouts'],
    gradient: 'from-orange-500/20 to-amber-500/20'
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics Dashboard',
    description: 'Comprehensive analytics track campaign performance, engagement metrics, and ROI in real-time.',
    metrics: ['Live Updates', 'Custom Reports', 'Data Export'],
    gradient: 'from-indigo-500/20 to-blue-500/20'
  },
  {
    icon: Zap,
    title: 'Automated Workflow Tools',
    description: 'Streamline collaboration with automated contracts, messaging, file sharing, and project management.',
    metrics: ['80% Time Saved', 'Seamless Integration', 'Mobile App'],
    gradient: 'from-rose-500/20 to-red-500/20'
  },
];

const strategies = [
  {
    phase: 'Phase 1: Foundation (Months 1- 3)',
    title: 'Platform Launch & User Acquisition',
    goals: [
      'Launch MVP with core features',
      'Acquire 1,000 early adopters',
      'Onboard 100 verified creators',
      'Partner with 50 brands',
      'Achieve $50K GMV'
    ],
    tactics: [
      'Content marketing and SEO',
      'Social media campaigns',
      'Influencer partnerships',
      'PR and media outreach',
      'Referral program launch'
    ]
  },
  {
    phase: 'Phase 2: Growth (Months 4 - 6)',
    title: 'Scale & Optimize',
    goals: [
      'Grow to 10,000 users',
      '500 active creators',
      '200 brand partners',
      'Achieve $500K GMV',
      'Launch Pro subscription'
    ],
    tactics: [
      'Paid advertising campaigns',
      'Strategic partnerships',
      'Community building',
      'Feature enhancements',
      'International expansion'
    ]
  },
  {
    phase: 'Phase 3: Expansion (Months 7 - 12)',
    title: 'Market Leadership',
    goals: [
      '50,000+ users',
      '2,000+ creators',
      '500+ brands',
      'Achieve $5M GMV',
      'Launch Enterprise tier'
    ],
    tactics: [
      'Enterprise sales team',
      'API and integrations',
      'White-label solutions',
      'Global expansion',
      'Strategic acquisitions'
    ]
  },
];

const kpis = [
  { metric: 'Monthly Active Users', target: '50K+', icon: Users },
  { metric: 'Creator Sign-ups', target: '2K+', icon: Sparkles },
  { metric: 'Brand Partnerships', target: '500+', icon: Building2 },
  { metric: 'Gross Merchandise Value', target: '$5M+', icon: DollarSign },
  { metric: 'Platform Revenue', target: '$500K+', icon: TrendingUp },
  { metric: 'User Retention Rate', target: '85%+', icon: Target },
];

export default function DigitalMarketingPlan() {
  return (
    <div className="min-h-screen bg-muted/30 pt-16">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            Digital Marketing Plan 5.0
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            ViralForge: <span className="gradient-text">Connecting Creators & Brands</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            A comprehensive strategy to build the leading marketplace platform connecting 
            micro-influencers with brands for viral marketing campaigns, service acquisition, 
            and mutual growth.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/auth?mode=signup">
              <Button variant="hero" size="lg">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg">
                Contact Sales
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Mission Statement */}
        <Card className="mb-12 border-0 shadow-lg bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="p-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To democratize influencer marketing by creating an accessible, transparent, and 
                efficient platform where creators can monetize their influence and brands can 
                discover authentic voices to amplify their message. We believe in the power of 
                micro-influencers and aim to make viral marketing accessible to businesses of all sizes.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Core Pillars */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our <span className="gradient-text">Core Pillars</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Six foundational elements that drive our platform's success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`h-full border-0 bg-gradient-to-br ${pillar.gradient} backdrop-blur-sm`}>
                    <CardHeader>
                      <div className="w-12 h-12 rounded-xl bg-background/80 flex items-center justify-center mb-4 shadow-lg">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{pillar.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{pillar.description}</p>
                      <div className="space-y-2">
                        {pillar.metrics.map((metric, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                            <span>{metric}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Growth Strategy */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              12-Month <span className="gradient-text">Growth Strategy</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A phased approach to building market leadership
            </p>
          </div>

          <Tabs defaultValue="phase1" className="max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="phase1">Phase 1</TabsTrigger>
              <TabsTrigger value="phase2">Phase 2</TabsTrigger>
              <TabsTrigger value="phase3">Phase 3</TabsTrigger>
            </TabsList>

            {strategies.map((strategy, index) => (
              <TabsContent key={index} value={`phase${index + 1}`}>
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <Badge variant="outline" className="w-fit mb-2">{strategy.phase}</Badge>
                    <CardTitle className="text-2xl">{strategy.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        Goals
                      </h3>
                      <ul className="space-y-2">
                        {strategy.goals.map((goal, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                            <span>{goal}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-primary" />
                        Tactics
                      </h3>
                      <ul className="space-y-2">
                        {strategy.tactics.map((tactic, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <ArrowRight className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                            <span>{tactic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </section>

        {/* KPIs */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Key Performance <span className="gradient-text">Indicators</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Metrics that define our success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {kpis.map((kpi, index) => {
              const Icon = kpi.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-0 shadow-lg text-center">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">{kpi.metric}</h3>
                      <p className="text-3xl font-bold gradient-text">{kpi.target}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-primary/10 to-accent/10">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to <span className="gradient-text">Transform</span> Your Marketing?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of creators and brands already growing with ViralForge. 
              Start your journey today.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/auth?mode=signup">
                <Button variant="hero" size="lg">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="lg">
                  View Pricing
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

