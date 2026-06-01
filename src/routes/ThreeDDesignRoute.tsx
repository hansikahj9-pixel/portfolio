import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ThreeDParticleTerrain from '../components/ThreeDParticleTerrain';
import './ThreeDDesign.css';

export default function ThreeDDesignRoute() {
  // Reset scroll to top on page mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="td-container">
      {/* ── High-Fidelity Circular 3D WebGL Point Cloud Background ── */}
      <ThreeDParticleTerrain />

      {/* ── Top Floating Navigation Header ── */}
      <header className="td-header">
        <div className="td-title-wrapper">
          <span className="td-category">Selected Works — Project 03</span>
          <h1 className="td-title">3D Design</h1>
        </div>

        {/* Floating Ring Back Button */}
        <Link to="/" className="td-back-btn" aria-label="Go Back">
          <span className="td-back-arrow">←</span>
        </Link>
      </header>

      {/* ── Bottom Narrative Footer ── */}
      <footer className="td-footer">
        <p className="td-description">
          An organic 3D simulation deforming mathematical grids circularly into liquid hills and crests. 
          A highly optimized custom GLSL Point-Cloud terrain rendering a premium, state-of-the-art visual experience 
          of motion graphics, deep color gradients, and computational design.
        </p>
        <span className="td-signature">
          © 2026 Hansika Jain — All Rights Reserved
        </span>
      </footer>
    </div>
  );
}
