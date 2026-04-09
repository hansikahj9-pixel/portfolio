import { useMemo, useState, useRef, useEffect } from 'react';

interface ShatterImageProps {
  imageUrl: string;
  alt?: string;
  isActive?: boolean;
  onComplete?: () => void;
}

type ShatterPhase = 'idle' | 'expand' | 'shatter';

export default function ShatterImage({ 
  imageUrl, 
  alt, 
  isActive = false,
  onComplete
}: ShatterImageProps) {
  const [phase, setPhase] = useState<ShatterPhase>('idle');
  const containerRef = useRef<HTMLDivElement>(null);
  const sequenceTimeoutRef = useRef<number | null>(null);

  const pieces = useMemo(() => {
    return Array.from({ length: 100 }).map((_, i) => {
      const x = i % 10;
      const y = Math.floor(i / 10);
      
      // Phase 2 Random Physics
      const tZ = Math.random() * 700 + 400; // 400px to 1100px for more depth
      const tX = (Math.random() - 0.5) * 800; // wider scatter
      const tY = Math.random() * 600 + 200; // tumble downward
      const rX = (Math.random() - 0.5) * 720; // more rotation
      const rY = (Math.random() - 0.5) * 720;
      const rZ = (Math.random() - 0.5) * 360;
      const opacity = 0.3 + Math.random() * 0.7;
      
      // Organic Ripple Transition Delay (0ms to 600ms)
      const delay = Math.random() * 0.6;
      
      return { x, y, tZ, tX, tY, rX, rY, rZ, opacity, delay };
    });
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (sequenceTimeoutRef.current) window.clearTimeout(sequenceTimeoutRef.current);
    };
  }, []);

  // Managed Lifecycle Sequence
  useEffect(() => {
    if (isActive && phase === 'idle') {
      // Start: Idle -> Expand
      setPhase('expand');
      
      // Expand -> Shatter after 0.6s
      sequenceTimeoutRef.current = window.setTimeout(() => {
        setPhase('shatter');
        
        // Shatter -> Idle (Reassemble) after 2 seconds
        sequenceTimeoutRef.current = window.setTimeout(() => {
          setPhase('idle');
          
          // Reassembly takes ~0.8s, then call onComplete
          sequenceTimeoutRef.current = window.setTimeout(() => {
            if (onComplete) onComplete();
          }, 800); 
        }, 2000);
      }, 600);
    }
  }, [isActive, onComplete, phase]);

  return (
    <div 
      ref={containerRef}
      className="shatter-wrapper"
      aria-label={alt}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        perspective: '2000px', // Increased perspective for deeper 3D effect
        transformStyle: 'preserve-3d',
        zIndex: phase !== 'idle' ? 9999 : 1, // Stay on top during expansion and shatter
      }}
    >
      <div
        className="shatter-container"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          // Phase: Expand (massive inhalation)
          transform: phase === 'expand' || phase === 'shatter' ? 'scale(2.2)' : 'scale(1)',
          transition: phase === 'idle' 
            ? 'transform 1s cubic-bezier(0.2, 0.8, 0.2, 1)' 
            : 'transform 0.8s cubic-bezier(0.1, 0.8, 0.2, 1)',
          boxShadow: phase !== 'idle' ? '0px 60px 120px rgba(0, 0, 0, 0.95)' : 'none',
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
                
                // Visual states
                opacity: phase === 'shatter' ? p.opacity : 1,
                transform: phase === 'shatter' 
                  ? `translate3d(${p.tX}px, ${p.tY}px, ${p.tZ}px) rotateX(${p.rX}deg) rotateY(${p.rY}deg) rotateZ(${p.rZ}deg)`
                  : 'translate3d(0, 0, 0) rotateX(0) rotateY(0) rotateZ(0)',
                
                // Fragment shadows
                boxShadow: phase === 'shatter' ? '0px 20px 40px rgba(0,0,0,0.6)' : 'none',
                
                // Movement timing
                transition: phase === 'shatter' 
                  ? `all 5s cubic-bezier(0.1, 0.8, 0.2, 1) ${p.delay}s` // Cinematic Floaty Slow-Mo
                  : 'all 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0s', // Smooth snap back
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
