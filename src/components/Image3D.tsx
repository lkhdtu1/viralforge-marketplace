import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface Image3DProps {
  src: string;
  alt: string;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  enableHover?: boolean;
}

export function Image3D({ 
  src, 
  alt, 
  className, 
  intensity = 'medium',
  enableHover = true 
}: Image3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Don't render if no src
  if (!src) {
    return null;
  }

  const intensityMap = {
    low: { rotateX: 5, rotateY: 5, scale: 1.02 },
    medium: { rotateX: 8, rotateY: 8, scale: 1.05 },
    high: { rotateX: 12, rotateY: 12, scale: 1.08 },
  };

  useEffect(() => {
    if (!enableHover || !containerRef.current || !imgRef.current) return;

    const container = containerRef.current;
    const img = imgRef.current;
    const intensityValue = intensityMap[intensity];

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * intensityValue.rotateX;
      const rotateY = ((centerX - x) / centerX) * intensityValue.rotateY;
      
      img.style.transform = `
        perspective(1000px) 
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg) 
        scale(${intensityValue.scale})
      `;
    };

    const handleMouseLeave = () => {
      img.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [intensity, enableHover]);

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden rounded-lg', className)}
      style={{ perspective: '1000px' }}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-300 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          filter: 'brightness(1.08) contrast(1.12) saturate(1.2) drop-shadow(0 10px 20px rgba(0,0,0,0.15))',
        }}
      />
      {/* Enhanced shadow for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
    </div>
  );
}

