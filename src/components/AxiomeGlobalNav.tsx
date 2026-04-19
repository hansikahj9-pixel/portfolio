import { Link } from 'react-router-dom';
import FluidTab from './FluidTab';

export default function AxiomeGlobalNav() {
  const tabColors: [string, string, string] = ['#F0F0F0', '#A0A0A0', '#333333'];

  return (
    <header className="axiome-header">
      <Link to="/" className="axiome-back-link outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-sm">
        <span className="axiome-back-arrow" aria-hidden="true">←</span>
        Back to Home
      </Link>

      <nav className="axiome-menu-tabs">
        <FluidTab to="/axiome/process" label="THE PROCESS" colors={tabColors} />
        <FluidTab to="/axiome/maison" label="LA MAISON" colors={tabColors} />
        <FluidTab to="/axiome/collection" label="THE COLLECTION" colors={tabColors} />
      </nav>
    </header>
  );
}
