import { HeroSection } from "@/components/art-of-abstract/HeroSection";
import { AssemblySection } from "@/components/art-of-abstract/AssemblySection";
import { PatternSection } from "@/components/art-of-abstract/PatternSection";

export default function ArtOfAbstractPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      {/* Phase 1: Hero with Background Video Blur & Scroll Scrub */}
      <HeroSection bgVideoSrc="/background.mp4" />

      {/* Phase 2: Dual Video Reverse Scrubbing */}
      <AssemblySection
        frontVideoSrc="/front.mp4"
        backVideoSrc="/back.mp4"
      />

      {/* Phase 3: Marked Pattern Lines & Unpeel Preview */}
      <PatternSection />
    </main>
  );
}
