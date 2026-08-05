import { HeroPinSection } from "../../components/art-of-abstract/HeroPinSection";
import { AssemblyPinSection } from "../../components/art-of-abstract/AssemblyPinSection";

export default function ArtOfAbstractRoute() {
  return (
    <div id="abstract-scroll-container" className="abstract-scroll-container bg-black text-white">
      {/* Pinned Section 1: Background Video Scrub */}
      <HeroPinSection />

      {/* Large minimalist luxury transition spacing */}
      <div className="w-full h-[60vh] bg-black flex items-center justify-center pointer-events-none select-none">
        <div className="w-[1px] h-32 bg-gradient-to-b from-zinc-800 to-transparent opacity-40" />
      </div>

      {/* Pinned Section 2: Combined Front & Back Reverse Assembly */}
      <AssemblyPinSection />
    </div>
  );
}
