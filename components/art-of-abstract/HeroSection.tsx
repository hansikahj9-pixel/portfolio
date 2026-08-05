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

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Camera Lens Blur & Scale effect on scroll
  const videoBlur = useTransform(scrollYProgress, [0, 1], ["blur(0px)", "blur(24px)"]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // SCROLL TRIGGER: Video ONLY plays / scrubs when user scrolls inside #abstract-scroll-container!
  useEffect(() => {
    const container = containerRef.current;
    const vid = videoRef.current;
    if (!container || !vid) return;

    vid.pause();

    const initScrollScrubber = () => {
      vid.pause();
      const dur = vid.duration || 10;

      ScrollTrigger.create({
        trigger: container,
        scroller: "#abstract-scroll-container",
        start: "top top",
        end: "bottom top",
        scrub: 0.5,
        onUpdate: (self) => {
          if (vid.duration) {
            vid.pause();
            vid.currentTime = self.progress * dur;
          }
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
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-black flex flex-col items-center justify-center">
      {/* Background Video with Framer Motion Lens Blur & Scroll Scrubber */}
      <motion.div
        style={{ filter: videoBlur, scale: videoScale }}
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        <video
          ref={videoRef}
          src={bgVideoSrc}
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover opacity-70"
        />
        {/* Dark Editorial Radial Gradient Overlay */}
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
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[10.5rem] font-light tracking-tighter uppercase leading-none molten-chrome-text mb-6 drop-shadow-2xl">
          THE ART OF ABSTRACT
        </h1>

        {/* Editorial Subhead */}
        <p className="text-sm sm:text-base md:text-lg text-zinc-300 font-light tracking-widest max-w-3xl mx-auto leading-relaxed uppercase font-mono">
          Raw object placement // Shrink-wrap tension // Masking tape moulding // Fabric duality
        </p>

        {/* Scroll Callout */}
        <div className="mt-12 flex flex-col items-center gap-2 opacity-80">
          <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-400 uppercase">
            SCROLL TO UNVEIL 360° MOULD ASSEMBLY
          </span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-zinc-400 to-transparent animate-bounce" />
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
