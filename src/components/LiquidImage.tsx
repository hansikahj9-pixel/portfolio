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
  
  const filterId = useRef(`dali-warp-${Math.random().toString(36).substr(2, 9)}`).current;

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
    // Reset phase when inactive so it can trigger again later
    if (!isActive) {
      setPhase('idle');
      return;
    }

    if (isActive && phase === 'idle') {
      // Step 1: Expand
      setPhase('expand');
      
      // Step 2: Melt after 600ms
      sequenceTimeoutRef.current = window.setTimeout(() => {
        setPhase('melt');
        animateWarp(250, 2500); 
        
        // Step 3: Hold for 3 seconds, then Reset
        sequenceTimeoutRef.current = window.setTimeout(() => {
          setPhase('idle'); // We set to idle here to trigger re-assembly visuals
          animateWarp(0, 1000); 
          
          // Step 4: Finalize and move to next
          sequenceTimeoutRef.current = window.setTimeout(() => {
            setPhase('completed'); // Prevents re-triggering while isActive is still true
            if (onComplete) onComplete();
          }, 1100);
        }, 3000);
      }, 600);
    }
  }, [isActive, onComplete, phase]);

  const isActuallyActive = phase !== 'idle' || warpScale > 0.1;

  return (
    <div 
      className="liquid-wrapper"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        zIndex: isActuallyActive ? 9999 : 1,
      }}
    >
      {isActuallyActive && (
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
          filter: isActuallyActive ? `url(#${filterId})` : 'none',
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
