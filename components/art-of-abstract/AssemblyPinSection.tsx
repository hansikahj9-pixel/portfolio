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

    let rafId: number;
    let lastTimestamp = 0;
    let phase: "front" | "back" = "front";
    let isPlaying = false;

    const resetSequence = () => {
      const frontDur = frontVid.duration || 10;
      const backDur = backVid.duration || 10;

      phase = "front";
      if (!frontVid.seeking && frontVid.readyState >= 2) frontVid.currentTime = frontDur;
      if (!backVid.seeking && backVid.readyState >= 2) backVid.currentTime = backDur;

      frontVid.style.opacity = "1";
      backVid.style.opacity = "0";

      setHudBadgeText("FRONT ANGLE (0° → 180°)");
      setStatusText("Objects Flying Inward & Locking onto Front Form");
    };

    // Smooth RAF continuous reverse loop engine
    const loopStep = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const delta = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
      lastTimestamp = timestamp;

      if (isPlaying) {
        const frontDur = frontVid.duration || 10;
        const backDur = backVid.duration || 10;

        if (phase === "front") {
          if (!frontVid.seeking && frontVid.readyState >= 2) {
            let nextTime = frontVid.currentTime - delta;
            if (nextTime <= 0.05) {
              // Transition to back video reverse
              phase = "back";
              frontVid.currentTime = 0;
              frontVid.style.opacity = "0";
              backVid.style.opacity = "1";
              backVid.currentTime = backDur;
              setHudBadgeText("BACK ANGLE (180° → 360°)");
              setStatusText("Tape, Spools & Cardboard Snapping onto Back Form");
            } else {
              frontVid.currentTime = nextTime;
            }
          }
        } else if (phase === "back") {
          if (!backVid.seeking && backVid.readyState >= 2) {
            let nextTime = backVid.currentTime - delta;
            if (nextTime <= 0.05) {
              // Loop back to front video reverse
              phase = "front";
              backVid.currentTime = 0;
              backVid.style.opacity = "0";
              frontVid.style.opacity = "1";
              frontVid.currentTime = frontDur;
              setHudBadgeText("FRONT ANGLE (0° → 180°)");
              setStatusText("Objects Flying Inward & Locking onto Front Form");
            } else {
              backVid.currentTime = nextTime;
            }
          }
        }
      }

      rafId = requestAnimationFrame(loopStep);
    };

    // Auto-trigger sequence when scrolled into view
    const st = ScrollTrigger.create({
      trigger: container,
      scroller: "#abstract-scroll-container",
      start: "top 80%",
      end: "bottom top",
      onEnter: () => {
        resetSequence();
        isPlaying = true;
        lastTimestamp = 0;
      },
      onEnterBack: () => {
        isPlaying = true;
      },
      onLeave: () => {
        isPlaying = false;
      },
      onLeaveBack: () => {
        isPlaying = false;
      },
    });

    rafId = requestAnimationFrame(loopStep);

    return () => {
      cancelAnimationFrame(rafId);
      st.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-zinc-950 overflow-hidden py-12">
      {/* HUD Elements & Status Bar */}
      <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-8 md:p-16">
        <div className="flex justify-between items-center">
          <span className="text-xs uppercase tracking-[0.3em] text-zinc-400 font-mono">
            PHASE 02 // REVERSE MOULD ASSEMBLY (AUTO LOOP)
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
