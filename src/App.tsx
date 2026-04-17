import { useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { View, Preload } from '@react-three/drei';

import PortfolioRoute from './routes/PortfolioRoute';
import AxiomeRoute from './routes/AxiomeRoute';
import ProcessRoute from './routes/ProcessRoute';
import InspirationRoute from './routes/InspirationRoute';
import CustomCursor from './components/CustomCursor';
import MotionPageFlip from './components/MotionPageFlip';

function App() {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="app-root-container" style={{ position: 'relative' }}>
      {/* ── Surgical Global WebGL Context ── */}
      <div className="global-webgl-canvas" style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        zIndex: -1, // Strictly behind all content
        pointerEvents: 'none' 
      }}>
        <Canvas 
          eventSource={containerRef as React.RefObject<HTMLElement>} 
          key="global-canvas"
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <View.Port />
          <Preload all />
        </Canvas>
      </div>

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

      {/* Custom Cursor stays global */}
      <CustomCursor />
    </div>
  );
}

export default App;
// Deployment Trigger: v13-Final-Restore-Confirmed
