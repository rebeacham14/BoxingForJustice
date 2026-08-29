import { fundsAllocation } from '../../data/fundsAllocation';

export default function FundsAllocationChart() {
  const { categories, source, asOf } = fundsAllocation;

  return (
    <div className="funds-chart">
      <div className="funds-chart-bar" role="img" aria-label="Breakdown of where donated funds go">
        {categories.map((cat) => (
          <div
            key={cat.label}
            className="funds-chart-segment"
            style={{ width: `${cat.share * 100}%`, background: cat.color }}
            title={`${cat.label}: ${Math.round(cat.share * 100)}%`}
          >
            <span>{Math.round(cat.share * 100)}%</span>
          </div>
        ))}
      </div>
      <ul className="funds-chart-legend">
        {categories.map((cat) => (
          <li key={cat.label}>
            <span className="funds-chart-swatch" style={{ background: cat.color }} aria-hidden="true" />
            {cat.label} <strong>{Math.round(cat.share * 100)}%</strong>
          </li>
        ))}
      </ul>
      <p className="funds-chart-caption">
        Source: {source} · {asOf}
      </p>
    </div>
  );
}
