export default function ProcessRoute() {
  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative', overflow: 'hidden', background: 'transparent' }}>


      {/* Content Layer */}
      <div style={{ 
        position: 'relative', 
        zIndex: 1, 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        pointerEvents: 'none'
      }}>
        <h1 style={{ 
          color: 'white', 
          opacity: 0.3, 
          letterSpacing: '0.2em', 
          textShadow: '0 0 20px rgba(0,0,0,0.5)',
          fontFamily: 'Inter, sans-serif'
        }}>
          PROCESS · COMING SOON
        </h1>
      </div>
    </div>
  );
}
