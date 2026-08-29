import { useNavigate } from 'react-router-dom';
import SEO from '../components/common/SEO';
import TeamGrid from '../components/about/TeamGrid';
import { aboutInfoCards } from '../data/team';

const boxingPrinciples = [
  { title: 'Choice', body: 'Safe options help participants practice saying yes, saying no, and recognizing that their preferences can be respected.' },
  { title: 'Control', body: 'Breathing, pausing, resetting, and returning help participants manage activation without shutting down or exploding.' },
  { title: 'Confidence', body: 'Every earned skill and completed round creates credible evidence of strength, progress, and possibility.' },
];

const boxingPathways = [
  {
    title: 'Beginning Boxing',
    body: 'For all youth - no boxing experience required. Group instruction and individual coaching help participants develop fitness, confidence, and a strong technical foundation at their own pace. Competition is not required.',
  },
  {
    title: 'Elite Boxing',
    body: 'For committed youth pursuing USA Boxing competition. Athletes build technical skill, conditioning, ring awareness, and competitive readiness while learning the 4 D’s: Desire, Dedication, Determination, and Discipline.',
  },
];

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

      <section className="page-hero" id="boxing-life-skills">
        <div className="page-hero-text">
          <h1>
            One program.<br /><span>Two youth pathways.</span>
          </h1>
          <p>
            BFJ welcomes youth who are stepping into a boxing gym for the first
            time and youth who want to earn the opportunity to compete. Every
            participant receives structured coaching, physical conditioning,
            mentorship, and practical life-skills development in a supportive
            environment.
          </p>
        </div>
      </section>

      <section className="about-cards">
        {boxingPrinciples.map((card) => (
          <div className="about-card" key={card.title}>
            <h2>{card.title}</h2>
            <p>{card.body}</p>
          </div>
        ))}
      </section>

      <section className="about-cards">
        {boxingPathways.map((card) => (
          <div className="about-card" key={card.title}>
            <h2>{card.title}</h2>
            <p>{card.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
