import { useEffect } from 'react';
import '../monolith-collages.css';
import LiquidDiamondMesh from '../components/LiquidDiamondMesh';

// ─── Absolute Asset Mapping (exact filenames on disk) ────────────────────────
import videoStructure   from '../assets/videos/structure and shape.mp4';
import videoFlowy       from '../assets/videos/flowy.mp4';
import videoContrast    from '../assets/videos/contrast.mp4';
import videoAsymmetrical from '../assets/videos/Asymmetrical.mp4';
import videoDistorted   from '../assets/videos/distorted volume.mp4';

interface PillarData { id: number; title: string; video: string; }

const PILLAR_DATA: PillarData[] = [
  { id: 1, title: 'STRUCTURE & SHAPE', video: videoStructure   },
  { id: 2, title: 'FLOWY',             video: videoFlowy       },
  { id: 3, title: 'CONTRAST',          video: videoContrast    },
  { id: 4, title: 'ASYMMETRICAL',      video: videoAsymmetrical },
  { id: 5, title: 'DISTORTED VOLUME',  video: videoDistorted   },
];

// ─── CONCEPT 1: Liquid Bento ──────────────────────────────────────────────────
const ConceptLiquidBento = ({ data }: { data: PillarData[] }) => {
  return (
    <section className="collage-section">
      <h2 className="section-title">Concept 01 / Liquid Bento Grid</h2>
      <div className="bento-container">
        {data.map((item, idx) => (
          <div key={item.id} className={`bento-cell bento-cell-${idx}`}>
            <video src={item.video} loop muted playsInline autoPlay preload="auto" />
            <div className="video-title">{item.title}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ─── CONCEPT 2: Ethereal Archipelagos ─────────────────────────────────────────
const ConceptEtherealBlobs = ({ data }: { data: PillarData[] }) => {
  return (
    <section className="collage-section">
      <h2 className="section-title">Concept 02 / Ethereal Archipelagos</h2>
      <div className="blobs-wrapper">
        <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -10" result="goo" />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
          </defs>
        </svg>
      </div>
      <div className="blobs-container">
        {data.map((item, idx) => (
          <div key={item.id} className={`blob-cell blob-cell-${idx}`}>
            <video src={item.video} loop muted playsInline autoPlay preload="auto" />
            <div className="video-title">{item.title}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ─── CONCEPT 3: Shattered Mirror ──────────────────────────────────────────────
const ConceptShatteredMirror = ({ data }: { data: PillarData[] }) => {
  return (
    <section className="collage-section">
      <h2 className="section-title">Concept 03 / Shattered Mirror</h2>
      <div className="mirror-container">
        {data.map((item, idx) => (
          <div key={item.id} className={`shard-cell shard-cell-${idx}`}>
            <div className="shard-overlay" />
            <video src={item.video} loop muted playsInline autoPlay preload="auto" />
            <div className="video-title">{item.title}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default function MonolithRoute() {
  useEffect(() => {
    // Reset scroll on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <LiquidDiamondMesh />
      
      <div className="monolith-scroll-container">
        <ConceptLiquidBento data={PILLAR_DATA} />
        <ConceptEtherealBlobs data={PILLAR_DATA} />
        <ConceptShatteredMirror data={PILLAR_DATA} />
      </div>
    </>
  );
}
