import EditableRegion from './EditableRegion';

// Wraps one site page so its EditableText blocks can fetch/save against
// GET/PATCH /api/pages/:slug and so the floating format toolbar has
// somewhere to mount. `slug` must match the Page document's slug in Mongo
// (see Backend/seedData/pages.seed.js).
//
// The `bfj-page-sections` wrapper is what makes EditableSection's inline
// `order` style actually reposition sections - it's a flex column scoped to
// editor-enabled pages only (not the global `<main>` in SiteLayout.jsx,
// which non-editor routes like /mma-events also render through).
export default function EditablePage({ slug, children }) {
  return (
    <EditableRegion slug={slug}>
      <div className="bfj-page-sections">{children}</div>
    </EditableRegion>
  );
}
