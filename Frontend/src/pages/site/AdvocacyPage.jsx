import { Link } from 'react-router-dom';
import BottomCta from '../../components/site/BottomCta';
import PageHero from '../../components/site/PageHero';
import FlipCard from '../../components/common/FlipCard';

const awarenessBlocks = [
  { front: 'Block 1', back: 'Owner to add content.' },
  { front: 'Block 2', back: 'Owner to add content.' },
  { front: 'Block 3', back: 'Owner to add content.' },
];

export default function AdvocacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Advocacy"
        title="Speaking up."
        accent="Standing between."
        lede="Boxing For Justice doesn't stop at the gym door. This is where we name the systems that fail kids and push for the ones that protect them."
        number="02"
      />

      <section className="section-heading" id="awareness-protects">
        <div>
          <p className="eyebrow"><span /> #AwarenessProtects</p>
          <h2>Tap a block<br /><strong>to learn more.</strong></h2>
        </div>
        <p className="section-intro">
          Click or tap any block to flip it. Content below is a placeholder — the
          owner will fill in the real campaign details.
        </p>
      </section>
      <section className="focus-grid">
        {awarenessBlocks.map((block) => (
          <FlipCard
            key={block.front}
            className="focus-card"
            front={<h3>{block.front}</h3>}
            back={<p>{block.back}</p>}
          />
        ))}
      </section>

      <section className="program-section" id="legislative-prep">
        <div className="program-index">02</div>
        <div className="program-title">
          <p className="eyebrow"><span /> Legislative prep</p>
          <h2>Prepared to<br /><strong>speak on policy.</strong></h2>
        </div>
        <div className="program-detail">
          <div className="content-placeholder">
            Owner to add content — committee/board recruitment, capital visits,
            and policy work will go here.
          </div>
          <Link className="button button-dark" to="/get-involved#committee-board">
            Want to be on the BFJ committee/board?
          </Link>
        </div>
      </section>
      <BottomCta />
    </>
  );
}
