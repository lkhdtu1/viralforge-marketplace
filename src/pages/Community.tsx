import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, MessageSquare, Calendar, Trophy, ExternalLink, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const communityStats = [
  { label: 'Active Members', value: '25K+' },
  { label: 'Daily Discussions', value: '500+' },
  { label: 'Success Stories', value: '1,200+' },
  { label: 'Countries', value: '80+' },
];

const channels = [
  { icon: Hash, name: 'general', description: 'General chat and introductions', members: 15420 },
  { icon: Hash, name: 'creator-tips', description: 'Share and learn creator strategies', members: 8930 },
  { icon: Hash, name: 'brand-partnerships', description: 'Discuss brand collaboration opportunities', members: 6240 },
  { icon: Hash, name: 'feedback', description: 'Share product feedback and feature requests', members: 4120 },
];

const topContributors = [
  { name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', role: 'Creator', badge: 'Top Contributor' },
  { name: 'Marcus J.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', role: 'Brand Manager', badge: 'Helpful' },
  { name: 'Emily R.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', role: 'Creator', badge: 'Rising Star' },
];

const upcomingEvents = [
  { title: 'Creator Meetup: Q1 Trends', date: 'Dec 15, 2024', type: 'Virtual' },
  { title: 'Workshop: Negotiation Skills', date: 'Dec 20, 2024', type: 'Virtual' },
  { title: 'AMA: Platform Updates', date: 'Jan 5, 2025', type: 'Virtual' },
];

export default function Community() {
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
            <h1 className="text-4xl font-bold mb-4">Community</h1>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of creators and brands sharing knowledge, opportunities, and support.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg">
                <Users className="w-5 h-5 mr-2" />
                Join Discord
              </Button>
              <Button variant="outline" size="lg">
                <MessageSquare className="w-5 h-5 mr-2" />
                Start Discussion
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {communityStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
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

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Channels */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Popular Channels</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {channels.map((channel) => (
                    <div
                      key={channel.name}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <channel.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">#{channel.name}</p>
                          <p className="text-sm text-muted-foreground">{channel.description}</p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{channel.members.toLocaleString()} members</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Events */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.title}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">{event.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{event.type}</Badge>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Top Contributors */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Top Contributors
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topContributors.map((contributor, index) => (
                    <div key={contributor.name} className="flex items-center gap-3">
                      <span className="text-lg font-bold text-muted-foreground w-6">{index + 1}</span>
                      <Avatar>
                        <AvatarImage src={contributor.avatar} />
                        <AvatarFallback>{contributor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{contributor.name}</p>
                        <p className="text-xs text-muted-foreground">{contributor.role}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">{contributor.badge}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
