"use client";

import React from "react";
import { motion } from "framer-motion";

export const PatternSection: React.FC = () => {
  return (
    <section className="relative w-full min-h-screen bg-black py-24 px-6 md:px-16 flex flex-col justify-center items-center overflow-hidden">
      {/* Background Accent Grid / Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-5xl w-full">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono uppercase tracking-[0.4em] text-zinc-400 mb-3 block">
            PHASE 03 // MARKED PATTERNS & UNPEEL PREVIEW
          </span>
          <h2 className="text-3xl md:text-5xl font-extralight uppercase chrome-silver-text">
            Architectural Dissection & Mould Deconstruction
          </h2>
        </motion.div>

        {/* Grid of Pattern & Mould Analysis Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="real-glassmorphism chrome-ring-border p-8 rounded-2xl flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-mono text-zinc-400 block mb-2">01 // MARKED PATTERN LINES</span>
              <h3 className="text-xl font-light chrome-silver-text mb-4">Precision Tension Strips</h3>
              <p className="text-sm text-zinc-300 font-light leading-relaxed mb-6">
                Analyzing seam placement, shrink-wrap compression vectors, and tactile geometry formed across everyday household foundations.
              </p>
            </div>
            <div className="h-48 rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden relative flex items-center justify-center">
              <svg className="w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                <line x1="10%" y1="20%" x2="90%" y2="80%" stroke="#ffffff" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="10%" y1="80%" x2="90%" y2="20%" stroke="#ffffff" strokeWidth="1" strokeDasharray="4 4" />
              </svg>
              <span className="absolute text-xs font-mono text-zinc-400 bg-zinc-950/80 px-3 py-1 rounded-full border border-zinc-700">
                PATTERN VECTOR ANALYSIS
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="real-glassmorphism chrome-ring-border p-8 rounded-2xl flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-mono text-zinc-400 block mb-2">02 // UNPEEL PREVIEW</span>
              <h3 className="text-xl font-light chrome-silver-text mb-4">Shell Separation & Mould Extraction</h3>
              <p className="text-sm text-zinc-300 font-light leading-relaxed mb-6">
                Transitioning from raw taped volume to self-supporting fabric structures through careful unpeeling of outer tension shells.
              </p>
            </div>
            <div className="h-48 rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden relative flex items-center justify-center p-6 text-center">
              <div className="border border-zinc-700/60 real-glassmorphism px-6 py-4 rounded-xl">
                <p className="text-xs font-mono text-zinc-300 tracking-wider">
                  TACTILE MOULD RELEASE STATE
                </p>
                <p className="text-xs text-zinc-400 mt-2 font-mono">
                  [99.4% STRUCTURAL INTEGRITY PRESERVED]
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PatternSection;
