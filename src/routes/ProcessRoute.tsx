import AxiomeGlobalNav from '../components/AxiomeGlobalNav';
import ShatterImage from '../components/ShatterImage';
import LiquidImage from '../components/LiquidImage';

// Ernst Images
import img2 from '../assets/image (2).png';
import img3 from '../assets/image (3).png';
import img4 from '../assets/image (4).png';
import img5 from '../assets/image (5).png';
import img6 from '../assets/image (6).png';
import img7 from '../assets/image (7).png';
import img8 from '../assets/image (8).png';
import img9 from '../assets/image (9).png';
import img10 from '../assets/image (10).png';

// Dali Images
import dali1 from '../assets/clock.jpg';
import dali2 from '../assets/Salvador Dalí.jpg';
import dali3 from '../assets/Salvador Dali - Oil on canvas, signed, artwork.jpg';
import dali4 from '../assets/download (1).jpg';
import dali5 from '../assets/Garden but Salvador Dali style.jpg';
import dali6 from '../assets/image (15).png';
import dali7 from '../assets/image (13).png';
import dali8 from '../assets/image (12).png';
import dali9 from '../assets/image (11).png';

export default function ProcessRoute() {
  return (
    <div className="process-container">
      {/* ── Global Navigation ── */}
      <AxiomeGlobalNav />

      {/* ── Section 1: Split Screen Manifesto ── */}
      <section className="process-section">
        <main className="process-grid">
          {/* ── Left Column: Meaning ── */}
          <section className="process-left fade-in">
            <h1 className="process-heading">THE AXIOME</h1>
            <h2 className="process-subheading">Bridging the gap between fashion and art.</h2>
            <p className="process-body">
              An axiom is a self-evident truth. But here, the truth is found in the irrational. 
              Axiome creates garments that embody the emotional intensity, symbolism, and visual 
              language of surrealism. These are not just clothes; they are wearable expressions 
              of inner narratives.
            </p>
          </section>

          {/* ── Right Column: Inspiration ── */}
          <section className="process-right fade-in-delayed">
            {/* Rotating Dream Orb Background */}
            <div className="dream-orb"></div>
            
            <div className="process-right-content">
              <h3 className="inspiration-heading">THE INSPIRATION.</h3>
              <p className="process-body">
                Rooted in a deep understanding of dreams and the unconscious, every silhouette 
                challenges conventional norms. Inspired by the melting, viscous realities of 
                Salvador Dalí and the meticulous, biomorphic structures of Max Ernst, the 
                collection blurs the lines between fantasy and reality.
              </p>
            </div>
          </section>
        </main>
        
        {/* ── Scroll Indicator ── */}
        <div className="process-scroll-indicator fade-in-delayed">
          <span>SCROLL</span>
          <div className="process-scroll-arrow">↓</div>
        </div>
      </section>

      {/* ── Section 2: Max Ernst Structure ── */}
      <section className="process-section ernst-section">
        <div className="ernst-left fade-in">
          <h2 className="ernst-heading">Max Ernst</h2>
          <p className="ernst-body">
            Max Ernst's surrealist pieces are characterized by a sense of structure and form, often using defined lines, layers, and textures to create a sense of depth and mystery. This inspired the collection's structured silhouettes, which aim to evoke a sense of intrigue and complexity... These silhouettes bring a contrast to the fluidity, grounding the dreamlike with elements that have a sense of precision and architectural form.
          </p>
        </div>
        
        <div className="ernst-right fade-in-delayed">
          <div className="ernst-grid">
            {[img2, img3, img4, img5, img6, img7, img8, img9, img10].map((img, index) => (
              <div key={index} className="ernst-card">
                <ShatterImage 
                  imageUrl={img} 
                  alt={`Max Ernst inspiration ${index + 1}`} 
                  autoTrigger={true}
                  staggerDelay={index * 0.4}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Salvador Dalí Fluidity ── */}
      <section className="process-section dali-section">
        <div className="dali-left fade-in-delayed">
          <div className="dali-grid">
            <div className="dali-card"><LiquidImage imageUrl={dali1} alt="Dalí inspiration 1" /></div>
            <div className="dali-card"><LiquidImage imageUrl={dali2} alt="Dalí inspiration 2" /></div>
            <div className="dali-card"><LiquidImage imageUrl={dali3} alt="Dalí inspiration 3" /></div>
            <div className="dali-card"><LiquidImage imageUrl={dali4} alt="Dalí inspiration 4" /></div>
            <div className="dali-card"><LiquidImage imageUrl={dali5} alt="Dalí inspiration 5" /></div>
            <div className="dali-card"><LiquidImage imageUrl={dali6} alt="Dalí inspiration 6" /></div>
            <div className="dali-card"><LiquidImage imageUrl={dali7} alt="Dalí inspiration 7" /></div>
            <div className="dali-card"><LiquidImage imageUrl={dali8} alt="Dalí inspiration 8" /></div>
            <div className="dali-card"><LiquidImage imageUrl={dali9} alt="Dalí inspiration 9" /></div>
          </div>
        </div>

        <div className="dali-right fade-in">
          <h2 className="dali-heading">Salvador Dalí</h2>
          <p className="dali-body">
            Dalí's artwork often features fluid, melting, and dreamlike forms that defy gravity... These silhouettes aim to mirror the organic, unpredictable movement seen in Dalí's work, emphasizing the idea of fluidity and transformation in a surreal, otherworldly way.
          </p>
        </div>
      </section>
    </div>
  );
}
