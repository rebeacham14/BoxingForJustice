import PageHero from '../../components/site/PageHero';

const actions = [
  {
    id: 'refer',
    audience: 'Families, caregivers & referral partners',
    title: 'Enroll or refer a participant',
    text: 'Ask about youth programming, mentorship, Beginning Boxing, Elite Boxing, or support for a veteran. We will help identify the most appropriate next conversation.',
    label: 'Start a referral',
    href: 'mailto:boxingforjustice@gmail.com?subject=Program%20referral',
  },
  {
    id: 'training',
    audience: 'Schools, nonprofits & community groups',
    title: 'Request education or training',
    text: 'Bring prevention education to your community around trafficking, exploitation, misconduct, abuse, bullying, peer pressure, substance misuse, boundaries, or help-seeking.',
    label: 'Request a training',
    href: 'mailto:boxingforjustice@gmail.com?subject=Education%20or%20training%20request',
  },
  {
    id: 'partner',
    audience: 'Nonprofits, funders & community leaders',
    title: 'Build a community partnership',
    text: 'Explore coordinated referrals, shared outreach, program sponsorship, collaborative grants, in-kind support, or a joint initiative that advances both missions.',
    label: 'Discuss partnership',
    href: 'mailto:boxingforjustice@gmail.com?subject=Community%20partnership',
  },
  {
    id: 'support',
    audience: 'Donors, sponsors & supporters',
    title: 'Fund the work',
    text: 'Donations and sponsorships support equipment, coaching, education, program access, athlete travel, and the practical resources required to serve young people well.',
    label: 'Donate securely',
    href: 'https://www.boxingforjustice.org/donationatetoday',
  },
  {
    id: 'volunteer',
    audience: 'Volunteers & skilled professionals',
    title: 'Contribute your time or expertise',
    text: 'Tell us about the skills you hope to share—from events and outreach to mentoring, education, media, administration, or specialized professional support.',
    label: 'Ask about volunteering',
    href: 'mailto:boxingforjustice@gmail.com?subject=Volunteer%20interest',
  },
];

export default function GetInvolvedPage() {
  return (
    <>
      <PageHero
        eyebrow="Get involved"
        title="Justice is"
        accent="a team effort."
        lede="Whether you need support, want to strengthen your community, or are ready to invest in the mission, there is a clear place to begin."
        number="04"
      />

      <section className="involvement-list">
        {actions.map((action, index) => (
          <article className="involvement-card" id={action.id} key={action.id}>
            <div className="involvement-number">0{index + 1}</div>
            <div className="involvement-content">
              <span>{action.audience}</span>
              <h2>{action.title}</h2>
              <p>{action.text}</p>
            </div>
            <a className="button button-dark" href={action.href}>{action.label} <span aria-hidden="true">↗</span></a>
          </article>
        ))}
      </section>

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
          <a className="button button-red" href="mailto:boxingforjustice@gmail.com?subject=Website%20inquiry">Email Boxing For Justice</a>
        </div>
      </section>

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
    </>
  );
}
