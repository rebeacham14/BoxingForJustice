import Layout from './Layout';
import { isClerkConfigured } from '../../utils/clerkConfig';

// ClerkProvider now lives at the app root (Frontend/src/main.jsx), mounted
// conditionally there so a missing key can never blank the whole public
// site (see that file's comment). This component still guards /mma-events
// specifically: unlike the rest of the site, this sub-app genuinely cannot
// function without Clerk configured.
export default function MmaEventsRoot() {
  if (!isClerkConfigured) {
    console.error('VITE_CLERK_PUBLISHABLE_KEY is not set - /mma-events auth will not work.');

    return (
      <div className="page" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <p>This section is temporarily unavailable. Please check back soon.</p>
      </div>
    );
  }

  return <Layout />;
}
