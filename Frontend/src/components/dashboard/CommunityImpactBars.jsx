import { BarChart, Bar, Cell, XAxis, YAxis, LabelList, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';
import { dashboardStats } from '../../data/dashboardStats';

const SERIES_COLORS = ['var(--chart-series-1)', 'var(--chart-series-2)', 'var(--chart-series-3)'];

export default function CommunityImpactBars() {
  const { categories, source, asOf } = dashboardStats.communityImpactByCategory;

  return (
    <ChartCard
      title="Program Graduates Reporting Improved Outcomes"
      source={source}
      asOf={asOf}
      tableColumns={['Category', '% Reporting Improvement']}
      tableRows={categories.map((cat) => [cat.label, `${Math.round(cat.value * 100)}%`])}
    >
      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <BarChart
            data={categories}
            layout="vertical"
            margin={{ top: 4, right: 40, left: 8, bottom: 4 }}
          >
            <XAxis type="number" hide domain={[0, 1]} />
            <YAxis
              type="category"
              dataKey="label"
              stroke="var(--chart-text-secondary)"
              tickLine={false}
              axisLine={false}
              width={190}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={26}>
              {categories.map((cat, index) => (
                <Cell key={cat.label} fill={SERIES_COLORS[index % SERIES_COLORS.length]} />
              ))}
              <LabelList
                dataKey="value"
                position="right"
                fill="#fff"
                fontSize={13}
                formatter={(v) => `${Math.round(v * 100)}%`}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
