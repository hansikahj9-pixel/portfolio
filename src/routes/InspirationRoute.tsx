import { useState, useRef, useEffect } from 'react';
import type { MouseEvent } from 'react';
import AxiomeGlobalNav from '../components/AxiomeGlobalNav';

const ACCORDION_DATA = [
  {
    id: 'spiral-volume',
    name: 'Spiral Volume Origami',
    description: "A flowing translation of spiraling rock formations, designed to hold a permanent, gravity-defying silhouette. The invisible architecture beneath the drape."
  },
  {
    id: 'layered-column',
    name: 'Layered Sculptural Column',
    description: "Replicating the monumental weight of geological strata. A tiered, block-like structure that possesses the perceived permanence of stone."
  },
  {
    id: 'two-toned-bodice',
    name: 'Two-Toned Bodice',
    description: "Defined by divergent color-blocking and sharp-edged construction, creating a tectonic boundary on the body."
  }
];

export default function InspirationRoute() {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  
  // Spotlight tracking
  const sectionRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: '50%', y: '50%' });

  // Handle Spotlight coordinates on mouse move
  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x: `${x}px`, y: `${y}px` });
  };

  // Ensure scroll is fixed to Top initially
  useEffect(() => {
    // If the top element needs snapping. However, we let native scroll operate smoothly.
    window.scrollTo(0, 0);
  }, []);

  const toggleCard = (id: string) => {
    setActiveCardId(prev => prev === id ? null : id);
  };

  return (
    <div className="inspiration-container">
      <AxiomeGlobalNav />

      {/* ── Section 1: The Global Inspiration Hero ── */}
      <section className="inspiration-hero">
        <div className="inspiration-hero-bg" />
        <div className="hero-content">
          <h1 className="hero-heading">INSPIRATION</h1>
          <p className="hero-manifesto">
            Axiomé represents a tectonic shift in the language of tailoring, standing at the precise intersection where the subconscious fluidity of Salvador Dalí meets the rigid architectures of Max Ernst. We have moved beyond the traditional concept of 'drape' to embrace a methodology of structural defiance.
          </p>
        </div>
      </section>

      {/* ── Section 2: "Structure & Shape" Box ── */}
      <section 
        className="structure-section" 
        ref={sectionRef} 
        onMouseMove={handleMouseMove}
        style={{
          // Pass mouse pos to CSS vars for Spotlight glow
          '--mouse-x': mousePos.x,
          '--mouse-y': mousePos.y
        } as React.CSSProperties}
      >
        {/* Parallax Layers & Spotlight Glow */}
        <div className="parallax-strata-1" />
        <div className="parallax-strata-2" />
        <div className="cursor-spotlight" />

        <div className="architectural-grid">
          
          {/* LEFT SIDE (The Anchor) */}
          <div className="arch-left">
            <h2 className="arch-heading">STRUCTURE &<br/>SHAPE</h2>
          </div>

          {/* RIGHT SIDE: The Frosted Glass Sidebar Accordion */}
          <div className="arch-right">
            {ACCORDION_DATA.map((card) => {
              const isActive = activeCardId === card.id;
              return (
                <article 
                  key={card.id}
                  className={`glass-card ${isActive ? 'active' : ''}`}
                  onClick={() => toggleCard(card.id)}
                >
                  <h3 className="glass-header">{card.name}</h3>
                  <div className="glass-body-wrapper">
                    <div className="glass-body-content">
                      <div className="glass-inner-grid">
                        <p className="glass-text">{card.description}</p>
                        <div className="macro-placeholder">
                          {/* Future macro-photo injection point */}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── Section 3: The Cinematic Climax ── */}
      <section className="cinematic-video-section">
        <video className="untouched-video" autoPlay loop muted playsInline>
          <source src="desktop/portfolio/structure inspiration.mp4" type="video/mp4" />
        </video>
      </section>

    </div>
  );
}
