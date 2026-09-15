import { Router } from "express";
import { pool } from "../config/db.js";
import countriesRoutes from "./countries.routes.js";
import visitedRoutes from "./visited.routes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

router.get("/stats", async (req, res, next) => {
  try {
    const countries = await pool.query(
      "SELECT COUNT(*)::int AS total FROM countries"
    );
    const visited = await pool.query(
      "SELECT COUNT(*)::int AS total FROM visitedcountries"
    );

    const totalCountries = countries.rows[0].total;
    const visitedCountries = visited.rows[0].total;
    const percentage = totalCountries
      ? Math.round((visitedCountries / totalCountries) * 1000) / 10
      : 0;

    res.json({ totalCountries, visitedCountries, percentage });
  } catch (err) {
    next(err);
  }
});

router.use("/countries", countriesRoutes);
router.use("/visited", visitedRoutes);

export default router;
