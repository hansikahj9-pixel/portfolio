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
        className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none"
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>

      {/* Hero Content Overlay */}
      <div className="relative z-10 p-6 max-w-4xl w-full text-center pointer-events-none">
        <div className="real-glassmorphism chrome-ring-border p-12 md:p-20 rounded-[2rem] backdrop-blur-3xl shadow-2xl transition-all max-w-2xl mx-auto">
          <h1 
            className="text-6xl md:text-8xl font-light tracking-[0.12em] uppercase leading-[1.1] select-none"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            <span className="chrome-medium block mb-2">The Art</span>
            <span className="chrome-dark italic font-extralight lowercase block text-4xl md:text-5xl my-1">of</span>
            <span className="chrome-bright block mt-2 tracking-[0.16em]">Abstract</span>
          </h1>
          
          {/* Subtle luxury divider line */}
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-zinc-400 to-transparent mx-auto mt-8 mb-4 opacity-50" />
          
          <span className="text-[10px] tracking-[0.6em] text-zinc-400 uppercase font-mono block">
            STUDY N° 04
          </span>
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
