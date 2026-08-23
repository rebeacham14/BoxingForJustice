import BottomCta from '../../components/site/BottomCta';
import PageHero from '../../components/site/PageHero';

const values = [
  ['Agency', 'People deserve meaningful choices, respected boundaries, and a voice in what happens next.'],
  ['Dignity', 'No one is reduced to a diagnosis, a circumstance, or the worst thing that happened to them.'],
  ['Safety', 'Trust is built through consistency, appropriate boundaries, and environments designed for belonging.'],
  ['Accountability', 'We set clear expectations, communicate honestly, and measure what our programs are meant to change.'],
  ['Collaboration', 'We share the work, connect people to appropriate support, and value impact over recognition.'],
];

const leaders = [
  ['Martye Perkins', 'Founder, Chief Executive Officer & Board Chair'],
  ['Julian “JP” Powers', 'Director, Strength & Conditioning Coach & Board Vice Chair'],
  ['Becky “Coach Bek” Perkins', 'Certified Amateur Boxing Coach & Board Secretary'],
  ['Peter Phan', 'Marketing Director & Youth Mentor'],
  ['Ryan “Ace” Beacham', 'Media & Production Director'],
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Boxing For Justice"
        title="Rooted in survival."
        accent="Built for restoration."
        lede="Boxing For Justice began with lived experience and a refusal to let silence have the final word. Today, that conviction powers a broader movement for safer youth, stronger families, supported veterans, and resilient communities."
        number="01"
      />

      <section className="story-section">
        <div className="story-rail">
          <span>Founded 2024</span>
          <span>Riverside County, CA</span>
          <span>501(c)(3) public charity</span>
        </div>
        <div className="story-content">
          <p className="eyebrow"><span /> The story behind the mission</p>
          <h2>When pain becomes purpose,<br />silence loses its power.</h2>
          <div className="story-columns">
            <p>
              Founder Martye Perkins is a survivor of exploitation, physical abuse,
              and sexual abuse. Her experience showed her how secrecy can protect
              harmful systems while isolating the very people who need support.
            </p>
            <p>
              Walking alongside a young relative through the aftermath of severe
              abuse made the need even clearer: families require better tools,
              young people need safe adults, and behavior must be understood in
              the context of what a child may have survived.
            </p>
          </div>
          <blockquote>
            &ldquo;My pain was not mine to carry in silence. It became the foundation of
            a purpose: creating spaces where young people are empowered, not
            overlooked, and where their voices are heard.&rdquo;
            <cite>— Martye Perkins, Founder</cite>
          </blockquote>
        </div>
      </section>

      <section className="mission-vision">
        <article>
          <span>Our mission</span>
          <h2>Protect. Educate. Restore.</h2>
          <p>
            We protect vulnerable people, prevent harm, and help youth, families,
            veterans, and survivors reclaim their power through education,
            advocacy, mentorship, community partnership, and healing-centered
            physical activity.
          </p>
        </article>
        <article>
          <span>Our vision</span>
          <h2>Communities where power is shared.</h2>
          <p>
            We envision safer communities where youth are supported, survivors are
            treated with dignity, veterans remain connected, families can reach
            trusted resources, and every person knows their voice matters.
          </p>
        </article>
      </section>

      <section className="values-section">
        <div className="values-heading">
          <p className="eyebrow"><span /> How we show up</p>
          <h2>Values you can<br />feel in the room.</h2>
        </div>
        <div className="values-list">
          {values.map(([name, description], index) => (
            <article key={name}>
              <span>0{index + 1}</span>
              <h3>{name}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="leadership-section">
        <div className="section-heading compact-heading">
          <div>
            <p className="eyebrow"><span /> Leadership & stewardship</p>
            <h2>People in<br />your corner.</h2>
          </div>
          <p className="section-intro">
            Coaches, mentors, educators, and community leaders bring professional
            knowledge and lived experience to a mission grounded in responsibility.
          </p>
        </div>
        <div className="leader-grid">
          {leaders.map(([name, role], index) => (
            <article key={name}>
              <span>0{index + 1}</span>
              <h3>{name}</h3>
              <p>{role}</p>
            </article>
          ))}
        </div>
      </section>
      <BottomCta />
    </>
  );
}
