import { Link } from 'react-router-dom';
import BottomCta from '../../components/site/BottomCta';
import PageHero from '../../components/site/PageHero';
import AccordionItem from '../../components/common/AccordionItem';
import FlipCard from '../../components/common/FlipCard';
import EditablePage from '../../components/site/EditablePage';
import EditableText from '../../components/site/EditableText';
import EditableSection from '../../components/site/EditableSection';
import ImageUploadButton from '../../components/site/ImageUploadButton';
import useEditableImage from '../../hooks/useEditableImage';
import useMovable from '../../hooks/useMovable';
import CustomBlocks from '../../components/site/blocks/CustomBlocks';

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
  const featureMedia = useEditableImage('our-work.feature.media', '/misc/orders-boxing.jpg');
  const featureMediaMove = useMovable('our-work.feature.media');

  return (
    <EditablePage slug="our-work">
      <PageHero
        eyebrow={<EditableText id="our-work.hero.eyebrow" defaultValue="What we do" />}
        title={<EditableText id="our-work.hero.title" defaultValue="One mission." />}
        accent={<EditableText id="our-work.hero.accent" defaultValue="Multiple pathways." />}
        lede={
          <EditableText
            as="span"
            id="our-work.hero.lede"
            defaultValue="Harm is connected. Healing must be, too. Our programs meet people at different points in their lives while advancing the same goal: safety, agency, resilience, and a future shaped by possibility."
          />
        }
        number="03"
      />

      <EditableSection as="div" sectionId="feature" className="feature-card">
        <div>
          <p className="feature-card-tag"><EditableText id="our-work.feature.tag" defaultValue="Boxing & life skills" /></p>
          <h3>
            <EditableText id="our-work.feature.title-line1" defaultValue="One program." /><br />
            <EditableText id="our-work.feature.title-line2" defaultValue="Two youth pathways." />
          </h3>
          <EditableText
            as="p"
            id="our-work.feature.text"
            defaultValue="Beginning and Elite Boxing pathways build fitness, discipline, and confidence — with a route to USA Boxing competition for athletes who are ready. Full details now live on the enrollment portal."
          />
          <Link className="button button-dark" to="/mma-events/about#boxing-life-skills">
            <EditableText id="our-work.feature.cta" defaultValue="See the full breakdown" /> <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div
          className={`feature-card-media ${featureMediaMove.className}`.trim()}
          style={{
            backgroundImage: `url(${featureMedia.image})`,
            position: featureMedia.canEdit ? 'relative' : undefined,
            ...featureMediaMove.style,
          }}
          aria-hidden={!featureMedia.canEdit}
          {...featureMediaMove.props}
        >
          {featureMedia.canEdit && <ImageUploadButton onFile={featureMedia.handleFile} error={featureMedia.error} />}
        </div>
      </EditableSection>

      <EditableSection as="section" sectionId="campaigns" className="program-section program-red" id="campaigns">
        <div className="program-index">01</div>
        <div className="program-title">
          <p className="eyebrow eyebrow-light"><span /> <EditableText id="our-work.campaigns.eyebrow" defaultValue="Campaigns" /></p>
          <h2>
            <EditableText id="our-work.campaigns.title-line1" defaultValue="2028" /><br /><strong><EditableText id="our-work.campaigns.title-line2" defaultValue="Olympics." /></strong>
          </h2>
        </div>
        <div className="program-detail">
          <EditableText
            as="p"
            className="program-lede"
            id="our-work.campaigns.lede"
            defaultValue="No past campaigns yet — this is the one we're building toward."
          />
          <EditableText
            as="p"
            id="our-work.campaigns.text"
            defaultValue="As the 2028 Olympics come to the region, BFJ is planning to partner with hotels, local businesses, and organizations to confront issues like prostitution and trafficking around USC and the surrounding areas during the Games."
          />
        </div>
      </EditableSection>

      <EditableSection as="section" sectionId="fundraisers" className="program-section" id="fundraiser-events">
        <div className="program-index">02</div>
        <div className="program-title">
          <p className="eyebrow"><span /> <EditableText id="our-work.fundraisers.eyebrow" defaultValue="Fundraiser events" /></p>
          <h2>
            <EditableText id="our-work.fundraisers.title-line1" defaultValue="Coming" /><br /><strong><EditableText id="our-work.fundraisers.title-line2" defaultValue="soon." /></strong>
          </h2>
        </div>
        <div className="program-detail">
          <EditableText
            as="div"
            className="content-placeholder"
            id="our-work.fundraisers.placeholder"
            defaultValue="Owner to add upcoming fundraiser events."
          />
        </div>
      </EditableSection>

      <EditableSection as="section" sectionId="articles" className="program-section" id="articles">
        <div className="program-index">03</div>
        <div className="program-title">
          <p className="eyebrow"><span /> <EditableText id="our-work.articles.eyebrow" defaultValue="Articles" /></p>
          {/* New block ids (not title-line1/2) on purpose: production Mongo
              already holds "Coming"/"soon." under the old ids, which would
              override these defaults. */}
          <h2>
            <EditableText id="our-work.articles.heading-line1" defaultValue="Related" /><br /><strong><EditableText id="our-work.articles.heading-line2" defaultValue="Articles." /></strong>
          </h2>
        </div>
        <div className="program-detail">
          <EditableText
            as="p"
            className="program-lede"
            id="our-work.articles.intro"
            defaultValue="Read about all the ways communities are being impacted."
          />
          <Link className="text-link" to="/articles">
            <EditableText id="our-work.articles.link" defaultValue="View all articles" /> <span aria-hidden="true">→</span>
          </Link>
        </div>
      </EditableSection>

      <EditableSection as="div" sectionId="callout" className="callout-bar">
        <EditableText as="h3" id="our-work.callout.title" defaultValue="Know the signs. Name the harm. Build safety." />
        <EditableText as="p" id="our-work.callout.subline" defaultValue="Owner to add subline." />
      </EditableSection>

      <EditableSection as="section" sectionId="educating" className="program-section program-red">
        <div className="program-index">04</div>
        <div className="program-title">
          <p className="eyebrow eyebrow-light"><span /> <EditableText id="our-work.educating.eyebrow" defaultValue="Educating" /></p>
          <h2>
            <EditableText id="our-work.educating.title-line1" defaultValue="Know the signs." /><br />
            <EditableText id="our-work.educating.title-line2" defaultValue="Name the harm." /><br />
            <strong><EditableText id="our-work.educating.title-line3" defaultValue="Build safety." /></strong>
          </h2>
        </div>
        <div className="program-detail">
          <EditableText
            as="p"
            className="program-lede"
            id="our-work.educating.lede"
            defaultValue="Prevention begins when people have the language and confidence to recognize unsafe behavior, establish boundaries, and reach trusted help."
          />
          <EditableText
            as="p"
            id="our-work.educating.text"
            defaultValue="We educate youth, parents, guardians, kinship caregivers, schools, and community groups through clear, age-appropriate conversations about vulnerability, exploitation, abuse, and everyday pressures."
          />
          <div className="accordion">
            {educationTopics.map((topic, index) => (
              <AccordionItem title={topic} key={topic}>
                <EditableText as="span" id={`our-work.educating.topic.${index}.detail`} defaultValue="Owner to add detail." />
              </AccordionItem>
            ))}
          </div>
          <Link className="button button-dark" to="/get-involved#training">
            <EditableText id="our-work.educating.cta" defaultValue="Request a training" />
          </Link>
        </div>
      </EditableSection>

      <EditableSection as="section" sectionId="equipping" className="program-section">
        <div className="program-index">05</div>
        <div className="program-title">
          <p className="eyebrow"><span /> <EditableText id="our-work.equipping.eyebrow" defaultValue="Equipping" /></p>
          <h2>
            <EditableText id="our-work.equipping.title-line1" defaultValue="Today's strength." /><br /><strong><EditableText id="our-work.equipping.title-line2" defaultValue="Tomorrow's leaders." /></strong>
          </h2>
        </div>
        <div className="program-detail">
          <EditableText
            as="p"
            className="program-lede"
            id="our-work.equipping.lede"
            defaultValue="Young people are more than the challenges they carry. We help them build skills that support healthy decisions, relationships, and goals."
          />
          <EditableText
            as="p"
            id="our-work.equipping.text"
            defaultValue="Mentorship, education, and structured activities help participants develop self-awareness, problem-solving, communication, perseverance, and community responsibility. Every success becomes evidence that a different future can be built."
          />
          <div className="mini-grid">
            {equipping.map(({ front, back }, index) => (
              <FlipCard
                key={front}
                front={<><span>0{index + 1}</span><strong><EditableText id={`our-work.equipping.${index}.front`} defaultValue={front} /></strong></>}
                back={<EditableText as="span" id={`our-work.equipping.${index}.back`} defaultValue={back} />}
              />
            ))}
          </div>
          <Link className="button button-dark" to="/get-involved#mma-program">
            <EditableText id="our-work.equipping.cta" defaultValue="Refer a young person" />
          </Link>
        </div>
      </EditableSection>

      <EditableSection as="section" sectionId="encouraging" className="program-section program-red">
        <div className="program-index">06</div>
        <div className="program-title">
          <p className="eyebrow eyebrow-light"><span /> <EditableText id="our-work.encouraging.eyebrow" defaultValue="Encouraging" /></p>
          <h2>
            <EditableText id="our-work.encouraging.title-line1" defaultValue="Community that" /><br /><strong><EditableText id="our-work.encouraging.title-line2" defaultValue="shows up." /></strong>
          </h2>
        </div>
        <div className="program-detail">
          <EditableText
            as="div"
            className="content-placeholder content-placeholder-light"
            id="our-work.encouraging.placeholder"
            defaultValue="Owner to add encouragement/mentorship stories and content."
          />
        </div>
      </EditableSection>

      <EditableSection as="section" sectionId="partnerships" className="partnership-model" id="partnerships">
        <p className="eyebrow"><span /> <EditableText id="our-work.partnerships.eyebrow" defaultValue="Community partnership" /></p>
        <h2>
          <EditableText id="our-work.partnerships.title-line1" defaultValue="We do not compete" /><br />
          <EditableText id="our-work.partnerships.title-line2" defaultValue="for credit." /> <strong><EditableText id="our-work.partnerships.title-accent" defaultValue="We multiply impact." /></strong>
        </h2>
        <EditableText
          as="p"
          id="our-work.partnerships.text"
          defaultValue="Schools, nonprofits, advocates, clinicians, caregivers, and community leaders all hold part of the solution. Through outreach, education, referrals, shared resources, and coordinated efforts, we help people reach the right support while helping partner organizations advance their own missions."
        />
        <Link className="button button-red" to="/get-involved#partnership">
          <EditableText id="our-work.partnerships.cta" defaultValue="Build something together" />
        </Link>
      </EditableSection>
      <CustomBlocks sectionId="custom" />
      <BottomCta />
    </EditablePage>
  );
}
