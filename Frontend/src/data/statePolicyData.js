// Placeholder per-state policy/data entries, keyed by postal code.
// Owner fills these in later; any state without an entry falls back to a
// generic "coming soon" placeholder via getStatePolicyInfo().
export const statePolicyData = {};

export function getStatePolicyInfo(code) {
  return (
    statePolicyData[code] ?? {
      policies: 'Owner to add policy information for this state.',
      helpfulData: 'Owner to add helpful data for this state.',
    }
  );
}
