"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface AssemblySectionProps {
  frontVideoSrc: string;
  backVideoSrc: string;
}

export const AssemblySection: React.FC<AssemblySectionProps> = ({
  frontVideoSrc,
  backVideoSrc,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const frontVideoRef = useRef<HTMLVideoElement>(null);
  const backVideoRef = useRef<HTMLVideoElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const frontVid = frontVideoRef.current;
    const backVid = backVideoRef.current;

    if (!container || !frontVid || !backVid) return;

    // Explicitly pause both videos so they ONLY move on scroll
    frontVid.pause();
    backVid.pause();

    const initScrubber = () => {
      frontVid.pause();
      backVid.pause();

      const frontDur = frontVid.duration || 10;
      const backDur = backVid.duration || 10;

      // Ensure initial frame state
      frontVid.currentTime = frontDur;
      backVid.currentTime = backDur;

      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: 1.2, // Smooth, luxurious motion delay
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress; // 0.0 -> 1.0

          // Keep both videos paused
          frontVid.pause();
          backVid.pause();

          if (progress <= 0.5) {
            // PHASE 1: Scrub Front Video Backwards (0° to 180° assembly)
            const norm1 = progress / 0.5; // 0.0 -> 1.0
            if (frontVid.duration) {
              frontVid.currentTime = frontDur * (1 - norm1);
            }
            frontVid.style.opacity = "1";
            backVid.style.opacity = "0";
          } else {
            // PHASE 2: Scrub Back Video Backwards (180° to 360° assembly)
            const norm2 = (progress - 0.5) / 0.5; // 0.0 -> 1.0
            if (backVid.duration) {
              backVid.currentTime = backDur * (1 - norm2);
            }
            frontVid.style.opacity = "0";
            backVid.style.opacity = "1";
          }
        },
      });
    };

    if (frontVid.readyState >= 1 && backVid.readyState >= 1) {
      initScrubber();
    } else {
      frontVid.onloadedmetadata = initScrubber;
      backVid.onloadedmetadata = initScrubber;
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-zinc-950 overflow-hidden">
      {/* Real Glassmorphism HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-8 md:p-16">
        <div className="flex justify-between items-center">
          <span className="text-xs uppercase tracking-[0.3em] text-zinc-400 font-mono">
            PHASE 02 // TACTILE MOULD ASSEMBLY
          </span>
          <span className="text-xs font-mono text-zinc-300 border border-zinc-700 px-4 py-1.5 rounded-full real-glassmorphism">
            360° REVERSE SCRUB
          </span>
        </div>

        {/* Dynamic Caption Panel */}
        <div ref={captionRef} className="self-center mb-8 max-w-xl text-center">
          <div className="real-glassmorphism chrome-ring-border p-6 rounded-2xl backdrop-blur-2xl">
            <p className="text-xs uppercase tracking-widest text-zinc-400 font-mono mb-1">
              STRUCTURAL FORMATION
            </p>
            <h3 className="text-xl md:text-2xl font-light chrome-silver-text">
              Cardboard, Spools & Paper Cups Magnetically Snapping into Place
            </h3>
          </div>
        </div>
      </div>

      {/* Video Container Stage */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Front Video (0° - 180°) */}
        <video
          ref={frontVideoRef}
          src={frontVideoSrc}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover opacity-100 transition-opacity duration-300"
        />

        {/* Back Video (180° - 360°) */}
        <video
          ref={backVideoRef}
          src={backVideoSrc}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300"
        />
      </div>
    </div>
  );
};

export default AssemblySection;
