import { Link } from 'react-router-dom';

export default function AxiomeGlobalNav() {
  return (
    <header className="axiome-header">
      <Link to="/" className="axiome-back-link">
        <span className="axiome-back-arrow">←</span>
        Back to Home
      </Link>

      <nav className="axiome-menu-tabs" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link to="/axiome/process" className="axiome-tab">THE PROCESS</Link>
        <Link to="/axiome/maison" className="axiome-tab">LA MAISON</Link>
        <Link to="/axiome/collection" className="axiome-tab">THE COLLECTION</Link>
      </nav>
    </header>
  );
}
