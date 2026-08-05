// Vercel deployment trigger: 2026-05-01T20:50:00Z
import { useRef } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import PortfolioRoute from './routes/PortfolioRoute';
import AxiomeRoute from './routes/AxiomeRoute';
import CollectionRoute from './routes/CollectionRoute';
import ProcessRoute from './routes/ProcessRoute';
import InspirationRoute from './routes/InspirationRoute';
import MonolithRoute from './routes/MonolithRoute';
import ShakespeareRoute from './routes/ShakespeareRoute';
import VisualMerchandisingRoute from './routes/VisualMerchandisingRoute';
import ThreeDDesignRoute from './routes/ThreeDDesignRoute';
import ArtOfAbstractRoute from './routes/ArtOfAbstractRoute';
import CustomCursor from './components/CustomCursor';
import MotionPageFlip from './components/MotionPageFlip';
import AxiomeGlobalNav from './components/AxiomeGlobalNav';
import BackgroundHub from './components/BackgroundHub';

function App() {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  // Include /process and /collection in project routes for navigation visibility
  const projectRoutes = ['/inspiration', '/process', '/collection', '/vision', '/axiome'];
  const isAxiomeRoute = projectRoutes.includes(location.pathname);

  return (
    <div ref={containerRef} className="app-root-container" style={{ position: 'relative' }}>
      {/* ── Singleton Background Hub: Unified WebGL Engine ── */}
      <BackgroundHub />

      {/* 3D Global Perspective Container for Page Flips */}
      <div className="global-perspective-container">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<MotionPageFlip locationKey="/"><PortfolioRoute /></MotionPageFlip>} />
            <Route path="/inspiration" element={<MotionPageFlip locationKey="/inspiration"><InspirationRoute /></MotionPageFlip>} />
            <Route path="/process" element={<MotionPageFlip locationKey="/process"><ProcessRoute /></MotionPageFlip>} />
            <Route path="/collection" element={<MotionPageFlip locationKey="/collection"><CollectionRoute /></MotionPageFlip>} />
            <Route path="/axiome" element={<MotionPageFlip locationKey="/axiome"><AxiomeRoute /></MotionPageFlip>} />
            <Route path="/vision" element={<MotionPageFlip locationKey="/vision"><MonolithRoute /></MotionPageFlip>} />
            <Route path="/visual-merchandising" element={<MotionPageFlip locationKey="/visual-merchandising"><VisualMerchandisingRoute /></MotionPageFlip>} />
            <Route path="/3d-design" element={<ThreeDDesignRoute />} />
            <Route path="/the-art-of-abstract" element={<ArtOfAbstractRoute />} />

            {/* ── Legacy Redirects ── */}
            <Route path="/axiome/process" element={<Navigate to="/process" replace />} />
            <Route path="/axiome/inspiration" element={<Navigate to="/inspiration" replace />} />

            {/* ── Shakespeare Feature (Isolated) ── */}
            <Route path="/shakespeare" element={<ShakespeareRoute />} />
          </Routes>
        </AnimatePresence>
      </div>

      {/* ── Axiomé Project Navigation ── */}
      {isAxiomeRoute && <AxiomeGlobalNav />}

      {/* Custom Cursor stays global */}
      <CustomCursor />
    </div>
  );
}

export default App;
