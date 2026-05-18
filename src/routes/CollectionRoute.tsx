export default function CollectionRoute() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent',
      color: '#e2dcd0',
      position: 'relative',
      zIndex: 1,
    }}>
      <h1 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(2.5rem, 5vw, 5rem)',
        fontWeight: 400,
        letterSpacing: '0.08em',
        marginBottom: '1.5rem',
        textShadow: '0 2px 12px rgba(0,0,0,0.6)',
      }}>
        THE COLLECTION
      </h1>
      <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '0.85rem',
        letterSpacing: '0.35em',
        textTransform: 'uppercase',
        opacity: 0.6,
        fontWeight: 300,
      }}>
        COMING SOON
      </p>
    </div>
  );
}
