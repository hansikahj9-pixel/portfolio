import { HeroSection } from "@/components/art-of-abstract/HeroSection";
import { AssemblySection } from "@/components/art-of-abstract/AssemblySection";
import { PatternSection } from "@/components/art-of-abstract/PatternSection";

export default function ArtOfAbstractPage() {
  return (
    <div id="abstract-scroll-container" className="abstract-scroll-container bg-black text-white">
      {/* Phase 1: Hero with Video Pinned Play Forward */}
      <HeroSection bgVideoSrc="/background.mp4" />

      {/* Phase 2: Single Video 360 Reverse Assembly Stage */}
      <AssemblySection videoSrc="/Hyper_realistic_reverse_stop_m.mp4" />

      {/* Phase 3: Marked Pattern Lines & Unpeel Preview */}
      <PatternSection />
    </div>
  );
}
