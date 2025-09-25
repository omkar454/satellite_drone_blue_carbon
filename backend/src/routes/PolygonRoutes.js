import express from "express";
import {
  createPolygon,
  getPolygons,
  getPolygonById,
  updatePolygon,
  deletePolygon,
  findPolygonsNear,
} from "../controllers/polygonController.js";

const router = express.Router();

router.post("/", createPolygon); // Create
router.get("/", getPolygons); // Get all
router.get("/near", findPolygonsNear); // Geospatial query
router.get("/:id", getPolygonById); // Get one
router.put("/:id", updatePolygon); // Update
router.delete("/:id", deletePolygon); // Delete

export default router;
