import { useNavigate } from 'react-router-dom';
import SEO from '../components/common/SEO';
import SectionHeading from '../components/common/SectionHeading';
import CrisisBanner from '../components/common/CrisisBanner';
import { veteranResources } from '../data/veteranResources';

const coachingPoints = [
  {
    title: 'Veteran Coaching',
    body: 'One-on-one and group coaching from staff who understand military transition and discipline.',
  },
  {
    title: 'Mental Health & PTSD Recovery',
    body: 'A supportive space to work through PTSD and reconnect with community, alongside professional resources.',
  },
];

export default function VeteranSupportPage() {
  const navigate = useNavigate();

  return (
    <div className="page veteran-page">
      <SEO
        title="Veteran Support | Boxing for Justice"
        description="Veteran coaching, mental health support, and PTSD recovery resources from Boxing for Justice."
      />

      <section className="page-hero">
        <div className="page-hero-text">
          <h1>
            Veteran <span>Support</span>
          </h1>

          <p>Coaching, mental health support, and community for those who served.</p>

          <button className="secondary-button" onClick={() => navigate('/mma-events')}>
            Back to Home
          </button>
        </div>
      </section>

      <section className="card-grid">
        {coachingPoints.map((point) => (
          <div className="info-card" key={point.title}>
            <h2>{point.title}</h2>
            <p>{point.body}</p>
          </div>
        ))}
      </section>

      <CrisisBanner variant="veteran" />

      <SectionHeading
        eyebrow="Understanding the Need"
        title="The Realities Veterans Face"
        intro="Many veterans return home to limited mental-health resources and a difficult transition to civilian life. We believe community, structure, and consistent support make a measurable difference."
      />

      <SectionHeading
        eyebrow="Resource Directory"
        title="Local & National Support"
        intro="Organizations and services available to veterans and their families."
      />

      <div className="resource-directory">
        <div className="resource-group">
          <p className="resource-group-title">National</p>
          <div className="resource-link-grid">
            {veteranResources.national.map((resource) => (
              <a
                className="resource-link-card"
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                key={resource.name}
              >
                <h4>{resource.name}</h4>
                <p>{resource.description}</p>
              </a>
            ))}
          </div>
        </div>

        <div className="resource-group">
          <p className="resource-group-title">Local</p>
          <div className="resource-link-grid">
            {veteranResources.local.map((resource) => (
              <div className="resource-link-card" key={resource.name}>
                <h4>{resource.name}</h4>
                <p>{resource.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
