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
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // SCROLL TRIGGER: Video ONLY plays / scrubs when user scrolls!
  useEffect(() => {
    const container = containerRef.current;
    const vid = videoRef.current;
    if (!container || !vid) return;

    // Explicitly pause video so it ONLY updates on scroll
    vid.pause();

    const initScrollScrubber = () => {
      vid.pause();
      const dur = vid.duration || 10;

      ScrollTrigger.create({
        trigger: container,
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
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
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
      </motion.div>

      {/* Floating 3D Tilt Glass Card Hero Content */}
      <motion.div
        style={{ opacity: textOpacity }}
        className="relative z-10 max-w-4xl px-6 text-center"
      >
        <div className="real-glassmorphism chrome-ring-border p-10 md:p-16 rounded-3xl backdrop-blur-3xl shadow-2xl">
          <span className="text-xs font-mono uppercase tracking-[0.4em] text-zinc-400 mb-4 block">
            VISUAL STUDY // HANSIKA JAIN
          </span>
          <h1 className="text-4xl md:text-7xl font-extralight tracking-tight uppercase chrome-silver-text mb-6">
            THE ART OF ABSTRACT
          </h1>
          <p className="text-sm md:text-base text-zinc-300 font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
            An exploration of raw object placement, shrink-wrap tension, masking tape moulding, and fabric duality.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
