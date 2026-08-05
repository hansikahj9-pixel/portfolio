import { HeroPinSection } from "@/components/art-of-abstract/HeroPinSection";
import { AssemblyPinSection } from "@/components/art-of-abstract/AssemblyPinSection";

export default function ArtOfAbstractPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      {/* Pinned Section 1: Background Video Scrub */}
      <HeroPinSection />

      {/* Pinned Section 2: Combined Front & Back Reverse Assembly */}
      <AssemblyPinSection />
    </main>
  );
}
