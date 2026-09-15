const API_BASE = "/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || "Something went wrong.");
    error.status = response.status;
    throw error;
  }

  return data;
}

export const api = {
  getStats: () => request("/stats"),
  getVisited: () => request("/visited"),
  searchCountries: (search) =>
    request(`/countries?search=${encodeURIComponent(search)}`),
  addVisited: (country) =>
    request("/visited", {
      method: "POST",
      body: JSON.stringify({ country }),
    }),
  removeVisited: (code) => request(`/visited/${code}`, { method: "DELETE" }),
};
