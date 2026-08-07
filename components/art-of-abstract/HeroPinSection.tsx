"use client";

import React from "react";
import { useNavigate } from "react-router-dom";

export const HeroPinSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#192020] flex items-center justify-center">
      {/* Top Left Back Navigation Link matching other pages */}
      <div className="absolute top-8 left-8 z-30 pointer-events-auto">
        <button
          onClick={() => navigate("/")}
          className="axiome-back-link cursor-pointer border-none bg-transparent outline-none pointer-events-auto"
        >
          <span className="axiome-back-arrow">←</span>
          BACK TO WORKS
        </button>
      </div>

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
          {/* "The Art" - Bold + Glass Refraction Bevel Style + Line Spacing 240 */}
          <h1 
            className="font-bold tracking-normal"
            style={{
              fontSize: "clamp(2rem, 15.97vw, 230px)",
              lineHeight: "1.0435",
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(218, 218, 218, 0.65) 50%, rgba(255, 255, 255, 0.95) 75%, rgba(160, 160, 160, 0.5) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              WebkitTextStroke: "calc(4px + 0.6vw) #000000",
              paintOrder: "stroke fill",
              textShadow: "1px 1px 0px rgba(255, 255, 255, 0.55), -1px -1px 0px rgba(0, 0, 0, 0.35), 0px 8px 16px rgba(0, 0, 0, 0.4)"
            }}
          >
            The Art
          </h1>
          
          {/* "of" - Bold + Glass Refraction Bevel Style + Line Spacing 240 */}
          <span 
            className="font-bold tracking-normal"
            style={{
              fontSize: "clamp(2rem, 15.97vw, 230px)",
              lineHeight: "1.0435",
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(218, 218, 218, 0.65) 50%, rgba(255, 255, 255, 0.95) 75%, rgba(160, 160, 160, 0.5) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              WebkitTextStroke: "calc(4px + 0.6vw) #000000",
              paintOrder: "stroke fill",
              textShadow: "1px 1px 0px rgba(255, 255, 255, 0.55), -1px -1px 0px rgba(0, 0, 0, 0.35), 0px 8px 16px rgba(0, 0, 0, 0.4)"
            }}
          >
            of
          </span>
          
          {/* "Abstract" - Bold + Glass Refraction Bevel Style + Line Spacing 240 */}
          <h1 
            className="font-bold tracking-normal"
            style={{
              fontSize: "clamp(2rem, 15.97vw, 230px)",
              lineHeight: "1.0435",
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(218, 218, 218, 0.65) 50%, rgba(255, 255, 255, 0.95) 75%, rgba(160, 160, 160, 0.5) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              WebkitTextStroke: "calc(4px + 0.6vw) #000000",
              paintOrder: "stroke fill",
              textShadow: "1px 1px 0px rgba(255, 255, 255, 0.55), -1px -1px 0px rgba(0, 0, 0, 0.35), 0px 8px 16px rgba(0, 0, 0, 0.4)"
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
