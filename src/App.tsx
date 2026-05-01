// Vercel deployment trigger: 2026-05-01T20:50:00Z
import { useRef } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import PortfolioRoute from './routes/PortfolioRoute';
import AxiomeRoute from './routes/AxiomeRoute';
import ProcessRoute from './routes/ProcessRoute';
import InspirationRoute from './routes/InspirationRoute';
import MonolithRoute from './routes/MonolithRoute';
import CustomCursor from './components/CustomCursor';
import MotionPageFlip from './components/MotionPageFlip';
import AxiomeGlobalNav from './components/AxiomeGlobalNav';
import BackgroundHub from './components/BackgroundHub';

function App() {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  // Include /vision in project routes for navigation visibility
  const projectRoutes = ['/inspiration', '/process', '/collection', '/vision'];
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
            <Route path="/vision" element={<MotionPageFlip locationKey="/vision"><MonolithRoute /></MotionPageFlip>} />
            <Route path="/process" element={<MotionPageFlip locationKey="/process"><ProcessRoute /></MotionPageFlip>} />
            <Route path="/collection" element={<MotionPageFlip locationKey="/collection"><AxiomeRoute /></MotionPageFlip>} />

            {/* ── Legacy Redirects ── */}
            <Route path="/axiome" element={<Navigate to="/collection" replace />} />
            <Route path="/axiome/process" element={<Navigate to="/process" replace />} />
            <Route path="/axiome/inspiration" element={<Navigate to="/inspiration" replace />} />
            <Route path="/axiome/*" element={<Navigate to="/collection" replace />} />
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
