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

    let rafId: number;
    let targetTime = 0;

    // Smooth RAF loop to update video currentTime without decoder congestion
    const renderLoop = () => {
      if (video && !video.seeking && video.readyState >= 2) {
        const diff = Math.abs(video.currentTime - targetTime);
        if (diff > 0.04) {
          video.currentTime = targetTime;
        }
      }
      rafId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    const setupHeroScroll = () => {
      const duration = video.duration || 10;

      const proxy = { time: 0 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          scroller: "#abstract-scroll-container",
          start: "top top",
          end: "+=250%",
          pin: true,
          pinType: "transform",
          scrub: 0.5,
          anticipatePin: 1,
        },
      });

      // Scrub proxy time smoothly
      tl.to(proxy, {
        time: duration,
        ease: "none",
        duration: 3,
        onUpdate: () => {
          targetTime = proxy.time;
        },
      });

      // Fade out hero card near the end
      if (card) {
        tl.to(card, { opacity: 0, y: -40, duration: 0.6 }, "-=0.8");
      }

      ScrollTrigger.refresh();
    };

    if (video.readyState >= 1) {
      setupHeroScroll();
    } else {
      video.onloadedmetadata = setupHeroScroll;
    }

    return () => {
      cancelAnimationFrame(rafId);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background Video */}
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>

      {/* Hero Content */}
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
