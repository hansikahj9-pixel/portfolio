import { HeroPinSection } from "../../components/art-of-abstract/HeroPinSection";
import { AssemblyPinSection } from "../../components/art-of-abstract/AssemblyPinSection";

export default function ArtOfAbstractRoute() {
  return (
    <div id="abstract-scroll-container" className="abstract-scroll-container bg-black text-white">
      {/* Pinned Section 1: Background Video Scrub */}
      <HeroPinSection />

      {/* Pinned Section 2: Combined Front & Back Reverse Assembly */}
      <AssemblyPinSection />
    </div>
  );
}
