import { LineChart, Line, ResponsiveContainer } from 'recharts';

export default function StatTile({ label, value, delta, trend, source, asOf }) {
  const isNegative = delta < 0;
  const sparklineData = trend.map((v, index) => ({ index, v }));

  return (
    <div className="stat-tile">
      <p className="stat-tile-label">{label}</p>

      <div className="stat-tile-value-row">
        <span className="stat-tile-value">{value}</span>

        {typeof delta === 'number' && (
          <span className={`stat-tile-delta${isNegative ? ' is-negative' : ''}`}>
            {isNegative ? '▼' : '▲'} {Math.abs(Math.round(delta * 100))}pp vs. prior period
          </span>
        )}
      </div>

      <div style={{ width: '100%', height: 48 }}>
        <ResponsiveContainer>
          <LineChart data={sparklineData}>
            <Line
              type="monotone"
              dataKey="v"
              stroke="var(--chart-seq-400)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {(source || asOf) && (
        <p className="chart-card-source">
          Source: {source}
          {asOf ? ` — ${asOf}` : ''}
        </p>
      )}
    </div>
  );
}
