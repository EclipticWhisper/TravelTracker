import { Router } from "express";
import {
  getVisited,
  addVisited,
  removeVisited,
} from "../controllers/visited.controller.js";

const router = Router();

router.get("/", getVisited);
router.post("/", addVisited);
router.delete("/:code", removeVisited);

export default router;
