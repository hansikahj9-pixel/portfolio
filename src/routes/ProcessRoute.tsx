import mindMap from '../assets/Mind map.png';
import random from '../assets/Random.png';
import fabricBoard from '../assets/Fabric board.png';
import silhouetteBoard from '../assets/Silhoutte board.mp4';
import moodBoard from '../assets/Mood board.mp4';

export default function ProcessRoute() {
  return (
    <div className="bifold-viewport">
      <div className="bifold-wrapper">
        {/* Left Column: Process (Clinical) */}
        <section className="bifold-column">
          <div className="column-stack">
            <div className="bifold-board stagger-left">
              <img src={mindMap} alt="Mind Map" />
            </div>
            <div className="bifold-board stagger-right">
              <img src={random} alt="Random Process" />
            </div>
            <div className="bifold-board stagger-left">
              <img src={fabricBoard} alt="Fabric Board" />
            </div>
          </div>
        </section>

        {/* Right Column: Inspiration (Pretty) */}
        <section className="bifold-column">
          <div className="column-stack">
            <div className="bifold-board stagger-left">
              <video src={silhouetteBoard} loop muted autoPlay playsInline />
            </div>
            <div className="bifold-board stagger-right">
              <video src={moodBoard} loop muted autoPlay playsInline />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
