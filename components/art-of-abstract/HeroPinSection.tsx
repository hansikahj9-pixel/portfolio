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
      <div className="relative z-10 w-full max-w-7xl px-6 md:px-24 flex flex-col justify-center h-full pointer-events-none select-none">
        {/* Line 1: "The Art" - Right Aligned / Upper Right */}
        <div className="w-full flex justify-end pr-[5%] md:pr-[12%]">
          <h1 
            className="text-6xl md:text-[8vw] font-normal tracking-tight chrome-bright leading-none"
            style={{ fontFamily: "'Courier New', Courier, monospace" }}
          >
            The Art
          </h1>
        </div>

        {/* Line 2: "of" - Aligned under the right side of "The Art" */}
        <div className="w-full flex justify-end pr-[8%] md:pr-[16%] -my-1 md:-my-3">
          <span 
            className="text-5xl md:text-[6vw] font-normal chrome-medium leading-none"
            style={{ fontFamily: "'Courier New', Courier, monospace" }}
          >
            of
          </span>
        </div>

        {/* Line 3: "Abstract" - Aligned towards the center-left */}
        <div className="w-full flex justify-start pl-[5%] md:pl-[20%]">
          <h1 
            className="text-6xl md:text-[8vw] font-normal tracking-tight chrome-bright leading-none"
            style={{ fontFamily: "'Courier New', Courier, monospace" }}
          >
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
