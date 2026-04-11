import { useState, useRef, useEffect } from 'react';
import type { MouseEvent } from 'react';
import AxiomeGlobalNav from '../components/AxiomeGlobalNav';
import videoSrc from '../assets/Structure-inspiration.mp4';

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
  
  // Spotlight tracking strictly within the Box
  const boxRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: '50%', y: '50%' });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!boxRef.current) return;
    const rect = boxRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x: `${x}px`, y: `${y}px` });
  };

  useEffect(() => {
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
        <h1 className="hero-heading">INSPIRATION</h1>
        <p className="hero-manifesto">
          Axiomé represents a tectonic shift in the language of tailoring, standing at the precise intersection where the subconscious fluidity of Salvador Dalí meets the rigid architectures of Max Ernst. We have moved beyond the traditional concept of 'drape' to embrace a methodology of structural defiance.
        </p>
      </section>

      {/* ── Section 2 & 3: The Thick Contained Box ── */}
      <div 
        className="structure-box-container" 
        ref={boxRef} 
        onMouseMove={handleMouseMove}
        style={{
          '--mouse-x': mousePos.x,
          '--mouse-y': mousePos.y
        } as React.CSSProperties}
      >
        {/* Hidden Topography & Javascript Glow */}
        <div className="topography-layer" />
        <div className="box-flashlight" />

        <div className="box-grid">
          
          {/* LEFT SIDE (The Anchor) */}
          <div className="box-left">
            <h2 className="box-heading">STRUCTURE &<br/>SHAPE</h2>
          </div>

          {/* RIGHT SIDE: Solid Accordion Sidebar (TEXT ONLY) */}
          <div className="box-right">
            {ACCORDION_DATA.map((card) => {
              const isActive = activeCardId === card.id;
              return (
                <article 
                  key={card.id}
                  className={`solid-card ${isActive ? 'active' : ''}`}
                  onClick={() => toggleCard(card.id)}
                >
                  <h3 className="solid-header">{card.name}</h3>
                  <div className="solid-body-wrapper">
                    <div className="solid-text-content">
                      <p className="solid-text">{card.description}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

        </div>

        {/* ── Section 3: The Cinematic Contained Video ── */}
        <video className="contained-video" autoPlay loop muted playsInline>
          <source src={videoSrc} type="video/mp4" />
        </video>

      </div>

    </div>
  );
}
