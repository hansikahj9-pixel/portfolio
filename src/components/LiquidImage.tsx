import { useState, useRef, useEffect } from 'react';

interface LiquidImageProps {
  imageUrl: string;
  alt?: string;
  isActive?: boolean;
  onComplete?: () => void;
}

type LiquidPhase = 'idle' | 'expand' | 'melt' | 'completed';

export default function LiquidImage({ 
  imageUrl, 
  alt, 
  isActive = false,
  onComplete 
}: LiquidImageProps) {
  const [phase, setPhase] = useState<LiquidPhase>('idle');
  const [warpScale, setWarpScale] = useState(0);
  
  const warpScaleRef = useRef(0);
  const sequenceTimeoutRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  
  const [filterId] = useState(() => `dali-warp-${Math.random().toString(36).substring(2, 11)}`);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (sequenceTimeoutRef.current) window.clearTimeout(sequenceTimeoutRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Animation Engine for warpScale
  const animateWarp = (targetScale: number, duration: number) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const start = performance.now();
    const initialScale = warpScaleRef.current;

    const step = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = initialScale + (targetScale - initialScale) * ease;
      
      warpScaleRef.current = current;
      setWarpScale(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };
    rafRef.current = requestAnimationFrame(step);
  };

  // Sequence Logic
  useEffect(() => {
    // CRITICAL: Clean up and reset when this image is no longer the active one
    if (!isActive) {
      if (sequenceTimeoutRef.current) window.clearTimeout(sequenceTimeoutRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      // Scheduling to avoid cascading synchronous render lint error
      requestAnimationFrame(() => {
        setPhase('idle');
        setWarpScale(0);
      });
      warpScaleRef.current = 0;
      return;
    }

    if (isActive && phase === 'idle') {
      // Step 1: Expand
      requestAnimationFrame(() => setPhase('expand'));
      
      // Step 2: Melt after 400ms
      sequenceTimeoutRef.current = window.setTimeout(() => {
        setPhase('melt');
        animateWarp(250, 1800); 
        
        // Step 3: Hold for 2 seconds, then Reset
        sequenceTimeoutRef.current = window.setTimeout(() => {
          setPhase('idle'); 
          animateWarp(0, 1000); 
          
          // Step 4: Finalize and move to next
          sequenceTimeoutRef.current = window.setTimeout(() => {
            setPhase('completed'); 
            if (onComplete) onComplete();
          }, 800);
        }, 2000);
      }, 400);
    }
  }, [isActive, onComplete, phase]);

  const isActuallyAnimating = phase !== 'idle' || warpScale > 0.1;
  // Use isActive to ensure the SVG is only present when intended
  const showFilter = isActive || isActuallyAnimating;

  return (
    <div 
      className="liquid-wrapper"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        zIndex: showFilter ? 9999 : 1,
      }}
    >
      {showFilter && (
        <svg style={{ width: 0, height: 0, position: 'absolute', pointerEvents: 'none' }}>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.07 0.003" 
              numOctaves="3" 
              result="noise" 
            />
            <feColorMatrix 
              type="matrix" 
              values="0 0 0 0 0.5  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" 
              in="noise" 
              result="verticalNoise" 
            />
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="verticalNoise" 
              scale={warpScale} 
              xChannelSelector="R" 
              yChannelSelector="G" 
            />
          </filter>
        </svg>
      )}

      <div
        className="liquid-image-container"
        style={{
          width: '100%',
          height: '100%',
          filter: showFilter ? `url(#${filterId})` : 'none',
          transform: phase === 'melt' 
            ? 'scale(2.2) scaleY(1.8) translateY(100px)' 
            : (phase === 'expand' ? 'scale(2.2)' : 'scale(1)'),
          transition: phase === 'melt' 
            ? 'all 4.5s cubic-bezier(0.25, 0.1, 0.25, 1)' 
            : 'all 1s cubic-bezier(0.2, 0.8, 0.2, 1)',
          boxShadow: phase !== 'idle' ? '0px 40px 80px rgba(0,0,0,0.9)' : 'none',
          transformOrigin: 'top center',
          background: '#111',
          overflow: 'hidden',
        }}
      >
        <img 
          src={imageUrl} 
          alt={alt || "Dali Inspiration"} 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            opacity: phase !== 'idle' ? 1 : 0.85,
            transition: 'opacity 0.6s ease',
          }}
        />
      </div>
    </div>
  );
}
