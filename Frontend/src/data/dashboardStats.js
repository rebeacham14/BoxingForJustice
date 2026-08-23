// ILLUSTRATIVE PLACEHOLDER DATA — these are not real, sourced figures.
// Replace the values (and their `source`/`asOf` fields) before public launch.
// See the Resources page dashboard for how this shape is consumed — each
// metric's `source`/`asOf` renders as a visible caption under its chart.

export const dashboardStats = {
  programCompletion: {
    value: 0.82,
    delta: 0.05,
    trend: [0.7, 0.74, 0.78, 0.82],
    source: 'Boxing for Justice internal program records',
    asOf: 'placeholder — not yet sourced',
  },
  youthTrainingByYear: {
    series: [
      { year: 2023, youthReached: 120 },
      { year: 2024, youthReached: 210 },
      { year: 2025, youthReached: 340 },
    ],
    source: 'Boxing for Justice internal program records',
    asOf: 'placeholder — not yet sourced',
  },
  missingChildrenByCategory: {
    categories: [
      { label: 'Endangered runaway', value: 0 },
      { label: 'Family abduction', value: 0 },
      { label: 'Non-family abduction', value: 0 },
      { label: 'Lost / injured', value: 0 },
    ],
    source:
      'PLACEHOLDER — cite the NCMEC published annual report once real figures are entered',
    asOf: 'placeholder — not yet sourced',
  },
  communityImpactByCategory: {
    categories: [
      { label: 'Relationship-safety awareness', value: 0 },
      { label: 'Job readiness', value: 0 },
      { label: 'Legal literacy', value: 0 },
    ],
    source: 'Boxing for Justice internal survey data',
    asOf: 'placeholder — not yet sourced',
  },
};
