import { useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import PortfolioRoute from './routes/PortfolioRoute';
import AxiomeRoute from './routes/AxiomeRoute';
import ProcessRoute from './routes/ProcessRoute';
import InspirationRoute from './routes/InspirationRoute';
import CustomCursor from './components/CustomCursor';
import MotionPageFlip from './components/MotionPageFlip';
import AxiomeGlobalNav from './components/AxiomeGlobalNav';
import MoltenBackground from './components/MoltenBackground';

function App() {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  // Only show background on process page
  const showMoltenBg = location.pathname === '/process';

  // Only show Axiomé specific nav within the project context
  const projectRoutes = ['/inspiration', '/process', '/collection'];
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
            <Route path="/process" element={<MotionPageFlip locationKey="/process"><ProcessRoute /></MotionPageFlip>} />
            <Route path="/collection" element={<MotionPageFlip locationKey="/collection"><AxiomeRoute /></MotionPageFlip>} />
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
