"use client";

import React from "react";
import { useNavigate } from "react-router-dom";

export const HeroPinSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#192020] flex items-center justify-center">
      {/* Floating Exit Button for Premium UX */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-8 left-8 z-30 flex items-center gap-3 px-5 py-2.5 rounded-full text-xs font-mono tracking-widest text-zinc-300 real-glassmorphism chrome-ring-border hover:text-white transition-all cursor-pointer pointer-events-auto"
      >
        <span>←</span> BACK TO WORKS
      </button>

      {/* Figma Letterboxed Video Crop Container (Y: 70px to 936px -> top: 6.8vh, height: 84.6vh) */}
      <div className="absolute top-[6.8vh] left-0 w-full h-[84.6vh] overflow-hidden bg-black pointer-events-none">
        {/* Native Auto-Looping Background Video (scaled slightly to hide watermark) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover scale-105 opacity-55"
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Hero Content Overlay (Exact Figma X:281 Y:301 Scale & Color Dodge Blend Mode) */}
      <div 
        className="absolute inset-0 flex items-center justify-center p-6 md:p-16 z-20 pointer-events-none select-none"
      >
        <div 
          className="w-full max-w-[1062px] flex flex-col items-end text-right mix-blend-color-dodge"
          style={{ fontFamily: "'Life Savers', serif" }}
        >
          {/* "The Art" - Bold + Exact Figma Spacing */}
          <h1 
            className="font-bold text-[#DADADA] tracking-normal"
            style={{
              fontSize: "clamp(2rem, 15.97vw, 230px)",
              lineHeight: "1.1739",
              WebkitTextStroke: "calc(4px + 0.6vw) #000000",
              paintOrder: "stroke fill"
            }}
          >
            The Art
          </h1>
          
          {/* "of" - Bold + Exact Figma Spacing */}
          <span 
            className="font-bold text-[#DADADA] tracking-normal"
            style={{
              fontSize: "clamp(2rem, 15.97vw, 230px)",
              lineHeight: "1.1739",
              WebkitTextStroke: "calc(4px + 0.6vw) #000000",
              paintOrder: "stroke fill"
            }}
          >
            of
          </span>
          
          {/* "Abstract" - Bold + Exact Figma Spacing */}
          <h1 
            className="font-bold text-[#DADADA] tracking-normal"
            style={{
              fontSize: "clamp(2rem, 15.97vw, 230px)",
              lineHeight: "1.1739",
              WebkitTextStroke: "calc(4px + 0.6vw) #000000",
              paintOrder: "stroke fill"
            }}
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
// Vercel rebuild trigger
