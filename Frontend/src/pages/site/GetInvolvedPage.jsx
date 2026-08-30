import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/site/PageHero';
import Overlay from '../../components/common/Overlay';
import ContactForm from '../../components/site/ContactForm';
import InternshipOverlay from '../../components/site/InternshipOverlay';
import EditablePage from '../../components/site/EditablePage';
import EditableText from '../../components/site/EditableText';

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
    <EditablePage slug="get-involved">
      <PageHero
        eyebrow={<EditableText id="get-involved.hero.eyebrow" defaultValue="Get involved" />}
        title={<EditableText id="get-involved.hero.title" defaultValue="Justice is" />}
        accent={<EditableText id="get-involved.hero.accent" defaultValue="a team effort." />}
        lede={
          <EditableText
            as="span"
            id="get-involved.hero.lede"
            defaultValue="Whether you need support, want to strengthen your community, or are ready to invest in the mission, there is a clear place to begin."
          />
        }
        number="05"
      />

      <aside className="urgent-help" aria-labelledby="urgent-help-title">
        <div>
          <span><EditableText id="get-involved.urgent.eyebrow" defaultValue="Immediate support" /></span>
          <h2 id="urgent-help-title"><EditableText id="get-involved.urgent.title" defaultValue="If someone may be in danger" /></h2>
          <EditableText as="p" id="get-involved.urgent.text" defaultValue="Boxing For Justice is not an emergency service or crisis hotline." />
        </div>
        <div className="help-links">
          <a href="tel:911">
            <EditableText as="strong" id="get-involved.urgent.0.label" defaultValue="Immediate danger" />
            <EditableText as="span" id="get-involved.urgent.0.detail" defaultValue="Call 911" />
          </a>
          <a href="https://humantraffickinghotline.org/en/get-help">
            <EditableText as="strong" id="get-involved.urgent.1.label" defaultValue="Human trafficking support" />
            <EditableText as="span" id="get-involved.urgent.1.detail" defaultValue="Call 1-888-373-7888 · Text 233733" />
          </a>
          <a href="https://988lifeline.org/get-help/">
            <EditableText as="strong" id="get-involved.urgent.2.label" defaultValue="Mental health crisis support" />
            <EditableText as="span" id="get-involved.urgent.2.detail" defaultValue="Call or text 988" />
          </a>
        </div>
      </aside>

      <section className="contact-panel">
        <div>
          <p className="eyebrow eyebrow-light"><span /> <EditableText id="get-involved.contact.eyebrow" defaultValue="Not sure where to begin?" /></p>
          <h2>
            <EditableText id="get-involved.contact.title-line1" defaultValue="Tell us what" /><br />
            <EditableText id="get-involved.contact.title-line2" defaultValue="brings you here." />
          </h2>
        </div>
        <div>
          <EditableText
            as="p"
            id="get-involved.contact.text"
            defaultValue="Send a brief note and we will help route your question to the right person. Please do not include confidential details about abuse, exploitation, health, or a minor in your initial email."
          />
          <a className="button button-red" href="mailto:info@boxingforjustice.org?subject=Website%20inquiry">
            <EditableText id="get-involved.contact.cta" defaultValue="Email Boxing For Justice" />
          </a>
        </div>
      </section>

      <section className="involvement-list">
        {actions.map((action, index) => (
          <article className="involvement-card" id={action.id} key={action.id}>
            <div className="involvement-number">0{index + 1}</div>
            <div className="involvement-content">
              <EditableText as="span" id={`get-involved.action.${index}.audience`} defaultValue={action.audience} />
              <EditableText as="h2" id={`get-involved.action.${index}.title`} defaultValue={action.title} />
              <EditableText as="p" id={`get-involved.action.${index}.text`} defaultValue={action.text} />
            </div>
            {action.kind === 'mailto' && (
              <a className="button button-dark" href={action.href}>
                <EditableText id={`get-involved.action.${index}.label`} defaultValue={action.label} /> <span aria-hidden="true">↗</span>
              </a>
            )}
            {action.kind === 'link' && (
              <Link className="button button-dark" to={action.to}>
                <EditableText id={`get-involved.action.${index}.label`} defaultValue={action.label} /> <span aria-hidden="true">→</span>
              </Link>
            )}
            {action.kind === 'overlay' && (
              <button type="button" className="button button-dark" onClick={() => setActiveOverlay(action.overlay)}>
                <EditableText id={`get-involved.action.${index}.label`} defaultValue={action.label} /> <span aria-hidden="true">↗</span>
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
    </EditablePage>
  );
}
