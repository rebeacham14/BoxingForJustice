import { Link } from 'react-router-dom';
import BottomCta from '../../components/site/BottomCta';
import PageHero from '../../components/site/PageHero';
import FlipCard from '../../components/common/FlipCard';
import EditablePage from '../../components/site/EditablePage';
import EditableText from '../../components/site/EditableText';

const awarenessBlocks = [
  { front: 'Block 1', back: 'Owner to add content.' },
  { front: 'Block 2', back: 'Owner to add content.' },
  { front: 'Block 3', back: 'Owner to add content.' },
];

export default function AdvocacyPage() {
  return (
    <EditablePage slug="advocacy">
      <PageHero
        eyebrow={<EditableText id="advocacy.hero.eyebrow" defaultValue="Advocacy" />}
        title={<EditableText id="advocacy.hero.title" defaultValue="Speaking up." />}
        accent={<EditableText id="advocacy.hero.accent" defaultValue="Standing between." />}
        lede={
          <EditableText
            as="span"
            id="advocacy.hero.lede"
            defaultValue="Boxing For Justice doesn't stop at the gym door. This is where we name the systems that fail kids and push for the ones that protect them."
          />
        }
        number="02"
      />

      <section className="section-heading" id="awareness-protects">
        <div>
          <p className="eyebrow"><span /> <EditableText id="advocacy.awareness.eyebrow" defaultValue="#AwarenessProtects" /></p>
          <h2>
            <EditableText id="advocacy.awareness.title-line1" defaultValue="Tap a block" /><br />
            <strong><EditableText id="advocacy.awareness.title-line2" defaultValue="to learn more." /></strong>
          </h2>
        </div>
        <p className="section-intro">
          <EditableText
            as="span"
            id="advocacy.awareness.intro"
            defaultValue="Click or tap any block to flip it. Content below is a placeholder — the owner will fill in the real campaign details."
          />
        </p>
      </section>
      <section className="focus-grid">
        {awarenessBlocks.map((block, index) => (
          <FlipCard
            key={block.front}
            className="focus-card"
            front={<EditableText as="h3" id={`advocacy.awareness.${index}.front`} defaultValue={block.front} />}
            back={<EditableText as="p" id={`advocacy.awareness.${index}.back`} defaultValue={block.back} />}
          />
        ))}
      </section>

      <section className="program-section" id="legislative-prep">
        <div className="program-index">02</div>
        <div className="program-title">
          <p className="eyebrow"><span /> <EditableText id="advocacy.legislative.eyebrow" defaultValue="Legislative prep" /></p>
          <h2>
            <EditableText id="advocacy.legislative.title-line1" defaultValue="Prepared to" /><br />
            <strong><EditableText id="advocacy.legislative.title-line2" defaultValue="speak on policy." /></strong>
          </h2>
        </div>
        <div className="program-detail">
          <EditableText
            as="div"
            className="content-placeholder"
            id="advocacy.legislative.placeholder"
            defaultValue="Owner to add content — committee/board recruitment, capital visits, and policy work will go here."
          />
          <Link className="button button-dark" to="/get-involved#committee-board">
            <EditableText id="advocacy.legislative.cta" defaultValue="Want to be on the BFJ committee/board?" />
          </Link>
        </div>
      </section>
      <BottomCta />
    </EditablePage>
  );
}
