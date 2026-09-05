import EditableSection from './EditableSection';

export default function PageHero({ eyebrow, title, accent, lede, number }) {
  return (
    <EditableSection as="section" sectionId="hero" className="page-hero">
      <div className="page-hero-copy">
        <p className="eyebrow"><span /> {eyebrow}</p>
        <h1>{title}<br /><strong>{accent}</strong></h1>
        <p>{lede}</p>
      </div>
      <div className="page-hero-side">
        <span>{number}</span>
        <p>Boxing For Justice<br />Riverside County, CA</p>
      </div>
    </EditableSection>
  );
}
