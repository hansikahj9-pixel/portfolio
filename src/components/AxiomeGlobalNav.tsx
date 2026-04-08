import { Link } from 'react-router-dom';

export default function AxiomeGlobalNav() {
  return (
    <header className="axiome-header">
      <Link to="/" className="axiome-back-link">
        <span className="axiome-back-arrow">←</span>
        Back to Home
      </Link>

      <nav className="axiome-menu">
        <Link to="/axiome/process" className="axiome-menu-link">THE PROCESS</Link>
        <Link to="/axiome/maison" className="axiome-menu-link">LA MAISON</Link>
        <Link to="/axiome/collection" className="axiome-menu-link">THE COLLECTION</Link>
      </nav>
    </header>
  );
}
