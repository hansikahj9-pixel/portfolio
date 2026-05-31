import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import { Link } from 'react-router-dom';

// Asset Imports
import coverImg from '../assets/store/cover page.png';
import moodBoardImg from '../assets/store/mood board.jpg';
import alulaImg from '../assets/store/alula.png';
import sketch15 from '../assets/store/15.png';
import sketch16 from '../assets/store/16.png';
import sketch17 from '../assets/store/17.png';
import sketch18 from '../assets/store/18.png';
import sketch19 from '../assets/store/19.png';

// Loewe Realized Sanctuary AI Renders Imports
import exteriorImg from '../assets/store/exterior.png';
import frontImg from '../assets/store/front.png';
import windowDisplayImg from '../assets/store/window display.png';
import wallImg from '../assets/store/wall.png';
import wall2Img from '../assets/store/wall 2.png';
import backImg from '../assets/store/back.png';
import topViewImg from '../assets/store/top view.png';
import view360Img from '../assets/store/360 view.png';
import store1Img from '../assets/store/store 1.jpeg';

import './VisualMerchandising.css';

// ── Avant-Garde Exhibits Data ──
const sketchesList = [
  {
    img: sketch17,
    title: 'The Sandstone Facade Portal',
    subtitle: 'Store Front Facade',
    desc: 'The entrance facade is carved from monolithic sandstone blocks, mimicking the slot canyons of AlUla. The offset entryway creates an intimate architectural threshold, while a sleek, polished brass base plate floats the heavy stone mass above the shifting sand floor.'
  },
  {
    img: sketch15,
    title: 'The Mirage Showcase Vitrine',
    subtitle: 'Window Display Scene',
    desc: 'An artistic street-facing vitrine installation. A circular plaster dune aperture acts as a framing device. Inside, a floating chrome halo suspends a single Puzzle leather bag, illuminated by tight pinpoint spotlights, surrounded by rising raw desert branches.'
  },
  {
    img: sketch18,
    title: 'Eroded Sandstone Shelving Niches',
    subtitle: 'Side Wall Detail - East Gallery',
    desc: 'A detailed study of the interior accessory coves. Deep, wind-eroded sandstone cavities are sculpted directly into the plaster walls, backed by hidden warm LED ribbons. Folded silk scarves and small leather goods sit like gems inside organic cavernous coves.'
  },
  {
    img: sketch19,
    title: 'The Shattered Mirror Vanity Coves',
    subtitle: 'Side Wall Detail - West Gallery',
    desc: 'Focused on eyewear and minor accessory display. A large, fractured mirror with natural, fluid brass contours is embedded flush into the dry clay wall. Sandstone columns emerge from the sand bed below to support luxury tortoiseshell glasses, offering shifting reflections of sand, mirror, and stone.'
  },
  {
    img: sketch16,
    title: 'The Back-of-Store Cash Wrap & Rock Shelf Canopy',
    subtitle: 'Back of Store View',
    desc: 'The terminal point of the gallery journey. A sweeping sandstone arch forms a protective plaster canopy. The central cash-wrap counter is shaped like a layered rock shelf, stepping up from rough texturized sandstone into a seamless, liquid-brass countertop.'
  }
];

export default function VisualMerchandisingRoute() {
  // ── Scroll Progress Tracking for Route Container ──
  const drawerScrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: drawerScrollRef });
  const scrollProgressSpring = useSpring(scrollYProgress, { stiffness: 100, damping: 25 });

  // ── Depth-Parallax Mirror Portal Mouse Tracking ──
  const portalRef = useRef<HTMLDivElement>(null);
  const portalMouseX = useMotionValue(0);
  const portalMouseY = useMotionValue(0);
  const portalMouseXSpring = useSpring(portalMouseX, { stiffness: 60, damping: 20 });
  const portalMouseYSpring = useSpring(portalMouseY, { stiffness: 60, damping: 20 });

  // Map mouse positions to mirror reflections (opposite direction for parallax)
  const portalReflectX = useTransform(portalMouseXSpring, [-200, 200], [25, -25]);
  const portalReflectY = useTransform(portalMouseYSpring, [-200, 200], [25, -25]);
  const portalTiltX = useTransform(portalMouseYSpring, [-200, 200], [8, -8]);
  const portalTiltY = useTransform(portalMouseXSpring, [-200, 200], [-8, 8]);

  const handlePortalMouseMove = (e: React.MouseEvent) => {
    if (!portalRef.current) return;
    const rect = portalRef.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    portalMouseX.set(x);
    portalMouseY.set(y);
  };

  const handlePortalMouseLeave = () => {
    portalMouseX.set(0);
    portalMouseY.set(0);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div 
      ref={drawerScrollRef}
      className="vm-stage loewe-desert-drawer"
      initial={{ background: '#f5efe6' }}
      animate={{ 
        background: ['#f5efe6', '#ead8c4', '#f5efe6'],
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      style={{ 
        width: '100%', 
        height: '100vh', 
        overflowY: 'auto', 
        padding: '3rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative'
      }}
    >
      {/* Floating Liquid-Gold Scroll Progress Ribbon */}
      <motion.div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #c49e29, #ebd79e, #8c7662, #c49e29)',
          scaleX: scrollProgressSpring,
          transformOrigin: '0%',
          zIndex: 9999
        }}
      />

      {/* ── Floating Ring Back Button ── */}
      <Link to="/" className="vm-back-btn" aria-label="Go Back" style={{ zIndex: 1000 }}>
        <motion.div 
          className="vm-back-ring"
          whileHover={{ rotate: 180, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="vm-back-arrow">←</span>
        </motion.div>
      </Link>

      {/* Organic Mirage Vector Dune Graphics (Drifting Backdrops) */}
      <motion.div 
        animate={{ 
          y: [0, -20, 0],
          x: [0, 10, 0],
          rotate: [0, 2, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: '15%', left: '-10%', width: '45%', opacity: 0.05, pointerEvents: 'none', zIndex: 0 }}
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%' }}>
          <path d="M0,50 C30,30 70,70 100,50 L100,100 L0,100 Z" fill="#c49e29" />
        </svg>
      </motion.div>
      <motion.div 
        animate={{ 
          y: [0, 25, 0],
          x: [0, -15, 0],
          rotate: [0, -3, 0]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: '65%', right: '-10%', width: '50%', opacity: 0.04, pointerEvents: 'none', zIndex: 0 }}
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%' }}>
          <path d="M0,40 C40,70 60,30 100,60 L100,100 L0,100 Z" fill="#c49e29" />
        </svg>
      </motion.div>

      {/* Scoped CSS Inject for responsiveness */}
      <style>{`
        @media (max-width: 900px) {
          .loewe-split-row {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
            text-align: center !important;
          }
          .loewe-split-row h2 {
            font-size: 2.2rem !important;
          }
          .loewe-desert-drawer p {
            font-size: 1.05rem !important;
          }
          .loewe-sketch-block {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
            text-align: center !important;
          }
          .loewe-sketch-block .sketch-text {
            text-align: center !important;
            align-items: center !important;
          }
          .loewe-three-col-analysis {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>

      {/* ── THE COVER IMAGE ── */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ 
          width: '100%', 
          maxWidth: '1200px',
          borderRadius: '16px', 
          overflow: 'hidden', 
          boxShadow: '0 25px 50px -12px rgba(139, 107, 74, 0.25)',
          marginBottom: '4rem',
          flexShrink: 0,
          zIndex: 1,
          marginTop: '2rem'
        }}
      >
        <img src={coverImg} alt="Loewe Desert Cover" style={{ width: '100%', height: 'auto', display: 'block' }} />
      </motion.div>

      {/* ── THE MOODBOARD SECTION ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%',
          maxWidth: '1200px',
          marginTop: '2rem',
          paddingBottom: '6rem',
          borderBottom: '1px solid rgba(92, 74, 61, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3.5rem',
          zIndex: 1
        }}
      >
        {/* Theme Header */}
        <div style={{ textAlign: 'center', color: '#5c4a3d', maxWidth: '850px' }}>
          <span style={{ fontSize: '0.85rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c49e29', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
            THEME & CONCEPT INSPIRATION
          </span>
          <h2 className="font-sans" style={{ fontSize: '3rem', letterSpacing: '0.04em', margin: 0, fontWeight: 300, textTransform: 'uppercase', lineHeight: '1.2' }}>
            THE CHROME DUNE SANCTUARY
          </h2>
          <span style={{ fontSize: '1.1rem', letterSpacing: '0.15em', color: '#8c7662', display: 'block', marginTop: '0.5rem', fontWeight: 300, textTransform: 'uppercase' }}>
            AN EXPERIMENTAL MIRAGE
          </span>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.8', opacity: 0.9, fontWeight: 300, marginTop: '1.5rem', color: '#5c4a3d', marginInline: 'auto' }}>
            This design is a highly curated study of <strong>tactile contrasts</strong>—an architectural sanctuary where raw geological matter dialogues directly with high-precision luxury craftsmanship.
          </p>
        </div>

        {/* Massive Full-Size Rectangular Mood Board (Matching Cover Image Size Exactly) */}
        <motion.div
          style={{
            width: '100%',
            borderRadius: '16px',
            border: '1px solid rgba(92, 74, 61, 0.12)',
            boxShadow: '0 25px 50px -12px rgba(139, 107, 74, 0.25)',
            overflow: 'hidden',
            cursor: 'pointer',
            background: '#fcfaf5',
            padding: '16px',
            position: 'relative'
          }}
          whileHover={{ scale: 1.005 }}
          transition={{ duration: 0.4 }}
        >
          <img 
            src={moodBoardImg} 
            alt="Loewe Desert Mood Board" 
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px' }} 
          />
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 60%)',
            pointerEvents: 'none'
          }} />
        </motion.div>

        {/* Highly Detailed Editorial Design Analysis Grid */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr 1fr', 
            gap: '3rem', 
            width: '100%', 
            color: '#5c4a3d',
            marginTop: '1.5rem',
            textAlign: 'left'
          }}
          className="loewe-three-col-analysis"
        >
          <div>
            <strong style={{ fontWeight: 500, color: '#c49e29', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.08em', display: 'block', marginBottom: '0.75rem', borderBottom: '1px solid rgba(196, 158, 41, 0.25)', paddingBottom: '0.5rem' }}>
              Geological Substrate
            </strong>
            <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: '1.75', fontWeight: 300, opacity: 0.9 }}>
              The mood board captures the coarse earth of AlUla: wind-rippled sand dunes, dry clay plaster, and layered agate geodes. These elements anchor the pop-up in an ancient topographic language, emphasizing physical mass, texture, and natural weathering.
            </p>
          </div>

          <div>
            <strong style={{ fontWeight: 500, color: '#c49e29', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.08em', display: 'block', marginBottom: '0.75rem', borderBottom: '1px solid rgba(196, 158, 41, 0.25)', paddingBottom: '0.5rem' }}>
              Precision Metallurgy
            </strong>
            <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: '1.75', fontWeight: 300, opacity: 0.9 }}>
              Hyper-polished chrome rings, liquid copper surfaces, and mirrored shards slice through the organic textures. They act as precise optical instruments, catching reflections of shifting dunes and the desert's high-contrast daylight, transforming the pop-up into an interactive mirage.
            </p>
          </div>

          <div>
            <strong style={{ fontWeight: 500, color: '#c49e29', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.08em', display: 'block', marginBottom: '0.75rem', borderBottom: '1px solid rgba(196, 158, 41, 0.25)', paddingBottom: '0.5rem' }}>
              Biomimetic Synergy
            </strong>
            <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: '1.75', fontWeight: 300, opacity: 0.9 }}>
              Loewe's avant-garde fashion details—the precise geometric seams of the signature Puzzle bag, classical architectural columns, and dried branches—are woven into the landscape. Products are presented not as isolated merchandise, but as organic formations emerging from the earth.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── SKETCHES TO VISUALISE SECTION ── */}
      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          marginTop: '6rem',
          paddingBottom: '6rem',
          borderBottom: '1px solid rgba(92, 74, 61, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 1
        }}
      >
        <div style={{ textAlign: 'center', color: '#5c4a3d', marginBottom: '5rem', maxWidth: '800px' }}>
          <span style={{ fontSize: '0.85rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c49e29', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
            BLUEPRINT GENESIS
          </span>
          <h2 className="font-sans" style={{ fontSize: '3rem', letterSpacing: '0.05em', margin: 0, fontWeight: 300, textTransform: 'uppercase' }}>
            SKETCHES TO VISUALISE
          </h2>
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: 120, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
            style={{ height: '2px', background: 'linear-gradient(90deg, #c49e29, rgba(196, 158, 41, 0.2))', marginInline: 'auto', marginTop: '1.5rem' }}
          />
          <p style={{ fontSize: '1.2rem', lineHeight: '1.8', opacity: 0.9, fontWeight: 300, marginTop: '2rem' }}>
            Original vector drawings, designed in Adobe Illustrator, mapping the physical volumes, display islands, and mirrored coves of the interior design before the realistic rendering stage.
          </p>
        </div>

        {/* Alternating Split Scrollway list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem', width: '100%' }}>
          {sketchesList.map((sketch, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: isEven ? '1.1fr 0.9fr' : '0.9fr 1.1fr',
                  gap: '4rem',
                  alignItems: 'center',
                  textAlign: 'left'
                }}
                className="loewe-sketch-block"
              >
                {/* Sketch Image */}
                <motion.div
                  style={{
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '4px solid rgba(253, 251, 247, 0.85)',
                    boxShadow: '0 20px 40px rgba(139, 107, 74, 0.15)',
                    cursor: 'pointer',
                    order: isEven ? 1 : 2
                  }}
                  whileHover={{ scale: 1.015, y: -4 }}
                  transition={{ duration: 0.4 }}
                >
                  <img 
                    src={sketch.img} 
                    alt={sketch.title} 
                    style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }} 
                  />
                </motion.div>

                {/* Sketch Narrative */}
                <div 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '1.5rem', 
                    color: '#5c4a3d',
                    order: isEven ? 2 : 1,
                    padding: '1.5rem'
                  }}
                  className="sketch-text"
                >
                  <span style={{ fontSize: '0.85rem', opacity: 0.6, letterSpacing: '0.2em', fontWeight: 600, color: '#c49e29', textTransform: 'uppercase', marginBottom: '0.25rem', display: 'block' }}>
                    {sketch.subtitle}
                  </span>
                  <h3 className="font-sans" style={{ fontSize: '2.2rem', letterSpacing: '0.02em', margin: 0, fontWeight: 300, textTransform: 'uppercase' }}>
                    {sketch.title}
                  </h3>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.75', opacity: 0.85, fontWeight: 300, margin: 0 }}>
                    {sketch.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── THE LOCATION SECTION ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%',
          maxWidth: '1200px',
          display: 'grid',
          gridTemplateColumns: '0.9fr 1.1fr',
          gap: '4rem',
          alignItems: 'center',
          marginTop: '6rem',
          paddingBottom: '6rem',
          borderBottom: '1px solid rgba(92, 74, 61, 0.15)',
          textAlign: 'left',
          zIndex: 1
        }}
        className="loewe-split-row"
      >
        {/* Left: Location Narrative */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: '#5c4a3d' }}>
          <div>
            <span style={{ fontSize: '0.85rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c49e29', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
              THE SITE COORDINATES
            </span>
            <h2 className="font-sans" style={{ fontSize: '3rem', letterSpacing: '0.05em', margin: 0, fontWeight: 300, lineHeight: '1.1', textTransform: 'uppercase' }}>
              THE LOCATION
            </h2>
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: 100, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
              style={{ height: '2px', background: 'linear-gradient(90deg, #c49e29, rgba(196, 158, 41, 0.2))', marginTop: '1rem' }}
            />
          </div>

          <p style={{ fontSize: '1.15rem', lineHeight: '1.8', opacity: 0.9, fontWeight: 300, margin: 0 }}>
            Nestled deep in the archaeological and geological sanctuary of <strong>AlUla, Saudi Arabia</strong>, this conceptual space commands the canyon landscape near the legendary <strong>Maraya Monument</strong>.
          </p>

          <p style={{ fontSize: '1.15rem', lineHeight: '1.8', opacity: 0.9, fontWeight: 300, margin: 0 }}>
            The towering red sandstone slot canyon walls form a magnificent dialogue with the pop-up's hyper-reflective mirrored details. Caught in AlUla's golden-hour light, the storefront operates as a shifty, disappearing mirage, dissolving into the geological scale of the desert.
          </p>

          {/* Specs card */}
          <div 
            className="loewe-chrome-specs"
            style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.5rem',
              marginTop: '1rem',
              background: 'rgba(253, 251, 247, 0.45)',
              padding: '1.5rem',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(92, 74, 61, 0.1)'
            }}
          >
            {[
              { label: 'ARCHITECTURAL TYPE', val: 'Organic Cave Pavilion' },
              { label: 'LOCATION COORDINATES', val: 'AlUla, Saudi Arabia' },
              { label: 'FACADE TEXTURES', val: 'Curved Sandstone Layers' },
              { label: 'DESIGN AESTHETIC', val: 'Biomimetic Desert Luxury' }
            ].map((spec, idx) => (
              <div key={idx}>
                <span style={{ fontSize: '0.75rem', opacity: 0.6, letterSpacing: '0.1em', display: 'block', textTransform: 'uppercase', marginBottom: '0.2rem' }}>{spec.label}</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 400, color: '#5c4a3d' }}>{spec.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Circular 3D Parallax Mirror Portal */}
        <div
          ref={portalRef}
          onMouseMove={handlePortalMouseMove}
          onMouseLeave={handlePortalMouseLeave}
          style={{
            perspective: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <motion.div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '500px',
              height: '500px',
              borderRadius: '50%',
              border: '10px solid rgba(253, 251, 247, 0.65)',
              boxShadow: '0 40px 80px rgba(139, 107, 74, 0.25), inset 0 0 40px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              cursor: 'pointer',
              rotateX: portalTiltX,
              rotateY: portalTiltY
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          >
            <motion.img
              src={alulaImg}
              alt="AlUla Canyon Landscape Mirror Reflection"
              style={{
                width: '125%',
                height: '125%',
                objectFit: 'cover',
                position: 'absolute',
                top: '-12.5%',
                left: '-12.5%',
                x: portalReflectX,
                y: portalReflectY
              }}
            />
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%)',
              pointerEvents: 'none'
            }} />
          </motion.div>
        </div>
      </motion.div>

      {/* ── THE REALIZED SANCTUARY (AI ARCHITECTURAL VISUALISATIONS) ── */}
      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          marginTop: '8rem',
          paddingBottom: '8rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '7rem',
          zIndex: 1
        }}
      >
        {/* Realized Sanctuary Section Header */}
        <div style={{ textAlign: 'center', color: '#5c4a3d', maxWidth: '800px' }}>
          <span style={{ fontSize: '0.85rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c49e29', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
            PHYSICAL REALIZATION
          </span>
          <h2 className="font-sans" style={{ fontSize: '3rem', letterSpacing: '0.04em', margin: 0, fontWeight: 300, textTransform: 'uppercase' }}>
            THE REALIZED SANCTUARY
          </h2>
          <span style={{ fontSize: '1.1rem', letterSpacing: '0.15em', color: '#8c7662', display: 'block', marginTop: '0.5rem', fontWeight: 300, textTransform: 'uppercase' }}>
            AI ARCHITECTURAL VISUALISATIONS
          </span>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.8', opacity: 0.9, fontWeight: 300, marginTop: '1.5rem', color: '#5c4a3d' }}>
            The transition from conceptual Illustrator vector drawings to physically realized, realistically rendered spaces. Every volume, texture, lighting vector, and mirror interface is executed in high fidelity.
          </p>
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: 120, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
            style={{ height: '2px', background: 'linear-gradient(90deg, #c49e29, rgba(196, 158, 41, 0.2))', marginInline: 'auto', marginTop: '1.5rem' }}
          />
        </div>

        {/* Massive Monograph Renders Scrollway */}
        {[
          {
            img: exteriorImg,
            title: 'The Canyon Outpost Facade',
            subtitle: 'Store Exterior & Canyon Integration',
            desc: 'A wide landscape capture of the pop-up outpost embedded directly into the towering sandstone slot canyons of AlUla. The sweeping sandstone exterior shell mirrors the wind-eroded cliff bands, while the reflective mirage facade panels catch the golden sunset light, making the store appear as a shimmering, magical illusion within the landscape.'
          },
          {
            img: frontImg,
            title: 'The Sandstone Facade Portal',
            subtitle: 'Store Front Entrance Detail',
            desc: 'A close capture of the main entrance canal. The heavy, layered sandstone curves wrap around the entrance, creating a shadowy cave threshold. A gleaming, polished brass trim anchors the base, making the entire monolithic sandstone structure appear as if it is floating.'
          },
          {
            img: windowDisplayImg,
            title: 'The Mirage Showcase Vitrine',
            subtitle: 'Front Window Display Scene',
            desc: 'An artistic street-facing vitrine installation. A circular plaster dune aperture acts as a framing device. Inside, a floating chrome halo suspends a single Puzzle leather bag, illuminated by tight pinpoint spotlights, surrounded by rising raw desert branches.'
          },
          {
            img: wallImg,
            title: 'Eroded Sandstone Shelving Niches',
            subtitle: 'Interior Gallery Wall Detail',
            desc: 'A detailed study of the interior accessory coves. Deep, wind-eroded sandstone cavities are sculpted directly into the plaster walls, backed by hidden warm LED ribbons. Folded silk scarves and small leather goods sit like gems inside organic cavernous coves.'
          },
          {
            img: store1Img,
            title: 'The Central Dune Sanctuary',
            subtitle: 'Interior Main Gallery View',
            desc: 'A broad interior panoramic capture. The wind-swept sandstone floor curves into columns. Loewe’s iconic Puzzle bags rest on classical column pedestals, elevated like rare organic minerals discovered in an ancient dune cave.'
          },
          {
            img: wall2Img,
            title: 'The Shattered Mirror Vanity Coves',
            subtitle: 'Interior Wall Detail - Eyewear Gallery',
            desc: 'Focused on eyewear and minor accessory display. A large, fractured mirror with natural, fluid brass contours is embedded flush into the dry clay wall. Sandstone columns emerge from the sand bed below to support luxury tortoiseshell glasses, offering shifting reflections of sand, mirror, and stone.'
          },
          {
            img: backImg,
            title: 'The Back-of-Store Cash Wrap & Rock Shelf Canopy',
            subtitle: 'Back of Store View',
            desc: 'The terminal point of the gallery journey. A sweeping sandstone arch forms a protective plaster canopy. The central cash-wrap counter is shaped like a layered rock shelf, stepping up from rough texturized sandstone into a seamless, liquid-brass countertop.'
          },
          {
            img: topViewImg,
            title: 'The Spatial Footprint Plan',
            subtitle: '3D Architectural Top View',
            desc: 'A 3D architectural plan view showcasing the circular dune paths. Illustrates how the biophilic layout guides visitors through the gallery in a seamless, fluid desert journey.'
          },
          {
            img: view360Img,
            title: 'The Cylindrical Panorama',
            subtitle: 'Immersive 360-Degree Cylindrical Projection',
            desc: 'An immersive, flattened 360-degree cylindrical projection panorama of the entire visual merchandising environment, illustrating the seamless circular dune flow of the interior space.'
          }
        ].map((render, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2.5rem',
              textAlign: 'center'
            }}
          >
            {/* Render Heading & Narrative */}
            <div style={{ maxWidth: '850px', color: '#5c4a3d' }}>
              <span style={{ fontSize: '0.85rem', opacity: 0.6, letterSpacing: '0.2em', fontWeight: 600, color: '#c49e29', textTransform: 'uppercase', marginBottom: '0.25rem', display: 'block' }}>
                {render.subtitle}
              </span>
              <h3 className="font-sans" style={{ fontSize: '2.2rem', letterSpacing: '0.03em', margin: 0, fontWeight: 300, textTransform: 'uppercase' }}>
                {render.title}
              </h3>
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                whileInView={{ width: 80, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                style={{ height: '2px', background: 'linear-gradient(90deg, #c49e29, rgba(196, 158, 41, 0.15))', marginInline: 'auto', marginTop: '0.75rem', marginBottom: '1.25rem' }}
              />
              <p style={{ fontSize: '1.15rem', lineHeight: '1.8', opacity: 0.9, fontWeight: 300, margin: 0 }}>
                {render.desc}
              </p>
            </div>

            {/* Massive Full-Screen Scale Render Container */}
            <motion.div
              style={{
                width: '100%',
                borderRadius: '16px',
                border: '1px solid rgba(92, 74, 61, 0.12)',
                boxShadow: '0 25px 50px -12px rgba(139, 107, 74, 0.25)',
                overflow: 'hidden',
                cursor: 'pointer',
                background: '#fcfaf5',
                padding: '16px',
                position: 'relative'
              }}
              whileHover={{ scale: 1.006, y: -6 }}
              transition={{ duration: 0.4 }}
            >
              <img 
                src={render.img} 
                alt={render.title} 
                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px' }} 
              />
              {/* Liquid-Chrome Reflective Shimmer Glass Overlay */}
              <motion.div 
                style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 60%)',
                  pointerEvents: 'none'
                }} 
              />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
