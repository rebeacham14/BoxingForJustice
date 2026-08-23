import { Link } from 'react-router-dom';
import { crisisLinks } from '../../data/crisisLinks';

export default function Footer() {
  const { primary, secondary } = crisisLinks.general;

  return (
    <footer
      style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '32px 0',
        textAlign: 'center',
      }}
    >
      <div style={{ marginBottom: 18 }}>
        <span style={{ color: 'var(--color-text-muted)', marginRight: 14, fontSize: 14 }}>
          In crisis? Free, confidential help is available 24/7:
        </span>
        <a
          href={primary.href}
          style={{
            color: 'var(--chart-status-good)',
            fontWeight: 800,
            textDecoration: 'none',
            marginRight: 14,
          }}
        >
          {primary.label}
        </a>
        <a
          href={secondary.href}
          target="_blank"
          rel="noreferrer"
          style={{ color: 'var(--chart-status-good)', fontWeight: 800, textDecoration: 'none' }}
        >
          {secondary.label}
        </a>
      </div>

      <div style={{ marginBottom: 18 }}>
        <Link
          to="/mma-events#sponsor-cta"
          className="secondary-button"
          style={{ padding: '10px 22px', marginBottom: 0 }}
        >
          Become a Sponsor or Donor
        </Link>
      </div>

      <p style={{ color: 'var(--color-text-muted)', fontSize: 13, margin: 0 }}>
        Boxing for Justice is a nonprofit dedicated to justice, advocacy, mental health, and youth
        education.
      </p>
    </footer>
  );
}
