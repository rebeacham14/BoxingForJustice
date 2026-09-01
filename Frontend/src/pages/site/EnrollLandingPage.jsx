import BottomCta from '../../components/site/BottomCta';
import PageHero from '../../components/site/PageHero';
import EditablePage from '../../components/site/EditablePage';
import EditableText from '../../components/site/EditableText';
import CustomBlocks from '../../components/site/blocks/CustomBlocks';

export default function EnrollLandingPage() {
  return (
    <EditablePage slug="enroll">
      <PageHero
        eyebrow={<EditableText id="enroll.hero.eyebrow" defaultValue="Enroll a participant" />}
        title={<EditableText id="enroll.hero.title" defaultValue="Ready to" />}
        accent={<EditableText id="enroll.hero.accent" defaultValue="get started?" />}
        lede={
          <EditableText
            as="span"
            id="enroll.hero.lede"
            defaultValue="Registration, event info, and payment all live on our enrollment portal. Create an account there to enroll a participant, buy tickets, and manage your orders."
          />
        }
        number="06"
      />

      <section className="work-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span /> <EditableText id="enroll.how.eyebrow" defaultValue="How it works" /></p>
            <h2>
              <EditableText id="enroll.how.title-line1" defaultValue="One portal." /><br />
              <EditableText id="enroll.how.title-line2" defaultValue="Everything you need." />
            </h2>
          </div>
          <p className="section-intro">
            <EditableText
              as="span"
              id="enroll.how.intro"
              defaultValue="The enrollment portal keeps a signed-in account, so you can come back anytime to check on an enrollment or order."
            />
          </p>
        </div>
        <div className="focus-grid">
          <article className="focus-card">
            <span className="focus-number">01</span>
            <div>
              <EditableText as="h3" id="enroll.how.0.title" defaultValue="Create an account" />
              <EditableText as="p" id="enroll.how.0.text" defaultValue="Sign in or sign up on the enrollment portal to get started." />
            </div>
          </article>
          <article className="focus-card">
            <span className="focus-number">02</span>
            <div>
              <EditableText as="h3" id="enroll.how.1.title" defaultValue="Enroll or buy tickets" />
              <EditableText as="p" id="enroll.how.1.text" defaultValue="Enroll a participant in a program, or purchase event tickets." />
            </div>
          </article>
        </div>
      </section>

      <section className="contact-panel">
        <div>
          <p className="eyebrow eyebrow-light"><span /> <EditableText id="enroll.portal.eyebrow" defaultValue="Go to the portal" /></p>
          <h2>
            <EditableText id="enroll.portal.title-line1" defaultValue="Enrollment" /><br />
            <EditableText id="enroll.portal.title-line2" defaultValue="portal." />
          </h2>
        </div>
        <div>
          <EditableText
            as="p"
            id="enroll.portal.text"
            defaultValue="You'll leave this page and land on the enrollment portal, where you can sign in and get started."
          />
          <a className="button button-red" href="/mma-events">
            <EditableText id="enroll.portal.cta" defaultValue="Go to the enrollment portal" /> <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
      <CustomBlocks sectionId="custom" />
      <BottomCta />
    </EditablePage>
  );
}
