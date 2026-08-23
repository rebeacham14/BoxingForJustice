import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import ChartCard from './ChartCard';
import { dashboardStats } from '../../data/dashboardStats';

export default function YouthTrainingTrendChart() {
  const { series, source, asOf } = dashboardStats.youthTrainingByYear;

  return (
    <ChartCard
      title="Youth Reached by Training, by Program Year"
      source={source}
      asOf={asOf}
      tableColumns={['Year', 'Youth Reached']}
      tableRows={series.map((row) => [row.year, row.youthReached])}
    >
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer>
          <LineChart data={series} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
            <CartesianGrid stroke="var(--chart-gridline)" vertical={false} />
            <XAxis
              dataKey="year"
              stroke="var(--chart-text-secondary)"
              tickLine={false}
              axisLine={{ stroke: 'var(--chart-gridline)' }}
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
            <Line
              type="monotone"
              dataKey="youthReached"
              name="Youth reached"
              stroke="var(--chart-seq-400)"
              strokeWidth={2}
              dot={{ r: 4, fill: 'var(--chart-seq-400)' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
