export default function VisitedList({ visited, onRemove, loading }) {
  if (loading) {
    return (
      <section className="visited-list">
        <h2 className="visited-title">Visited</h2>
        <p className="visited-empty">Loading your travels…</p>
      </section>
    );
  }

  return (
    <section className="visited-list">
      <h2 className="visited-title">Visited ({visited.length})</h2>
      {visited.length === 0 ? (
        <p className="visited-empty">
          No countries yet. Search above or click the map!
        </p>
      ) : (
        <ul>
          {visited.map((country) => (
            <li key={country.code} className="visited-item">
              <span className="visited-code">{country.code}</span>
              <span className="visited-name">{country.name}</span>
              <button
                type="button"
                className="visited-remove"
                onClick={() => onRemove(country.code)}
                aria-label={`Remove ${country.name}`}
                title={`Remove ${country.name}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
