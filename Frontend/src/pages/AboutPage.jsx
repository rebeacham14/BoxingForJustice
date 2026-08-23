import { useNavigate } from 'react-router-dom';
import SEO from '../components/common/SEO';
import TeamGrid from '../components/about/TeamGrid';
import { aboutInfoCards } from '../data/team';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="page about-page">
      <SEO
        title="About Boxing for Justice | Therapeutic Boxing for Trauma Support"
        description="Learn how Boxing for Justice helps people affected by trauma build confidence, resilience, and healthy coping skills through therapeutic boxing and supportive community programs."
      />

      <section className="page-hero">
        <div className="page-hero-text">
          <h1>
            About <span>Boxing for Justice</span>
          </h1>

          <p>
            Boxing For Justice fosters discipline and resilience. Providing underserved youth
            with the tools to succeed inside and outside the ring.
          </p>

          <button className="secondary-button" onClick={() => navigate('/mma-events')}>
            Back to Home
          </button>
        </div>
      </section>

      <TeamGrid />

      <section className="about-cards">
        {aboutInfoCards.map((card) => (
          <div className="about-card" key={card.title}>
            <h2>{card.title}</h2>
            <p>{card.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
