"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const HeroPinSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    const card = cardRef.current;

    if (!container || !video) return;

    const setupHeroScroll = () => {
      const duration = video.duration || 10;

      // Pinned timeline over 250vh scroll distance
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          scroller: "#abstract-scroll-container",
          start: "top top",
          end: "+=250%",
          pin: true,
          scrub: 0.8, // Smooth connection to scroll wheel
          anticipatePin: 1,
        },
      });

      // Scrub background.mp4 from 0 to video duration
      tl.fromTo(
        video,
        { currentTime: 0 },
        { currentTime: duration, ease: "none", duration: 3 }
      );

      // Fade out the hero glass card near the end of the video sequence
      if (card) {
        tl.to(card, { opacity: 0, y: -40, duration: 0.6 }, "-=0.8");
      }
    };

    if (video.readyState >= 1) {
      setupHeroScroll();
    } else {
      video.onloadedmetadata = setupHeroScroll;
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background Video (background.mp4) */}
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>

      {/* Hero Glassmorphism Content Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 pointer-events-none">
        <div
          ref={cardRef}
          className="real-glassmorphism chrome-ring-border max-w-3xl p-10 md:p-16 rounded-3xl text-center backdrop-blur-3xl shadow-2xl transition-all pointer-events-auto"
        >
          <span className="text-xs font-mono uppercase tracking-[0.4em] text-zinc-400 mb-4 block">
            VISUAL STUDY // HANSIKA JAIN
          </span>
          <h1 className="text-4xl md:text-7xl font-extralight tracking-tight uppercase chrome-silver-text mb-6">
            THE ART OF ABSTRACT
          </h1>
          <p className="text-sm md:text-base text-zinc-300 font-light tracking-wide max-w-xl mx-auto leading-relaxed">
            Scroll down to control the structure. The viewport locks in place until the ambient tape and plastic sequence unfolds.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroPinSection;
