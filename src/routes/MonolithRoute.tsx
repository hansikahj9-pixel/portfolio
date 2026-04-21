import { useRef, useEffect, useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

// ─── Dalí Melt Canvas ─────────────────────────────────────────────────────────
const MeltCanvas = memo(function MeltCanvas({ visible }: { visible: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = 160, H = 22;
    canvas.width  = W;
    canvas.height = H;
    const ctx     = canvas.getContext('2d')!;
    const imgData = ctx.createImageData(W, H);
    const t0      = Date.now();

    const render = () => {
      const t = ((Date.now() - t0) / 1000) * 0.38;

      for (let ix = 0; ix < W; ix++) {
        for (let iy = 0; iy < H; iy++) {
          const ux = ix / W;
          const uy = 1.0 - iy / H;

          const drip = Math.sin(ux * 6.2832 + t * 2.2) * 0.09;
          const my   = uy - (1.0 - uy) * Math.abs(drip) * 1.4;

          const n1 = Math.sin(ux * 3.1 + t * 1.0) * Math.cos(my * 5.2 - t * 0.75) * 0.5 + 0.5;
          const n2 = Math.sin(ux * 8.6 - t * 1.35) * Math.cos(my * 2.3 + t * 1.1) * 0.5 + 0.5;
          const n3 = Math.sin(ux * 2.0 + my * 5.0  + t * 0.55) * 0.5 + 0.5;
          const n4 = Math.cos(ux * 5.2 * Math.sin(t * 0.28) + my * 2.9) * 0.5 + 0.5;

          let r = 126 + (  6 - 126) * n1;
          let g =  34 + (182 -  34) * n1;
          let b = 206 + (212 - 206) * n1;

          r += (192 - r) * n2 * 0.48;
          g += (132 - g) * n2 * 0.48;
          b += (252 - b) * n2 * 0.48;

          const depth = 0.08 + n3 * 0.92;
          r *= depth; g *= depth; b *= depth;

          const spec = Math.pow(n4, 4.5) * 90;
          r += spec * 0.04;
          g += spec * 0.7;
          b += spec;

          const idx = (iy * W + ix) * 4;
          imgData.data[idx]     = Math.max(5,  Math.min(255, r));
          imgData.data[idx + 1] = Math.max(5,  Math.min(255, g));
          imgData.data[idx + 2] = Math.max(5,  Math.min(255, b));
          imgData.data[idx + 3] = 255;
        }
      }

      ctx.putImageData(imgData, 0, 0);
      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="melt-canvas"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.35s ease' }}
    />
  );
});

// ─── Phase 3: The Volume — Cinematic Video Overlay ───────────────────────────
const VideoOverlay = ({
  data,
  onClose,
}: {
  data: PillarData;
  onClose: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    (async () => {
      if (!videoRef.current) return;
      try {
        videoRef.current.load();
        await videoRef.current.play();
      } catch (e) {
        console.warn('Axiomé · Video: playback deferred by browser policy.', e);
      }
    })();
    return () => { videoRef.current?.pause(); };
  }, []);

  return (
    <motion.div
      className="volume-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.32 }}
      onClick={onClose}
    >
      <div className="volume-backdrop" />

      <motion.div
        className="volume-frame"
        initial={{ scaleX: 0.005, opacity: 0.6 }}
        animate={{ scaleX: 1,     opacity: 1   }}
        exit={{ scaleX: 0.005,    opacity: 0   }}
        transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
      >
        <video
          key={data.id}
          ref={videoRef}
          src={data.video}
          loop
          muted
          playsInline
          preload="auto"
          className="volume-video"
        />
      </motion.div>

      <motion.p
        className="volume-close-hint"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.55, duration: 0.4 }}
        onClick={onClose}
      >
        ESC · CLOSE ARTIFACT
      </motion.p>
    </motion.div>
  );
};

// ─── Pillar Artifact ──────────────────────────────────────────────────────────
const PillarArtifact = ({
  data,
  isActive,
  isInactive,
  phase,
  onOpen,
}: {
  data: PillarData;
  isActive:   boolean;
  isInactive: boolean;
  phase: 1 | 2 | 3;
  onOpen: () => void;
}) => {
  const isSliver = isActive && phase >= 2;

  const animTarget = isSliver
    ? { width: '4px',   height: '90vh', opacity: 1,    filter: 'blur(0px)'   }
    : isInactive
    ? { width: '61vw',  height: '9vh',  opacity: 0.05, filter: 'blur(12px)'  }
    : { width: '61vw',  height: '9vh',  opacity: 1,    filter: 'blur(0px)'   };

  return (
    <div className="pillar-wrapper">
      <motion.div
        layout
        className="monolith-frame"
        animate={animTarget}
        transition={{
          layout:  { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
          width:   { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
          height:  { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
          opacity: { duration: 0.30 },
          filter:  { duration: 0.30 },
        }}
        style={{
          pointerEvents: isInactive ? 'none' : 'auto',
          cursor: (!isActive && !isInactive && phase === 1) ? 'pointer' : 'default',
        }}
        whileHover={!isActive && !isInactive && phase === 1 ? { scale: 1.012 } : {}}
        onClick={() => !isActive && !isInactive && phase === 1 && onOpen()}
      >
        <MeltCanvas visible={!isSliver} />

        <AnimatePresence mode="wait">
          {!isSliver && (
            <motion.span
              key="title"
              className="pillar-title"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                rotate: -90,
                scale: 0.65,
                transition: { duration: 0.28, ease: 'easeIn' },
              }}
            >
              {data.title}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default function MonolithRoute() {
  const [activePillarId, setActivePillarId] = useState<number | null>(null);
  const [phase, setPhase]                   = useState<1 | 2 | 3>(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const activePillar = PILLAR_DATA.find(p => p.id === activePillarId) ?? null;

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const openPillar = useCallback((id: number) => {
    clearTimeout(timerRef.current);
    setActivePillarId(id);
    setPhase(2);
    timerRef.current = setTimeout(() => setPhase(3), 460);
  }, []);

  const closePillar = useCallback(() => {
    clearTimeout(timerRef.current);
    setPhase(2);
    timerRef.current = setTimeout(() => {
      setPhase(1);
      setActivePillarId(null);
    }, 460);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activePillarId !== null) closePillar();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activePillarId, closePillar]);

  return (
    <div className="inspiration-container">
      <svg
        style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
        aria-hidden="true"
      >
        <defs>
          <filter
            id="dali-liquify"
            x="-25%" y="-25%"
            width="150%" height="150%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="turbulence"
              baseFrequency="0.012 0.018"
              numOctaves="3"
              seed="7"
              result="turbNoise"
            >
              <animate
                attributeName="baseFrequency"
                dur="14s"
                values="0.012 0.018;0.024 0.012;0.016 0.028;0.012 0.018"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbNoise"
              scale="32"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <LiquidDiamondMesh />

      <div className="inspiration-monolith-container">
        {PILLAR_DATA.map(pillar => (
          <PillarArtifact
            key={pillar.id}
            data={pillar}
            isActive={activePillarId === pillar.id}
            isInactive={activePillarId !== null && activePillarId !== pillar.id}
            phase={phase}
            onOpen={() => openPillar(pillar.id)}
          />
        ))}
      </div>

      <AnimatePresence>
        {phase === 3 && activePillar && (
          <VideoOverlay
            key={activePillarId}
            data={activePillar}
            onClose={closePillar}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
