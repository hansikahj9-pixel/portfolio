import { useRef, useEffect } from 'react';
import type { MouseEvent } from 'react';
import AxiomeGlobalNav from '../components/AxiomeGlobalNav';
import LiquidDiamondMesh from '../components/LiquidDiamondMesh';
import videoSrc from '../assets/Structure-inspiration.mp4';

export default function InspirationRoute() {
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
        {/* Background Video */}
        <video className="contained-video" autoPlay loop muted playsInline>
          <source src={videoSrc} type="video/mp4" />
        </video>

        {/* Interaction layer */}
        <div className="box-flashlight" />

        <div className="box-grid">
          {/* CENTERED 3D HEADING */}
          <div className="box-title-wrapper">
            <h2 className="box-heading">STRUCTURE &amp;<br />SHAPE</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

// We need to import useState since it's used for mousePos
import { useState } from 'react';
