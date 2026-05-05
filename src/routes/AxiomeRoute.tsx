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
      
      {/* Branding Overlay */}
      <div style={{
        position: 'fixed',
        bottom: '8%',
        left: '4%',
        zIndex: 10,
        pointerEvents: 'none'
      }}>
        <h1 style={{
          fontSize: 'clamp(3rem, 8vw, 10rem)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          margin: 0,
          color: 'white',
          fontWeight: 400,
          opacity: 0.95
        }}>
          AXIOMÉ
        </h1>
        <p style={{
          fontSize: '0.8rem',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.6)',
          marginTop: '1rem'
        }}>
          SPRING SUMMER 2025–2026
        </p>
      </div>

      {/* Placeholder for future collection items */}
      <div className="axiome-empty-container" style={{ 
        position: 'relative',
        zIndex: 5,
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        pointerEvents: 'none'
      }}>
        <h2 style={{ 
          color: 'white', 
          opacity: 0.15, 
          letterSpacing: '0.3em',
          fontWeight: 300,
          fontSize: '0.9rem',
          textTransform: 'uppercase'
        }}>
          COLLECTION · CURATION IN PROGRESS
        </h2>
      </div>
    </div>
  );
}
