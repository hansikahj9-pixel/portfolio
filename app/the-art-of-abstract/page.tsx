import { HeroSection } from "@/components/art-of-abstract/HeroSection";
import { AssemblySection } from "@/components/art-of-abstract/AssemblySection";
import { PatternSection } from "@/components/art-of-abstract/PatternSection";

export default function ArtOfAbstractPage() {
  return (
    <div id="abstract-scroll-container" className="abstract-scroll-container bg-black text-white">
      {/* Phase 1: Hero with Background Video Blur & Scroll Scrub */}
      <HeroSection bgVideoSrc="/background.mp4" />

      {/* Phase 2: Dual Video Reverse Scrubbing Stage */}
      <AssemblySection
        frontVideoSrc="/front.mp4"
        backVideoSrc="/back.mp4"
      />

      {/* Phase 3: Marked Pattern Lines & Unpeel Preview */}
      <PatternSection />
    </div>
  );
}
