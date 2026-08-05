"use client";

import React, { useEffect, useRef, useState } from "react";

export const AssemblyPinSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const frontVideoRef = useRef<HTMLVideoElement>(null);
  const backVideoRef = useRef<HTMLVideoElement>(null);
  const [hudBadgeText, setHudBadgeText] = useState("FRONT ANGLE (0° → 180°)");
  const [statusText, setStatusText] = useState("Objects Flying Inward & Locking onto Front Form");

  useEffect(() => {
    const frontVid = frontVideoRef.current;
    const backVid = backVideoRef.current;

    if (!frontVid || !backVid) return;

    let intervalId: ReturnType<typeof setInterval>;
    let phase: "front" | "back" = "front";

    const startReverseLoop = async () => {
      frontVid.muted = true;
      backVid.muted = true;

      // Keep media decoding pipeline active for real-time reverse seeking
      await frontVid.play().catch(() => {});
      await backVid.play().catch(() => {});

      const frontDur = frontVid.duration || 10;
      const backDur = backVid.duration || 10;

      frontVid.currentTime = frontDur;
      backVid.currentTime = backDur;
      frontVid.style.opacity = "1";
      backVid.style.opacity = "0";

      // 25 FPS smooth reverse playback loop (40ms interval)
      intervalId = setInterval(() => {
        if (phase === "front") {
          if (frontVid.currentTime <= 0.2) {
            // Transition to Back Video reverse
            phase = "back";
            frontVid.style.opacity = "0";
            backVid.style.opacity = "1";
            backVid.currentTime = backVid.duration || 10;
            setHudBadgeText("BACK ANGLE (180° → 360°)");
            setStatusText("Tape, Spools & Cardboard Snapping onto Back Form");
          } else {
            frontVid.currentTime = Math.max(0, frontVid.currentTime - 0.04);
          }
        } else if (phase === "back") {
          if (backVid.currentTime <= 0.2) {
            // Transition back to Front Video reverse
            phase = "front";
            backVid.style.opacity = "0";
            frontVid.style.opacity = "1";
            frontVid.currentTime = frontVid.duration || 10;
            setHudBadgeText("FRONT ANGLE (0° → 180°)");
            setStatusText("Objects Flying Inward & Locking onto Front Form");
          } else {
            backVid.currentTime = Math.max(0, backVid.currentTime - 0.04);
          }
        }
      }, 40);
    };

    if (frontVid.readyState >= 1 && backVid.readyState >= 1) {
      startReverseLoop();
    } else {
      frontVid.onloadedmetadata = () => {
        if (backVid.readyState >= 1) startReverseLoop();
      };
      backVid.onloadedmetadata = () => {
        if (frontVid.readyState >= 1) startReverseLoop();
      };
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
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
