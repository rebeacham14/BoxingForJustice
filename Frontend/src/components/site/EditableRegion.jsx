import { PageContentProvider } from '../../context/PageContentContext';
import EditToolbar from './EditToolbar';
import MoveHandle from './MoveHandle';

// One editable content region: loads/saves the blocks of one Page document
// (`slug`) and mounts that region's format toolbar and move handle. Used
// per page by EditablePage, and with slug="site" for the content every page
// shares (bottom call-to-action, contact band, footer). Regions can nest -
// each EditableText saves to its nearest region.
export default function EditableRegion({ slug, children }) {
  return (
    <PageContentProvider slug={slug}>
      {children}
      <EditToolbar />
      <MoveHandle />
    </PageContentProvider>
  );
}
