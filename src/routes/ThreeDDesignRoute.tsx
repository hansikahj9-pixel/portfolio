import { useEffect } from 'react';
import ThreeDParticleTerrain from '../components/ThreeDParticleTerrain';
import './ThreeDDesign.css';

export default function ThreeDDesignRoute() {
  // Reset scroll to top on page mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="td-container" style={{ padding: 0 }}>
      {/* ── High-Fidelity Circular 3D WebGL Point Cloud Background ── */}
      <ThreeDParticleTerrain />
    </div>
  );
}
