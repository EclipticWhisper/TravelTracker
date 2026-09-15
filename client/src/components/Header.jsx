export default function Header({ stats }) {
  return (
    <header className="header">
      <div className="header-brand">
        <div className="logo" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M3.6 9h16.8M3.6 15h16.8M12 3a13.5 13.5 0 0 1 0 18M12 3a13.5 13.5 0 0 0 0 18"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </div>
        <div className="header-title">
          <h1>Travel Tracker</h1>
          <p>Your personal map of the world</p>
        </div>
      </div>
      <div className="header-stat">
        <span className="header-stat-value">{stats.visitedCountries}</span>
        <span className="header-stat-label">countries visited</span>
      </div>
    </header>
  );
}
