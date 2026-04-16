import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { View } from '@react-three/drei';
import { useRef } from 'react';
import FluidTab from './FluidTab';

export default function AxiomeGlobalNav() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tabColors: [string, string, string] = ['#FF5F1F', '#C0C0C0', '#50C878'];

  return (
    <header className="axiome-header" ref={containerRef}>
      <Link to="/" className="axiome-back-link">
        <span className="axiome-back-arrow">←</span>
        Back to Home
      </Link>

      <nav className="axiome-menu-tabs">
        <FluidTab to="/axiome/process" label="THE PROCESS" colors={tabColors} />
        <FluidTab to="/axiome/maison" label="LA MAISON" colors={tabColors} />
        <FluidTab to="/axiome/collection" label="THE COLLECTION" colors={tabColors} />
      </nav>

      {/* Shared Global Canvas for all Views */}
      <div className="axiome-nav-canvas-container">
        <Canvas
          eventSource={containerRef as any}
          className="shared-nav-canvas"
          dpr={[1, 2]}
          camera={{ position: [0, 0, 1] }}
          gl={{ antialias: true, alpha: true }}
        >
          <View.Port />
        </Canvas>
      </div>
    </header>
  );
}
