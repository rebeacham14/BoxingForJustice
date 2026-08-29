import BottomCta from '../../components/site/BottomCta';
import PageHero from '../../components/site/PageHero';

export default function EnrollLandingPage() {
  return (
    <>
      <PageHero
        eyebrow="Enroll a participant"
        title="Ready to"
        accent="get started?"
        lede="Registration, event info, and payment all live on our enrollment portal. Create an account there to enroll a participant, buy tickets, and manage your orders."
        number="06"
      />

      <section className="work-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span /> How it works</p>
            <h2>One portal.<br />Everything you need.</h2>
          </div>
          <p className="section-intro">
            The enrollment portal keeps a signed-in account, so you can come
            back anytime to check on an enrollment or order.
          </p>
        </div>
        <div className="focus-grid">
          <article className="focus-card">
            <span className="focus-number">01</span>
            <div>
              <h3>Create an account</h3>
              <p>Sign in or sign up on the enrollment portal to get started.</p>
            </div>
          </article>
          <article className="focus-card">
            <span className="focus-number">02</span>
            <div>
              <h3>Enroll or buy tickets</h3>
              <p>Enroll a participant in a program, or purchase event tickets.</p>
            </div>
          </article>
        </div>
      </section>

      <section className="contact-panel">
        <div>
          <p className="eyebrow eyebrow-light"><span /> Go to the portal</p>
          <h2>Enrollment<br />portal.</h2>
        </div>
        <div>
          <p>
            You&apos;ll leave this page and land on the enrollment portal, where
            you can sign in and get started.
          </p>
          <a className="button button-red" href="/mma-events">
            Go to the enrollment portal <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
      <BottomCta />
    </>
  );
}
