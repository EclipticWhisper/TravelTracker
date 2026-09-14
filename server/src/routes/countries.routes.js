import { Router } from "express";
import { listCountries } from "../controllers/countries.controller.js";

const router = Router();

router.get("/", listCountries);

export default router;
