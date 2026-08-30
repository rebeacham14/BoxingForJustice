import { Link } from 'react-router-dom';
import BottomCta from '../../components/site/BottomCta';
import PageHero from '../../components/site/PageHero';
import UsPolicyMap from '../../components/impact/UsPolicyMap';

const outcomes = [
  ['Participation', 'Consistent engagement, attendance, retention, and completion'],
  ['Personal growth', 'Self-reported confidence, emotional awareness, and use of regulation skills'],
  ['Knowledge', 'Understanding of boundaries, warning signs, safety, and help-seeking'],
  ['Progress', 'Boxing or fitness development, goal completion, and demonstrated discipline'],
  ['Community reach', 'Training participants, partner activity, referrals, and connections to support'],
];

export default function ImpactPage() {
  return (
    <>
      <PageHero
        eyebrow="Impact & accountability"
        title="Measure what"
        accent="matters."
        lede="Trust is earned through clear goals, responsible stewardship, honest learning, and evidence that programs are creating the changes they were designed to make."
        number="04"
      />

      <section className="work-section" id="policies">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span /> Policies</p>
            <h2>What&apos;s on<br />the books.</h2>
          </div>
          <p className="section-intro">
            A state-by-state look at the policies that shape how kids are
            protected. Content below is a placeholder — the owner will add real
            policy summaries.
          </p>
        </div>
        <div className="content-placeholder">Owner to add policy tracking content.</div>
      </section>

      <section className="work-section" id="geo-data">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span /> GEO Data</p>
            <h2>Click a state.<br />See the picture.</h2>
          </div>
          <p className="section-intro">
            Click or tap any state to see its policies and helpful data.
          </p>
        </div>
        <UsPolicyMap />
      </section>

      <section className="fact-band">
        <article><strong>2024</strong><span>Year founded</span></article>
        <article><strong>8–21</strong><span>Youth & young adults served</span></article>
        <article><strong>501(c)(3)</strong><span>IRS-recognized public charity</span></article>
        <article><strong>99-3175496</strong><span>Employer identification number</span></article>
      </section>

      <section className="change-model">
        <div className="change-heading">
          <p className="eyebrow"><span /> Our path to change</p>
          <h2>From a safe moment<br />to a stronger future.</h2>
          <p>
            Our model links every activity to an intended result. That keeps the
            work focused and gives funders, families, and partners a clear way to
            understand how change is expected to happen.
          </p>
        </div>
        <div className="change-steps">
          <article><span>01 / Begin</span><h3>Create safety & access</h3><p>Trusted adults, appropriate choices, clear expectations, and welcoming spaces make participation possible.</p></article>
          <article><span>02 / Practice</span><h3>Build practical skills</h3><p>Education, mentoring, movement, breathing, repetition, and reflection turn ideas into usable tools.</p></article>
          <article><span>03 / Strengthen</span><h3>Reinforce agency</h3><p>Participants experience progress, make decisions, recover from setbacks, and see their own capacity grow.</p></article>
          <article><span>04 / Lead</span><h3>Carry change forward</h3><p>Skills move beyond the program into school, relationships, work, family, service, and leadership.</p></article>
        </div>
      </section>

      <section className="outcomes-section">
        <div className="section-heading compact-heading">
          <div>
            <p className="eyebrow eyebrow-light"><span /> What we measure</p>
            <h2>Evidence with<br /><strong>integrity.</strong></h2>
          </div>
          <p className="section-intro">
            We are building a consistent evaluation practice that combines
            participation data, feedback, observed progress, and partner reach.
          </p>
        </div>
        <div className="outcomes-list">
          {outcomes.map(([title, description], index) => (
            <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{description}</p></article>
          ))}
        </div>
      </section>

      <section className="integrity-section">
        <div>
          <p className="eyebrow"><span /> Our commitment</p>
          <h2>People are never<br />marketing material.</h2>
        </div>
        <div>
          <p>
            Participant stories can be powerful, but dignity comes first. We will
            seek appropriate permission, protect privacy, avoid sensationalizing
            trauma, and never inflate numbers to make the work appear larger than it is.
          </p>
          <p>
            As verified program data and approved participant stories are prepared,
            this site will publish them with context: what was measured, who was
            included, and what the results can—and cannot—tell us.
          </p>
        </div>
      </section>

      <section className="funder-section">
        <div className="funder-seal">BFJ<span>Funder<br />readiness</span></div>
        <div>
          <p className="eyebrow"><span /> For grantmakers & sponsors</p>
          <h2>A mission built<br />for partnership.</h2>
          <p>
            Boxing For Justice is an IRS-recognized 501(c)(3) public charity. We
            welcome conversations about aligned funding, program sponsorship,
            in-kind support, collaborative proposals, and responsible capacity building.
          </p>
          <div className="funder-links">
            <a href="https://www.guidestar.org/Profile/99-3175496">View GuideStar profile <span>↗</span></a>
            <Link to="/get-involved#partnership">Discuss a partnership <span>→</span></Link>
          </div>
        </div>
      </section>
      <BottomCta />
    </>
  );
}
