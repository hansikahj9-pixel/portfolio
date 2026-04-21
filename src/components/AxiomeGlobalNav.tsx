import { Link } from 'react-router-dom';
import FluidTab from './FluidTab';

export default function AxiomeGlobalNav() {
  const tabColors: [string, string, string] = ['#F0F0F0', '#A0A0A0', '#333333'];

  return (
    <header className="axiome-header">
      <Link to="/" className="axiome-back-link">
        <span className="axiome-back-arrow">←</span>
        Back to Home
      </Link>

      <nav className="axiome-menu-tabs">
        <FluidTab to="/inspiration" label="Inspiration" colors={tabColors} />
        <FluidTab to="/collection" label="Collection" colors={tabColors} />
      </nav>
    </header>
  );
}
