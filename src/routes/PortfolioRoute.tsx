import { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ProjectList, { type Project } from '../components/ProjectList';
import FluidBackground from '../components/FluidBackground';
import HoverImagePlane from '../components/HoverImagePlane';

export default function PortfolioRoute() {
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleProjectHover = useCallback(
    (project: Project | null, mouseX: number, mouseY: number) => {
      setHoveredProject(project);
      if (project) {
        setMousePos({ x: mouseX, y: mouseY });
      }
    },
    []
  );

  return (
    <>
      {/* WebGL Canvas - behind everything */}
      <div className="canvas-container">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: false }}
          style={{ background: '#000000' }}
        >
          <FluidBackground />
          <HoverImagePlane
            visible={hoveredProject !== null}
            mouseX={mousePos.x}
            mouseY={mousePos.y}
            color={hoveredProject?.color ?? '#C3C1B9'}
          />
        </Canvas>
      </div>

      {/* UI Layer: Contains natural scroll independent from canvas */}
      <div className="portfolio-scroll-container">
        <Navbar />
        <HeroSection />

        <ProjectList onHover={handleProjectHover} />

        <footer className="footer">
          <span className="footer-text">
            © 2026 Hansika Jain — All Rights Reserved
          </span>
          <span className="footer-text">Fashion Design Portfolio</span>
        </footer>
      </div>
    </>
  );
}
