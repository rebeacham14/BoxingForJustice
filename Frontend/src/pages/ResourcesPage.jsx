import { lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/common/SEO';
import CrisisBanner from '../components/common/CrisisBanner';
import MediaEmbedGrid from '../components/resources/MediaEmbedGrid';
import BlogPlaceholderList from '../components/resources/BlogPlaceholderList';
import LegalLiteracyGuides from '../components/resources/LegalLiteracyGuides';

const DashboardSection = lazy(() => import('../components/dashboard/DashboardSection'));

export default function ResourcesPage() {
  const navigate = useNavigate();

  return (
    <div className="page resources-page">
      <SEO
        title="Resources & Media Hub | Boxing for Justice"
        description="Self-defense and safety education, legal literacy guides, crisis support links, and community impact data from Boxing for Justice."
      />

      <section className="page-hero">
        <div className="page-hero-text">
          <h1>
            Resources & <span>Media Hub</span>
          </h1>

          <p>Education, safety guides, and crisis support — all in one place.</p>

          <button className="secondary-button" onClick={() => navigate('/mma-events')}>
            Back to Home
          </button>
        </div>
      </section>

      <CrisisBanner variant="general" />

      <MediaEmbedGrid />
      <BlogPlaceholderList />
      <LegalLiteracyGuides />

      <Suspense fallback={<p className="dashboard-fallback">Loading dashboard...</p>}>
        <DashboardSection />
      </Suspense>
    </div>
  );
}
