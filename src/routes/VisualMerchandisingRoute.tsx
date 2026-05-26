import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

// Asset Imports
import loeweStore from '../assets/store/store 1.jpeg';
import loeweInterior from '../assets/store/Gemini_Generated_Image_ (2).png';
import guoPeiStore from '../assets/store/Gemini_Generated_Image_nuxoqlnuxoqlnuxo.png';
import guoPeiDetail from '../assets/store/360 view.png';

import './VisualMerchandising.css';

export default function VisualMerchandisingRoute() {
  const [hoveredPanel, setHoveredPanel] = useState<'loewe' | 'guopei' | null>(null);
  const [activeLoeweMaterial, setActiveLoeweMaterial] = useState<'suede' | 'terracotta' | 'concrete'>('concrete');
  const [selectedProject, setSelectedProject] = useState<'loewe' | 'guopei' | null>(null);

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
  const loeweMaterialThemes = {
    concrete: {
      accentColor: 'rgba(212, 208, 199, 0.45)',
      bgColor: '#e2dfd8',
      swatchLabel: 'Board-Formed Cement',
      borderStyle: '1px solid rgba(0, 0, 0, 0.08)'
    },
    suede: {
      accentColor: 'rgba(196, 154, 108, 0.4)',
      bgColor: '#dac9b5',
      swatchLabel: 'Raw Spanish Suede',
      borderStyle: '1px dashed #A67C52'
    },
    terracotta: {
      accentColor: 'rgba(204, 114, 82, 0.35)',
      bgColor: '#dfccbd',
      swatchLabel: 'Artisanal Terracotta',
      borderStyle: '2px solid #CC7252'
    }
  };

  const activeTheme = loeweMaterialThemes[activeLoeweMaterial];

  const navigate = useNavigate();
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
              onClick={() => navigate('/loewe')}
            >
              <div 
                className="loewe-card-frame"
                style={{ border: activeTheme.borderStyle }}
              >
                <div className="loewe-image-container">
                  <img src={loeweStore} alt="Loewe Facade Pop-Up Store Mockup" className="loewe-img" />
                  <div className="loewe-image-overlay" />
                </div>

                <div className="loewe-card-details">
                  <span className="loewe-tag">RESONANT TACTILITY</span>
                  <h3 className="loewe-project-name">LOEWE ARCHITECTURAL POP-UP</h3>
                  <p className="loewe-project-desc">
                    A physical structure celebrating modern geometry, raw concrete panels, and Madrid's signature leather heritage.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Bento Grid: Sub-Cards */}
            <div className="loewe-bento-grid">
              {/* Material Swatches Card */}
              <motion.div 
                className="loewe-bento-card material-board"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <div className="bento-card-notch">MATERIAL PALETTE</div>
                <h4 className="bento-card-title">Tactile Swatches</h4>
                
                <div className="swatches-container">
                  <button 
                    onClick={() => setActiveLoeweMaterial('concrete')}
                    className={`swatch-btn concrete ${activeLoeweMaterial === 'concrete' ? 'active' : ''}`}
                    title="Cement block"
                  />
                  <button 
                    onClick={() => setActiveLoeweMaterial('suede')}
                    className={`swatch-btn suede ${activeLoeweMaterial === 'suede' ? 'active' : ''}`}
                    title="Suede leather swatch"
                  />
                  <button 
                    onClick={() => setActiveLoeweMaterial('terracotta')}
                    className={`swatch-btn terracotta ${activeLoeweMaterial === 'terracotta' ? 'active' : ''}`}
                    title="Clay brick swatch"
                  />
                </div>
                <span className="swatch-indicator">{activeTheme.swatchLabel}</span>
              </motion.div>

              {/* VM Strategy Bento Card */}
              <motion.div 
                className="loewe-bento-card text-strategy"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="bento-card-notch">VM STRATEGY</div>
                <p className="bento-card-body">
                  Leveraging low-angle soft museum spotlights and textured concrete columns to evoke a warm, open-air Spanish courtyard experience.
                </p>
              </motion.div>
            </div>
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
                // LOEWE Immersive Presentation
                <div className="drawer-layout">
                  <div className="drawer-column visual-show">
                    <div className="drawer-main-image-box">
                      <img src={loeweStore} alt="Loewe Architectural Facade" />
                    </div>
                    <div className="drawer-secondary-images">
                      <div className="sec-img-box"><img src={loeweInterior} alt="Loewe Store Interior Design" /></div>
                      <div className="sec-text-box">
                        <h5>SPATIAL STRATEGY</h5>
                        <p>Open-air sensory geometry utilizing natural clay aggregates and linen partitions to curate organic luxury.</p>
                      </div>
                    </div>
                  </div>

                  <div className="drawer-column details-show">
                    <span className="drawer-brand-sub font-sans">L O E W E</span>
                    <h2 className="drawer-title font-sans">Madrid Pop-Up Store</h2>
                    
                    <div className="drawer-section">
                      <h4>THE CONCEPT</h4>
                      <p>
                        A tribute to traditional Spanish craft merged with cutting-edge architectural form. The layout mimics the geometry of an open Spanish courtyard, utilizing board-formed cement panels contrasted against premium hand-stitched tan suede partitions.
                      </p>
                    </div>

                    <div className="drawer-section">
                      <h4>VISUAL MERCHANDISING ELEMENTS</h4>
                      <ul className="details-list">
                        <li><strong>Focal Points:</strong> Isolated central concrete podium showcasing the signature Puzzle bag, framed by architectural clay pillars.</li>
                        <li><strong>Lighting Scheme:</strong> 3000K warm tracking spotlights focusing strictly on product focal planes, leaving the raw concrete columns in soft, structural shadow.</li>
                        <li><strong>Sensory Touchpoints:</strong> Live Spanish olive trees embedded in board-formed clay rings, integrating organic elements into the luxury shopping experience.</li>
                      </ul>
                    </div>
                  </div>
                </div>
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
