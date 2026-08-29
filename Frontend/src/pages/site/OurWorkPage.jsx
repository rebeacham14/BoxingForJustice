import { Link } from 'react-router-dom';
import BottomCta from '../../components/site/BottomCta';
import PageHero from '../../components/site/PageHero';
import AccordionItem from '../../components/common/AccordionItem';
import FlipCard from '../../components/common/FlipCard';

const educationTopics = [
  'Human trafficking, sexual exploitation, grooming, and coercion',
  'Sexual misconduct by people in leadership or positions of trust',
  'Bullying, peer pressure, substance misuse, and unsafe relationships',
  'Physical, emotional, and sexual abuse; healthy boundaries; and help-seeking',
];

const equipping = [
  { front: 'Recognize', back: 'emotions and warning signs' },
  { front: 'Respond', back: 'with skills instead of impulse' },
  { front: 'Rise', back: 'through leadership and purpose' },
];

export default function OurWorkPage() {
  return (
    <>
      <PageHero
        eyebrow="What we do"
        title="One mission."
        accent="Multiple pathways."
        lede="Harm is connected. Healing must be, too. Our programs meet people at different points in their lives while advancing the same goal: safety, agency, resilience, and a future shaped by possibility."
        number="03"
      />

      <div className="feature-card">
        <div>
          <p className="feature-card-tag">Boxing &amp; life skills</p>
          <h3>One program.<br />Two youth pathways.</h3>
          <p>
            Beginning and Elite Boxing pathways build fitness, discipline, and
            confidence — with a route to USA Boxing competition for athletes who
            are ready. Full details now live on the enrollment portal.
          </p>
          <Link className="button button-dark" to="/mma-events/about#boxing-life-skills">
            See the full breakdown ↗
          </Link>
        </div>
      </div>

      <section className="program-section program-red" id="campaigns">
        <div className="program-index">01</div>
        <div className="program-title">
          <p className="eyebrow eyebrow-light"><span /> Campaigns</p>
          <h2>2028<br /><strong>Olympics.</strong></h2>
        </div>
        <div className="program-detail">
          <p className="program-lede">
            No past campaigns yet — this is the one we&apos;re building toward.
          </p>
          <p>
            As the 2028 Olympics come to the region, BFJ is planning to partner
            with hotels, local businesses, and organizations to confront issues
            like prostitution and trafficking around USC and the surrounding
            areas during the Games.
          </p>
        </div>
      </section>

      <section className="program-section" id="fundraiser-events">
        <div className="program-index">02</div>
        <div className="program-title">
          <p className="eyebrow"><span /> Fundraiser events</p>
          <h2>Coming<br /><strong>soon.</strong></h2>
        </div>
        <div className="program-detail">
          <div className="content-placeholder">Owner to add upcoming fundraiser events.</div>
        </div>
      </section>

      <section className="program-section" id="articles">
        <div className="program-index">03</div>
        <div className="program-title">
          <p className="eyebrow"><span /> Articles</p>
          <h2>Coming<br /><strong>soon.</strong></h2>
        </div>
        <div className="program-detail">
          <div className="content-placeholder">Owner to add articles and press.</div>
        </div>
      </section>

      <div className="callout-bar">
        <h3>Know the signs. Name the harm. Build safety.</h3>
        <p>Owner to add subline.</p>
      </div>

      <section className="program-section program-red">
        <div className="program-index">04</div>
        <div className="program-title">
          <p className="eyebrow eyebrow-light"><span /> Educating</p>
          <h2>Know the signs.<br />Name the harm.<br /><strong>Build safety.</strong></h2>
        </div>
        <div className="program-detail">
          <p className="program-lede">
            Prevention begins when people have the language and confidence to
            recognize unsafe behavior, establish boundaries, and reach trusted help.
          </p>
          <p>
            We educate youth, parents, guardians, kinship caregivers, schools, and
            community groups through clear, age-appropriate conversations about
            vulnerability, exploitation, abuse, and everyday pressures.
          </p>
          <div className="accordion">
            {educationTopics.map((topic) => (
              <AccordionItem title={topic} key={topic}>
                Owner to add detail.
              </AccordionItem>
            ))}
          </div>
          <Link className="button button-dark" to="/get-involved#training">Request a training</Link>
        </div>
      </section>

      <section className="program-section">
        <div className="program-index">05</div>
        <div className="program-title">
          <p className="eyebrow"><span /> Equipping</p>
          <h2>Today&apos;s strength.<br /><strong>Tomorrow&apos;s leaders.</strong></h2>
        </div>
        <div className="program-detail">
          <p className="program-lede">
            Young people are more than the challenges they carry. We help them
            build skills that support healthy decisions, relationships, and goals.
          </p>
          <p>
            Mentorship, education, and structured activities help participants
            develop self-awareness, problem-solving, communication, perseverance,
            and community responsibility. Every success becomes evidence that a
            different future can be built.
          </p>
          <div className="mini-grid">
            {equipping.map(({ front, back }, index) => (
              <FlipCard
                key={front}
                front={<><span>0{index + 1}</span><strong>{front}</strong></>}
                back={<span>{back}</span>}
              />
            ))}
          </div>
          <Link className="button button-dark" to="/get-involved#mma-program">Refer a young person</Link>
        </div>
      </section>

      <section className="program-section program-red">
        <div className="program-index">06</div>
        <div className="program-title">
          <p className="eyebrow eyebrow-light"><span /> Encouraging</p>
          <h2>Community that<br /><strong>shows up.</strong></h2>
        </div>
        <div className="program-detail">
          <div className="content-placeholder content-placeholder-light">
            Owner to add encouragement/mentorship stories and content.
          </div>
        </div>
      </section>

      <section className="partnership-model" id="partnerships">
        <p className="eyebrow"><span /> Community partnership</p>
        <h2>We do not compete<br />for credit. <strong>We multiply impact.</strong></h2>
        <p>
          Schools, nonprofits, advocates, clinicians, caregivers, and community
          leaders all hold part of the solution. Through outreach, education,
          referrals, shared resources, and coordinated efforts, we help people reach
          the right support while helping partner organizations advance their own missions.
        </p>
        <Link className="button button-red" to="/get-involved#partnership">Build something together</Link>
      </section>
      <BottomCta />
    </>
  );
}
