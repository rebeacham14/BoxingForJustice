import SectionHeading from '../common/SectionHeading';

const impactCards = [
  {
    image: '/shop-boxing.jpg',
    title: 'Our Mission',
    body: 'We use advocacy, education, and mentorship to help youth affected by trauma build confidence and a path forward.',
  },
  {
    image: '/orders-boxing.jpg',
    title: 'Who We Serve',
    body: 'At-risk youth, community members, and veterans — anyone who needs support, safety education, or a stronger foundation.',
  },
  {
    image: '/headshots/about-boxing.png',
    title: 'How We Work',
    body: 'Structured programs in relationship safety, legal literacy, and job readiness, backed by a supportive community.',
  },
];

export default function ImpactSection() {
  return (
    <section id="impact">
      <SectionHeading
        eyebrow="Our Impact"
        title="More Than a Program — a Path Forward"
        intro="Every session, workshop, and event is built around one goal: helping young people build the skills and confidence to thrive."
      />

      <div className="impact-section">
        {impactCards.map((card) => (
          <div className="impact-card" key={card.title}>
            <img src={card.image} alt="" />
            <div className="impact-card-body">
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
