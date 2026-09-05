import BottomCta from '../../components/site/BottomCta';
import PageHero from '../../components/site/PageHero';
import SponsorBar from '../../components/common/SponsorBar';
import FundsAllocationChart from '../../components/common/FundsAllocationChart';
import EditablePage from '../../components/site/EditablePage';
import EditableText from '../../components/site/EditableText';
import CustomBlocks from '../../components/site/blocks/CustomBlocks';

const pillars = [
  ['Healing-Centered Boxing', 'Boxing as a structured tool for regulation, discipline, and confidence — not the end goal, the vehicle.'],
  ['Mentorship', 'Consistent, trusted adults who walk alongside youth through decisions, setbacks, and growth.'],
  ['— pillar 3 —', 'Owner to name and describe the third pillar.'],
];

const values = [
  ['Agency', 'People deserve meaningful choices, respected boundaries, and a voice in what happens next.'],
  ['Dignity', 'No one is reduced to a diagnosis, a circumstance, or the worst thing that happened to them.'],
  ['Safety', 'Trust is built through consistency, appropriate boundaries, and environments designed for belonging.'],
  ['Accountability', 'We set clear expectations, communicate honestly, and measure what our programs are meant to change.'],
  ['Collaboration', 'We share the work, connect people to appropriate support, and value impact over recognition.'],
];

const leaders = [
  ['Martye Perkins', 'Founder, Chief Executive Officer & Board Chair', '/headshots/Martye.webp'],
  ['Julian “JP” Powers', 'Director, Strength & Conditioning Coach & Board Vice Chair', null],
  ['Becky “Coach Bek” Perkins', 'Certified Amateur Boxing Coach & Board Secretary', null],
  ['Peter Phan', 'Marketing Director & Youth Mentor', '/headshots/peter.webp'],
  ['Ryan “Ace” Beacham', 'Media & Production Director', '/headshots/ryan.webp'],
];

export default function AboutPage() {
  return (
    <EditablePage slug="about">
      <PageHero
        eyebrow={<EditableText id="about.hero.eyebrow" defaultValue="About Boxing For Justice" />}
        title={<EditableText id="about.hero.title" defaultValue="Rooted in survival." />}
        accent={<EditableText id="about.hero.accent" defaultValue="Built for restoration." />}
        lede={
          <EditableText
            as="span"
            id="about.hero.lede"
            defaultValue="Boxing For Justice began with lived experience and a refusal to let silence have the final word. Today, that conviction powers a broader movement for safer youth, stronger families, and resilient communities."
          />
        }
        number="01"
      />

      <section className="work-section pillars-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span /> <EditableText id="about.pillars.eyebrow" defaultValue="Our 3 pillars" /></p>
            <h2>
              <EditableText id="about.pillars.title-line1" defaultValue="What we" /><br />
              <EditableText id="about.pillars.title-line2" defaultValue="stand on." />
            </h2>
          </div>
        </div>
        <div className="focus-grid">
          {pillars.map(([name, description], index) => (
            <article className="focus-card" key={name}>
              <span className="focus-number">0{index + 1}</span>
              <div>
                <EditableText as="h3" id={`about.pillars.${index}.name`} defaultValue={name} />
                <EditableText as="p" id={`about.pillars.${index}.description`} defaultValue={description} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="story-section" id="purpose">
        <div className="story-rail">
          <span><EditableText id="about.story.fact-founded" defaultValue="Founded 2024" /></span>
          <span><EditableText id="about.story.fact-location" defaultValue="Riverside County, CA" /></span>
          <span><EditableText id="about.story.fact-status" defaultValue="501(c)(3) public charity" /></span>
        </div>
        <div className="story-content">
          <p className="eyebrow"><span /> <EditableText id="about.story.eyebrow" defaultValue="The story behind the mission" /></p>
          <h2>
            <EditableText id="about.story.title-line1" defaultValue="When pain becomes purpose," /><br />
            <EditableText id="about.story.title-line2" defaultValue="silence loses its power." />
          </h2>
          <div className="story-columns">
            <p>
              <EditableText
                as="span"
                id="about.story.paragraph-1"
                defaultValue="Founder Martye Perkins is a survivor of exploitation, physical abuse, and sexual abuse. Her experience showed her how secrecy can protect harmful systems while isolating the very people who need support."
              />
            </p>
            <p>
              <EditableText
                as="span"
                id="about.story.paragraph-2"
                defaultValue="Walking alongside a young relative through the aftermath of severe abuse made the need even clearer: families require better tools, young people need safe adults, and behavior must be understood in the context of what a child may have survived."
              />
            </p>
          </div>
          <blockquote>
            &ldquo;<EditableText
              as="span"
              id="about.story.quote"
              defaultValue="My pain was not mine to carry in silence. It became the foundation of a purpose: creating spaces where young people are empowered, not overlooked, and where their voices are heard."
            />&rdquo;
            <cite>— <EditableText id="about.story.quote-cite" defaultValue="Martye Perkins, Founder" /></cite>
          </blockquote>
        </div>
      </section>

      <section className="mission-vision">
        <article>
          <span><EditableText id="about.mission.label" defaultValue="Our mission" /></span>
          <EditableText as="h2" id="about.mission.title" defaultValue="Protect. Educate. Restore." />
          <EditableText
            as="p"
            id="about.mission.text"
            defaultValue="We protect vulnerable people, prevent harm, and help youth, families, and survivors reclaim their power through education, advocacy, mentorship, community partnership, and healing-centered physical activity."
          />
        </article>
        <article>
          <span><EditableText id="about.vision.label" defaultValue="Our vision" /></span>
          <EditableText as="h2" id="about.vision.title" defaultValue="Communities where power is shared." />
          <EditableText
            as="p"
            id="about.vision.text"
            defaultValue="We envision safer communities where youth are supported, survivors are treated with dignity, families can reach trusted resources, and every person knows their voice matters."
          />
        </article>
      </section>

      <section className="values-section">
        <div className="values-heading">
          <p className="eyebrow"><span /> <EditableText id="about.values.eyebrow" defaultValue="How we show up" /></p>
          <h2>
            <EditableText id="about.values.title-line1" defaultValue="Values you can" /><br />
            <EditableText id="about.values.title-line2" defaultValue="feel in the room." />
          </h2>
        </div>
        <div className="values-list">
          {values.map(([name, description], index) => (
            <article key={name}>
              <span>0{index + 1}</span>
              <EditableText as="h3" id={`about.values.${index}.name`} defaultValue={name} />
              <EditableText as="p" id={`about.values.${index}.description`} defaultValue={description} />
            </article>
          ))}
        </div>
      </section>

      <section className="work-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span /> <EditableText id="about.funds.eyebrow" defaultValue="Where the money goes" /></p>
            <h2>
              <EditableText id="about.funds.title-line1" defaultValue="Funds," /><br />
              <EditableText id="about.funds.title-line2" defaultValue="accounted for." />
            </h2>
          </div>
          <p className="section-intro">
            <EditableText
              as="span"
              id="about.funds.intro"
              defaultValue="A transparent look at how donations and program funding are put to work. Figures below are illustrative placeholders."
            />
          </p>
        </div>
        <FundsAllocationChart />
      </section>

      <section className="work-section" id="sponsors">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span /> <EditableText id="about.sponsors.eyebrow" defaultValue="Sponsors" /></p>
            <h2>
              <EditableText id="about.sponsors.title-line1" defaultValue="Backed by" /><br />
              <EditableText id="about.sponsors.title-line2" defaultValue="our community." />
            </h2>
          </div>
        </div>
        <SponsorBar />
      </section>

      <section className="work-section" id="partners">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span /> <EditableText id="about.partners.eyebrow" defaultValue="Partners" /></p>
            <h2>
              <EditableText id="about.partners.title-line1" defaultValue="We don't do" /><br />
              <EditableText id="about.partners.title-line2" defaultValue="this alone." />
            </h2>
          </div>
        </div>
        <EditableText
          as="div"
          className="content-placeholder"
          id="about.partners.placeholder"
          defaultValue="Owner to add confirmed partner organizations here."
        />
      </section>

      <section className="leadership-section" id="staff">
        <div className="section-heading compact-heading">
          <div>
            <p className="eyebrow"><span /> <EditableText id="about.staff.eyebrow" defaultValue="Leadership & staff" /></p>
            <h2>
              <EditableText id="about.staff.title-line1" defaultValue="People in" /><br />
              <EditableText id="about.staff.title-line2" defaultValue="your corner." />
            </h2>
          </div>
          <p className="section-intro">
            <EditableText
              as="span"
              id="about.staff.intro"
              defaultValue="Coaches, mentors, educators, and community leaders bring professional knowledge and lived experience to a mission grounded in responsibility."
            />
          </p>
        </div>
        <div className="leader-grid">
          {leaders.map(([name, role, photo], index) => (
            <article key={name}>
              {photo ? (
                <img className="leader-photo" src={photo} alt="" aria-hidden="true" />
              ) : (
                <span>0{index + 1}</span>
              )}
              <EditableText as="h3" id={`about.staff.${index}.name`} defaultValue={name} />
              <EditableText as="p" id={`about.staff.${index}.role`} defaultValue={role} />
            </article>
          ))}
        </div>
      </section>
      <CustomBlocks sectionId="custom" />
      <BottomCta />
    </EditablePage>
  );
}
