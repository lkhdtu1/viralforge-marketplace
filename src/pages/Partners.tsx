import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Handshake, Award, Globe, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const partnerTypes = [
  {
    icon: Handshake,
    title: 'Agency Partners',
    description: 'For marketing agencies managing multiple brand accounts',
    benefits: ['Priority support', 'Bulk discounts', 'White-label options', 'Dedicated account manager'],
  },
  {
    icon: Globe,
    title: 'Technology Partners',
    description: 'For platforms and tools that integrate with ViralForge',
    benefits: ['API access', 'Technical documentation', 'Co-marketing opportunities', 'Revenue sharing'],
  },
  {
    icon: Award,
    title: 'Affiliate Partners',
    description: 'For influencers and content creators promoting ViralForge',
    benefits: ['Commission on referrals', 'Marketing materials', 'Exclusive content', 'Early access features'],
  },
];

const existingPartners = [
  'CreatorStudio Pro',
  'MediaMetrics',
  'BrandConnect',
  'InfluenceIQ',
  'ContentCloud',
  'SocialPulse',
];

export default function Partners() {
  return (
    <div className="min-h-screen bg-muted/30 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Partner Program</h1>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our partner ecosystem and grow together. We offer various partnership opportunities for agencies, technology providers, and affiliates.
            </p>
          </div>

          {/* Partner Types */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {partnerTypes.map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <type.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>{type.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{type.description}</p>
                    <ul className="space-y-2">
                      {type.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full mt-6">
                      Apply Now <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[
              { label: 'Active Partners', value: '200+' },
              { label: 'Countries', value: '40+' },
              { label: 'Revenue Shared', value: '$2M+' },
              { label: 'Partner Growth', value: '150%' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <p className="text-3xl font-bold text-primary">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Existing Partners */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Trusted By Industry Leaders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap justify-center gap-8">
                {existingPartners.map((partner) => (
                  <div
                    key={partner}
                    className="text-lg font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {partner}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="mt-12 text-center">
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="py-12">
                <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">Ready to Partner?</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Let's discuss how we can work together to achieve mutual success.
                </p>
                <Link to="/contact">
                  <Button size="lg">
                    Get in Touch <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
