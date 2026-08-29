import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/site/PageHero';
import Overlay from '../../components/common/Overlay';
import ContactForm from '../../components/site/ContactForm';
import InternshipOverlay from '../../components/site/InternshipOverlay';

const actions = [
  {
    id: 'report',
    audience: 'Anyone with information to share',
    title: 'Make a report',
    text: 'Share a concern confidentially. If someone is in immediate danger, use the resources below instead.',
    kind: 'mailto',
    label: 'Make a report',
    href: 'mailto:info@boxingforjustice.org?subject=Confidential%20report',
  },
  {
    id: 'training',
    audience: 'Schools, nonprofits & community groups',
    title: 'Request education or training',
    text: 'Bring prevention education to your community around trafficking, exploitation, misconduct, abuse, bullying, peer pressure, substance misuse, boundaries, or help-seeking.',
    kind: 'overlay',
    overlay: 'training',
    label: 'Request a training',
  },
  {
    id: 'partnership',
    audience: 'Other nonprofits, funders & community leaders',
    title: 'Build a community partnership',
    text: 'Partnerships are for organizations, not individuals — explore coordinated referrals, shared outreach, program sponsorship, collaborative grants, or a joint initiative that advances both missions.',
    kind: 'overlay',
    overlay: 'partnership',
    label: 'Discuss partnership',
  },
  {
    id: 'committee-board',
    audience: 'Individuals ready to serve',
    title: 'Join the committee or board',
    text: 'Help shape the direction of BFJ’s advocacy and programs as a committee or board member.',
    kind: 'mailto',
    label: 'Ask about the board',
    href: 'mailto:info@boxingforjustice.org?subject=Committee%2Fboard%20interest',
  },
  {
    id: 'mma-program',
    audience: 'Families, caregivers & referral partners',
    title: 'Enroll or refer a participant',
    text: 'Ask about youth programming, mentorship, Beginning Boxing, or Elite Boxing. We will help identify the most appropriate next conversation.',
    kind: 'link',
    to: '/mma-events/enroll',
    label: 'Enroll in boxing',
  },
  {
    id: 'endorsements',
    audience: 'Coaches, partners & community leaders',
    title: 'Offer an endorsement',
    text: 'Owner to add endorsement details.',
    kind: 'mailto',
    label: 'Offer an endorsement',
    href: 'mailto:info@boxingforjustice.org?subject=Endorsement',
  },
  {
    id: 'fundraiser-signups',
    audience: 'Supporters & volunteers',
    title: 'Sign up for a fundraiser',
    text: 'Owner to add upcoming fundraiser sign-up details.',
    kind: 'mailto',
    label: 'Sign up',
    href: 'mailto:info@boxingforjustice.org?subject=Fundraiser%20signup',
  },
  {
    id: 'internship',
    audience: 'Students & early-career professionals',
    title: 'Explore internships',
    text: 'Tell us about the skills you hope to share — from events and outreach to mentoring, education, media, and administration.',
    kind: 'overlay',
    overlay: 'internship',
    label: 'Explore internships',
  },
];

export default function GetInvolvedPage() {
  const [activeOverlay, setActiveOverlay] = useState(null);

  return (
    <>
      <PageHero
        eyebrow="Get involved"
        title="Justice is"
        accent="a team effort."
        lede="Whether you need support, want to strengthen your community, or are ready to invest in the mission, there is a clear place to begin."
        number="05"
      />

      <aside className="urgent-help" aria-labelledby="urgent-help-title">
        <div>
          <span>Immediate support</span>
          <h2 id="urgent-help-title">If someone may be in danger</h2>
          <p>Boxing For Justice is not an emergency service or crisis hotline.</p>
        </div>
        <div className="help-links">
          <a href="tel:911"><strong>Immediate danger</strong><span>Call 911</span></a>
          <a href="https://humantraffickinghotline.org/en/get-help"><strong>Human trafficking support</strong><span>Call 1-888-373-7888 · Text 233733</span></a>
          <a href="https://988lifeline.org/get-help/"><strong>Mental health crisis support</strong><span>Call or text 988</span></a>
        </div>
      </aside>

      <section className="contact-panel">
        <div>
          <p className="eyebrow eyebrow-light"><span /> Not sure where to begin?</p>
          <h2>Tell us what<br />brings you here.</h2>
        </div>
        <div>
          <p>
            Send a brief note and we will help route your question to the right
            person. Please do not include confidential details about abuse,
            exploitation, health, or a minor in your initial email.
          </p>
          <a className="button button-red" href="mailto:info@boxingforjustice.org?subject=Website%20inquiry">Email Boxing For Justice</a>
        </div>
      </section>

      <section className="involvement-list">
        {actions.map((action, index) => (
          <article className="involvement-card" id={action.id} key={action.id}>
            <div className="involvement-number">0{index + 1}</div>
            <div className="involvement-content">
              <span>{action.audience}</span>
              <h2>{action.title}</h2>
              <p>{action.text}</p>
            </div>
            {action.kind === 'mailto' && (
              <a className="button button-dark" href={action.href}>{action.label} <span aria-hidden="true">↗</span></a>
            )}
            {action.kind === 'link' && (
              <Link className="button button-dark" to={action.to}>{action.label} <span aria-hidden="true">→</span></Link>
            )}
            {action.kind === 'overlay' && (
              <button type="button" className="button button-dark" onClick={() => setActiveOverlay(action.overlay)}>
                {action.label} <span aria-hidden="true">↗</span>
              </button>
            )}
          </article>
        ))}
      </section>

      {activeOverlay === 'training' && (
        <Overlay title="Request a training" onClose={() => setActiveOverlay(null)}>
          <ContactForm type="training" showOrg submitLabel="Request a training" />
        </Overlay>
      )}
      {activeOverlay === 'partnership' && (
        <Overlay title="Discuss partnership" onClose={() => setActiveOverlay(null)}>
          <ContactForm type="partnership" showOrg submitLabel="Send" />
        </Overlay>
      )}
      {activeOverlay === 'internship' && (
        <InternshipOverlay onClose={() => setActiveOverlay(null)} />
      )}
    </>
  );
}
