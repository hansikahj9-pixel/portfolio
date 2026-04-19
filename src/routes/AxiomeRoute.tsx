import videoSrc from '../assets/66a3c3e1-ba5d-4278-8ec4-0b9a7a3ea23f.mp4';
import Meta from '../components/Meta';

export default function AxiomeRoute() {
  return (
    <div className="axiome-container">
      <Meta 
        title="Axiomé | Cinematic Project" 
        description="A cinematic exploration of the Axiomé project, where fashion meets surreality."
      />
      {/* ── Cinematic Video Background ── */}
      <video
        className="axiome-video"
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        aria-label="Cinematic background video for Axiomé project"
      />

      {/* ── Subtle Dark Overlay ── */}
      <div className="axiome-overlay" />

    </div>
  );
}
