import { useMemo, useState, useRef, useEffect } from 'react';

interface ShatterImageProps {
  imageUrl: string;
  alt?: string;
  autoTrigger?: boolean;
  staggerDelay?: number;
}

export default function ShatterImage({ 
  imageUrl, 
  alt, 
  autoTrigger = false, 
  staggerDelay = 0 
}: ShatterImageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isShattering, setIsShattering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);
  const autoTimeoutRef = useRef<number | null>(null);

  const pieces = useMemo(() => {
    return Array.from({ length: 100 }).map((_, i) => {
      const x = i % 10;
      const y = Math.floor(i / 10);
      
      // Phase 2 Random Physics
      const tZ = Math.random() * 700 + 200; // 200px to 900px
      const tX = (Math.random() - 0.5) * 600; // scatter X heavily
      const tY = Math.random() * 700 + 100; // 100px to 800px (tumble downward)
      const rX = (Math.random() - 0.5) * 360; // extreme random X rotation
      const rY = (Math.random() - 0.5) * 360; // extreme random Y rotation
      const rZ = (Math.random() - 0.5) * 180; // extreme random Z rotation
      const opacity = 0.4 + Math.random() * 0.6; // 0.4 to 1
      
      // Organic Ripple Transition Delay (0ms to 500ms)
      const delay = Math.random() * 0.5;
      
      return { x, y, tZ, tX, tY, rX, rY, rZ, opacity, delay };
    });
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (autoTimeoutRef.current) clearTimeout(autoTimeoutRef.current);
    };
  }, []);

  // Intersection Observer for Auto Trigger
  useEffect(() => {
    if (!autoTrigger || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Trigger sequence with stagger delay
            autoTimeoutRef.current = window.setTimeout(() => {
              setIsHovered(true);
              
              // Phase 2 triggers strictly after 800ms expansion
              timeoutRef.current = window.setTimeout(() => {
                setIsShattering(true);
              }, 800);
            }, staggerDelay * 1000);
            
            // Only trigger once
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [autoTrigger, staggerDelay]);

  const handleMouseEnter = () => {
    if (autoTrigger) return; // Disable hover when auto-triggered
    setIsHovered(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    // Phase 2 triggers strictly after 800ms
    timeoutRef.current = window.setTimeout(() => {
      setIsShattering(true);
    }, 800);
  };

  const handleMouseLeave = () => {
    if (autoTrigger) return; // Disable hover when auto-triggered
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsHovered(false);
    setIsShattering(false);
  };

  return (
    <div 
      ref={containerRef}
      className="shatter-wrapper"
      aria-label={alt}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseEnter}
      onTouchEnd={handleMouseLeave}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        perspective: '1200px',
        transformStyle: 'preserve-3d',
        zIndex: isHovered ? 9999 : 1, // Elevate container aggressively above everything
      }}
    >
      <div
        className="shatter-container"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          // Phase 1: Massive Expansion
          transform: isHovered ? 'scale(2.2)' : 'scale(1)',
          transition: 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
          boxShadow: isHovered ? '0px 60px 120px rgba(0, 0, 0, 0.95)' : 'none',
        }}
      >
        {pieces.map((p, i) => {
          const bgPosX = p.x * (100 / 9);
          const bgPosY = p.y * (100 / 9);
          
          return (
            <div 
              key={i}
              className="shatter-piece"
              style={{
                position: 'absolute',
                left: `${p.x * 10}%`,
                top: `${p.y * 10}%`,
                width: '10%',
                height: '10%',
                backgroundImage: `url("${imageUrl}")`,
                backgroundSize: '1000% 1000%',
                backgroundPosition: `${bgPosX}% ${bgPosY}%`,
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
                
                // Phase 2 Shatter Transitions and Transforms
                opacity: isShattering ? p.opacity : 1,
                transform: isShattering 
                  ? `translate3d(${p.tX}px, ${p.tY}px, ${p.tZ}px) rotateX(${p.rX}deg) rotateY(${p.rY}deg) rotateZ(${p.rZ}deg)`
                  : 'translate3d(0, 0, 0) rotateX(0) rotateY(0) rotateZ(0)',
                
                // Individual shadows falling dynamically
                boxShadow: isShattering ? '0px 20px 40px rgba(0,0,0,0.6)' : 'none',
                
                transition: isShattering 
                  ? `all 3s cubic-bezier(0.1, 0.9, 0.2, 1) ${p.delay}s` // Slow-Mo with organic ripple
                  : 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0s', // Smooth snap back, immediate
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
