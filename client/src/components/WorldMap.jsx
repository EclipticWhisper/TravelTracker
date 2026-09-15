import { useMemo, useState } from "react";
import worldMap from "../data/world-map.json";

export default function WorldMap({ visited, onToggle, loading }) {
  const [tooltip, setTooltip] = useState(null);

  const visitedSet = useMemo(
    () => new Set(visited.map((country) => country.code)),
    [visited]
  );

  const handleMouseMove = (event, country) => {
    const svg = event.currentTarget.ownerSVGElement;
    const rect = svg.getBoundingClientRect();
    setTooltip({
      name: country.name,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  return (
    <div className="map-wrap">
      <svg
        className="world-map"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1008 651"
        onMouseLeave={() => setTooltip(null)}
      >
        <defs>
          <linearGradient
            id="visitedGradient"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        {worldMap.map((country) => {
          const isVisited = visitedSet.has(country.code);
          return (
            <path
              key={country.code}
              d={country.d}
              className={isVisited ? "country is-visited" : "country"}
              onMouseMove={(event) => handleMouseMove(event, country)}
              onClick={() => onToggle(country.code)}
            />
          );
        })}
      </svg>

      {tooltip && (
        <div
          className="map-tooltip"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.name}
        </div>
      )}

      {loading && <div className="map-loading">Loading map…</div>}
    </div>
  );
}
