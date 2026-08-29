// Single source of truth for the public site's primary nav (Header + Footer).
// `submenu` entries scroll to a matching `id` on the parent page via
// SiteLayout's existing hash-scroll effect - they don't add a new route.
export const NAV_ITEMS = [
  {
    label: 'About',
    to: '/about',
    submenu: [
      { label: 'Purpose', hash: 'purpose' },
      { label: 'Sponsors', hash: 'sponsors' },
      { label: 'Partners', hash: 'partners' },
      { label: 'Staff', hash: 'staff' },
    ],
  },
  {
    label: 'Advocacy',
    to: '/advocacy',
    submenu: [
      { label: '#AwarenessProtects', hash: 'awareness-protects' },
      { label: 'Legislative prep', hash: 'legislative-prep' },
    ],
  },
  {
    label: 'Our work',
    to: '/our-work',
    submenu: [
      { label: 'Campaigns', hash: 'campaigns' },
      { label: 'Fundraiser events', hash: 'fundraiser-events' },
      { label: 'Articles', hash: 'articles' },
    ],
  },
  {
    label: 'Impact',
    to: '/impact',
    submenu: [
      { label: 'Policies', hash: 'policies' },
      { label: 'GEO Data', hash: 'geo-data' },
    ],
  },
  {
    label: 'Get involved',
    to: '/get-involved',
    submenu: [
      { label: 'Make a report', hash: 'report' },
      { label: 'Endorsements', hash: 'endorsements' },
      { label: 'Fundraiser signups', hash: 'fundraiser-signups' },
      { label: 'Committee/board recruitment', hash: 'committee-board' },
      { label: 'MMA program', hash: 'mma-program' },
    ],
  },
  { label: 'Enroll Participant', to: '/enroll' },
];
