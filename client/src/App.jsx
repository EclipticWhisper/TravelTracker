import { useCallback, useEffect, useState } from "react";
import { api } from "./api/client.js";
import Header from "./components/Header.jsx";
import WorldMap from "./components/WorldMap.jsx";
import SearchBar from "./components/SearchBar.jsx";
import Stats from "./components/Stats.jsx";
import VisitedList from "./components/VisitedList.jsx";
import Toasts from "./components/Toasts.jsx";

export default function App() {
  const [visited, setVisited] = useState([]);
  const [stats, setStats] = useState({
    totalCountries: 0,
    visitedCountries: 0,
    percentage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  const notify = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3200);
  }, []);

  const loadData = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const [visitedRes, statsRes] = await Promise.all([
          api.getVisited(),
          api.getStats(),
        ]);
        setVisited(visitedRes.visited);
        setStats(statsRes);
      } catch (err) {
        notify(err.message, "error");
      } finally {
        setLoading(false);
      }
    },
    [notify]
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addCountry = useCallback(
    async (country) => {
      try {
        const res = await api.addVisited(country);
        await loadData(true);
        notify(`${res.country.name} added to your map`, "success");
        return true;
      } catch (err) {
        notify(err.message, "error");
        return false;
      }
    },
    [loadData, notify]
  );

  const removeCountry = useCallback(
    async (code) => {
      const target = visited.find((country) => country.code === code);
      try {
        await api.removeVisited(code);
        await loadData(true);
        notify(`${target?.name || code} removed`, "info");
      } catch (err) {
        notify(err.message, "error");
      }
    },
    [visited, loadData, notify]
  );

  const toggleCountry = useCallback(
    async (code) => {
      const isVisited = visited.some((country) => country.code === code);
      if (isVisited) {
        await removeCountry(code);
      } else {
        await addCountry(code);
      }
    },
    [visited, addCountry, removeCountry]
  );

  return (
    <div className="app">
      <Header stats={stats} />
      <main className="layout">
        <section className="map-panel">
          <WorldMap
            visited={visited}
            onToggle={toggleCountry}
            loading={loading}
          />
        </section>
        <aside className="side-panel">
          <SearchBar onAdd={addCountry} visited={visited} />
          <Stats stats={stats} />
          <VisitedList
            visited={visited}
            onRemove={removeCountry}
            loading={loading}
          />
        </aside>
      </main>
      <Toasts toasts={toasts} />
    </div>
  );
}
