import { useState, useEffect } from 'react';
import AxiomeGlobalNav from '../components/AxiomeGlobalNav';
import videoSrc from '../assets/Structure-inspiration.mp4';
import { motion, AnimatePresence } from 'framer-motion';

const GARMENT_DATA = [
  {
    id: 'spiral-volume',
    name: 'The Spiral Volume Origami Silhouette',
    description: "This silhouette serves as a direct mathematical translation of the spiraling rock formations in Ernst's landscape. We have abandoned soft seams in favor of a complex internal scaffolding system, utilizing heavy-gauge internal wiring and multi-layered, stiff fused panels to force a permanent 3D protrusion that defies the traditional laws of gravity."
  },
  {
    id: 'layered-column',
    name: 'The Layered Sculptural Column',
    description: "A study in tiered monumental weight, this garment replicates the stratified layers of geological formations. The architectural integrity is maintained through high-density bonding and hidden internal scaffolding concentrated in the high-neck and shoulder regions, allowing the fabric to sit away from the body in heavy, monumental blocks."
  },
  {
    id: 'architectural-bodice',
    name: 'The Architectural Two-Toned Bodice',
    description: "Defined by a divergent color-blocking strategy that creates a sharp, visual schism on the torso. Through industrial-grade architectural interfacing, we have created a literal, sharp-edged ridge at the intersection of the fabric panels that juts outward, emphasizing the rigid, non-flowy nature of the Axiomé aesthetic."
  }
];

const MANIFESTO_TEXT = "Axiomé represents a radical tectonic shift in the language of modern tailoring, standing at the precise intersection where the subconscious fluidity of Salvador Dalí meets the rigid, monumental architectures of Max Ernst. We have moved beyond the traditional concept of drape to embrace a methodology of structural defiance, where every silhouette is treated as a three-dimensional manifestation of a surrealist dream. By meticulously deconstructing the geological strata of Ernst’s landscape and the melting logic of Dalí’s visions, we translate these ethereal concepts into the rigorous discipline of the high-fashion atelier. This collection is defined by the invisible tech of construction—heavy fused interfacing, internal wiring, and hidden boning—elements that allow us to architect volume that does not collapse, but rather protrudes and erupts from the body. Axiomé is not merely an aesthetic choice; it is a manifestation of the structural soul.";

export default function InspirationRoute() {
  const [typedText, setTypedText] = useState("");
  const [activeGarment, setActiveGarment] = useState<typeof GARMENT_DATA[0] | null>(null);

  // Typewriter effect
  useEffect(() => {
    // Delay start until heading finishes blurring in
    const startDelay = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        setTypedText(MANIFESTO_TEXT.substring(0, index + 1));
        index++;
        if (index >= MANIFESTO_TEXT.length) clearInterval(interval);
      }, 15); // Fast typewriter speed
      return () => clearInterval(interval);
    }, 2800); // 2.5s for heading blur + slight offset
    
    return () => clearTimeout(startDelay);
  }, []);

  return (
    <div className="inspiration-container">
      <AxiomeGlobalNav />

      <main className="inspiration-layout">
        
        {/* SVG Filter for Tectonic Typography */}
        <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
          <filter id="tectonic-stone">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>

        <section className="inspiration-left">
          <h1 className="editorial-heading blur-focus-heading">INSPIRATION</h1>
          <p className="typewriter-manifesto">{typedText}<span className="cursor" /></p>

          <div className="tectonic-section">
            <h2 className="tectonic-heading">STRUCTURE & SHAPE</h2>
            
            <div className="architectural-video-wrapper">
              <div className="blueprint-frame top-left"></div>
              <div className="blueprint-frame top-right"></div>
              <div className="blueprint-frame bottom-left"></div>
              <div className="blueprint-frame bottom-right"></div>
              
              <video 
                src={videoSrc} 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="structure-video"
              />
            </div>
          </div>
        </section>

        <section className="inspiration-right">
          <ul className="garment-list">
            {GARMENT_DATA.map((garment) => (
              <li 
                key={garment.id} 
                className={`garment-item ${activeGarment?.id === garment.id ? 'active' : ''}`}
                onClick={() => setActiveGarment(activeGarment?.id === garment.id ? null : garment)}
              >
                {garment.name}
              </li>
            ))}
          </ul>
        </section>

        {/* Collapsible Technical Analysis Panel */}
        <AnimatePresence>
          {activeGarment && (
            <motion.aside 
              className="technical-panel"
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            >
              <button className="panel-close" onClick={() => setActiveGarment(null)}>CLOSE [X]</button>
              <h3 className="panel-title">{activeGarment.name}</h3>
              <div className="panel-divider" />
              <p className="panel-description">{activeGarment.description}</p>
            </motion.aside>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
