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
  const [hoveredPanel, setHoveredPanel] = useState<'loewe' | 'guopei' | null>(null);
  const [selectedProject, setSelectedProject] = useState<'loewe' | 'guopei' | null>(null);

  // ── Depth-Parallax Mirror Portal Mouse Tracking ──

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
                    }
                  `}</style>

                  {/* ── THE MOODBOARD SECTION ── */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      width: '100%',
                      maxWidth: '1200px',
                      display: 'grid',
                      gridTemplateColumns: '1.1fr 0.9fr',
                      gap: '4rem',
                      alignItems: 'center',
                      marginTop: '2rem',
                      paddingBottom: '6rem',
                      borderBottom: '1px solid rgba(92, 74, 61, 0.15)',
                      textAlign: 'left'
                    }}
                    className="loewe-split-row"
                  >
                    {/* Left: Full-size detailed rectangular Mood Board */}
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        borderRadius: '12px',
                        border: '1px solid rgba(92, 74, 61, 0.15)',
                        boxShadow: '0 20px 45px rgba(139, 107, 74, 0.12)',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        justifySelf: 'center',
                        background: '#fcfaf5',
                        padding: '12px'
                      }}
                    >
                      <img 
                        src={moodBoardImg} 
                        alt="Loewe Desert Mood Board" 
                        style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '6px' }} 
                      />
                      <div style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 60%)',
                        pointerEvents: 'none'
                      }} />
                    </div>

                    {/* Right: Editorial Theme Analysis */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', color: '#5c4a3d' }}>
                      <div>
                        <span style={{ fontSize: '0.85rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c49e29', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                          THEME & CONCEPT INSPIRATION
                        </span>
                        <h2 className="font-sans" style={{ fontSize: '2.5rem', letterSpacing: '0.03em', margin: 0, fontWeight: 300, lineHeight: '1.15', textTransform: 'uppercase' }}>
                          THE CHROME DUNE SANCTUARY
                        </h2>
                        <span style={{ fontSize: '1rem', letterSpacing: '0.1em', color: '#8c7662', display: 'block', marginTop: '0.25rem', fontWeight: 400 }}>
                          AN EXPERIMENTAL MIRAGE
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '1.05rem', lineHeight: '1.75', fontWeight: 300 }}>
                        <p style={{ margin: 0 }}>
                          This design is a highly curated study of <strong>tactile contrasts</strong>—an architectural sanctuary where raw geological matter dialogues directly with high-precision luxury craftsmanship.
                        </p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                          <div>
                            <strong style={{ fontWeight: 500, color: '#c49e29', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em', display: 'block', marginBottom: '0.25rem' }}>Geological Substrate & High-Tactility</strong>
                            <p style={{ margin: 0, opacity: 0.9 }}>
                              The mood board captures the coarse earth of AlUla: wind-rippled sand dunes, dry clay plaster, and layered agate geodes. These elements anchor the pop-up in an ancient topographic language, emphasizing physical mass, texture, and natural weathering.
                            </p>
                          </div>
                          
                          <div>
                            <strong style={{ fontWeight: 500, color: '#c49e29', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em', display: 'block', marginBottom: '0.25rem' }}>Precision Metallurgy & Mirror Horizons</strong>
                            <p style={{ margin: 0, opacity: 0.9 }}>
                              Hyper-polished chrome rings, liquid copper surfaces, and mirrored shards slice through the organic textures. They act as precise optical instruments, catching reflections of shifting dunes and the desert's high-contrast daylight, transforming the pop-up into an interactive mirage.
                            </p>
                          </div>
                          
                          <div>
                            <strong style={{ fontWeight: 500, color: '#c49e29', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em', display: 'block', marginBottom: '0.25rem' }}>Biomimetic Synergy & Leather Cuts</strong>
                            <p style={{ margin: 0, opacity: 0.9 }}>
                              Loewe's avant-garde fashion details—the precise geometric seams of the signature Puzzle bag, classical architectural columns, and dried branches—are woven into the landscape. Products are presented not as isolated merchandise, but as organic formations emerging from the earth.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div style={{ width: '80px', height: '2px', background: '#c49e29', marginTop: '0.5rem' }} />
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
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ textAlign: 'center', color: '#5c4a3d', marginBottom: '5rem', maxWidth: '800px' }}>
                      <span style={{ fontSize: '0.85rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c49e29', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                        BLUEPRINT GENESIS
                      </span>
                      <h2 className="font-sans" style={{ fontSize: '3rem', letterSpacing: '0.05em', margin: 0, fontWeight: 300, textTransform: 'uppercase' }}>
                        SKETCHES TO VISUALISE
                      </h2>
                      <p style={{ fontSize: '1.15rem', lineHeight: '1.8', opacity: 0.9, fontWeight: 300, marginTop: '1.5rem' }}>
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
                      textAlign: 'left'
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
