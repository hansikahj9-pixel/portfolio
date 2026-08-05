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

      {/* Hero Content Overlay (Asymmetric & Floating Clean) */}
      <div className="relative z-10 w-full max-w-7xl px-8 md:px-24 text-left pointer-events-none flex flex-col justify-center h-full">
        <h1 
          className="text-7xl md:text-[10rem] font-light tracking-[0.08em] leading-[0.95] select-none"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          <span className="chrome-medium block mb-3 text-left">The Art</span>
          <span className="chrome-dark italic font-extralight block text-left ml-[15%] my-4 text-5xl md:text-8xl">of</span>
          <span className="chrome-bright block mt-3 tracking-[0.12em] text-left ml-[30%] text-8xl md:text-[12rem]">Abstract</span>
        </h1>
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
