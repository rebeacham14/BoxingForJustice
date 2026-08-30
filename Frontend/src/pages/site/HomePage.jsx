import { Link } from 'react-router-dom';
import EditablePage from '../../components/site/EditablePage';
import EditableText from '../../components/site/EditableText';

const focusAreas = [
  {
    number: '01',
    title: 'Prevention & Education',
    text: 'Practical education for youth, parents, caregivers, and community leaders on trafficking, grooming, abuse, bullying, substance misuse, and healthy boundaries.',
  },
  {
    number: '02',
    title: 'Boxing & Life Skills',
    text: 'Beginning and Elite Boxing pathways help youth build fundamentals, fitness, discipline, resilience, and confidence—with a route to USA Boxing competition for athletes who are ready.',
  },
  {
    number: '03',
    title: 'Community Partnership',
    text: 'Collaboration with nonprofits, educators, advocates, and service providers to close gaps and multiply impact across Riverside County.',
  },
];

const measures = [
  'Participation and consistent engagement',
  'Growth in emotional regulation and confidence',
  'Knowledge gained through prevention education',
  'Referrals, collaborations, and community reach',
];

const actionGrid = [
  { to: '/get-involved#mma-program', audience: 'For families', title: 'Enroll or refer a participant' },
  { to: '/get-involved#training', audience: 'For organizations', title: 'Request education or training' },
  { to: '/get-involved#partnership', audience: 'For community leaders', title: 'Become a partner' },
  { to: '/get-involved#internship', audience: 'For supporters', title: 'Volunteer or intern' },
];

export default function HomePage() {
  return (
    <EditablePage slug="home">
      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span /> <EditableText id="home.top.eyebrow" defaultValue="Justice begins before the fight" /></p>
          <h1>
            <EditableText id="home.top.title" defaultValue="Power is not taken." /><br />
            <strong><EditableText id="home.top.title-accent" defaultValue="It is restored." /></strong>
          </h1>
          <p className="hero-lede">
            <EditableText
              as="span"
              id="home.top.lede"
              defaultValue="We protect vulnerable people, prevent harm, and help youth, families, and survivors reclaim their power. Boxing is one tool. The mission is healing, justice, and lasting change."
            />
          </p>
          <div className="button-row">
            <Link className="button button-red" to="/get-involved#mma-program">
              <EditableText id="home.top.cta-primary" defaultValue="Refer a young person" />
            </Link>
            <Link className="text-link" to="/our-work">
              <EditableText id="home.top.cta-secondary" defaultValue="Explore our work" /> <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="hero-visual" aria-label="Choice, Control, Confidence — the Boxing For Justice 3 C's model">
          <div className="ring-lines" aria-hidden="true">
            <span className="ring-line ring-line-a" />
            <span className="ring-line ring-line-b" />
            <span className="ring-line ring-line-c" />
          </div>
          <div className="visual-kicker"><EditableText id="home.top.visual-kicker" defaultValue="Our youth-centered model" /></div>
          <div className="three-cs">
            <div>
              <span>01</span>
              <strong><EditableText id="home.top.three-cs.0.label" defaultValue="Choice" /></strong>
              <small><EditableText id="home.top.three-cs.0.caption" defaultValue="My voice matters." /></small>
            </div>
            <div>
              <span>02</span>
              <strong><EditableText id="home.top.three-cs.1.label" defaultValue="Control" /></strong>
              <small><EditableText id="home.top.three-cs.1.caption" defaultValue="I can choose my response." /></small>
            </div>
            <div>
              <span>03</span>
              <strong><EditableText id="home.top.three-cs.2.label" defaultValue="Confidence" /></strong>
              <small><EditableText id="home.top.three-cs.2.caption" defaultValue="I am more than what happened." /></small>
            </div>
          </div>
          <div className="visual-statement">
            <EditableText id="home.top.visual-statement" defaultValue="Not just winning fights." /><br />
            <em><EditableText id="home.top.visual-statement-accent" defaultValue="Winning yourself back." /></em>
          </div>
        </div>
      </section>

      <section className="manifesto" id="why">
        <div className="section-number">01 / Why we exist</div>
        <div className="manifesto-copy">
          <p className="eyebrow eyebrow-light"><span /> <EditableText id="home.why.eyebrow" defaultValue="Our purpose" /></p>
          <h2>
            <EditableText id="home.why.title" defaultValue="Trauma can steal choice, control, and confidence." /> <strong><EditableText id="home.why.title-accent" defaultValue="We help give them back." /></strong>
          </h2>
          <div className="manifesto-columns">
            <p>
              <EditableText
                as="span"
                id="home.why.paragraph-1"
                defaultValue="Boxing For Justice works at the intersection of violence prevention, education, advocacy, emotional wellness, and community collaboration. We create safe pathways for people to build strength without being defined by what they have endured."
              />
            </p>
            <p>
              <EditableText
                as="span"
                id="home.why.paragraph-2"
                defaultValue="Justice means more than responding after harm occurs. It means recognizing warning signs, preventing abuse, restoring dignity, and equipping communities to protect their most vulnerable members."
              />
            </p>
          </div>
        </div>
      </section>

      <section className="work-section" id="our-work">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span /> <EditableText id="home.our-work.eyebrow" defaultValue="One mission. Multiple pathways." /></p>
            <h2>
              <EditableText id="home.our-work.title-line1" defaultValue="Our work goes" /><br />
              <EditableText id="home.our-work.title-line2" defaultValue="beyond the ring." />
            </h2>
          </div>
          <p className="section-intro">
            <EditableText
              as="span"
              id="home.our-work.intro"
              defaultValue="We respond to connected challenges with a connected model—meeting people where they are and building practical routes toward safety, resilience, and leadership."
            />
          </p>
        </div>
        <div className="focus-grid">
          {focusAreas.map((area, index) => (
            <article className="focus-card" key={area.number}>
              <span className="focus-number">{area.number}</span>
              <div>
                <EditableText as="h3" id={`home.our-work.focus.${index}.title`} defaultValue={area.title} />
                <EditableText as="p" id={`home.our-work.focus.${index}.text`} defaultValue={area.text} />
              </div>
              <span className="focus-arrow" aria-hidden="true">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section className="quote-band">
        <span className="quote-mark" aria-hidden="true">&ldquo;</span>
        <blockquote>
          <EditableText
            as="span"
            id="home.quote.text"
            defaultValue="We do not define young people by what they have endured. We help them discover the power they still hold."
          />
        </blockquote>
        <p><EditableText id="home.quote.attribution" defaultValue="Boxing For Justice" /></p>
      </section>

      <section className="method-section">
        <div className="method-art" aria-hidden="true">
          <div className="corner-label">In their corner</div>
          <div className="method-word">BREATHE</div>
          <div className="method-word">PAUSE</div>
          <div className="method-word active">RESET</div>
          <div className="method-word">RETURN</div>
        </div>
        <div className="method-copy">
          <p className="eyebrow"><span /> <EditableText id="home.method.eyebrow" defaultValue="Boxing as a tool" /></p>
          <h2><EditableText id="home.method.title" defaultValue="We teach breathing before we teach punching." /></h2>
          <p>
            <EditableText
              as="span"
              id="home.method.paragraph"
              defaultValue="The ring becomes a structured place to notice emotion, practice a pause, and choose what happens next. Participants learn that strength is not losing control—it is knowing how to regain it."
            />
          </p>
          <ul className="check-list">
            <li><span>01</span> <EditableText id="home.method.check.0" defaultValue="Beginning Boxing welcomes youth at every experience level and builds strong fundamentals, fitness, and belonging." /></li>
            <li><span>02</span> <EditableText id="home.method.check.1" defaultValue="Elite Boxing prepares committed youth for the demands of USA Boxing competition and develops the 4 D's." /></li>
            <li><span>03</span> <EditableText id="home.method.check.2" defaultValue="Every level values personal growth as much as athletic progress." /></li>
          </ul>
          <Link className="text-link text-link-dark" to="/mma-events/about#boxing-life-skills">
            <EditableText id="home.method.cta" defaultValue="Find the right program" /> <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className="impact-section" id="impact">
        <div className="section-number dark-number">02 / Accountability</div>
        <div className="impact-content">
          <p className="eyebrow eyebrow-light"><span /> <EditableText id="home.impact.eyebrow" defaultValue="Built for measurable change" /></p>
          <h2>
            <EditableText id="home.impact.title" defaultValue="Credibility lives in" /><br /><strong><EditableText id="home.impact.title-accent" defaultValue="what we can show." /></strong>
          </h2>
          <p className="impact-lede">
            <EditableText
              as="span"
              id="home.impact.lede"
              defaultValue="Our evaluation framework connects participation to meaningful changes in knowledge, behavior, resilience, and community reach. Program data and participant stories will make that progress visible."
            />
          </p>
          <div className="measure-grid">
            {measures.map((measure, index) => (
              <div className="measure" key={measure}>
                <span>0{index + 1}</span>
                <EditableText as="p" id={`home.impact.measure.${index}`} defaultValue={measure} />
              </div>
            ))}
          </div>
          <div className="funder-note">
            <strong><EditableText id="home.impact.funder-heading" defaultValue="For funders & community partners" /></strong>
            <p>
              <EditableText
                as="span"
                id="home.impact.funder-text"
                defaultValue="Our model is designed for transparent goals, responsible stewardship, coordinated referrals, and outcomes that can be communicated clearly."
              />
            </p>
          </div>
        </div>
      </section>

      <section className="action-section" id="get-involved">
        <p className="eyebrow"><span /> <EditableText id="home.get-involved.eyebrow" defaultValue="Take the next step" /></p>
        <h2>
          <EditableText id="home.get-involved.title" defaultValue="Justice is a team effort." /><br /><strong><EditableText id="home.get-involved.title-accent" defaultValue="There is a place for you." /></strong>
        </h2>
        <div className="action-grid">
          {actionGrid.map((action, index) => (
            <Link to={action.to} key={action.to}>
              <span><EditableText id={`home.get-involved.action.${index}.audience`} defaultValue={action.audience} /></span>
              <strong><EditableText id={`home.get-involved.action.${index}.title`} defaultValue={action.title} /></strong>
              <em>→</em>
            </Link>
          ))}
        </div>
      </section>
    </EditablePage>
  );
}
