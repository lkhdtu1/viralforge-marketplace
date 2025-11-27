import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, X } from 'lucide-react';

interface DemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DemoModal({ open, onOpenChange }: DemoModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>ViralForge Platform Demo</DialogTitle>
          <DialogDescription>
            See how ViralForge helps creators and brands collaborate successfully
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
          {!isPlaying ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
              <Button
                size="lg"
                variant="hero"
                onClick={() => setIsPlaying(true)}
                className="gap-2"
              >
                <Play className="w-5 h-5" />
                Play Demo Video
              </Button>
            </div>
          ) : (
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              title="ViralForge Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="font-semibold text-primary">3 min</div>
            <div className="text-muted-foreground">Quick Overview</div>
          </div>
          <div>
            <div className="font-semibold text-primary">5 Features</div>
            <div className="text-muted-foreground">Core Platform</div>
          </div>
          <div>
            <div className="font-semibold text-primary">Real Use Cases</div>
            <div className="text-muted-foreground">Success Stories</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
