import { createContext, useContext, useEffect, useState } from 'react';
import { fetchPage } from '../utils/contentApi';

const PageContentContext = createContext({
  slug: null,
  blocks: {},
  status: 'idle',
  setBlockLocal: () => {},
});

function flattenBlocks(page) {
  const blocks = {};

  for (const section of page?.sections || []) {
    for (const block of section.blocks || []) {
      blocks[block.blockId] = block;
    }
  }

  return blocks;
}

// Fetches one page's content once per mount and exposes it as a
// blockId -> block map. `status` starts 'loading' so EditableText can fall
// back to its defaultValue until (or unless) the fetch resolves - the site
// is never blank on a slow or failed backend.
export function PageContentProvider({ slug, children }) {
  const [state, setState] = useState({ blocks: {}, status: 'loading' });

  useEffect(() => {
    let cancelled = false;

    fetchPage(slug)
      .then((page) => {
        if (!cancelled) {
          setState({ blocks: flattenBlocks(page), status: 'ready' });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({ blocks: {}, status: 'error' });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  function setBlockLocal(blockId, patch) {
    setState((prev) => {
      const existing = prev.blocks[blockId] || { blockId, content: {}, style: {} };

      return {
        ...prev,
        blocks: {
          ...prev.blocks,
          [blockId]: {
            ...existing,
            ...patch,
            content: { ...existing.content, ...(patch.content || {}) },
            style: { ...existing.style, ...(patch.style || {}) },
          },
        },
      };
    });
  }

  return (
    <PageContentContext.Provider value={{ ...state, slug, setBlockLocal }}>
      {children}
    </PageContentContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePageContent() {
  return useContext(PageContentContext);
}
