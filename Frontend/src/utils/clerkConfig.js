// Single source of truth for "is Clerk actually usable right now". Used to
// decide whether to mount ClerkProvider at all (see main.jsx) and, anywhere
// else in the app, whether it's safe to call a Clerk hook/component -
// calling one without a mounted ClerkProvider throws.
export const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
export const isClerkConfigured = Boolean(CLERK_PUBLISHABLE_KEY);
