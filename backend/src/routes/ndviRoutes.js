import express from "express";
import { getNDVI, getNDVIComparison } from "../controllers/ndviController.js";

const router = express.Router();

// Fetch NDVI for a single polygon
router.post("/", getNDVI);

// Compare NDVI (before vs after)
router.post("/compare", getNDVIComparison);

export default router;
