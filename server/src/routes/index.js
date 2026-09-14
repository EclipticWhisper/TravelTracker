import { Router } from "express";
import countriesRoutes from "./countries.routes.js";
import visitedRoutes from "./visited.routes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

router.use("/countries", countriesRoutes);
router.use("/visited", visitedRoutes);

export default router;
