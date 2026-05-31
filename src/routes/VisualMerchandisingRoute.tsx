import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// Asset Imports

import guoPeiStore from '../assets/store/front.png';
import guoPeiDetail from '../assets/store/360 view.png';
import coverImg from '../assets/store/cover page.png';
import moodBoardImg from '../assets/store/mood board.jpg';
import alulaImg from '../assets/store/alula.png';
import sketch15 from '../assets/store/15.png';
import sketch16 from '../assets/store/16.png';
import sketch17 from '../assets/store/17.png';
import sketch18 from '../assets/store/18.png';
import sketch19 from '../assets/store/19.png';
import store1Img from '../assets/store/store 1.jpeg';

import './VisualMerchandising.css';

// ── Avant-Garde Exhibits Data ──
const sketchesList = [
  { img: sketch15, title: 'Concept 15: The Organic Dune Portal', desc: 'Initial visualization of the sweeping plaster canopy and open slot canyon entrance path.' },
  { img: sketch16, title: 'Concept 16: Fluid Sand Display Islands', desc: 'Designing the layered display platforms resembling natural rock shelves to support Puzzle leather bags.' },
  { img: sketch17, title: 'Concept 17: Linear Sandstone Runway', desc: 'Visual plan of the central canyon pathway showcasing the luxury eyewear collection.' },
  { img: sketch18, title: 'Concept 18: Shelving Niche Formations', desc: 'Conceptualizing natural, organic cave wall cutouts and warm backlight coves for merchandise.' },
  { img: sketch19, title: 'Concept 19: The Mirrored Portal', desc: 'Designing the shattered organic mirror display reflecting the ancient AlUla sands.' }
];

export default function VisualMerchandisingRoute() {
  const [hoveredPanel, setHoveredPanel] = useState<'loewe' | 'guopei' | null>(null);
  const [selectedProject, setSelectedProject] = useState<'loewe' | 'guopei' | null>(null);

  // ── Surreal Desert Mirror Exhibition State ──
  const [activeChapter, setActiveChapter] = useState<'concept' | 'location' | 'sketches' | 'renders'>('concept');
  const [activeSketchIdx, setActiveSketchIdx] = useState(0);

  // Mouse tracking for depth-parallax mirror portal
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

  // Mouse Tracking for Spotlight / Parallax
  const loewePanelRef = useRef<HTMLDivElement>(null);
  const guoPeiPanelRef = useRef<HTMLDivElement>(null);

  const loeweSpotlightX = useMotionValue(0);
  const loeweSpotlightY = useMotionValue(0);
  const loeweSpotlightXSpring = useSpring(loeweSpotlightX, { stiffness: 120, damping: 25 });
  const loeweSpotlightYSpring = useSpring(loeweSpotlightY, { stiffness: 120, damping: 25 });

  const guoPeiSpotlightX = useMotionValue(0);
  const guoPeiSpotlightY = useMotionValue(0);
  const guoPeiSpotlightXSpring = useSpring(guoPeiSpotlightX, { stiffness: 100, damping: 20 });
  const guoPeiSpotlightYSpring = useSpring(guoPeiSpotlightY, { stiffness: 100, damping: 20 });

  // 3D Card Tilt - Loewe
  const loeweCardRef = useRef<HTMLDivElement>(null);
  const loeweCardX = useMotionValue(0);
  const loeweCardY = useMotionValue(0);
  const loeweRotateX = useTransform(loeweCardY, [-200, 200], [12, -12]);
  const loeweRotateY = useTransform(loeweCardX, [-200, 200], [-12, 12]);
  const loeweRotateXSpring = useSpring(loeweRotateX, { stiffness: 150, damping: 25 });
  const loeweRotateYSpring = useSpring(loeweRotateY, { stiffness: 150, damping: 25 });

  // 3D Card Tilt - Guo Pei
  const guoPeiCardRef = useRef<HTMLDivElement>(null);
  const guoPeiCardX = useMotionValue(0);
  const guoPeiCardY = useMotionValue(0);
  const guoPeiRotateX = useTransform(guoPeiCardY, [-200, 200], [10, -10]);
  const guoPeiRotateY = useTransform(guoPeiCardX, [-200, 200], [-10, 10]);
  const guoPeiRotateXSpring = useSpring(guoPeiRotateX, { stiffness: 150, damping: 25 });
  const guoPeiRotateYSpring = useSpring(guoPeiRotateY, { stiffness: 150, damping: 25 });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Spotlight Mouse Move Handlers
  const handleLoeweMouseMove = (e: React.MouseEvent) => {
    if (!loewePanelRef.current) return;
    const rect = loewePanelRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    loeweSpotlightX.set(x);
    loeweSpotlightY.set(y);

    if (loeweCardRef.current) {
      const cardRect = loeweCardRef.current.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const cardCenterY = cardRect.top + cardRect.height / 2;
      loeweCardX.set(e.clientX - cardCenterX);
      loeweCardY.set(e.clientY - cardCenterY);
    }
  };

  const handleLoeweMouseLeave = () => {
    loeweCardX.set(0);
    loeweCardY.set(0);
  };

  const handleGuoPeiMouseMove = (e: React.MouseEvent) => {
    if (!guoPeiPanelRef.current) return;
    const rect = guoPeiPanelRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    guoPeiSpotlightX.set(x);
    guoPeiSpotlightY.set(y);

    if (guoPeiCardRef.current) {
      const cardRect = guoPeiCardRef.current.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const cardCenterY = cardRect.top + cardRect.height / 2;
      guoPeiCardX.set(e.clientX - cardCenterX);
      guoPeiCardY.set(e.clientY - cardCenterY);
    }
  };

  const handleGuoPeiMouseLeave = () => {
    guoPeiCardX.set(0);
    guoPeiCardY.set(0);
  };

  // Swatch Styles / Backgrounds based on active material
  const activeTheme = {
    accentColor: 'rgba(212, 208, 199, 0.45)',
    bgColor: '#e2dfd8',
    borderStyle: '1px solid rgba(0, 0, 0, 0.08)'
  };

  return (
    <div className="vm-stage">
      {/* ── Floating Ring Back Button ── */}
      <Link to="/" className="vm-back-btn" aria-label="Go Back">
        <motion.div 
          className="vm-back-ring"
          whileHover={{ rotate: 180, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="vm-back-arrow">←</span>
        </motion.div>
      </Link>

      <div className="vm-split-container">
        {/* ==========================================
            1. LOEWE PANEL (Minimalist Architectural)
            ========================================== */}
        <motion.div
          ref={loewePanelRef}
          className={`vm-panel loewe-panel ${hoveredPanel === 'loewe' ? 'expanded' : hoveredPanel === 'guopei' ? 'collapsed' : ''}`}
          onMouseMove={handleLoeweMouseMove}
          onMouseEnter={() => setHoveredPanel('loewe')}
          onMouseLeave={() => {
            handleLoeweMouseLeave();
            setHoveredPanel(null);
          }}
          animate={{ backgroundColor: activeTheme.bgColor }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
        >
          {/* Parallax Blueprint Grid Overlay */}
          <div className="loewe-blueprint-grid"></div>

          {/* Interactive Museum Spotlight */}
          <motion.div
            className="loewe-spotlight"
            style={{
              left: loeweSpotlightXSpring,
              top: loeweSpotlightYSpring,
              background: `radial-gradient(circle, ${activeTheme.accentColor} 0%, transparent 65%)`
            }}
          />

          <div className="vm-panel-content">
            {/* Header branding */}
            <motion.div 
              className="vm-brand-header loewe-brand"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="vm-brand-index">01</span>
              <h1 className="vm-brand-title font-sans">L O E W E</h1>
              <span className="vm-brand-subtitle">MADRID — 1846</span>
            </motion.div>

            {/* Main Interactive 3D Card */}
            <motion.div
              ref={loeweCardRef}
              className="loewe-showcase-card-wrapper"
              style={{
                perspective: 1200,
                rotateX: loeweRotateXSpring,
                rotateY: loeweRotateYSpring,
              }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedProject('loewe')}
            >
              <div 
                className="loewe-card-frame"
                style={{ border: activeTheme.borderStyle }}
              >
                <div className="loewe-image-container">
                  <img src={coverImg} alt="Loewe Desert Pop-Up Store Mockup" className="loewe-img" />
                  <div className="loewe-image-overlay" />
                </div>

                <div className="loewe-card-details">
                  <span className="loewe-tag">DESERT OASIS</span>
                  <h3 className="loewe-project-name">LOEWE DESERT POP-UP</h3>
                  <p className="loewe-project-desc">
                    A desert-themed pop-up store design showcasing Loewe products, mainly signature Puzzle bags and premium sunglasses.
                  </p>
                </div>
              </div>
            </motion.div>


          </div>
        </motion.div>

        {/* ==========================================
            2. GUO PEI PANEL (Theatrical Baroque)
            ========================================== */}
        <motion.div
          ref={guoPeiPanelRef}
          className={`vm-panel guopei-panel ${hoveredPanel === 'guopei' ? 'expanded' : hoveredPanel === 'loewe' ? 'collapsed' : ''}`}
          onMouseMove={handleGuoPeiMouseMove}
          onMouseEnter={() => setHoveredPanel('guopei')}
          onMouseLeave={() => {
            handleGuoPeiMouseLeave();
            setHoveredPanel(null);
          }}
        >
          {/* Royal Velvet Overlay */}
          <div className="guopei-velvet-overlay"></div>

          {/* Slow rising gold dust animation */}
          <div className="gold-dust-particles">
            <div className="dust-particle p1"></div>
            <div className="dust-particle p2"></div>
            <div className="dust-particle p3"></div>
            <div className="dust-particle p4"></div>
            <div className="dust-particle p5"></div>
          </div>

          {/* Dynamic Golden Halo Backlight */}
          <motion.div
            className="guopei-spotlight"
            style={{
              left: guoPeiSpotlightXSpring,
              top: guoPeiSpotlightYSpring,
            }}
          />

          <div className="vm-panel-content">
            {/* Header branding */}
            <motion.div 
              className="vm-brand-header guopei-brand"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="vm-brand-index">02</span>
              <h1 className="vm-brand-title font-serif">G U O   P E I</h1>
              <span className="vm-brand-subtitle">HAUTE COUTURE — BEIJING</span>
            </motion.div>

            {/* Main Interactive 3D circular moon gate showcase */}
            <motion.div
              ref={guoPeiCardRef}
              className="guopei-showcase-card-wrapper"
              style={{
                perspective: 1200,
                rotateX: guoPeiRotateXSpring,
                rotateY: guoPeiRotateYSpring,
              }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedProject('guopei')}
            >
              <div className="guopei-moongate-frame">
                {/* SVG Golden Filigree Embroidery */}
                <svg className="moongate-svg-border" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="48" className="svg-ring-base" />
                  <circle cx="50" cy="50" r="48" className="svg-ring-glow" />
                </svg>

                <div className="guopei-moongate-image-area">
                  <img src={guoPeiStore} alt="Guo Pei Dramatic Window Display Mockup" className="guopei-img" />
                  <div className="guopei-image-overlay" />
                </div>

                <div className="guopei-card-caption">
                  <span className="guopei-tag">THEATRICAL DRAMA</span>
                  <h3 className="guopei-project-name">GUO PEI WINDOW EXHIBIT</h3>
                </div>
              </div>
            </motion.div>

            {/* Bento Grid: Sub-Cards */}
            <div className="guopei-bento-grid">
              {/* Sensory Elements Card */}
              <motion.div 
                className="guopei-bento-card sensory-board"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <div className="bento-card-notch">THE WINDOW SCENOGRAPHY</div>
                <p className="bento-card-body">
                  An operatic presentation using directional pinpoint spotlights, sculpted bronze filigree screens, and a gold leaf background frame to dramatize haute couture silhouettes.
                </p>
              </motion.div>

              {/* Gold Palette Bento Card */}
              <motion.div 
                className="guopei-bento-card gold-palette"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="bento-card-notch">TEXTILE PALETTE</div>
                <div className="gold-textures-row">
                  <div className="gold-text-block brocade" title="Silk Gold Brocade" />
                  <div className="gold-text-block velvet" title="Imperial Crimson Velvet" />
                  <div className="gold-text-block brass" title="Polished Hammered Brass" />
                </div>
                <span className="swatch-indicator">Imperial Brocade & Brass</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ==========================================
          3. EXPANDED LUXURY DETAILS DIALOG/DRAWER
          ========================================== */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            className="vm-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              className={`vm-drawer-container ${selectedProject}`}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button className="vm-drawer-close" onClick={() => setSelectedProject(null)}>×</button>

              {selectedProject === 'loewe' ? (
                /* LOEWE Immersive Presentation - Desert Theme */
                <motion.div 
                  className="loewe-desert-drawer"
                  initial={{ background: '#f5efe6' }}
                  animate={{ 
                    background: ['#f5efe6', '#ead8c4', '#f5efe6'],
                  }}
                  transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    overflowY: 'auto', 
                    padding: '3rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
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
                      flexShrink: 0
                    }}
                  >
                    <img src={coverImg} alt="Loewe Desert Cover" style={{ width: '100%', height: 'auto', display: 'block' }} />
                  </motion.div>
                  
                  {/* Scoped CSS Inject for responsiveness */}
                  <style>{`
                    @media (max-width: 900px) {
                      .loewe-shard-nav {
                        gap: 0.8rem !important;
                        margin-bottom: 2rem !important;
                      }
                      .loewe-shard-nav button {
                        padding: 0.8rem 1.2rem !important;
                        font-size: 0.7rem !important;
                      }
                      .loewe-desert-drawer > div {
                        grid-template-columns: 1fr !important;
                        gap: 2.5rem !important;
                        text-align: center !important;
                      }
                      .loewe-desert-drawer h2 {
                        font-size: 2.2rem !important;
                      }
                      .sketches-deck-container {
                        grid-template-columns: 1fr !important;
                        gap: 3rem !important;
                      }
                      .loewe-chrome-specs div {
                        text-align: left !important;
                      }
                    }
                  `}</style>

                  {/* --- FLOATING ASYMMETRICAL MIRRORED SHARD NAVIGATION --- */}
                  <div 
                    className="loewe-shard-nav"
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '1.5rem',
                      marginBottom: '4rem',
                      flexWrap: 'wrap',
                      zIndex: 10,
                      width: '100%',
                      maxWidth: '1000px',
                      padding: '0 1rem'
                    }}
                  >
                    {[
                      { id: 'concept', label: 'SHARD 01: THE MIRAGE' },
                      { id: 'location', label: 'SHARD 02: THE CANYON' },
                      { id: 'sketches', label: 'SHARD 03: THE BLUEPRINTS' },
                      { id: 'renders', label: 'SHARD 04: THE SANCTUARY' }
                    ].map((chapter, idx) => {
                      const isActive = activeChapter === chapter.id;
                      return (
                        <motion.button
                          key={chapter.id}
                          onClick={() => setActiveChapter(chapter.id as any)}
                          whileHover={{ scale: 1.05, y: -4 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                          style={{
                            position: 'relative',
                            padding: '1rem 2rem',
                            background: isActive 
                              ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.22) 0%, rgba(226, 223, 216, 0.45) 100%)'
                              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.04) 100%)',
                            backdropFilter: 'blur(12px)',
                            border: isActive ? '1px solid rgba(212, 175, 55, 0.55)' : '1px solid rgba(92, 74, 61, 0.15)',
                            borderRadius: idx === 0 ? '16px 4px 12px 6px' : idx === 1 ? '4px 16px 8px 12px' : idx === 2 ? '12px 6px 16px 4px' : '6px 12px 4px 16px',
                            color: isActive ? '#8a6b2a' : '#5c4a3d',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            letterSpacing: '0.2em',
                            cursor: 'pointer',
                            boxShadow: isActive ? '0 10px 20px rgba(212, 175, 55, 0.12)' : '0 4px 10px rgba(0,0,0,0.02)',
                            transition: 'color 0.3s ease, border-color 0.3s ease'
                          }}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="activeShardGlow"
                              style={{
                                position: 'absolute',
                                top: 0, left: 0, right: 0, bottom: 0,
                                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent)',
                                zIndex: -1
                              }}
                              animate={{ x: ['-100%', '100%'] }}
                              transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
                            />
                          )}
                          {chapter.label}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* --- RUNWAY EXHIBITION EXHIBITS CANVAS --- */}
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <AnimatePresence mode="wait">
                      {activeChapter === 'concept' && (
                        <motion.div
                          key="concept"
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -30 }}
                          transition={{ duration: 0.6 }}
                          style={{
                            width: '100%',
                            maxWidth: '1200px',
                            display: 'grid',
                            gridTemplateColumns: '1.1fr 0.9fr',
                            gap: '4rem',
                            alignItems: 'center',
                            marginTop: '2rem'
                          }}
                        >
                          {/* Left Column: Interactive Depth Parallax Mirror Portal */}
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
                                boxShadow: '0 40px 80px rgba(139, 107, 74, 0.3), inset 0 0 40px rgba(0,0,0,0.1)',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                rotateX: portalTiltX,
                                rotateY: portalTiltY
                              }}
                              whileHover={{ scale: 1.02 }}
                              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                            >
                              <motion.img
                                src={moodBoardImg}
                                alt="Loewe Desert Mood Board"
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

                          {/* Right Column: Narrative */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left', color: '#5c4a3d' }}>
                            <div>
                              <span style={{ fontSize: '0.85rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c49e29', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                                CHAPTER I: THE MIRAGE
                              </span>
                              <h2 className="font-sans" style={{ fontSize: '3rem', letterSpacing: '0.05em', margin: 0, fontWeight: 300, lineHeight: '1.1', textTransform: 'uppercase' }}>
                                SURREAL LUXURY MIRAGE
                              </h2>
                            </div>

                            <p style={{ fontSize: '1.15rem', lineHeight: '1.8', opacity: 0.9, fontWeight: 300, margin: 0 }}>
                              The Loewe Desert Pop-Up is born from a highly experimental, surreal dialogue between the untamed, ancient geology of <strong>AlUla</strong> and the absolute geometric precision of Spanish luxury craftsmanship.
                            </p>

                            <p style={{ fontSize: '1.15rem', lineHeight: '1.8', opacity: 0.9, fontWeight: 300, margin: 0 }}>
                              The theme contrasts wind-swept layered sand dunes, raw agave fibers, and natural agate crystals with Loewe's signature puzzle leather cuts, polished brass hardware, and geometric eyewear. It operates as an interactive luxury mirage where raw minerals meet polished luxury, and mirror shards reflect the endless sand.
                            </p>

                            <div style={{ width: '80px', height: '2px', background: '#c49e29', marginTop: '1rem' }} />
                          </div>
                        </motion.div>
                      )}

                      {activeChapter === 'location' && (
                        <motion.div
                          key="location"
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -30 }}
                          transition={{ duration: 0.6 }}
                          style={{
                            width: '100%',
                            maxWidth: '1200px',
                            display: 'grid',
                            gridTemplateColumns: '0.9fr 1.1fr',
                            gap: '4rem',
                            alignItems: 'center',
                            marginTop: '2rem'
                          }}
                        >
                          {/* Left Column: Narrative */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left', color: '#5c4a3d' }}>
                            <div>
                              <span style={{ fontSize: '0.85rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c49e29', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                                CHAPTER II: THE SITE
                              </span>
                              <h2 className="font-sans" style={{ fontSize: '3rem', letterSpacing: '0.05em', margin: 0, fontWeight: 300, lineHeight: '1.1', textTransform: 'uppercase' }}>
                                ALULA CANYON MONUMENT
                              </h2>
                            </div>

                            <p style={{ fontSize: '1.15rem', lineHeight: '1.8', opacity: 0.9, fontWeight: 300, margin: 0 }}>
                              Nestled deep inside the archaeological and geological sanctuary of <strong>AlUla, Saudi Arabia</strong>, the pop-up resides near the legendary mirrored <strong>Maraya Hall</strong>—the world's largest reflective architectural monument.
                            </p>

                            <p style={{ fontSize: '1.15rem', lineHeight: '1.8', opacity: 0.9, fontWeight: 300, margin: 0 }}>
                              The soaring sandstone canyon walls and slot passages form a magnificent visual dialogue with the store's mirrored envelope. The structure catches the extreme golden-hour sunbeams, operating as a disappearing landscape mirage that dissolves entirely into its ancient desert context.
                            </p>

                            <div style={{ width: '80px', height: '2px', background: '#c49e29', marginTop: '1rem' }} />
                          </div>

                          {/* Right Column: Morphing Parallax mirror */}
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
                              animate={{ 
                                borderRadius: [
                                  "40% 60% 70% 30% / 40% 40% 60% 50%", 
                                  "60% 40% 50% 50% / 30% 60% 40% 70%", 
                                  "40% 60% 70% 30% / 40% 40% 60% 50%"
                                ]
                              }}
                              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                              style={{
                                position: 'relative',
                                width: '100%',
                                maxWidth: '500px',
                                height: '500px',
                                border: '1px solid rgba(92, 74, 61, 0.2)',
                                boxShadow: '0 40px 80px rgba(139, 107, 74, 0.25)',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                rotateX: portalTiltX,
                                rotateY: portalTiltY
                              }}
                              whileHover={{ scale: 1.015 }}
                            >
                              <motion.img
                                src={alulaImg}
                                alt="AlUla Canyon Landscape"
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
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 50%)',
                                pointerEvents: 'none'
                              }} />
                            </motion.div>
                          </div>
                        </motion.div>
                      )}

                      {activeChapter === 'sketches' && (
                        <motion.div
                          key="sketches"
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -30 }}
                          transition={{ duration: 0.6 }}
                          style={{
                            width: '100%',
                            maxWidth: '1200px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            marginTop: '2rem'
                          }}
                        >
                          <div style={{ textAlign: 'center', color: '#5c4a3d', marginBottom: '4rem', maxWidth: '800px' }}>
                            <span style={{ fontSize: '0.85rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c49e29', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                              CHAPTER III: THE BLUEPRINTS
                            </span>
                            <h2 className="font-sans" style={{ fontSize: '3rem', letterSpacing: '0.05em', margin: 0, fontWeight: 300, textTransform: 'uppercase' }}>
                              ILLUSTRATOR BLUEPRINT GENESIS
                            </h2>
                            <p style={{ fontSize: '1.15rem', lineHeight: '1.8', opacity: 0.9, fontWeight: 300, marginTop: '1.5rem' }}>
                              These vector sketches, designed in Adobe Illustrator, represent the step-by-step conceptualization of the pop-up's organic contours, display columns, and cave volumes before the photorealistic AI stage.
                            </p>
                          </div>

                          <div 
                            className="sketches-deck-container"
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '1.2fr 0.8fr',
                              gap: '4rem',
                              alignItems: 'center',
                              width: '100%'
                            }}
                          >
                            {/* 3D Stack Deck Graphic */}
                            <div 
                              style={{
                                position: 'relative',
                                height: '420px',
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                              }}
                            >
                              {sketchesList.map((sketch, idx) => {
                                const offset = idx - activeSketchIdx;
                                const isCurrent = idx === activeSketchIdx;
                                
                                let zIndex = 5 - Math.abs(offset);
                                let rotate = offset * 6;
                                let scale = 1 - Math.abs(offset) * 0.08;
                                let opacity = Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.3;
                                let y = offset * 12;
                                let x = offset * 25;
                                
                                if (isCurrent) {
                                  zIndex = 10;
                                  rotate = 0;
                                  scale = 1;
                                  opacity = 1;
                                  y = 0;
                                  x = 0;
                                }

                                return (
                                  <motion.div
                                    key={idx}
                                    onClick={() => setActiveSketchIdx(idx)}
                                    style={{
                                      position: 'absolute',
                                      width: '100%',
                                      maxWidth: '560px',
                                      borderRadius: '16px',
                                      overflow: 'hidden',
                                      boxShadow: isCurrent 
                                        ? '0 25px 50px rgba(139, 107, 74, 0.3)' 
                                        : '0 8px 20px rgba(0, 0, 0, 0.08)',
                                      cursor: 'pointer',
                                      zIndex,
                                      border: '4px solid rgba(253, 251, 247, 0.85)',
                                      originY: 0.5
                                    }}
                                    animate={{
                                      x,
                                      y,
                                      scale,
                                      rotate,
                                      opacity
                                    }}
                                    whileHover={isCurrent ? { scale: 1.015, y: -5 } : { scale: scale + 0.02 }}
                                    transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                                  >
                                    <img 
                                      src={sketch.img} 
                                      alt={sketch.title} 
                                      style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }} 
                                    />
                                  </motion.div>
                                );
                              })}
                            </div>

                            {/* Details panel */}
                            <div 
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '2.5rem',
                                textAlign: 'left',
                                color: '#5c4a3d',
                                background: 'rgba(253, 251, 247, 0.45)',
                                padding: '2.5rem',
                                borderRadius: '16px',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(92, 74, 61, 0.1)'
                              }}
                            >
                              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '-1rem' }}>
                                {sketchesList.map((_, idx) => (
                                  <motion.button
                                    key={idx}
                                    onClick={() => setActiveSketchIdx(idx)}
                                    style={{
                                      width: '12px',
                                      height: '12px',
                                      borderRadius: '50%',
                                      background: idx === activeSketchIdx ? '#c49e29' : 'rgba(92, 74, 61, 0.2)',
                                      border: 'none',
                                      cursor: 'pointer',
                                      padding: 0
                                    }}
                                    whileHover={{ scale: 1.2 }}
                                  />
                                ))}
                              </div>

                              <AnimatePresence mode="wait">
                                <motion.div
                                  key={activeSketchIdx}
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -20 }}
                                  transition={{ duration: 0.4 }}
                                >
                                  <span style={{ fontSize: '0.8rem', opacity: 0.6, letterSpacing: '0.15em', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                                    SKETCH CONCEPT {activeSketchIdx + 1} OF 5
                                  </span>
                                  <h3 className="font-sans" style={{ fontSize: '1.8rem', letterSpacing: '0.02em', margin: '0 0 1rem 0', fontWeight: 300 }}>
                                    {sketchesList[activeSketchIdx].title}
                                  </h3>
                                  <p style={{ fontSize: '1.05rem', lineHeight: '1.7', opacity: 0.85, fontWeight: 300, margin: 0 }}>
                                    {sketchesList[activeSketchIdx].desc}
                                  </p>
                                </motion.div>
                              </AnimatePresence>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {activeChapter === 'renders' && (
                        <motion.div
                          key="renders"
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -30 }}
                          transition={{ duration: 0.6 }}
                          style={{
                            width: '100%',
                            maxWidth: '1200px',
                            display: 'grid',
                            gridTemplateColumns: '1.1fr 0.9fr',
                            gap: '4rem',
                            alignItems: 'center',
                            marginTop: '2rem'
                          }}
                        >
                          {/* Left Column: Final AI Render */}
                          <motion.div
                            style={{
                              position: 'relative',
                              borderRadius: '16px',
                              overflow: 'hidden',
                              boxShadow: '0 30px 60px rgba(139, 107, 74, 0.25)',
                              border: '4px solid rgba(253, 251, 247, 0.8)'
                            }}
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.4 }}
                          >
                            <img 
                              src={store1Img} 
                              alt="Loewe Pop-Up Store Realistic Render" 
                              style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }} 
                            />
                          </motion.div>

                          {/* Right Column: Specs & Chrome Slate */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left', color: '#5c4a3d' }}>
                            <div>
                              <span style={{ fontSize: '0.85rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c49e29', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                                CHAPTER IV: THE SANCTUARY
                              </span>
                              <h2 className="font-sans" style={{ fontSize: '3rem', letterSpacing: '0.05em', margin: 0, fontWeight: 300, lineHeight: '1.1', textTransform: 'uppercase' }}>
                                THE REALIZED OASIS
                              </h2>
                            </div>

                            <p style={{ fontSize: '1.15rem', lineHeight: '1.8', opacity: 0.9, fontWeight: 300, margin: 0 }}>
                              The conceptual vector blueprints crystallize into a physical desert retail oasis. Smooth sand-clay curves form organic interior cave walls, integrated coves spill warm lighting across shelves, and tortoiseshell eyewear plinths stand firm in raw sands.
                            </p>

                            <div 
                              className="loewe-chrome-specs"
                              style={{ 
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                                marginTop: '1rem'
                              }}
                            >
                              {[
                                { label: 'ARCHITECTURAL TYPE', val: 'Organic Clay Pavilion' },
                                { label: 'LOCATION COORDINATES', val: 'AlUla, Saudi Arabia' },
                                { label: 'FACADE TEXTURES', val: 'Curved Sandstone Layers' },
                                { label: 'MERCHANDISE FOCUS', val: 'Puzzle Bags & Sunglasses' }
                              ].map((spec, idx) => (
                                <motion.div
                                  key={idx}
                                  style={{
                                    padding: '1.25rem 1.5rem',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(92, 74, 61, 0.1)',
                                    background: 'rgba(253, 251, 247, 0.45)',
                                    backdropFilter: 'blur(8px)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: 'pointer'
                                  }}
                                  whileHover={{ 
                                    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(139, 107, 74, 0.12) 100%)',
                                    borderColor: 'rgba(212, 175, 55, 0.45)',
                                    x: 5
                                  }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <span style={{ fontSize: '0.75rem', opacity: 0.6, letterSpacing: '0.15em', fontWeight: 600 }}>{spec.label}</span>
                                  <span style={{ fontSize: '0.95rem', fontWeight: 400 }}>{spec.val}</span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ) : (
                /* GUO PEI Immersive Presentation */
                <div className="drawer-layout">
                  <div className="drawer-column visual-show">
                    <div className="drawer-main-image-box">
                      <img src={guoPeiStore} alt="Guo Pei Dramatic Window Display" />
                    </div>
                    <div className="drawer-secondary-images">
                      <div className="sec-img-box"><img src={guoPeiDetail} alt="Guo Pei Haute Couture Detailing" /></div>
                      <div className="sec-text-box">
                        <h5>SCENIC DESIGN</h5>
                        <p>An operatic window stage leveraging gold filigree panels and theatrical spotlight paths to celebrate haute couture grandeur.</p>
                      </div>
                    </div>
                  </div>

                  <div className="drawer-column details-show">
                    <span className="drawer-brand-sub font-serif">G U O   P E I</span>
                    <h2 className="drawer-title font-serif">Haute Couture Window Display</h2>

                    <div className="drawer-section">
                      <h4>THE CONCEPT</h4>
                      <p>
                        A dramatic window installation inspired by the theatricality of royal imperial dynastic garments and operatic grand staging. Built around the theme of "Golden Silk Thread," the window features sculpted golden brass frames that mirror Guo Pei's legendary embroidered couture.
                      </p>
                    </div>

                    <div className="drawer-section">
                      <h4>VISUAL MERCHANDISING ELEMENTS</h4>
                      <ul className="details-list">
                        <li><strong>Scenography:</strong> Dual concentric golden circles (representing celestial spheres) that frame a floating mannequin, dramatically suspended above hand-carved gold panels.</li>
                        <li><strong>Lighting Scheme:</strong> Overhead high-contrast spotlight beams focusing precisely on the metallic threads of the gown, creating a reflective, luminous halo effect.</li>
                        <li><strong>Sensory Touchpoints:</strong> Deep crimson velvet drapery surrounding the window perimeter, absorbing peripheral light to heighten visual drama and contrast.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
