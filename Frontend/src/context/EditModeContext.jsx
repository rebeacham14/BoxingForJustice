import { createContext, useContext, useMemo, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { isClerkConfigured } from '../utils/clerkConfig';

const noopGetToken = async () => null;

const EditModeContext = createContext({
  isOwner: false,
  isSignedIn: false,
  editMode: false,
  setEditMode: () => {},
  activeBlockId: null,
  setActiveBlockId: () => {},
  getToken: noopGetToken,
});

const SESSION_KEY = 'bfj-edit-mode';

function EditModeProviderInner({ isOwner, isSignedIn, getToken, children }) {
  const [editMode, setEditModeState] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [activeBlockId, setActiveBlockId] = useState(null);

  function setEditMode(value) {
    setEditModeState(value);

    try {
      sessionStorage.setItem(SESSION_KEY, String(value));
    } catch {
      // sessionStorage unavailable (e.g. private browsing) - edit mode just
      // won't persist across reloads.
    }
  }

  const value = useMemo(
    () => ({
      isOwner,
      isSignedIn,
      editMode: isOwner && editMode,
      setEditMode,
      activeBlockId,
      setActiveBlockId,
      getToken,
    }),
    [isOwner, isSignedIn, editMode, activeBlockId, getToken]
  );

  return <EditModeContext.Provider value={value}>{children}</EditModeContext.Provider>;
}

function EditModeProviderWithClerk({ children }) {
  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const isOwner = Boolean(isLoaded && isSignedIn && user?.publicMetadata?.role === 'owner');

  return (
    <EditModeProviderInner isOwner={isOwner} isSignedIn={Boolean(isSignedIn)} getToken={getToken}>
      {children}
    </EditModeProviderInner>
  );
}

export function EditModeProvider({ children }) {
  // Never call useUser()/useAuth() when Clerk isn't mounted (see main.jsx) -
  // both throw without a ClerkProvider ancestor. Without a key, edit mode is
  // simply never available.
  if (!isClerkConfigured) {
    return (
      <EditModeProviderInner isOwner={false} isSignedIn={false} getToken={noopGetToken}>
        {children}
      </EditModeProviderInner>
    );
  }

  return <EditModeProviderWithClerk>{children}</EditModeProviderWithClerk>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useEditMode() {
  return useContext(EditModeContext);
}
