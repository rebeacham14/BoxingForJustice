import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import './styles/index.css';
import './styles/site.css';
import './index.css';
import App from './App.jsx';
import { CLERK_PUBLISHABLE_KEY, isClerkConfigured } from './utils/clerkConfig';

// ClerkProvider throws synchronously if the publishable key is missing or
// invalid. It's mounted here (instead of only around /mma-events) so the
// public marketing site can also gate an owner-only "Edit mode" toggle -
// but only when a key is actually configured, so a missing/misconfigured
// key means "no edit mode", never a blank public site.
const routedApp = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

const tree = isClerkConfigured ? (
  <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} afterSignOutUrl="/">
    {routedApp}
  </ClerkProvider>
) : (
  routedApp
);

createRoot(document.getElementById('root')).render(
  <StrictMode>{tree}</StrictMode>
);
