import { useState } from 'react';
import { Link } from 'react-router-dom';

interface FluidTabProps {
  to: string;
  label: string;
  colors?: [string, string, string]; // Colors kept in props for interface compatibility but logic handled by CSS
}

export default function FluidTab({ to, label }: FluidTabProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={to}
      className={`fluid-tab-box ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="fluid-tab-label">{label}</span>
      <div className="fluid-tab-border" />
    </Link>
  );
}
