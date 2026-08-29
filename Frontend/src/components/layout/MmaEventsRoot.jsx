import { ClerkProvider } from '@clerk/clerk-react';
import Layout from './Layout';

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Scopes Clerk to the /mma-events sub-app only. ClerkProvider throws
// synchronously if publishableKey is missing/invalid - previously this was
// mounted around the whole app in main.jsx, so a misconfigured or missing
// key (e.g. an env var never set on a deploy host) blanked the entire
// public site, not just the section that actually needs auth.
export default function MmaEventsRoot() {
  if (!CLERK_PUBLISHABLE_KEY) {
    console.error('VITE_CLERK_PUBLISHABLE_KEY is not set - /mma-events auth will not work.');

    return (
      <div className="page" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <p>This section is temporarily unavailable. Please check back soon.</p>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} afterSignOutUrl="/mma-events">
      <Layout />
    </ClerkProvider>
  );
}
