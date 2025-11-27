import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const demoSlides = [
  {
    title: "Discover Perfect Creator Matches",
    description: "AI-powered matching connects brands with creators based on audience demographics, engagement rates, and brand alignment.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=675&fit=crop",
    features: ["Advanced filtering", "Virality scoring", "Real-time analytics"]
  },
  {
    title: "Launch Campaigns in Minutes",
    description: "Intuitive campaign builder with step-by-step guidance. Create briefs, set budgets, and invite creators effortlessly.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=675&fit=crop",
    features: ["5-step builder", "Template library", "Automated invitations"]
  },
  {
    title: "Collaborate Seamlessly",
    description: "Built-in messaging, file sharing, and real-time collaboration tools keep all campaign communication organized.",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&h=675&fit=crop",
    features: ["In-app messaging", "File sharing", "Video calls"]
  },
  {
    title: "Track Performance & ROI",
    description: "Comprehensive analytics dashboard with virality scoring, engagement tracking, and ROI calculations in real-time.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=675&fit=crop",
    features: ["Virality scores", "Engagement metrics", "Custom reports"]
  },
  {
    title: "Secure Payments & Escrow",
    description: "Industry-leading payment protection with automated escrow holding until deliverables are approved.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=675&fit=crop",
    features: ["Escrow protection", "Milestone payments", "Multi-currency"]
  }
];

export function DemoModal({ open, onOpenChange }: DemoModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % demoSlides.length);
    }, 4000);
    
    return () => clearInterval(timer);
  }, [isPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % demoSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + demoSlides.length) % demoSlides.length);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>ViralForge Platform Demo</DialogTitle>
          <DialogDescription>
            See how ViralForge helps creators and brands collaborate successfully
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative">
          {/* Main Demo Area */}
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <img
                  src={demoSlides[currentSlide].image}
                  alt={demoSlides[currentSlide].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-2xl font-bold mb-2">{demoSlides[currentSlide].title}</h3>
                  <p className="text-muted-foreground mb-4 max-w-2xl">
                    {demoSlides[currentSlide].description}
                  </p>
                  <div className="flex gap-2">
                    {demoSlides[currentSlide].features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm border border-primary/20"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Play/Pause Overlay */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-sm">
                <Button
                  size="lg"
                  variant="hero"
                  onClick={handlePlayPause}
                  className="gap-2"
                >
                  <Play className="w-5 h-5" />
                  Play Demo
                </Button>
              </div>
            )}

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Indicators */}
          <div className="flex gap-2 justify-center mt-4">
            {demoSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentSlide
                    ? 'w-8 bg-primary'
                    : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center text-sm mt-4">
          <div>
            <div className="font-semibold text-primary">{demoSlides.length} Features</div>
            <div className="text-muted-foreground">Core Platform</div>
          </div>
          <div>
            <div className="font-semibold text-primary">50K+</div>
            <div className="text-muted-foreground">Active Users</div>
          </div>
          <div>
            <div className="font-semibold text-primary">98%</div>
            <div className="text-muted-foreground">Satisfaction</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
