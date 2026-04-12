import { useState, useRef, useEffect } from 'react';
import type { MouseEvent } from 'react';
import AxiomeGlobalNav from '../components/AxiomeGlobalNav';
import LiquidDiamondMesh from '../components/LiquidDiamondMesh';
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

  // Box spotlight tracking
  const boxRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: '50%', y: '50%' });

  const handleBoxMouseMove = (e: MouseEvent<HTMLDivElement>) => {
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
      {/* WebGL Liquid Diamond Background — fixed behind everything */}
      <LiquidDiamondMesh />

      <AxiomeGlobalNav />

      {/* ── Section 1: The Global Inspiration Hero ── */}
      <section className="inspiration-hero">
        <h1 className="hero-heading">INSPIRATION</h1>
        <p className="hero-manifesto">
          Axiomé represents a tectonic shift in the language of tailoring, standing at the precise intersection where the subconscious fluidity of Salvador Dalí meets the rigid architectures of Max Ernst. We have moved beyond the traditional concept of 'drape' to embrace a methodology of structural defiance.
        </p>
      </section>

      {/* ── Section 2 & 3: The Architectural Box ── */}
      <div
        className="structure-box-container"
        ref={boxRef}
        onMouseMove={handleBoxMouseMove}
        style={{
          '--mouse-x': mousePos.x,
          '--mouse-y': mousePos.y
        } as React.CSSProperties}
      >
        {/* Interior topography & flashlight */}
        <div className="topography-layer" />
        <div className="box-flashlight" />

        <div className="box-grid">
          {/* LEFT SIDE */}
          <div className="box-left">
            <h2 className="box-heading">STRUCTURE &amp;<br />SHAPE</h2>
          </div>

          {/* RIGHT SIDE: Solid Accordion (TEXT ONLY) */}
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

        {/* ── Section 3: Cinematic Contained Video ── */}
        <video className="contained-video" autoPlay loop muted playsInline>
          <source src={videoSrc} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
