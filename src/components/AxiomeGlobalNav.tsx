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
        <FluidTab to="/axiome/process" label="THE PROCESS" colors={tabColors} />
        <FluidTab to="/axiome/maison" label="LA MAISON" colors={tabColors} />
        <FluidTab to="/axiome/collection" label="THE COLLECTION" colors={tabColors} />
      </nav>
    </header>
  );
}
