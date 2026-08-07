"use client";

import React from "react";
import { useNavigate } from "react-router-dom";

export const HeroPinSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
      {/* Floating Exit Button for Premium UX */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-8 left-8 z-30 flex items-center gap-3 px-5 py-2.5 rounded-full text-xs font-mono tracking-widest text-zinc-300 real-glassmorphism chrome-ring-border hover:text-white transition-all cursor-pointer pointer-events-auto"
      >
        <span>←</span> BACK TO WORKS
      </button>

      {/* Native Auto-Looping Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover scale-105 opacity-50 pointer-events-none"
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>

      {/* Hero Content Overlay (Asymmetric Figma Typewriter Layout) */}
      <div className="relative z-10 w-full max-w-7xl px-6 md:px-24 flex items-center justify-end h-full pointer-events-none select-none">
        <div 
          className="flex flex-col text-left max-w-3xl pr-[5%] md:pr-[8%]"
          style={{ fontFamily: "'Courier New', Courier, monospace" }}
        >
          {/* "The Art" - Bold Monospace */}
          <h1 className="text-6xl md:text-[8vw] font-bold chrome-bright leading-[0.85] tracking-tight">
            The Art
          </h1>
          
          {/* "of" - Lowercase, nested below "Art" */}
          <span className="text-5xl md:text-[6vw] font-normal chrome-medium leading-[0.85] self-end mr-[8%] md:mr-[12%] my-1 md:my-2">
            of
          </span>
          
          {/* "Abstract" - Shifted left to overlap stagger */}
          <h1 className="text-6xl md:text-[8vw] font-bold chrome-bright leading-[0.85] tracking-tight -ml-[10%] md:-ml-[20%]">
            Abstract
          </h1>
        </div>
      </div>

      {/* Elegant scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-60">
        <span className="text-[9px] font-mono tracking-[0.4em] text-zinc-500 uppercase">SCROLL</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-zinc-500 to-transparent animate-pulse" />
      </div>
    </div>
  );
};

export default HeroPinSection;
