import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../utils/cn';

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
      className={cn(
        "fluid-tab-box outline-none focus-visible:ring-2 focus-visible:ring-white/50",
        isHovered && 'hovered'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`Navigate to ${label}`}
    >
      <span className="fluid-tab-label">{label}</span>
      <div className="fluid-tab-border" />
    </Link>
  );
}
