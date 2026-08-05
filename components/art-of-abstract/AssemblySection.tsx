"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface AssemblySectionProps {
  videoSrc: string;
}

export const AssemblySection: React.FC<AssemblySectionProps> = ({ videoSrc }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phaseDegrees, setPhaseDegrees] = useState<string>("0° / 360°");

  useEffect(() => {
    const container = containerRef.current;
    const vid = videoRef.current;

    if (!container || !vid) return;

    vid.pause();

    const initScrubber = () => {
      vid.pause();
      const dur = vid.duration || 10;
      vid.currentTime = dur;

      ScrollTrigger.create({
        trigger: container,
        scroller: "#abstract-scroll-container",
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: 1.0,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (vid.duration) {
            vid.pause();
            // REVERSE SCRUB: From duration down to 0 as user scrolls
            vid.currentTime = dur * (1 - self.progress);

            const degrees = Math.round(self.progress * 360);
            setPhaseDegrees(`${degrees}° / 360°`);
          }
        },
      });

      ScrollTrigger.refresh();
    };

    if (vid.readyState >= 1) {
      initScrubber();
    } else {
      vid.onloadedmetadata = initScrubber;
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-zinc-950 overflow-hidden">
      {/* Real Glassmorphism HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-6 md:p-14">
        <div className="flex justify-between items-center">
          <span className="text-xs uppercase tracking-[0.3em] text-zinc-400 font-mono">
            PHASE 02 // TACTILE MOULD ASSEMBLY
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-zinc-300 border border-zinc-700 px-4 py-1.5 rounded-full real-glassmorphism">
              {phaseDegrees}
            </span>
            <span className="text-xs font-mono text-zinc-300 border border-zinc-700 px-4 py-1.5 rounded-full real-glassmorphism">
              360° REVERSE ASSEMBLY
            </span>
          </div>
        </div>

        {/* Dynamic Caption Panel */}
        <div className="self-center mb-8 max-w-2xl text-center">
          <div className="real-glassmorphism chrome-ring-border p-8 rounded-3xl backdrop-blur-3xl shadow-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400 font-mono mb-2">
              STRUCTURAL FORMATION
            </p>
            <h3 className="text-2xl md:text-3xl font-light molten-chrome-text">
              Cardboard, Spools & Paper Cups Magnetically Snapping into Place
            </h3>
          </div>
        </div>
      </div>

      {/* Single Unified Video Stage (Zero Black Screens / Zero Lag) */}
      <div className="relative w-full h-full flex items-center justify-center">
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover opacity-90"
        />
      </div>
    </div>
  );
};

export default AssemblySection;
