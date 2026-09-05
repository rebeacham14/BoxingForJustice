import { Link } from 'react-router-dom';
import BottomCta from '../../components/site/BottomCta';
import PageHero from '../../components/site/PageHero';
import UsPolicyMap from '../../components/impact/UsPolicyMap';
import EditablePage from '../../components/site/EditablePage';
import EditableText from '../../components/site/EditableText';
import EditableSection from '../../components/site/EditableSection';
import CustomBlocks from '../../components/site/blocks/CustomBlocks';

const outcomes = [
  ['Participation', 'Consistent engagement, attendance, retention, and completion'],
  ['Personal growth', 'Self-reported confidence, emotional awareness, and use of regulation skills'],
  ['Knowledge', 'Understanding of boundaries, warning signs, safety, and help-seeking'],
  ['Progress', 'Boxing or fitness development, goal completion, and demonstrated discipline'],
  ['Community reach', 'Training participants, partner activity, referrals, and connections to support'],
];

const changeSteps = [
  { label: '01 / Begin', title: 'Create safety & access', text: 'Trusted adults, appropriate choices, clear expectations, and welcoming spaces make participation possible.' },
  { label: '02 / Practice', title: 'Build practical skills', text: 'Education, mentoring, movement, breathing, repetition, and reflection turn ideas into usable tools.' },
  { label: '03 / Strengthen', title: 'Reinforce agency', text: 'Participants experience progress, make decisions, recover from setbacks, and see their own capacity grow.' },
  { label: '04 / Lead', title: 'Carry change forward', text: 'Skills move beyond the program into school, relationships, work, family, service, and leadership.' },
];

const factBand = [
  { value: '2024', label: 'Year founded' },
  { value: '8–21', label: 'Youth & young adults served' },
  { value: '501(c)(3)', label: 'IRS-recognized public charity' },
  { value: '99-3175496', label: 'Employer identification number' },
];

export default function ImpactPage() {
  return (
    <EditablePage slug="impact">
      <PageHero
        eyebrow={<EditableText id="impact.hero.eyebrow" defaultValue="Impact & accountability" />}
        title={<EditableText id="impact.hero.title" defaultValue="Measure what" />}
        accent={<EditableText id="impact.hero.accent" defaultValue="matters." />}
        lede={
          <EditableText
            as="span"
            id="impact.hero.lede"
            defaultValue="Trust is earned through clear goals, responsible stewardship, honest learning, and evidence that programs are creating the changes they were designed to make."
          />
        }
        number="04"
      />

      <EditableSection as="section" sectionId="policies" className="work-section" id="policies">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span /> <EditableText id="impact.policies.eyebrow" defaultValue="Policies" /></p>
            <h2>
              <EditableText id="impact.policies.title-line1" defaultValue="What's on" /><br />
              <EditableText id="impact.policies.title-line2" defaultValue="the books." />
            </h2>
          </div>
          <p className="section-intro">
            <EditableText
              as="span"
              id="impact.policies.intro"
              defaultValue="A state-by-state look at the policies that shape how kids are protected. Content below is a placeholder — the owner will add real policy summaries."
            />
          </p>
        </div>
        <EditableText
          as="div"
          className="content-placeholder"
          id="impact.policies.placeholder"
          defaultValue="Owner to add policy tracking content."
        />
      </EditableSection>

      <EditableSection as="section" sectionId="geo" className="work-section" id="geo-data">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span /> <EditableText id="impact.geo.eyebrow" defaultValue="GEO Data" /></p>
            <h2>
              <EditableText id="impact.geo.title-line1" defaultValue="Click a state." /><br />
              <EditableText id="impact.geo.title-line2" defaultValue="See the picture." />
            </h2>
          </div>
          <p className="section-intro">
            <EditableText as="span" id="impact.geo.intro" defaultValue="Click or tap any state to see its policies and helpful data." />
          </p>
        </div>
        <UsPolicyMap />
      </EditableSection>

      <EditableSection as="section" sectionId="facts" className="fact-band">
        {factBand.map((fact, index) => (
          <article key={fact.label}>
            <EditableText as="strong" id={`impact.facts.${index}.value`} defaultValue={fact.value} />
            <EditableText as="span" id={`impact.facts.${index}.label`} defaultValue={fact.label} />
          </article>
        ))}
      </EditableSection>

      <EditableSection as="section" sectionId="change" className="change-model">
        <div className="change-heading">
          <p className="eyebrow"><span /> <EditableText id="impact.change.eyebrow" defaultValue="Our path to change" /></p>
          <h2>
            <EditableText id="impact.change.title-line1" defaultValue="From a safe moment" /><br />
            <EditableText id="impact.change.title-line2" defaultValue="to a stronger future." />
          </h2>
          <EditableText
            as="p"
            id="impact.change.intro"
            defaultValue="Our model links every activity to an intended result. That keeps the work focused and gives funders, families, and partners a clear way to understand how change is expected to happen."
          />
        </div>
        <div className="change-steps">
          {changeSteps.map((step, index) => (
            <article key={step.label}>
              <EditableText as="span" id={`impact.change.${index}.label`} defaultValue={step.label} />
              <EditableText as="h3" id={`impact.change.${index}.title`} defaultValue={step.title} />
              <EditableText as="p" id={`impact.change.${index}.text`} defaultValue={step.text} />
            </article>
          ))}
        </div>
      </EditableSection>

      <EditableSection as="section" sectionId="outcomes" className="outcomes-section">
        <div className="section-heading compact-heading">
          <div>
            <p className="eyebrow eyebrow-light"><span /> <EditableText id="impact.outcomes.eyebrow" defaultValue="What we measure" /></p>
            <h2>
              <EditableText id="impact.outcomes.title-line1" defaultValue="Evidence with" /><br /><strong><EditableText id="impact.outcomes.title-line2" defaultValue="integrity." /></strong>
            </h2>
          </div>
          <p className="section-intro">
            <EditableText
              as="span"
              id="impact.outcomes.intro"
              defaultValue="We are building a consistent evaluation practice that combines participation data, feedback, observed progress, and partner reach."
            />
          </p>
        </div>
        <div className="outcomes-list">
          {outcomes.map(([title, description], index) => (
            <article key={title}>
              <span>0{index + 1}</span>
              <EditableText as="h3" id={`impact.outcomes.${index}.title`} defaultValue={title} />
              <EditableText as="p" id={`impact.outcomes.${index}.description`} defaultValue={description} />
            </article>
          ))}
        </div>
      </EditableSection>

      <EditableSection as="section" sectionId="integrity" className="integrity-section">
        <div>
          <p className="eyebrow"><span /> <EditableText id="impact.integrity.eyebrow" defaultValue="Our commitment" /></p>
          <h2>
            <EditableText id="impact.integrity.title-line1" defaultValue="People are never" /><br />
            <EditableText id="impact.integrity.title-line2" defaultValue="marketing material." />
          </h2>
        </div>
        <div>
          <EditableText
            as="p"
            id="impact.integrity.paragraph-1"
            defaultValue="Participant stories can be powerful, but dignity comes first. We will seek appropriate permission, protect privacy, avoid sensationalizing trauma, and never inflate numbers to make the work appear larger than it is."
          />
          <EditableText
            as="p"
            id="impact.integrity.paragraph-2"
            defaultValue="As verified program data and approved participant stories are prepared, this site will publish them with context: what was measured, who was included, and what the results can—and cannot—tell us."
          />
        </div>
      </EditableSection>

      <EditableSection as="section" sectionId="funder" className="funder-section">
        <div className="funder-seal">
          BFJ
          <span>
            <EditableText id="impact.funder.seal-line1" defaultValue="Funder" /><br />
            <EditableText id="impact.funder.seal-line2" defaultValue="readiness" />
          </span>
        </div>
        <div>
          <p className="eyebrow"><span /> <EditableText id="impact.funder.eyebrow" defaultValue="For grantmakers & sponsors" /></p>
          <h2>
            <EditableText id="impact.funder.title-line1" defaultValue="A mission built" /><br />
            <EditableText id="impact.funder.title-line2" defaultValue="for partnership." />
          </h2>
          <EditableText
            as="p"
            id="impact.funder.text"
            defaultValue="Boxing For Justice is an IRS-recognized 501(c)(3) public charity. We welcome conversations about aligned funding, program sponsorship, in-kind support, collaborative proposals, and responsible capacity building."
          />
          <div className="funder-links">
            <a href="https://www.guidestar.org/Profile/99-3175496">
              <EditableText id="impact.funder.link-guidestar" defaultValue="View GuideStar profile" /> <span>↗</span>
            </a>
            <Link to="/get-involved#partnership">
              <EditableText id="impact.funder.link-partnership" defaultValue="Discuss a partnership" /> <span>→</span>
            </Link>
          </div>
        </div>
      </EditableSection>
      <CustomBlocks sectionId="custom" />
      <BottomCta />
    </EditablePage>
  );
}
