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

function App() {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="app-root-container" style={{ position: 'relative' }}>
      {/* 3D Global Perspective Container for Page Flips */}
      <div className="global-perspective-container">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<MotionPageFlip locationKey="/"><PortfolioRoute /></MotionPageFlip>} />
            <Route path="/axiome" element={<MotionPageFlip locationKey="/axiome"><AxiomeRoute /></MotionPageFlip>} />
            <Route path="/axiome/process" element={<MotionPageFlip locationKey="/axiome/process"><ProcessRoute /></MotionPageFlip>} />
            <Route path="/axiome/inspiration" element={<MotionPageFlip locationKey="/axiome/inspiration"><InspirationRoute /></MotionPageFlip>} />
          </Routes>
        </AnimatePresence>
      </div>

      {/* ── Truly Global Header Overlay ── */}
      <AxiomeGlobalNav />

      {/* Custom Cursor stays global */}
      <CustomCursor />
    </div>
  );
}

export default App;
