import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const guides = [
  {
    id: 1,
    title: 'Complete Guide to Creator Marketing',
    description: 'Everything you need to know about building successful creator partnerships.',
    chapters: 8,
    duration: '45 min',
    level: 'Beginner',
    progress: 0,
    featured: true,
  },
  {
    id: 2,
    title: 'Maximizing Campaign ROI',
    description: 'Strategies and tactics to get the most out of your marketing budget.',
    chapters: 6,
    duration: '30 min',
    level: 'Intermediate',
    progress: 0,
  },
  {
    id: 3,
    title: 'Building Your Creator Portfolio',
    description: 'How to showcase your work and attract premium brand partnerships.',
    chapters: 5,
    duration: '25 min',
    level: 'Beginner',
    progress: 0,
  },
  {
    id: 4,
    title: 'Advanced Analytics & Reporting',
    description: 'Deep dive into metrics, data analysis, and performance tracking.',
    chapters: 7,
    duration: '40 min',
    level: 'Advanced',
    progress: 0,
  },
  {
    id: 5,
    title: 'Negotiation & Pricing Strategies',
    description: 'Learn how to price your services and negotiate better deals.',
    chapters: 4,
    duration: '20 min',
    level: 'Intermediate',
    progress: 0,
  },
  {
    id: 6,
    title: 'Content Creation Best Practices',
    description: 'Tips and techniques for creating engaging, high-quality content.',
    chapters: 9,
    duration: '50 min',
    level: 'Beginner',
    progress: 0,
  },
];

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default: return '';
  }
};

export default function Guides() {
  const featuredGuide = guides.find(g => g.featured);
  const otherGuides = guides.filter(g => !g.featured);

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
          <h1 className="text-4xl font-bold mb-4">Guides & Tutorials</h1>
          <p className="text-muted-foreground mb-12 max-w-2xl">
            Learn everything about creator marketing with our comprehensive guides and tutorials.
          </p>

          {/* Featured Guide */}
          {featuredGuide && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                <CardContent className="flex flex-col md:flex-row items-start gap-6 p-6">
                  <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Star className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <Badge className="mb-2">Featured</Badge>
                    <h2 className="text-2xl font-bold mb-2">{featuredGuide.title}</h2>
                    <p className="text-muted-foreground mb-4">{featuredGuide.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {featuredGuide.chapters} chapters
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {featuredGuide.duration}
                      </span>
                      <Badge className={getLevelColor(featuredGuide.level)}>{featuredGuide.level}</Badge>
                    </div>
                    <Button>
                      Start Learning <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Other Guides */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherGuides.map((guide, index) => (
              <motion.div
                key={guide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getLevelColor(guide.level)}>{guide.level}</Badge>
                    </div>
                    <CardTitle className="text-lg">{guide.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{guide.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {guide.chapters} chapters
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {guide.duration}
                      </span>
                    </div>
                    {guide.progress > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{guide.progress}%</span>
                        </div>
                        <Progress value={guide.progress} />
                      </div>
                    )}
                    <Button variant="outline" className="w-full">
                      {guide.progress > 0 ? 'Continue' : 'Start'} <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
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
