import { useState } from 'react';

export default function ChartCard({
  title,
  legend,
  source,
  asOf,
  tableColumns,
  tableRows,
  children,
}) {
  const [showTable, setShowTable] = useState(false);
  const hasTable = Boolean(tableColumns && tableRows);

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <h3 className="chart-card-title">{title}</h3>

        {hasTable && (
          <button
            type="button"
            className="chart-card-toggle"
            onClick={() => setShowTable((prev) => !prev)}
            aria-pressed={showTable}
          >
            {showTable ? 'View chart' : 'View as table'}
          </button>
        )}
      </div>

      {legend && legend.length > 1 && (
        <ul className="chart-card-legend">
          {legend.map((item) => (
            <li key={item.label}>
              <span
                className="chart-card-legend-swatch"
                style={{ backgroundColor: item.color }}
                aria-hidden="true"
              />
              {item.label}
            </li>
          ))}
        </ul>
      )}

      {showTable && hasTable ? (
        <table className="chart-table">
          <caption className="sr-only">{title}</caption>
          <thead>
            <tr>
              {tableColumns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row) => (
              <tr key={row.join('|')}>
                {row.map((cell, cellIndex) => (
                  <td key={`${row[0]}-${cellIndex}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        children
      )}

      {(source || asOf) && (
        <p className="chart-card-source">
          Source: {source}
          {asOf ? ` — ${asOf}` : ''}
        </p>
      )}
    </div>
  );
}
