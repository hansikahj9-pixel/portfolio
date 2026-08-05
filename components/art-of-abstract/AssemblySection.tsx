"use client";

import React, { useEffect, useRef, useState } from "react";
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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [phaseProgress, setPhaseProgress] = useState<string>("0° / 360°");

  useEffect(() => {
    const container = containerRef.current;
    const frontVid = frontVideoRef.current;
    const backVid = backVideoRef.current;
    const canvas = canvasRef.current;

    if (!container || !frontVid || !backVid || !canvas) return;

    frontVid.pause();
    backVid.pause();

    const ctx = canvas.getContext("2d");

    let animFrameId: number;
    let targetProgress = 0;
    let currentProgress = 0;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const render = () => {
      // Smooth lerp dampening for butter-smooth, ultra-deliberate scroll motion
      currentProgress += (targetProgress - currentProgress) * 0.05;

      const degrees = Math.round(currentProgress * 360);
      setPhaseProgress(`${degrees}° / 360°`);

      if (ctx) {
        const frontDur = frontVid.duration || 10;
        const backDur = backVid.duration || 10;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (currentProgress <= 0.5) {
          // PHASE 1: Front Video Reverse Scrub (0° to 180°)
          const norm1 = currentProgress / 0.5; // 0 -> 1
          if (frontVid.duration) {
            frontVid.currentTime = frontDur * (1 - norm1);
          }
          try {
            ctx.globalAlpha = 1;
            ctx.drawImage(frontVid, 0, 0, canvas.width, canvas.height);
          } catch {
            // ignore draw errors during seek
          }
        } else {
          // PHASE 2: Back Video Reverse Scrub (180° to 360°)
          const norm2 = (currentProgress - 0.5) / 0.5; // 0 -> 1
          if (backVid.duration) {
            backVid.currentTime = backDur * (1 - norm2);
          }
          try {
            ctx.globalAlpha = 1;
            ctx.drawImage(backVid, 0, 0, canvas.width, canvas.height);
          } catch {
            // ignore draw errors during seek
          }
        }
      }

      animFrameId = requestAnimationFrame(render);
    };

    const initScrubber = () => {
      frontVid.pause();
      backVid.pause();
      render();

      ScrollTrigger.create({
        trigger: container,
        scroller: "#abstract-scroll-container",
        start: "top top",
        end: "+=350%",
        pin: true,
        scrub: 1.5, // Slowed down speed for luxurious smooth control
        anticipatePin: 1,
        onUpdate: (self) => {
          targetProgress = self.progress;
        },
      });

      ScrollTrigger.refresh();
    };

    if (frontVid.readyState >= 1 && backVid.readyState >= 1) {
      initScrubber();
    } else {
      frontVid.onloadedmetadata = initScrubber;
      backVid.onloadedmetadata = initScrubber;
    }

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-zinc-950 overflow-hidden">
      {/* Offscreen Video Elements */}
      <video
        ref={frontVideoRef}
        src={frontVideoSrc}
        muted
        playsInline
        preload="auto"
        className="hidden"
      />
      <video
        ref={backVideoRef}
        src={backVideoSrc}
        muted
        playsInline
        preload="auto"
        className="hidden"
      />

      {/* Real Glassmorphism HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-6 md:p-14">
        <div className="flex justify-between items-center">
          <span className="text-xs uppercase tracking-[0.3em] text-zinc-400 font-mono">
            PHASE 02 // TACTILE MOULD ASSEMBLY
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-zinc-300 border border-zinc-700 px-4 py-1.5 rounded-full real-glassmorphism">
              {phaseProgress}
            </span>
            <span className="text-xs font-mono text-zinc-300 border border-zinc-700 px-4 py-1.5 rounded-full real-glassmorphism">
              360° REVERSE COMBINED STAGE
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

      {/* Single Unified Canvas Stage (Zero Blanking / Zero Flicker) */}
      <div className="relative w-full h-full flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default AssemblySection;
