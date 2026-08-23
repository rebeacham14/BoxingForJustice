import StatTile from './StatTile';
import { dashboardStats } from '../../data/dashboardStats';

export default function ProgramCompletionStat() {
  const { value, delta, trend, source, asOf } = dashboardStats.programCompletion;

  return (
    <StatTile
      label="Youth Program Completion Rate (this quarter)"
      value={`${Math.round(value * 100)}%`}
      delta={delta}
      trend={trend}
      source={source}
      asOf={asOf}
    />
  );
}
