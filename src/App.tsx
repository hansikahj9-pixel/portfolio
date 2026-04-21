import { useRef } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import PortfolioRoute from './routes/PortfolioRoute';
import AxiomeRoute from './routes/AxiomeRoute';
import InspirationRoute from './routes/InspirationRoute';
import CustomCursor from './components/CustomCursor';
import MotionPageFlip from './components/MotionPageFlip';
import AxiomeGlobalNav from './components/AxiomeGlobalNav';
import MoltenBackground from './components/MoltenBackground';

function App() {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  // Only show background on inspiration/collection pages
  const showMoltenBg = location.pathname === '/inspiration';

  // Only show Axiomé specific nav within the project context
  const projectRoutes = ['/inspiration', '/collection'];
  const isAxiomeRoute = projectRoutes.includes(location.pathname);

  return (
    <div ref={containerRef} className="app-root-container" style={{ position: 'relative' }}>
      {/* ── Molten Background: OUTSIDE perspective container so position:fixed works ── */}
      {showMoltenBg && <MoltenBackground />}

      {/* 3D Global Perspective Container for Page Flips */}
      <div className="global-perspective-container">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<MotionPageFlip locationKey="/"><PortfolioRoute /></MotionPageFlip>} />
            <Route path="/inspiration" element={<MotionPageFlip locationKey="/inspiration"><InspirationRoute /></MotionPageFlip>} />
            <Route path="/collection" element={<MotionPageFlip locationKey="/collection"><AxiomeRoute /></MotionPageFlip>} />

            {/* ── Legacy Redirects ── */}
            <Route path="/process" element={<Navigate to="/inspiration" replace />} />

            {/* ── Legacy Redirects to prevent blank screens ── */}
            <Route path="/axiome" element={<Navigate to="/collection" replace />} />
            <Route path="/axiome/process" element={<Navigate to="/inspiration" replace />} />
            <Route path="/axiome/inspiration" element={<Navigate to="/inspiration" replace />} />
            <Route path="/axiome/*" element={<Navigate to="/collection" replace />} />
          </Routes>
        </AnimatePresence>
      </div>

      {/* ── Axiomé Project Navigation: Shown only for project pages ── */}
      {isAxiomeRoute && <AxiomeGlobalNav />}

      {/* Custom Cursor stays global */}
      <CustomCursor />
    </div>
  );
}

export default App;
