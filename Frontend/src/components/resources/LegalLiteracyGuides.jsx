import SectionHeading from '../common/SectionHeading';
import { legalGuides } from '../../data/resources';

export default function LegalLiteracyGuides() {
  return (
    <section>
      <SectionHeading
        eyebrow="Legal & Safety Literacy"
        title="Know Your Rights, With Confidence"
        intro="Clear, accessible guidance — not legal advice — to help youth understand their rights and interact with authority safely."
      />

      <div className="card-grid">
        {legalGuides.map((guide) => (
          <div className="info-card" key={guide.title}>
            <h2>{guide.title}</h2>
            <p>{guide.summary}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
