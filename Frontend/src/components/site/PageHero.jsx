import EditableSection from './EditableSection';
import EditableText from './EditableText';
import Movable from './Movable';
import { usePageContent } from '../../context/PageContentContext';

export default function PageHero({ eyebrow, title, accent, lede, number }) {
  const { slug } = usePageContent();

  return (
    <EditableSection as="section" sectionId="hero" className="page-hero">
      <div className="page-hero-copy">
        <p className="eyebrow"><Movable id={`${slug}.hero.eyebrow-tick`} /> {eyebrow}</p>
        <h1>{title}<br /><strong>{accent}</strong></h1>
        <p>{lede}</p>
      </div>
      <Movable as="div" id={`${slug}.hero.side`} className="page-hero-side">
        <span>{number}</span>
        <p>
          <EditableText id={`${slug}.hero.side-line1`} defaultValue="Boxing For Justice" /><br />
          <EditableText id={`${slug}.hero.side-line2`} defaultValue="Riverside County, CA" />
        </p>
      </Movable>
    </EditableSection>
  );
}
