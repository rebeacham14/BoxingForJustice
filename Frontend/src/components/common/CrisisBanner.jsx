import { crisisLinks } from '../../data/crisisLinks';

export default function CrisisBanner({ variant = 'general' }) {
  const content = crisisLinks[variant] ?? crisisLinks.general;
  const isVeteran = variant === 'veteran';

  return (
    <div
      className={`crisis-banner${isVeteran ? ' crisis-banner-veteran' : ''}`}
      role="region"
      aria-label="Crisis support"
    >
      <div className="crisis-banner-inner">
        <div className="crisis-banner-icon" aria-hidden="true">
          !
        </div>

        <div className="crisis-banner-text">
          <h2>{content.heading}</h2>
          <p>{content.body}</p>
        </div>

        <div className="crisis-banner-links">
          <a href={content.primary.href} aria-label={content.primary.label}>
            {content.primary.label}
          </a>
          <a
            href={content.secondary.href}
            aria-label={content.secondary.label}
            target={content.secondary.href.startsWith('http') ? '_blank' : undefined}
            rel={content.secondary.href.startsWith('http') ? 'noreferrer' : undefined}
          >
            {content.secondary.label}
          </a>
        </div>
      </div>
    </div>
  );
}
