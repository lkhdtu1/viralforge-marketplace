import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const blogPosts = [
  {
    id: 1,
    title: 'How to Build a Successful Creator-Brand Partnership',
    excerpt: 'Learn the key strategies for creating authentic collaborations that drive results for both creators and brands.',
    category: 'Partnerships',
    author: 'Sarah Chen',
    date: 'Dec 1, 2024',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
  },
  {
    id: 2,
    title: 'The Rise of Micro-Influencers in Digital Marketing',
    excerpt: 'Why smaller audiences often drive better engagement and ROI for brands looking to connect authentically.',
    category: 'Trends',
    author: 'Marcus Johnson',
    date: 'Nov 28, 2024',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
  },
  {
    id: 3,
    title: 'Content Creation Tips for Maximum Engagement',
    excerpt: 'Discover proven techniques to create content that resonates with your audience and drives meaningful interactions.',
    category: 'Content',
    author: 'Emily Rodriguez',
    date: 'Nov 25, 2024',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=800',
  },
  {
    id: 4,
    title: 'Understanding Analytics: Metrics That Matter',
    excerpt: 'A comprehensive guide to tracking and interpreting your campaign performance data effectively.',
    category: 'Analytics',
    author: 'David Park',
    date: 'Nov 22, 2024',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
  },
];

export default function Blog() {
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
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-muted-foreground mb-12 max-w-2xl">
            Insights, tips, and trends from the world of creator marketing and brand partnerships.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {blogPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{post.category}</Badge>
                      <span className="text-xs text-muted-foreground">{post.readTime}</span>
                    </div>
                    <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                        <span>•</span>
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        Read <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
