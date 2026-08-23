import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-text">
        <h1>
          Justice, Education, and Safety <span>for the Youth Who Need It Most</span>
        </h1>

        <p>
          Boxing for Justice is an advocacy and youth-education nonprofit — building
          confidence, resilience, and life skills in the young people and communities we serve.
        </p>

        <Link to="#impact" className="main-button">
          See Our Impact
        </Link>

        <Link to="/mma-events/tickets" className="secondary-button" style={{ marginLeft: 16 }}>
          Support Our Nov 21 Event
        </Link>
      </div>

      <div className="hero-image">
        <img src="/home-boxing.jpg" alt="Boxing for Justice community program" />
      </div>
    </section>
  );
}
