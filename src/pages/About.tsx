import { motion } from 'framer-motion';
import { 
  Target, 
  Heart, 
  Award, 
  Users, 
  TrendingUp,
  Globe,
  Sparkles,
  Shield
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Image3D } from '@/components/Image3D';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const values = [
  {
    icon: Heart,
    title: 'Creator First',
    description: 'We believe in empowering creators to build sustainable careers and authentic partnerships.',
  },
  {
    icon: Shield,
    title: 'Trust & Security',
    description: 'Our escrow system and verified profiles ensure safe, transparent transactions for everyone.',
  },
  {
    icon: TrendingUp,
    title: 'Data-Driven',
    description: 'Real-time analytics and virality scoring help you make informed decisions.',
  },
  {
    icon: Globe,
    title: 'Global Community',
    description: 'Connecting creators and brands across the world, breaking down geographical barriers.',
  },
];

const team = [
  {
    name: 'Mohamed Anaddam',
    role: 'Co-founder & CEO',
    avatar: '/mohamed-anaddam.jpeg',
    bio: 'Visionary leader driving innovation in the creator economy and influencer marketing space.',
  },
  {
    name: 'Mohamed Tamis',
    role: 'Co-founder & CEO',
    avatar: '/Mohamed-tamis.jpeg',
    bio: 'Strategic leader passionate about empowering creators and building authentic brand partnerships.',
  },
];

const milestones = [
  { year: '2020', title: 'Founded', description: 'Started with a vision to transform influencer marketing' },
  { year: '2021', title: '1K Creators', description: 'Reached our first thousand active creators' },
  { year: '2022', title: '$1M Paid', description: 'First million dollars paid to creators' },
  { year: '2023', title: 'Series A', description: 'Raised $10M to scale globally' },
  { year: '2024', title: '50K+ Users', description: 'Growing community of creators and brands' },
];

const galleryImages = [
  { url: 'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=800', alt: 'Team collaboration' },
  { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800', alt: 'Office culture' },
  { url: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800', alt: 'Product development' },
  { url: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800', alt: 'Creator community' },
  { url: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800', alt: 'Team meeting' },
];

export default function About() {
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
                Our Story
              </span>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Building the Future of{' '}
              <span className="gradient-text">Creator Economy</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              We're on a mission to democratize influencer marketing and empower creators 
              to build sustainable, authentic partnerships with brands they love.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Image Gallery Carousel */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 3000,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent>
              {galleryImages.map((image, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="border-0 shadow-soft overflow-hidden">
                      <CardContent className="p-0">
                        <Image3D
                          src={image.url}
                          alt={image.alt}
                          className="w-full h-64"
                          intensity="medium"
                          enableHover={true}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To create the world's most trusted platform where creators and brands collaborate 
                authentically, transparently, and successfully. We're building the infrastructure 
                for the creator economy of tomorrow.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                A world where every creator can build a sustainable career doing what they love, 
                and every brand can find authentic voices to tell their story. We envision a 
                creator economy that's accessible, fair, and rewarding for all.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our <span className="gradient-text">Core Values</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full card-hover border-0 shadow-soft">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                      <value.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our <span className="gradient-text">Journey</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From startup to platform serving thousands
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/20" />

              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-20 pb-12 last:pb-0"
                >
                  <div className="absolute left-6 top-0 w-5 h-5 rounded-full bg-primary border-4 border-background" />
                  <div className="text-sm font-medium text-primary mb-1">{milestone.year}</div>
                  <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                  <p className="text-muted-foreground">{milestone.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Meet the <span className="gradient-text">Team</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Passionate people building the future of creator-brand partnerships
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto justify-items-center">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full card-hover border-0 shadow-soft text-center">
                  <CardContent className="p-6">
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                    <p className="text-sm text-primary mb-3">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
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
