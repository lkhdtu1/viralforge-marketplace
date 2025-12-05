import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, BookOpen, MessageCircle, Video, FileText, HelpCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const helpCategories = [
  { icon: BookOpen, title: 'Getting Started', description: 'Learn the basics of using ViralForge', count: 12 },
  { icon: Zap, title: 'Campaigns', description: 'Create and manage your campaigns', count: 8 },
  { icon: MessageCircle, title: 'Messaging', description: 'Communication and collaboration', count: 6 },
  { icon: FileText, title: 'Billing', description: 'Payments, subscriptions, and invoices', count: 10 },
  { icon: Video, title: 'Video Tutorials', description: 'Step-by-step visual guides', count: 15 },
  { icon: HelpCircle, title: 'FAQ', description: 'Frequently asked questions', count: 20 },
];

const faqs = [
  {
    question: 'How do I get started as a creator?',
    answer: 'Sign up for a free account, complete your profile with your social media links and portfolio, set your service rates, and start receiving collaboration requests from brands.',
  },
  {
    question: 'How does payment protection work?',
    answer: 'We use an escrow system where brands deposit funds before the campaign starts. Once you complete the deliverables and the brand approves, funds are released to your account.',
  },
  {
    question: 'What are the platform fees?',
    answer: 'ViralForge charges a small transaction fee on completed campaigns. Creators keep 90% of their earnings. Check our pricing page for detailed fee structures.',
  },
  {
    question: 'How do I contact a creator or brand?',
    answer: 'Use our built-in messaging system to communicate directly. You can send messages from their profile page or through your campaign dashboard.',
  },
  {
    question: 'Can I cancel a campaign?',
    answer: 'Yes, campaigns can be cancelled before work begins with a full refund. Once work starts, cancellation terms depend on the agreed milestones.',
  },
];

export default function Help() {
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
            <h1 className="text-4xl font-bold mb-4">Help Center</h1>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Find answers, tutorials, and resources to help you get the most out of ViralForge.
            </p>
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input placeholder="Search for help..." className="pl-10" />
            </div>
          </div>

          {/* Categories */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {helpCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <category.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{category.title}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                      <p className="text-xs text-primary mt-2">{category.count} articles</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* FAQs */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">Still need help?</p>
            <Link to="/contact">
              <Button>Contact Support</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
