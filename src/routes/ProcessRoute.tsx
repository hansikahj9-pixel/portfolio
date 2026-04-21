import LiquidSilkBackground from '../components/LiquidSilkBackground';

export default function ProcessRoute() {
  return (
    <div className="process-empty-container" style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <LiquidSilkBackground />
      <h1 style={{ 
        color: 'white', 
        opacity: 0.3, 
        letterSpacing: '0.2em', 
        zIndex: 1, 
        pointerEvents: 'none',
        textShadow: '0 0 20px rgba(0,0,0,0.5)'
      }}>
        PROCESS · COMING SOON
      </h1>
    </div>
  );
}
