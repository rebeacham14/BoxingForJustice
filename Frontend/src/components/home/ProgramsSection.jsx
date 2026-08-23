import SectionHeading from '../common/SectionHeading';
import { programs } from '../../data/programs';

export default function ProgramsSection() {
  return (
    <section className="programs-section">
      <SectionHeading
        eyebrow="Core Youth Programs"
        title="Building Skills That Last a Lifetime"
        intro="Boxing is one tool we use — these three programs are the heart of our mission."
      />

      <div className="card-grid">
        {programs.map((program) => (
          <div className="info-card" key={program.id}>
            <div className="program-icon" aria-hidden="true">
              {program.icon}
            </div>
            <h2>{program.title}</h2>
            <p>{program.summary}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
