import { Link } from 'react-router-dom';
import BottomCta from '../../components/site/BottomCta';
import PageHero from '../../components/site/PageHero';

const educationTopics = [
  'Human trafficking, sexual exploitation, grooming, and coercion',
  'Sexual misconduct by people in leadership or positions of trust',
  'Bullying, peer pressure, substance misuse, and unsafe relationships',
  'Physical, emotional, and sexual abuse; healthy boundaries; and help-seeking',
];

export default function OurWorkPage() {
  return (
    <>
      <PageHero
        eyebrow="What we do"
        title="One mission."
        accent="Multiple pathways."
        lede="Harm is connected. Healing must be, too. Our programs meet people at different points in their lives while advancing the same goal: safety, agency, resilience, and a future shaped by possibility."
        number="02"
      />

      <section className="program-section program-red" id="prevention">
        <div className="program-index">01</div>
        <div className="program-title">
          <p className="eyebrow eyebrow-light"><span /> Prevention & education</p>
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
          <ul>
            {educationTopics.map((topic) => <li key={topic}>{topic}</li>)}
          </ul>
          <Link className="button button-dark" to="/get-involved#training">Request a training</Link>
        </div>
      </section>

      <section className="program-section" id="youth">
        <div className="program-index">02</div>
        <div className="program-title">
          <p className="eyebrow"><span /> Youth resilience & leadership</p>
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
            <div><span>01</span><strong>Recognize</strong><small>emotions and warning signs</small></div>
            <div><span>02</span><strong>Respond</strong><small>with skills instead of impulse</small></div>
            <div><span>03</span><strong>Rise</strong><small>through leadership and purpose</small></div>
          </div>
          <Link className="button button-dark" to="/get-involved#refer">Refer a young person</Link>
        </div>
      </section>

      <section className="boxing-deep-dive" id="boxing">
        <div className="boxing-heading">
          <p className="eyebrow eyebrow-light"><span /> Boxing &amp; life skills</p>
          <h2>One program.<br /><strong>Two youth pathways.</strong></h2>
          <p>
            BFJ welcomes youth who are stepping into a boxing gym for the first time
            and youth who want to earn the opportunity to compete. Every participant
            receives structured coaching, physical conditioning, mentorship, and
            practical life-skills development in a supportive environment.
          </p>
        </div>
        <div className="cs-deep-grid">
          <article><span>01</span><h3>Choice</h3><strong>My voice matters.</strong><p>Safe options help participants practice saying yes, saying no, and recognizing that their preferences can be respected.</p></article>
          <article><span>02</span><h3>Control</h3><strong>I can choose my response.</strong><p>Breathing, pausing, resetting, and returning help participants manage activation without shutting down or exploding.</p></article>
          <article><span>03</span><h3>Confidence</h3><strong>I am more than what happened.</strong><p>Every earned skill and completed round creates credible evidence of strength, progress, and possibility.</p></article>
        </div>
        <div className="boxing-levels">
          <article>
            <span>Pathway 01</span>
            <h3>Beginning Boxing</h3>
            <p className="level-audience">For all youth—no boxing experience required.</p>
            <p>
              Beginning Boxing introduces interested and novice youth to the sport in
              a safe, structured, and encouraging environment. Group instruction and
              individual coaching help participants develop fitness, confidence, and
              a strong technical foundation at their own pace.
            </p>
            <ul>
              <li>Stance, guard, footwork, balance, and basic combinations</li>
              <li>Conditioning, coordination, and healthy training habits</li>
              <li>Gym safety, teamwork, respect, and personal responsibility</li>
              <li>Choice, control, confidence, and positive goal-setting</li>
            </ul>
            <p className="level-note">
              Competition is not required. Youth who later demonstrate interest,
              consistency, and readiness may be considered for the Elite pathway.
            </p>
            <Link className="button button-red" to="/get-involved#refer">Enroll or refer a youth</Link>
          </article>
          <article>
            <span>Pathway 02</span>
            <h3>Elite Boxing</h3>
            <p className="level-audience">For committed youth pursuing USA Boxing competition.</p>
            <p>
              Elite Boxing provides advanced training for youth who want to prepare
              for amateur competition. Athletes build technical skill, conditioning,
              ring awareness, and competitive readiness while learning the 4 D&apos;s:
              Desire, Dedication, Determination, and Discipline.
            </p>
            <ul>
              <li>Advanced technique, defense, combinations, and ring movement</li>
              <li>Strength, conditioning, strategy, and competition preparation</li>
              <li>Attendance, coachability, discipline, and sportsmanship</li>
              <li>Goal-setting, accountability, resilience, and leadership</li>
            </ul>
            <p className="level-note">
              Entry into Elite Boxing and participation in competition depend on
              coach assessment, consistent training, athlete readiness, and completion
              of applicable USA Boxing registration, eligibility, medical, and safety requirements.
            </p>
            <Link className="button button-red" to="/get-involved#refer">Ask about Elite Boxing</Link>
          </article>
        </div>
        <p className="boxing-scope-note">
          BFJ provides boxing instruction, coaching, mentorship, prevention education,
          and experiential life-skills development. Our program is not therapy or mental
          health treatment. When a youth has an established therapist, clinician, case
          manager, or STRTP treatment team, BFJ may coordinate with that team—with
          appropriate authorization—while remaining within our role as coaches, mentors,
          and educators.
        </p>
      </section>

      <section className="program-section" id="veterans">
        <div className="program-index">04</div>
        <div className="program-title">
          <p className="eyebrow"><span /> Veteran support</p>
          <h2>Service changed.<br /><strong>Purpose continues.</strong></h2>
        </div>
        <div className="program-detail">
          <p className="program-lede">
            Veterans deserve connection, structure, and a community that recognizes
            the challenges of post-traumatic stress and civilian transition.
          </p>
          <p>
            Purposeful movement, routine, peer connection, and a respectful coaching
            environment offer a constructive outlet for stress and a way to rebuild
            confidence beyond military service. This support complements—not
            replaces—professional mental health care.
          </p>
          <Link className="button button-dark" to="/get-involved#refer">Ask about veteran support</Link>
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
        <Link className="button button-red" to="/get-involved#partner">Build something together</Link>
      </section>
      <BottomCta />
    </>
  );
}
