import { useEffect, useRef } from 'react';
import axiomeVideo from '../assets/66a3c3e1-ba5d-4278-8ec4-0b9a7a3ea23f.mp4';

export default function AxiomeRoute() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.warn("Axiomé · Video: Playback deferred by browser policy.", err);
      });
    }
  }, []);

  return (
    <div className="axiome-container">
      <video
        ref={videoRef}
        className="axiome-video"
        src={axiomeVideo}
        autoPlay
        muted
        loop
        playsInline
        style={{
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 0
        }}
      />
      <div className="axiome-overlay" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.25)',
        zIndex: 1,
        pointerEvents: 'none'
      }} />
    </div>
  );
}
