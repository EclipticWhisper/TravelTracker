# Travel Tracker

A full-stack web app to track the countries you've visited on an interactive world map. Click any country to mark it as visited, search and add countries by name, and watch your travel progress grow in real time.

![Stack](https://img.shields.io/badge/React-18-61DAFB) ![Vite](https://img.shields.io/badge/Vite-5-646CFF) ![Express](https://img.shields.io/badge/Express-4-000000) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-4169E1)

## Features

- Interactive SVG world map — click a country to toggle it visited
- Live stats: countries visited, total countries, and completion percentage
- Debounced country search with visited-state indicators
- Visited list with one-click removal
- Toast notifications for every action
- Responsive dark UI (Inter + Sora typography)

## Tech Stack

| Layer     | Technology                              |
| --------- | --------------------------------------- |
| Frontend  | React 18, Vite 5, plain CSS             |
| Backend   | Node.js, Express 4 (ESM)                |
| Database  | PostgreSQL (`pg` driver)                |
| Tooling   | ESLint, Concurrently                    |

## Project Structure

```
TravelTracker/
├── client/                 # React frontend (Vite)
│   ├── index.html
│   ├── vite.config.js      # dev proxy: /api -> :3000
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx         # state + orchestration
│       ├── index.css
│       ├── api/client.js   # fetch wrapper around /api/*
│       ├── components/
│       │   ├── Header.jsx
│       │   ├── WorldMap.jsx
│       │   ├── SearchBar.jsx
│       │   ├── Stats.jsx
│       │   ├── VisitedList.jsx
│       │   └── Toasts.jsx
│       └── data/world-map.json  # SVG country paths
├── server/                 # Express REST API
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── server.js       # entrypoint + graceful shutdown
│       ├── app.js          # middleware + route mounting
│       ├── config/db.js    # pg Pool + env config
│       ├── controllers/
│       │   ├── countries.controller.js
│       │   └── visited.controller.js
│       ├── routes/
│       │   ├── index.js
│       │   ├── countries.routes.js
│       │   └── visited.routes.js
│       └── middleware/errorHandler.js
└── package.json            # root scripts (concurrently)
```

## Prerequisites

- Node.js 18+
- PostgreSQL 12+

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/EclipticWhisper/TravelTracker.git
cd TravelTracker
npm run install:all
```

### 2. Configure the database

Create the database and tables:

```sql
CREATE DATABASE world;

CREATE TABLE countries (
  id           SERIAL PRIMARY KEY,
  country_code VARCHAR(2)  NOT NULL UNIQUE,
  country_name TEXT        NOT NULL
);

CREATE TABLE visitedcountries (
  country_code VARCHAR(2) PRIMARY KEY REFERENCES countries(country_code)
);
```

Seed the `countries` table with country codes and names (the SVG paths for the map live client-side in `client/src/data/world-map.json`).

### 3. Set environment variables

Copy the example file and fill in your PostgreSQL credentials:

```bash
cp server/.env.example server/.env
```

```dotenv
PGUSER=postgres
PGHOST=localhost
PGDATABASE=world
PGPASSWORD=your_password_here
PGPORT=5432
PORT=3000
NODE_ENV=development
```

### 4. Run in development

```bash
npm run dev
```

This starts both services concurrently:

- Server — http://localhost:3000
- Client — http://localhost:5173 (proxies `/api` to the server)

Run them separately if preferred:

```bash
npm run dev:server
npm run dev:client
```

### Production build

```bash
npm run build      # builds the client into client/dist
npm start          # serves the API and the built client
```

## API Reference

All endpoints are prefixed with `/api`.

| Method | Endpoint            | Description                                        |
| ------ | ------------------- | -------------------------------------------------- |
| GET    | `/health`           | Health check                                       |
| GET    | `/stats`            | Aggregate counts and completion percentage         |
| GET    | `/countries?search=`| List countries, optionally filtered by name/code   |
| GET    | `/visited`          | List visited countries                             |
| POST   | `/visited`          | Add a visited country (by name or ISO code)        |
| DELETE | `/visited/:code`    | Remove a visited country                           |

**Add a country** — `POST /api/visited`

```json
{ "country": "France" }
```

**Response** — `201 Created`

```json
{ "country": { "code": "FR", "name": "France" } }
```

## Scripts

| Script             | Description                              |
| ------------------ | ---------------------------------------- |
| `npm run dev`      | Run server + client together             |
| `npm run dev:server` | Run the API only                       |
| `npm run dev:client` | Run the frontend only                  |
| `npm run build`    | Build the frontend for production        |
| `npm start`        | Start the server (serves built client)   |
| `npm run lint`     | Lint the frontend                        |
| `npm run install:all` | Install root, server, and client deps  |
