import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import './styles/index.css';
import './styles/site.css';
import './index.css';
import App from './App.jsx';

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  console.error('VITE_CLERK_PUBLISHABLE_KEY is not set - /mma-events auth will not work.');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} afterSignOutUrl="/mma-events">
        <App />
      </ClerkProvider>
    </BrowserRouter>
  </StrictMode>
);
