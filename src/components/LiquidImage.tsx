import { useState, useRef, useEffect } from 'react';

interface LiquidImageProps {
  imageUrl: string;
  alt?: string;
}

export default function LiquidImage({ imageUrl, alt }: LiquidImageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMelting, setIsMelting] = useState(false);
  const [warpScale, setWarpScale] = useState(0);
  
  const warpScaleRef = useRef(0);
  const timeoutRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  
  // Create a unique ID for this instance's SVG filter
  const filterId = useRef(`dali-warp-${Math.random().toString(36).substr(2, 9)}`).current;

  // Handle SVG Warp Scale Interpolation
  useEffect(() => {
    if (!isHovered && !isMelting && warpScaleRef.current === 0) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    let start = performance.now();
    let initialScale = warpScaleRef.current;

    const animate = (time: number) => {
      let delta = time - start;
      if (isMelting) {
        // Melt phase: animate up to 250
        let progress = Math.min(delta / 4500, 1);
        let easeProgress = 1 - Math.pow(1 - progress, 3);
        let newScale = initialScale + (250 - initialScale) * easeProgress;
        warpScaleRef.current = newScale;
        setWarpScale(newScale);
        
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        }
      } else {
        // Recovery phase: animate back to 0
        let progress = Math.min(delta / 1000, 1);
        let easeProgress = 1 - Math.pow(1 - progress, 3);
        let newScale = initialScale * (1 - easeProgress);
        
        if (newScale < 0.1) newScale = 0;
        
        warpScaleRef.current = newScale;
        setWarpScale(newScale);
        
        if (progress < 1 && newScale > 0) {
          rafRef.current = requestAnimationFrame(animate);
        }
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isMelting, isHovered]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setIsMelting(true);
    }, 600);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsHovered(false);
    setIsMelting(false);
  };

  const isActive = isHovered || isMelting || warpScale > 0;

  return (
    <div 
      className="liquid-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseEnter}
      onTouchEnd={handleMouseLeave}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        zIndex: isActive ? 9999 : 1,
      }}
    >
      {/* Only render SVG Filter when active to save GPU memory */}
      {isActive && (
        <svg style={{ width: 0, height: 0, position: 'absolute', pointerEvents: 'none' }}>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.1 0.005" 
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
          filter: isActive ? `url(#${filterId})` : 'none',
          transform: isMelting 
            ? 'scale(2.2) scaleY(1.8) translateY(80px)' 
            : (isHovered ? 'scale(2.2)' : 'scale(1) translate(0)'),
          transition: isMelting 
            ? 'all 4.5s cubic-bezier(0.25, 0.1, 0.25, 1)' 
            : 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
          boxShadow: isHovered ? '0px 40px 80px rgba(0,0,0,0.9)' : 'none',
          transformOrigin: 'top center',
          background: '#111',
          overflow: 'hidden', // Contain the image inside the scaled container
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
            opacity: isActive ? 1 : 0.8, // Slight dim when inactive for performance
            transition: 'opacity 0.6s ease',
          }}
        />
      </div>
    </div>
  );
}
