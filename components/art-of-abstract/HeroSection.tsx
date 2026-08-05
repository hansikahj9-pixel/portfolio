"use client";

import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  bgVideoSrc: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ bgVideoSrc }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const videoBlur = useTransform(scrollYProgress, [0, 1], ["blur(0px)", "blur(24px)"]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    const container = containerRef.current;
    const vid = videoRef.current;
    const canvas = canvasRef.current;
    if (!container || !vid || !canvas) return;

    vid.pause();
    const ctx = canvas.getContext("2d");

    let animFrameId: number;
    let targetProgress = 0;
    let currentProgress = 0;

    const render = () => {
      // Smooth lerp dampening (slower, butter-smooth motion)
      currentProgress += (targetProgress - currentProgress) * 0.06;

      if (vid.duration && ctx) {
        vid.currentTime = currentProgress * vid.duration;
        try {
          ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
        } catch {
          // ignore seek frame draw errors
        }
      }
      animFrameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const initScrollScrubber = () => {
      vid.pause();
      render();

      ScrollTrigger.create({
        trigger: container,
        scroller: "#abstract-scroll-container",
        start: "top top",
        end: "bottom top",
        scrub: 0.5,
        onUpdate: (self) => {
          targetProgress = self.progress;
        },
      });

      ScrollTrigger.refresh();
    };

    if (vid.readyState >= 1) {
      initScrollScrubber();
    } else {
      vid.onloadedmetadata = initScrollScrubber;
    }

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-black flex flex-col items-center justify-center">
      {/* Offscreen Video Element */}
      <video
        ref={videoRef}
        src={bgVideoSrc}
        muted
        playsInline
        preload="auto"
        className="hidden"
      />

      {/* Canvas Video Stage (Zero Blanking / Zero Flicker) */}
      <motion.div
        style={{ filter: videoBlur, scale: videoScale }}
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover opacity-75"
        />
        {/* Dark Editorial Radial Overlay */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black/90 pointer-events-none" />
      </motion.div>

      {/* High-Fashion Editorial Hero Content */}
      <motion.div
        style={{ opacity: textOpacity }}
        className="relative z-10 max-w-7xl px-6 text-center flex flex-col items-center justify-center"
      >
        {/* Pill Badge */}
        <div className="mb-6 inline-flex items-center gap-2 px-5 py-2 rounded-full real-glassmorphism chrome-ring-border">
          <span className="w-2 h-2 rounded-full bg-zinc-300 animate-pulse" />
          <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.4em] text-zinc-300">
            VISUAL STUDY // HANSIKA JAIN
          </span>
        </div>

        {/* Massive Molten Chrome Silver Ring Heading */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[10.5rem] font-light tracking-tighter uppercase leading-none molten-chrome-text drop-shadow-2xl">
          THE ART OF ABSTRACT
        </h1>
      </motion.div>
    </div>
  );
};

export default HeroSection;
