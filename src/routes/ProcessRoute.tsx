import mindMap from '../assets/Mind map.png';
import random from '../assets/Random.png';
import fabricBoard from '../assets/Fabric board.png';

export default function ProcessRoute() {
  return (
    <div className="bifold-viewport">
      <div className="bifold-wrapper" style={{ width: '100vw' }}>
        {/* Only Column: Process (Clinical) */}
        <section className="bifold-column" style={{ width: '100vw' }}>
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
      </div>
    </div>
  );
}
