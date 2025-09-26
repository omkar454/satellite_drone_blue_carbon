import express from "express";
import { getNDVI, getNDVIComparison } from "../controllers/ndviController.js";

const router = express.Router();

// single NDVI
router.post("/", getNDVI);

// before vs after comparison
router.post("/compare", getNDVIComparison);

export default router;
