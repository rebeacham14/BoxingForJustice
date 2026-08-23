import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  ResponsiveContainer,
} from 'recharts';
import ChartCard from './ChartCard';
import { dashboardStats } from '../../data/dashboardStats';

const SERIES_COLORS = [
  'var(--chart-series-1)',
  'var(--chart-series-2)',
  'var(--chart-series-3)',
  'var(--chart-series-4)',
];

export default function MissingChildrenChart() {
  const { categories, source, asOf } = dashboardStats.missingChildrenByCategory;

  const legend = categories.map((cat, index) => ({
    label: cat.label,
    color: SERIES_COLORS[index % SERIES_COLORS.length],
  }));

  return (
    <ChartCard
      title="Reported Missing-Child Cases by Category"
      legend={legend}
      source={source}
      asOf={asOf}
      tableColumns={['Category', 'Cases']}
      tableRows={categories.map((cat) => [cat.label, cat.value])}
    >
      <div style={{ width: '100%', height: 240 }}>
        <ResponsiveContainer>
          <BarChart data={categories} margin={{ top: 20, right: 12, left: -12, bottom: 0 }}>
            <CartesianGrid stroke="var(--chart-gridline)" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="var(--chart-text-secondary)"
              tickLine={false}
              axisLine={{ stroke: 'var(--chart-gridline)' }}
              tick={false}
            />
            <YAxis
              stroke="var(--chart-text-secondary)"
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--chart-surface)',
                border: '1px solid var(--chart-gridline)',
                borderRadius: 8,
                color: '#fff',
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {categories.map((cat, index) => (
                <Cell key={cat.label} fill={SERIES_COLORS[index % SERIES_COLORS.length]} />
              ))}
              <LabelList dataKey="value" position="top" fill="#fff" fontSize={12} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
