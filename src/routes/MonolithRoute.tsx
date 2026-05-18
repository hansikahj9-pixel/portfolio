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

export default function MonolithRoute() {
  return (
    <>
      <LiquidDiamondMesh />
      
      <div className="monolith-single-container">
        <ConceptLiquidBento data={PILLAR_DATA} />
      </div>
    </>
  );
}
