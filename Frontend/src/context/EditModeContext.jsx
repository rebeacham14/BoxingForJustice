import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { isClerkConfigured } from '../utils/clerkConfig';

const noopGetToken = async () => null;

const EditModeContext = createContext({
  isOwner: false,
  isSignedIn: false,
  editMode: false,
  setEditMode: () => {},
  gridMode: false,
  setGridMode: () => {},
  activeBlockId: null,
  activeBlockKind: 'text',
  activeBlockRegion: null,
  setActiveBlockId: () => {},
  getToken: noopGetToken,
});

const SESSION_KEY = 'bfj-edit-mode';
const GRID_SESSION_KEY = 'bfj-grid-mode';

function readSessionFlag(key) {
  try {
    return sessionStorage.getItem(key) === 'true';
  } catch {
    return false;
  }
}

function writeSessionFlag(key, value) {
  try {
    sessionStorage.setItem(key, String(value));
  } catch {
    // sessionStorage unavailable (e.g. private browsing) - the flag just
    // won't persist across reloads.
  }
}

function EditModeProviderInner({ isOwner, isSignedIn, getToken, children }) {
  const [editMode, setEditModeState] = useState(() => readSessionFlag(SESSION_KEY));
  // Grid mode: section width drags snap to a 12-column grid (see
  // utils/layoutGrid.js). A per-owner preference, not page content, so it
  // lives here next to editMode rather than in Mongo.
  const [gridMode, setGridModeState] = useState(() => readSessionFlag(GRID_SESSION_KEY));
  // The selected element: a text block ('text', gets the format toolbar)
  // or any other movable element ('element', e.g. a photo - see
  // useMovable.js). Both get the move handle (MoveHandle.jsx). `region` is
  // the PageContentProvider instance the block belongs to (its regionId),
  // so only that region's toolbar/move handle shows - one screen can hold
  // several regions (a page, the site-wide bottom call-to-action, the
  // footer), and another region's toolbar would save to the wrong place.
  const [active, setActive] = useState({ id: null, kind: 'text', region: null });
  const setActiveBlockId = useCallback(
    (id, kind = 'text', region = null) => setActive({ id, kind, region }),
    []
  );

  function setEditMode(value) {
    setEditModeState(value);
    writeSessionFlag(SESSION_KEY, value);
  }

  function setGridMode(value) {
    setGridModeState(value);
    writeSessionFlag(GRID_SESSION_KEY, value);
  }

  const value = useMemo(
    () => ({
      isOwner,
      isSignedIn,
      editMode: isOwner && editMode,
      setEditMode,
      gridMode,
      setGridMode,
      activeBlockId: active.id,
      activeBlockKind: active.kind,
      activeBlockRegion: active.region,
      setActiveBlockId,
      getToken,
    }),
    [isOwner, isSignedIn, editMode, gridMode, active, setActiveBlockId, getToken]
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
