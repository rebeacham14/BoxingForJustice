import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import usStatesTopoJson from '../../data/us-states-10m.json';
import { codeForName } from '../../data/usStates';
import { getStatePolicyInfo } from '../../data/statePolicyData';

export default function UsPolicyMap() {
  const [searchParams] = useSearchParams();
  // Lazy-initialized from the `?state=XX` deep link (e.g. from Get Involved's
  // resource links) - only read on mount, not re-synced on further param
  // changes since that would only matter for the rare case of navigating
  // between two different `?state=` links without leaving this page.
  const [selected, setSelected] = useState(() => {
    const fromQuery = searchParams.get('state');
    return fromQuery ? fromQuery.toUpperCase() : null;
  });

  const info = selected ? getStatePolicyInfo(selected) : null;

  return (
    <div className="us-map">
      <div className="us-map-canvas">
        <ComposableMap projection="geoAlbersUsa" width={880} height={500}>
          <Geographies geography={usStatesTopoJson}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const code = codeForName(geo.properties.name);
                const isSelected = code === selected;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    tabIndex={0}
                    aria-label={geo.properties.name}
                    onClick={() => code && setSelected(code)}
                    onKeyDown={(e) => {
                      if (code && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        setSelected(code);
                      }
                    }}
                    className={`us-map-state${isSelected ? ' us-map-state-selected' : ''}`}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      <div className="us-map-panel">
        {info ? (
          <>
            <h3>{selected}</h3>
            <p className="us-map-panel-label">Policies</p>
            <p>{info.policies}</p>
            <p className="us-map-panel-label">Helpful data</p>
            <p>{info.helpfulData}</p>
          </>
        ) : (
          <p className="content-placeholder">Click or tap a state to see its policies and data.</p>
        )}
      </div>
    </div>
  );
}
