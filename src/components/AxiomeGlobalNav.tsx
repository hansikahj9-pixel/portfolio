import { Link } from 'react-router-dom';
import FluidTab from './FluidTab';

export default function AxiomeGlobalNav() {
  // Keeping your colors and fluid logic intact
  const tabColors: [string, string, string] = ['#F0F0F0', '#A0A0A0', '#333333'];

  return (
    <header className="axiome-header" style={{ 
      padding: '3rem 8%', // Increased padding for more "breathing room"
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'absolute',
      width: '100%',
      top: 0,
      zIndex: 1000,
      boxSizing: 'border-box'
    }}>
      <Link to="/" className="axiome-back-link" style={{
        textDecoration: 'none',
        color: 'white',
        fontSize: '0.75rem',
        letterSpacing: '0.2em', // High-fashion tracking
        textTransform: 'uppercase',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        opacity: 0.8
      }}>
        <span className="axiome-back-arrow" style={{ fontSize: '1.2rem' }}>←</span>
        Back to Home
      </Link>

      <nav className="axiome-menu-tabs" style={{ 
        display: 'flex', 
        gap: '1.5rem' // Standardized spacing between tabs
      }}>
        <FluidTab to="/axiome/process" label="THE PROCESS" colors={tabColors} />
        <FluidTab to="/axiome/maison" label="LA MAISON" colors={tabColors} />
        <FluidTab to="/axiome/collection" label="THE COLLECTION" colors={tabColors} />
      </nav>
    </header>
  );
}
