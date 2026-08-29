import { Link } from 'react-router-dom';

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

export default function HomePage() {
  return (
    <>
      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Justice begins before the fight</p>
          <h1>Power is not taken.<br /><strong>It is restored.</strong></h1>
          <p className="hero-lede">
            We protect vulnerable people, prevent harm, and help youth, families,
            and survivors reclaim their power. Boxing is one tool. The
            mission is healing, justice, and lasting change.
          </p>
          <div className="button-row">
            <Link className="button button-red" to="/get-involved#mma-program">Refer a young person</Link>
            <Link className="text-link" to="/our-work">Explore our work <span aria-hidden="true">→</span></Link>
          </div>
        </div>

        <div className="hero-visual" aria-label="Choice, Control, Confidence — the Boxing For Justice 3 C's model">
          <div className="ring-lines" aria-hidden="true">
            <span className="ring-line ring-line-a" />
            <span className="ring-line ring-line-b" />
            <span className="ring-line ring-line-c" />
          </div>
          <div className="visual-kicker">Our youth-centered model</div>
          <div className="three-cs">
            <div><span>01</span><strong>Choice</strong><small>My voice matters.</small></div>
            <div><span>02</span><strong>Control</strong><small>I can choose my response.</small></div>
            <div><span>03</span><strong>Confidence</strong><small>I am more than what happened.</small></div>
          </div>
          <div className="visual-statement">Not just winning fights.<br /><em>Winning yourself back.</em></div>
        </div>
      </section>

      <section className="manifesto" id="why">
        <div className="section-number">01 / Why we exist</div>
        <div className="manifesto-copy">
          <p className="eyebrow eyebrow-light"><span /> Our purpose</p>
          <h2>Trauma can steal choice, control, and confidence. <strong>We help give them back.</strong></h2>
          <div className="manifesto-columns">
            <p>
              Boxing For Justice works at the intersection of violence prevention,
              education, advocacy, emotional wellness, and community collaboration.
              We create safe pathways for people to build strength without being
              defined by what they have endured.
            </p>
            <p>
              Justice means more than responding after harm occurs. It means
              recognizing warning signs, preventing abuse, restoring dignity, and
              equipping communities to protect their most vulnerable members.
            </p>
          </div>
        </div>
      </section>

      <section className="work-section" id="our-work">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span /> One mission. Multiple pathways.</p>
            <h2>Our work goes<br />beyond the ring.</h2>
          </div>
          <p className="section-intro">
            We respond to connected challenges with a connected model—meeting
            people where they are and building practical routes toward safety,
            resilience, and leadership.
          </p>
        </div>
        <div className="focus-grid">
          {focusAreas.map((area) => (
            <article className="focus-card" key={area.number}>
              <span className="focus-number">{area.number}</span>
              <div>
                <h3>{area.title}</h3>
                <p>{area.text}</p>
              </div>
              <span className="focus-arrow" aria-hidden="true">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section className="quote-band">
        <span className="quote-mark" aria-hidden="true">&ldquo;</span>
        <blockquote>
          We do not define young people by what they have endured. We help them
          discover the power they still hold.
        </blockquote>
        <p>Boxing For Justice</p>
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
          <p className="eyebrow"><span /> Boxing as a tool</p>
          <h2>We teach breathing before we teach punching.</h2>
          <p>
            The ring becomes a structured place to notice emotion, practice a
            pause, and choose what happens next. Participants learn that strength
            is not losing control—it is knowing how to regain it.
          </p>
          <ul className="check-list">
            <li><span>01</span> Beginning Boxing welcomes youth at every experience level and builds strong fundamentals, fitness, and belonging.</li>
            <li><span>02</span> Elite Boxing prepares committed youth for the demands of USA Boxing competition and develops the 4 D&apos;s.</li>
            <li><span>03</span> Every level values personal growth as much as athletic progress.</li>
          </ul>
          <Link className="text-link text-link-dark" to="/mma-events/about#boxing-life-skills">Find the right program <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <section className="impact-section" id="impact">
        <div className="section-number dark-number">02 / Accountability</div>
        <div className="impact-content">
          <p className="eyebrow eyebrow-light"><span /> Built for measurable change</p>
          <h2>Credibility lives in<br /><strong>what we can show.</strong></h2>
          <p className="impact-lede">
            Our evaluation framework connects participation to meaningful changes
            in knowledge, behavior, resilience, and community reach. Program data
            and participant stories will make that progress visible.
          </p>
          <div className="measure-grid">
            {measures.map((measure, index) => (
              <div className="measure" key={measure}>
                <span>0{index + 1}</span>
                <p>{measure}</p>
              </div>
            ))}
          </div>
          <div className="funder-note">
            <strong>For funders &amp; community partners</strong>
            <p>
              Our model is designed for transparent goals, responsible stewardship,
              coordinated referrals, and outcomes that can be communicated clearly.
            </p>
          </div>
        </div>
      </section>

      <section className="action-section" id="get-involved">
        <p className="eyebrow"><span /> Take the next step</p>
        <h2>Justice is a team effort.<br /><strong>There is a place for you.</strong></h2>
        <div className="action-grid">
          <Link to="/get-involved#mma-program"><span>For families</span><strong>Enroll or refer a participant</strong><em>→</em></Link>
          <Link to="/get-involved#training"><span>For organizations</span><strong>Request education or training</strong><em>→</em></Link>
          <Link to="/get-involved#partnership"><span>For community leaders</span><strong>Become a partner</strong><em>→</em></Link>
          <Link to="/get-involved#internship"><span>For supporters</span><strong>Volunteer or intern</strong><em>→</em></Link>
        </div>
      </section>
    </>
  );
}
