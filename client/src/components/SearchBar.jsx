import { useEffect, useRef, useState } from "react";
import { api } from "../api/client.js";

export default function SearchBar({ onAdd, visited }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef(null);

  const visitedCodes = new Set(visited.map((country) => country.code));

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await api.searchCountries(trimmed);
        setResults(res.countries || []);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClick = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (country) => {
    setQuery("");
    setResults([]);
    setOpen(false);
    onAdd(country.name);
  };

  return (
    <div className="search-bar" ref={boxRef}>
      <label className="search-label" htmlFor="country-search">
        Add a country
      </label>
      <div className="search-input-wrap">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M21 21l-4.35-4.35M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <input
          id="country-search"
          className="search-input"
          type="text"
          placeholder="Search countries…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoComplete="off"
        />
        {loading && <span className="search-spinner" aria-hidden="true" />}
      </div>

      {open && query.trim() && (
        <ul className="search-results">
          {results.length === 0 ? (
            <li className="search-empty">No countries found</li>
          ) : (
            results.map((country) => (
              <li key={country.code}>
                <button
                  type="button"
                  className="search-item"
                  onClick={() => handleSelect(country)}
                  disabled={visitedCodes.has(country.code)}
                >
                  <span className="search-flag">{country.code}</span>
                  <span className="search-name">{country.name}</span>
                  {visitedCodes.has(country.code) && (
                    <span className="search-visited">Visited</span>
                  )}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
