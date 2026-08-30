// Mechanical 1:1 mirror of Frontend/src/data/navigation.js's NAV_ITEMS,
// plus an explicit `order`. Keep these two files in sync until the Phase 5
// nav builder makes the static file purely a fallback-of-last-resort.
module.exports = [
  {
    label: 'About',
    to: '/about',
    order: 0,
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
    order: 1,
    submenu: [
      { label: '#AwarenessProtects', hash: 'awareness-protects' },
      { label: 'Legislative prep', hash: 'legislative-prep' },
    ],
  },
  {
    label: 'Our work',
    to: '/our-work',
    order: 2,
    submenu: [
      { label: 'Campaigns', hash: 'campaigns' },
      { label: 'Fundraiser events', hash: 'fundraiser-events' },
      { label: 'Articles', hash: 'articles' },
    ],
  },
  {
    label: 'Impact',
    to: '/impact',
    order: 3,
    submenu: [
      { label: 'Policies', hash: 'policies' },
      { label: 'GEO Data', hash: 'geo-data' },
    ],
  },
  {
    label: 'Get involved',
    to: '/get-involved',
    order: 4,
    submenu: [
      { label: 'Make a report', hash: 'report' },
      { label: 'Endorsements', hash: 'endorsements' },
      { label: 'Fundraiser signups', hash: 'fundraiser-signups' },
      { label: 'Committee/board recruitment', hash: 'committee-board' },
      { label: 'MMA program', hash: 'mma-program' },
    ],
  },
  { label: 'Enroll Participant', to: '/enroll', order: 5, submenu: [] },
];
