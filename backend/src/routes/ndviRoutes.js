// routes/ndviRoutes.js
import express from "express";
import { getNDVI } from "../controllers/ndviController.js";

const router = express.Router();

// POST /api/ndvi
router.post("/", getNDVI);

export default router;
