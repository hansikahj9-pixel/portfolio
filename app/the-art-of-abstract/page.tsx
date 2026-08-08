"use client";

export default function ArtOfAbstractPage() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#192020] flex flex-col justify-between select-none">
      {/* Top Left Back Navigation Link */}
      <div className="absolute top-8 left-8 z-30 pointer-events-auto">
        <a
          href="/"
          className="axiome-back-link cursor-pointer border-none bg-transparent outline-none pointer-events-auto"
        >
          <span className="axiome-back-arrow">←</span>
          BACK TO WORKS
        </a>
      </div>

      {/* Symmetrical Top Letterbox Spacer (79px on standard desktop) */}
      <div className="w-full h-[7.7vh] md:h-[79px] shrink-0 bg-[#192020]" />

      {/* Main Video Frame Content (866px height on standard desktop) */}
      <div className="relative w-full flex-1 bg-black overflow-hidden">
        {/* Looping Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover scale-105 opacity-55 pointer-events-none"
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>

        {/* Text Container aligned exactly to Figma specs (X:281, Y:301 -> right:97px, centered vertically) */}
        <div 
          className="absolute right-6 md:right-[97px] top-1/2 -translate-y-1/2 w-full max-w-[1062px] h-[421px] flex flex-col justify-center text-right z-20 pointer-events-none mix-blend-color-dodge"
          style={{ fontFamily: "'Life Savers', serif" }}
        >
          <h1
            className="font-bold whitespace-pre-wrap tracking-normal"
            style={{
              fontSize: "clamp(2rem, 15.97vw, 230px)",
              lineHeight: "1.1739", // Unitless multiplier matching exactly 270px / 230px for responsiveness
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(218, 218, 218, 0.65) 50%, rgba(255, 255, 255, 0.95) 75%, rgba(160, 160, 160, 0.5) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              WebkitTextStroke: "calc(4px + 0.6vw) #000000",
              paintOrder: "stroke fill",
              textShadow: "1px 1px 0px rgba(255, 255, 255, 0.55), -1px -1px 0px rgba(0, 0, 0, 0.35), 0px 8px 16px rgba(0, 0, 0, 0.4)"
            }}
          >
            {"The Art\nof\nAbstract          "}
          </h1>
        </div>
      </div>

      {/* Symmetrical Bottom Letterbox Spacer (79px on standard desktop) */}
      <div className="w-full h-[7.7vh] md:h-[79px] shrink-0 bg-[#192020]" />
    </div>
  );
}
