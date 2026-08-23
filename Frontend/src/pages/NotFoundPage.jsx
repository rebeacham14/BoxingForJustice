import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';

export default function NotFoundPage() {
  return (
    <div className="page">
      <SEO title="Page Not Found | Boxing for Justice" description="This page could not be found." robots="noindex, nofollow" />

      <section className="auth-box">
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <Link to="/" className="main-button">
          Back to Home
        </Link>
      </section>
    </div>
  );
}
