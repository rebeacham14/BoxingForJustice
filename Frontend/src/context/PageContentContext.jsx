import { createContext, useContext, useEffect, useId, useState } from 'react';
import { fetchPage } from '../utils/contentApi';

const PageContentContext = createContext({
  slug: null,
  regionId: null,
  sections: [],
  blocks: {},
  status: 'idle',
  setBlockLocal: () => {},
  addBlocksLocal: () => {},
  removeBlocksLocal: () => {},
  reorderSectionsLocal: () => {},
  setSectionSizeLocal: () => {},
});

function flattenBlocks(sections) {
  const blocks = {};

  for (const section of sections || []) {
    for (const block of section.blocks || []) {
      blocks[block.blockId] = block;
    }
  }

  return blocks;
}

// Fetches one page's content once per mount. `sections` (the page's raw
// section/block tree, in order - needed by anything that must enumerate a
// section's blocks, e.g. the block library in CustomBlocks.jsx) is the
// source of truth; `blocks` (a flat blockId -> block map, for EditableText's
// single-block lookups) is derived from it on every render. `status` starts
// 'loading' so EditableText can fall back to its defaultValue until (or
// unless) the fetch resolves - the site is never blank on a slow/failed
// backend.
export function PageContentProvider({ slug, children }) {
  const [state, setState] = useState({ sections: [], status: 'loading' });
  // Identifies this provider instance, so the editor knows which region's
  // toolbar owns the selected block even when two regions share a slug
  // (see activeBlockRegion in EditModeContext).
  const regionId = useId();

  useEffect(() => {
    let cancelled = false;

    fetchPage(slug)
      .then((page) => {
        if (!cancelled) {
          setState({ sections: page.sections || [], status: 'ready' });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({ sections: [], status: 'error' });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  function setBlockLocal(blockId, patch) {
    setState((prev) => {
      const exists = prev.sections.some((section) =>
        section.blocks.some((block) => block.blockId === blockId)
      );

      return exists ? updateBlockIn(prev, blockId, patch) : insertBlockIn(prev, blockId, patch);
    });
  }

  // Mirrors the backend's auto-create-on-PATCH (Backend/routes/content.js):
  // a block that was never seeded lands in the section named by its
  // blockId's 2nd segment (<page>.<section>.<field>). Without this, the
  // first save to a new block (e.g. a section's width, or a new item list)
  // would persist server-side but vanish locally until a reload.
  function insertBlockIn(prev, blockId, patch) {
    const sectionId = blockId.split('.')[1];
    const newBlock = {
      blockId,
      type: 'text',
      content: { ...(patch.content || {}) },
      style: { ...(patch.style || {}) },
    };
    const hasSection = prev.sections.some((s) => s.sectionId === sectionId);

    const sections = hasSection
      ? prev.sections.map((section) =>
          section.sectionId === sectionId
            ? { ...section, blocks: [...section.blocks, newBlock] }
            : section
        )
      : [...prev.sections, { sectionId, layout: 'default', blocks: [newBlock] }];

    return { ...prev, sections };
  }

  function updateBlockIn(prev, blockId, patch) {
    return {
      ...prev,
      sections: prev.sections.map((section) => ({
        ...section,
        blocks: section.blocks.map((block) => {
          if (block.blockId !== blockId) return block;

          return {
            ...block,
            ...patch,
            content: { ...block.content, ...(patch.content || {}) },
            style: { ...block.style, ...(patch.style || {}) },
          };
        }),
      })),
    };
  }

  function addBlocksLocal(sectionId, newBlocks) {
    setState((prev) => {
      const exists = prev.sections.some((s) => s.sectionId === sectionId);

      const sections = exists
        ? prev.sections.map((section) =>
            section.sectionId === sectionId
              ? { ...section, blocks: [...section.blocks, ...newBlocks] }
              : section
          )
        : [...prev.sections, { sectionId, layout: 'default', blocks: newBlocks }];

      return { ...prev, sections };
    });
  }

  function removeBlocksLocal(blockIds) {
    const idsToRemove = new Set(blockIds);

    setState((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => ({
        ...section,
        blocks: section.blocks.filter((block) => !idsToRemove.has(block.blockId)),
      })),
    }));
  }

  // `order` is the page's full new ordered list of section ids, matching
  // what the reorder route expects/persists.
  function reorderSectionsLocal(order) {
    setState((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => ({
        ...section,
        order: order.indexOf(section.sectionId),
      })),
    }));
  }

  function setSectionSizeLocal(sectionId, size) {
    setState((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.sectionId === sectionId ? { ...section, size } : section
      ),
    }));
  }

  const blocks = flattenBlocks(state.sections);

  return (
    <PageContentContext.Provider
      value={{
        sections: state.sections,
        status: state.status,
        blocks,
        slug,
        regionId,
        setBlockLocal,
        addBlocksLocal,
        removeBlocksLocal,
        reorderSectionsLocal,
        setSectionSizeLocal,
      }}
    >
      {children}
    </PageContentContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePageContent() {
  return useContext(PageContentContext);
}
