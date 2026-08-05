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

  const videoBlur = useTransform(scrollYProgress, [0, 1], ["blur(0px)", "blur(20px)"]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // PINNED HERO SCROLLTRIGGER: Screen stays pinned until video finishes playing forward!
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
        end: "+=200%",
        pin: true,
        scrub: 1.0,
        anticipatePin: 1,
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
      {/* Background Video with Pinned Scroll Scrubber */}
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
          className="w-full h-full object-cover opacity-80"
        />
        {/* Dark Editorial Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none" />
      </motion.div>

      {/* High-Fashion Editorial Hero Content */}
      <motion.div
        style={{ opacity: textOpacity }}
        className="relative z-10 max-w-7xl px-6 text-center flex flex-col items-center justify-center pointer-events-none"
      >
        {/* Pill Badge */}
        <div className="mb-8 inline-flex items-center gap-2 px-5 py-2 rounded-full real-glassmorphism chrome-ring-border">
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
