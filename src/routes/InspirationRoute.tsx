import { useRef, useEffect } from 'react';
import type { MouseEvent } from 'react';
import AxiomeGlobalNav from '../components/AxiomeGlobalNav';
import LiquidDiamondMesh from '../components/LiquidDiamondMesh';
import CharacterForm from '../components/CharacterForm';
import { useState } from 'react';

export default function InspirationRoute() {

  // Box spotlight tracking — MANDATORY PRESERVATION

  const boxRef = useRef<HTMLDivElement>(null);
  // @ts-ignore - Preserving for future artifact integration
  const [mousePos, setMousePos] = useState({ x: '50%', y: '50%' });

  // @ts-ignore - Preserving for future artifact integration
  const handleBoxMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!boxRef.current) return;
    const rect = boxRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x: `${x}px`, y: `${y}px` });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="inspiration-container">
      {/* WebGL Liquid Diamond Background — fixed behind everything */}
      <LiquidDiamondMesh />

      <AxiomeGlobalNav />

      {/* Main Content Area — The "Clean Slate" Void Integration */}
      <main className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <CharacterForm />
      </main>
    </div>
  );
}

