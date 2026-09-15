export default function Stats({ stats }) {
  const { totalCountries, visitedCountries, percentage } = stats;

  return (
    <section className="stats">
      <h2 className="stats-title">Your progress</h2>
      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-value">{visitedCountries}</span>
          <span className="stat-label">Visited</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{totalCountries}</span>
          <span className="stat-label">Countries</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{percentage}%</span>
          <span className="stat-label">Complete</span>
        </div>
      </div>
      <div
        className="progress"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div className="progress-fill" style={{ width: `${percentage}%` }} />
      </div>
      <p className="stats-hint">Click a country on the map to toggle it.</p>
    </section>
  );
}
