"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const AssemblyPinSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const frontVideoRef = useRef<HTMLVideoElement>(null);
  const backVideoRef = useRef<HTMLVideoElement>(null);
  const [hudBadgeText, setHudBadgeText] = useState("FRONT ANGLE (0° → 180°)");
  const [statusText, setStatusText] = useState("Objects Flying Inward & Locking onto Front Form");

  useEffect(() => {
    const container = containerRef.current;
    const frontVid = frontVideoRef.current;
    const backVid = backVideoRef.current;

    if (!container || !frontVid || !backVid) return;

    const setupAssemblyScroll = () => {
      const frontDur = frontVid.duration || 10;
      const backDur = backVid.duration || 10;

      // Pinned timeline over 350vh scroll distance
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          scroller: "#abstract-scroll-container",
          start: "top top",
          end: "+=350%",
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (self.progress < 0.5) {
              setHudBadgeText("FRONT ANGLE (0° → 180°)");
              setStatusText("Objects Flying Inward & Locking onto Front Form");
            } else {
              setHudBadgeText("BACK ANGLE (180° → 360°)");
              setStatusText("Tape, Spools & Cardboard Snapping onto Back Form");
            }
          },
        },
      });

      // 1. Scrub front.mp4 BACKWARDS (Duration -> 0)
      tl.fromTo(
        frontVid,
        { currentTime: frontDur },
        { currentTime: 0, ease: "none", duration: 2 }
      )
      // 2. Crossfade Front -> Back Video
      .to(frontVid, { opacity: 0, duration: 0.5 }, "crossfade")
      .to(backVid, { opacity: 1, duration: 0.5 }, "crossfade")
      // 3. Scrub back.mp4 BACKWARDS (Duration -> 0)
      .fromTo(
        backVid,
        { currentTime: backDur },
        { currentTime: 0, ease: "none", duration: 2 }
      );
    };

    if (frontVid.readyState >= 1 && backVid.readyState >= 1) {
      setupAssemblyScroll();
    } else {
      frontVid.onloadedmetadata = setupAssemblyScroll;
      backVid.onloadedmetadata = setupAssemblyScroll;
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-zinc-950 overflow-hidden">
      {/* HUD Elements & Status Bar */}
      <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-8 md:p-16">
        <div className="flex justify-between items-center">
          <span className="text-xs uppercase tracking-[0.3em] text-zinc-400 font-mono">
            PHASE 02 // REVERSE MOULD ASSEMBLY
          </span>
          <span className="text-xs font-mono text-zinc-300 border border-zinc-700 px-4 py-1.5 rounded-full real-glassmorphism">
            {hudBadgeText}
          </span>
        </div>

        {/* Dynamic Glass Status Banner */}
        <div className="self-center mb-6 max-w-xl text-center">
          <div className="real-glassmorphism chrome-ring-border p-6 rounded-2xl">
            <h3 className="text-lg md:text-xl font-light chrome-silver-text">
              {statusText}
            </h3>
          </div>
        </div>
      </div>

      {/* Video Stage Frame */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Front Video (front.mp4) */}
        <video
          ref={frontVideoRef}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover opacity-100 transition-opacity duration-500"
        >
          <source src="/front.mp4" type="video/mp4" />
        </video>

        {/* Back Video (back.mp4) */}
        <video
          ref={backVideoRef}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500"
        >
          <source src="/back.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
};

export default AssemblyPinSection;
