import { Link } from 'react-router-dom';
import EditablePage from '../../components/site/EditablePage';
import EditableText from '../../components/site/EditableText';
import EditableSection from '../../components/site/EditableSection';
import ImageUploadButton from '../../components/site/ImageUploadButton';
import ItemControls from '../../components/site/ItemControls';
import useEditableImage from '../../hooks/useEditableImage';
import useMovable from '../../hooks/useMovable';
import useEditableItemList from '../../hooks/useEditableItemList';
import CustomBlocks from '../../components/site/blocks/CustomBlocks';

const ACCENT_CYCLE = ['var(--gold)', 'var(--blue)', 'var(--red)', 'var(--purple)'];

const threeCs = [
  { label: 'Choice', caption: 'My voice matters.' },
  { label: 'Control', caption: 'I can choose my response.' },
  { label: 'Confidence', caption: 'I am more than what happened.' },
];

const focusAreas = [
  {
    number: '01',
    title: 'Prevention & Education',
    text: 'Practical education for youth, parents, caregivers, and community leaders on trafficking, grooming, abuse, bullying, substance misuse, and healthy boundaries.',
  },
  {
    number: '02',
    title: 'Boxing & Life Skills',
    text: 'Beginning and Elite Boxing pathways help youth build fundamentals, fitness, discipline, resilience, and confidence—with a route to USA Boxing competition for athletes who are ready.',
  },
  {
    number: '03',
    title: 'Community Partnership',
    text: 'Collaboration with nonprofits, educators, advocates, and service providers to close gaps and multiply impact across Riverside County.',
  },
];

const measures = [
  'Participation and consistent engagement',
  'Growth in emotional regulation and confidence',
  'Knowledge gained through prevention education',
  'Referrals, collaborations, and community reach',
];

const actionGrid = [
  { to: '/get-involved#mma-program', audience: 'For families', title: 'Enroll or refer a participant', image: '/Pics/back_of_kid_holding_flag.jpg' },
  { to: '/get-involved#training', audience: 'For organizations', title: 'Request education or training', image: '/Pics/kid_headshot_serious.jpg' },
  { to: '/get-involved#partnership', audience: 'For community leaders', title: 'Become a partner', image: '/misc/home-boxing.jpg' },
  { to: '/get-involved#internship', audience: 'For supporters', title: 'Volunteer or intern', image: '/misc/shop-boxing.jpg' },
];

function ActionCard({ itemId, index, total, list }) {
  const action = actionGrid[itemId] || { to: '/get-involved', audience: 'New audience', title: 'New action' };
  const { image, canEdit, error, handleFile } = useEditableImage(
    `home.get-involved.action.${itemId}.image`,
    action.image
  );

  return (
    // Upload control is a SIBLING of the <Link>, not nested inside it -
    // ImageUploadButton's fileInputRef.current.click() dispatches a real
    // bubbling click event, which would trigger the anchor's own navigation
    // if the button lived inside it. .action-card-wrap gives the absolutely
    // positioned button (see .bfj-image-upload in site.css) something to
    // anchor to instead.
    <div className="action-card-wrap" style={canEdit ? { display: 'block', position: 'relative' } : undefined}>
      <Link
        className="action-card"
        to={action.to}
        style={{ backgroundImage: `url(${image})`, '--card-accent': ACCENT_CYCLE[index % ACCENT_CYCLE.length] }}
      >
        <span className="action-card-audience"><EditableText id={`home.get-involved.action.${itemId}.audience`} defaultValue={action.audience} /></span>
        <strong className="action-card-title"><EditableText id={`home.get-involved.action.${itemId}.title`} defaultValue={action.title} /></strong>
        <em className="action-card-arrow">→</em>
      </Link>
      {canEdit && (
        <>
          <ImageUploadButton onFile={handleFile} error={error} />
          <ItemControls
            onMoveUp={() => list.moveItem(itemId, -1)}
            onMoveDown={() => list.moveItem(itemId, 1)}
            onRemove={() => list.removeItem(itemId)}
            isFirst={index === 0}
            isLast={index === total - 1}
            canRemove={total > 1}
          />
        </>
      )}
    </div>
  );
}

function FocusStep({ itemId, index, total, list }) {
  const area = focusAreas[itemId] || { title: 'New step', text: '' };

  return (
    <div className="connected-step" style={list.canEdit ? { position: 'relative' } : undefined}>
      {list.canEdit && (
        <ItemControls
          onMoveUp={() => list.moveItem(itemId, -1)}
          onMoveDown={() => list.moveItem(itemId, 1)}
          onRemove={() => list.removeItem(itemId)}
          isFirst={index === 0}
          isLast={index === total - 1}
          canRemove={total > 1}
        />
      )}
      <span className="connected-circle" style={{ background: ACCENT_CYCLE[index % ACCENT_CYCLE.length] }}>
        {String(index + 1).padStart(2, '0')}
      </span>
      <EditableText as="h3" id={`home.our-work.focus.${itemId}.title`} defaultValue={area.title} />
      <EditableText as="p" id={`home.our-work.focus.${itemId}.text`} defaultValue={area.text} />
      {index < total - 1 && <span className="connected-arrow" aria-hidden="true">→</span>}
    </div>
  );
}

function MeasureItem({ itemId, index, total, list }) {
  const measure = measures[itemId] ?? '';

  return (
    <div className="measure" style={list.canEdit ? { position: 'relative' } : undefined}>
      {list.canEdit && (
        <ItemControls
          onMoveUp={() => list.moveItem(itemId, -1)}
          onMoveDown={() => list.moveItem(itemId, 1)}
          onRemove={() => list.removeItem(itemId)}
          isFirst={index === 0}
          isLast={index === total - 1}
          canRemove={total > 1}
        />
      )}
      <span>0{index + 1}</span>
      <EditableText as="p" id={`home.impact.measure.${itemId}`} defaultValue={measure} />
    </div>
  );
}

export default function HomePage() {
  const heroPhoto = useEditableImage('home.top.photo', '/Pics/kid_coach_conversation.jpg');
  const heroPhotoMove = useMovable('home.top.photo');
  const focusList = useEditableItemList({ listId: 'home.our-work.focus', defaultItemIds: ['0', '1', '2'] });
  const measureList = useEditableItemList({ listId: 'home.impact.measure', defaultItemIds: ['0', '1', '2', '3'] });
  const actionList = useEditableItemList({ listId: 'home.get-involved.action', defaultItemIds: ['0', '1', '2', '3'] });

  return (
    <EditablePage slug="home">
      <EditableSection as="section" sectionId="top" className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span /> <EditableText id="home.top.eyebrow" defaultValue="Justice begins before the fight" /></p>
          <h1>
            <EditableText id="home.top.title" defaultValue="Power is not taken." /><br />
            <strong><EditableText id="home.top.title-accent" defaultValue="It is restored." /></strong>
          </h1>
          <p className="hero-lede">
            <EditableText
              as="span"
              id="home.top.lede"
              defaultValue="We protect vulnerable people, prevent harm, and help youth, families, and survivors reclaim their power. Boxing is one tool. The mission is healing, justice, and lasting change."
            />
          </p>

          <div className="icon-stat-row" aria-label="Choice, Control, Confidence — the Boxing For Justice 3 C's model">
            {threeCs.map((item, index) => (
              <div className="icon-stat" key={item.label}>
                <span className="icon-stat-chip" style={{ background: ACCENT_CYCLE[index] }}>0{index + 1}</span>
                <div>
                  <strong><EditableText id={`home.top.three-cs.${index}.label`} defaultValue={item.label} /></strong>
                  <small><EditableText id={`home.top.three-cs.${index}.caption`} defaultValue={item.caption} /></small>
                </div>
              </div>
            ))}
          </div>

          <div className="button-row">
            <Link className="button button-red" to="/get-involved#mma-program">
              <EditableText id="home.top.cta-primary" defaultValue="Refer a young person" />
            </Link>
            <Link className="text-link" to="/our-work">
              <EditableText id="home.top.cta-secondary" defaultValue="Explore our work" /> <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div
          className={`hero-photo ${heroPhotoMove.className}`.trim()}
          style={{ backgroundImage: `url(${heroPhoto.image})`, ...heroPhotoMove.style }}
          {...heroPhotoMove.props}
        >
          <div className="hero-photo-badge">
            <EditableText id="home.top.visual-kicker" defaultValue="Our youth-centered model" />
          </div>
          <div className="hero-photo-caption">
            <EditableText id="home.top.visual-statement" defaultValue="Not just winning fights." /><br />
            <strong><EditableText id="home.top.visual-statement-accent" defaultValue="Winning yourself back." /></strong>
          </div>
          {heroPhoto.canEdit && <ImageUploadButton onFile={heroPhoto.handleFile} error={heroPhoto.error} />}
        </div>
      </EditableSection>

      <EditableSection as="section" sectionId="why" className="manifesto" id="why">
        <div className="section-number">01 / Why we exist</div>
        <div className="manifesto-copy">
          <p className="eyebrow eyebrow-light"><span /> <EditableText id="home.why.eyebrow" defaultValue="Our purpose" /></p>
          <h2>
            <EditableText id="home.why.title" defaultValue="Trauma can steal choice, control, and confidence." /> <strong><EditableText id="home.why.title-accent" defaultValue="We help give them back." /></strong>
          </h2>
          <div className="manifesto-columns">
            <p>
              <EditableText
                as="span"
                id="home.why.paragraph-1"
                defaultValue="Boxing For Justice works at the intersection of violence prevention, education, advocacy, emotional wellness, and community collaboration. We create safe pathways for people to build strength without being defined by what they have endured."
              />
            </p>
            <p>
              <EditableText
                as="span"
                id="home.why.paragraph-2"
                defaultValue="Justice means more than responding after harm occurs. It means recognizing warning signs, preventing abuse, restoring dignity, and equipping communities to protect their most vulnerable members."
              />
            </p>
          </div>
        </div>
      </EditableSection>

      <EditableSection as="section" sectionId="our-work" className="connected-model" id="our-work">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span /> <EditableText id="home.our-work.eyebrow" defaultValue="One mission. Multiple pathways." /></p>
            <h2>
              <EditableText id="home.our-work.title-line1" defaultValue="Our work goes" /><br />
              <EditableText id="home.our-work.title-line2" defaultValue="beyond the ring." />
            </h2>
          </div>
          <p className="section-intro">
            <EditableText
              as="span"
              id="home.our-work.intro"
              defaultValue="We respond to connected challenges with a connected model—meeting people where they are and building practical routes toward safety, resilience, and leadership."
            />
          </p>
        </div>
        <div className="connected-row">
          {focusList.itemIds.map((itemId, index) => (
            <FocusStep key={itemId} itemId={itemId} index={index} total={focusList.itemIds.length} list={focusList} />
          ))}
        </div>
        {focusList.canEdit && (
          <button type="button" className="bfj-add-item" onClick={focusList.addItem}>+ Add step</button>
        )}
        {focusList.error && <span className="bfj-section-error">{focusList.error}</span>}
      </EditableSection>

      <EditableSection as="section" sectionId="quote" className="quote-band">
        <span className="quote-mark" aria-hidden="true">&ldquo;</span>
        <blockquote>
          <EditableText
            as="span"
            id="home.quote.text"
            defaultValue="We do not define young people by what they have endured. We help them discover the power they still hold."
          />
        </blockquote>
        <p><EditableText id="home.quote.attribution" defaultValue="Boxing For Justice" /></p>
      </EditableSection>

      <EditableSection as="section" sectionId="method" className="method-section">
        <div className="method-art">
          <video
            className="method-art-video"
            src="/Videos/shot_of_paperwaork_and_discussion.mp4"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
          <div className="method-art-overlay" aria-hidden="true" />
          <div className="corner-label">In their corner</div>
        </div>
        <div className="method-copy">
          <p className="eyebrow"><span /> <EditableText id="home.method.eyebrow" defaultValue="Boxing as a tool" /></p>
          <h2><EditableText id="home.method.title" defaultValue="We teach breathing before we teach punching." /></h2>
          <p>
            <EditableText
              as="span"
              id="home.method.paragraph"
              defaultValue="The ring becomes a structured place to notice emotion, practice a pause, and choose what happens next. Participants learn that strength is not losing control—it is knowing how to regain it."
            />
          </p>
          <ul className="check-list">
            <li><span>01</span> <EditableText id="home.method.check.0" defaultValue="Beginning Boxing welcomes youth at every experience level and builds strong fundamentals, fitness, and belonging." /></li>
            <li><span>02</span> <EditableText id="home.method.check.1" defaultValue="Elite Boxing prepares committed youth for the demands of USA Boxing competition and develops the 4 D's." /></li>
            <li><span>03</span> <EditableText id="home.method.check.2" defaultValue="Every level values personal growth as much as athletic progress." /></li>
          </ul>
          <Link className="text-link text-link-dark" to="/mma-events/about#boxing-life-skills">
            <EditableText id="home.method.cta" defaultValue="Find the right program" /> <span aria-hidden="true">→</span>
          </Link>
        </div>
      </EditableSection>

      <EditableSection as="section" sectionId="impact" className="impact-section" id="impact">
        <div className="section-number dark-number">02 / Accountability</div>
        <div className="impact-content">
          <p className="eyebrow eyebrow-light"><span /> <EditableText id="home.impact.eyebrow" defaultValue="Built for measurable change" /></p>
          <h2>
            <EditableText id="home.impact.title" defaultValue="Credibility lives in" /><br /><strong><EditableText id="home.impact.title-accent" defaultValue="what we can show." /></strong>
          </h2>
          <p className="impact-lede">
            <EditableText
              as="span"
              id="home.impact.lede"
              defaultValue="Our evaluation framework connects participation to meaningful changes in knowledge, behavior, resilience, and community reach. Program data and participant stories will make that progress visible."
            />
          </p>
          <div className="measure-grid">
            {measureList.itemIds.map((itemId, index) => (
              <MeasureItem key={itemId} itemId={itemId} index={index} total={measureList.itemIds.length} list={measureList} />
            ))}
          </div>
          {measureList.canEdit && (
            <button type="button" className="bfj-add-item" onClick={measureList.addItem}>+ Add measure</button>
          )}
          {measureList.error && <span className="bfj-section-error">{measureList.error}</span>}
          <div className="funder-note">
            <strong><EditableText id="home.impact.funder-heading" defaultValue="For funders & community partners" /></strong>
            <p>
              <EditableText
                as="span"
                id="home.impact.funder-text"
                defaultValue="Our model is designed for transparent goals, responsible stewardship, coordinated referrals, and outcomes that can be communicated clearly."
              />
            </p>
          </div>
        </div>
      </EditableSection>

      <EditableSection as="section" sectionId="get-involved" className="action-section" id="get-involved">
        <p className="eyebrow"><span /> <EditableText id="home.get-involved.eyebrow" defaultValue="Take the next step" /></p>
        <h2>
          <EditableText id="home.get-involved.title" defaultValue="Justice is a team effort." /><br /><strong><EditableText id="home.get-involved.title-accent" defaultValue="There is a place for you." /></strong>
        </h2>
        <div className="action-grid">
          {actionList.itemIds.map((itemId, index) => (
            <ActionCard key={itemId} itemId={itemId} index={index} total={actionList.itemIds.length} list={actionList} />
          ))}
        </div>
        {actionList.canEdit && (
          <button type="button" className="bfj-add-item" onClick={actionList.addItem}>+ Add action</button>
        )}
        {actionList.error && <span className="bfj-section-error">{actionList.error}</span>}
      </EditableSection>

      <CustomBlocks sectionId="custom" />
    </EditablePage>
  );
}
