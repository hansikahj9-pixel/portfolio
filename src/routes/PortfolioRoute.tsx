import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ProjectList from '../components/ProjectList';

export default function PortfolioRoute() {

  return (
    <>
      {/* UI Layer: Contains natural scroll independent from canvas */}

      {/* UI Layer: Contains natural scroll independent from canvas */}
      <div className="portfolio-scroll-container">
        <Navbar />
        <HeroSection />

        <ProjectList />

        <footer className="footer">
          <span className="footer-text">
            © 2026 Hansika Jain — All Rights Reserved
          </span>
          <span className="footer-text">Fashion Design Portfolio</span>
        </footer>
      </div>
    </>
  );
}
