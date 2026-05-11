import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.fromTo(
      titleRef.current,
      { y: 80, opacity: 0, skewY: 5 },
      { y: 0, opacity: 1, skewY: 0, duration: 1.4, delay: 0.3 }
    )
      .fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0 },
        '-=0.6'
      )
      .fromTo(
        scrollRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1 },
        '-=0.3'
      );
  }, []);

  return (
    <div className="hero-container" ref={containerRef}>
      <div className="hero-content">
        <h1 className="hero-title" ref={titleRef}>
          Hansika Jain
        </h1>
        <p className="hero-subtitle" ref={subtitleRef}>
          Fashion Designer &amp; 3D Artist
        </p>
      </div>
      <div className="hero-scroll-indicator" ref={scrollRef}>
        <span>Scroll</span>
        <div className="hero-scroll-line" />
      </div>
      <Link to="/shakespeare" style={{ position: 'absolute', bottom: '1rem', left: '1rem', fontSize: '0.75rem', color: '#ffffff', opacity: 0.5, transition: 'opacity 0.3s ease', zIndex: 5, pointerEvents: 'auto' }} onMouseEnter={e => (e.currentTarget.style.opacity = '1')} onMouseLeave={e => (e.currentTarget.style.opacity = '0.5')}>Shakespearean Love</Link>
    </div>
  );
}
