import { Link } from 'react-router-dom';

export default function MartialArtsSection() {
  return (
    <section className="martial-arts-section">
      <div className="martial-arts-text">
        <p className="eyebrow">More Than Boxing</p>
        <h2>Martial Arts as a Tool, Not the Point</h2>
        <p>
          Boxing and martial arts training give our youth a healthy outlet for stress, a path to
          discipline, and a mental-health tool that supports everything else we do. It's how we
          build the confidence and resilience our advocacy and education programs need to stick.
        </p>
        <Link to="/mma-events/tickets" className="secondary-button">
          Support Our Nov 21 Boxing Event
        </Link>
      </div>

      <div className="martial-arts-image">
        <img src="/misc/shop-boxing.jpg" alt="Boxing training session" />
      </div>
    </section>
  );
}
