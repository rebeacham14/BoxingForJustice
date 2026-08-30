import { PageContentProvider } from '../../context/PageContentContext';
import EditToolbar from './EditToolbar';

// Wraps one site page so its EditableText blocks can fetch/save against
// GET/PATCH /api/pages/:slug and so the floating format toolbar has
// somewhere to mount. `slug` must match the Page document's slug in Mongo
// (see Backend/seedData/pages.seed.js).
export default function EditablePage({ slug, children }) {
  return (
    <PageContentProvider slug={slug}>
      {children}
      <EditToolbar />
    </PageContentProvider>
  );
}
