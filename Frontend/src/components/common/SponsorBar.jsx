import { sponsorLogos } from '../../data/sponsors';

export default function SponsorBar() {
  const logos = [...sponsorLogos, ...sponsorLogos];

  return (
    <div className="sponsor-bar">
      <div className="sponsor-track">
        {logos.map((logo, index) => (
          <img key={`${logo.src}-${index}`} src={logo.src} alt={logo.alt} />
        ))}
      </div>
    </div>
  );
}
