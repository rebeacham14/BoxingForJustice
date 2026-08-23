import SectionHeading from '../common/SectionHeading';
import ProgramCompletionStat from './ProgramCompletionStat';
import YouthTrainingTrendChart from './YouthTrainingTrendChart';
import MissingChildrenChart from './MissingChildrenChart';
import CommunityImpactBars from './CommunityImpactBars';

export default function DashboardSection() {
  return (
    <section className="dashboard-section">
      <SectionHeading
        eyebrow="Data & Advocacy"
        title="Our Impact, in Numbers"
        intro="Illustrative figures while we build out live reporting — see each chart's source note for details."
      />

      <div className="dashboard-grid">
        <ProgramCompletionStat />
        <YouthTrainingTrendChart />
        <MissingChildrenChart />
        <CommunityImpactBars />
      </div>
    </section>
  );
}
