"use client";

import React from "react";

export const HeroPinSection: React.FC = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
      {/* Native Auto-Looping Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>

      {/* Hero Content Overlay */}
      <div className="relative z-10 p-6 max-w-3xl w-full text-center">
        <div className="real-glassmorphism chrome-ring-border p-10 md:p-16 rounded-3xl backdrop-blur-3xl shadow-2xl transition-all">
          <span className="text-xs font-mono uppercase tracking-[0.4em] text-zinc-400 mb-4 block">
            VISUAL STUDY // HANSIKA JAIN
          </span>
          <h1 className="text-4xl md:text-7xl font-extralight tracking-tight uppercase chrome-silver-text mb-6">
            THE ART OF ABSTRACT
          </h1>
          <p className="text-sm md:text-base text-zinc-300 font-light tracking-wide max-w-xl mx-auto leading-relaxed">
            Ambient tape and plastic visual study. High-end glassmorphism and metallic chrome silver aesthetic.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroPinSection;
