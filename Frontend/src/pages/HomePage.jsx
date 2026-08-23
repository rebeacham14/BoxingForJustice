import SEO from '../components/common/SEO';
import Hero from '../components/home/Hero';
import ImpactSection from '../components/home/ImpactSection';
import ProgramsSection from '../components/home/ProgramsSection';
import SponsorCtaSection from '../components/home/SponsorCtaSection';
import MartialArtsSection from '../components/home/MartialArtsSection';

export default function HomePage() {
  return (
    <div className="page home-page">
      <SEO
        title="Boxing for Justice | Justice, Advocacy & Youth Education"
        description="Boxing for Justice is a nonprofit advancing justice, advocacy, mental health, and youth education. We use martial arts as a tool to build confidence, resilience, and safety skills in at-risk youth."
      />

      <Hero />
      <ImpactSection />
      <ProgramsSection />
      <SponsorCtaSection />
      <MartialArtsSection />
    </div>
  );
}
