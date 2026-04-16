import AxiomeGlobalNav from '../components/AxiomeGlobalNav';
import AnimatedServicesTabs from '../components/AnimatedServicesTabs';
import videoSrc from '../assets/66a3c3e1-ba5d-4278-8ec4-0b9a7a3ea23f.mp4';

export default function AxiomeRoute() {
  return (
    <div className="axiome-container">
      {/* ── Cinematic Video Background ── */}
      <video
        className="axiome-video"
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
      />

      {/* ── Subtle Dark Overlay ── */}
      <div className="axiome-overlay" />

      {/* ── Global Navigation Overlay ── */}
      <AxiomeGlobalNav />

      {/* ── Animated Services Tabs ── */}
      <div style={{ position: 'relative', zIndex: 50, padding: '10vh 5vw' }}>
        <AnimatedServicesTabs />
      </div>
    </div>
  );
}
