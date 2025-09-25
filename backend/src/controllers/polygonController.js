import Polygon from "../models/Polygon.js";
import * as turf from "@turf/turf";

// @desc    Create new polygon
// @route   POST /api/polygons
export const createPolygon = async (req, res) => {
  try {
    console.log("Received polygon:", req.body); // <--- debug
    const { name, geometry } = req.body;

    if (
      !name ||
      !geometry ||
      !geometry.coordinates ||
      geometry.coordinates[0].length < 3
    ) {
      return res
        .status(400)
        .json({ message: "Name and at least 3 coordinates are required" });
    }

    // Calculate area using Turf
    const areaSqMeters = turf.area(geometry);
    const areaHectares = areaSqMeters / 10000;

    const polygon = new Polygon({
      name,
      geometry,
      area: areaHectares,
    });

    await polygon.save();
    res.status(201).json(polygon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all polygons
// @route   GET /api/polygons
export const getPolygons = async (req, res) => {
  try {
    const polygons = await Polygon.find();
    res.json(polygons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get polygon by ID
// @route   GET /api/polygons/:id
export const getPolygonById = async (req, res) => {
  try {
    const polygon = await Polygon.findById(req.params.id);
    if (!polygon) return res.status(404).json({ message: "Polygon not found" });
    res.json(polygon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update polygon
// @route   PUT /api/polygons/:id
export const updatePolygon = async (req, res) => {
  try {
    const { name, geometry } = req.body;

    const polygon = await Polygon.findById(req.params.id);
    if (!polygon) return res.status(404).json({ message: "Polygon not found" });

    if (
      geometry &&
      geometry.coordinates &&
      geometry.coordinates[0].length >= 3
    ) {
      polygon.geometry = geometry;
      polygon.area = turf.area(geometry) / 10000;
    }

    polygon.name = name || polygon.name;

    const updatedPolygon = await polygon.save();
    res.json(updatedPolygon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete polygon
// @route   DELETE /api/polygons/:id
export const deletePolygon = async (req, res) => {
  try {
    const polygon = await Polygon.findById(req.params.id);
    if (!polygon) return res.status(404).json({ message: "Polygon not found" });

    await polygon.deleteOne();
    res.json({ message: "Polygon removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Find polygons near a point
// @route   GET /api/polygons/near?lng=..&lat=..&distance=..
export const findPolygonsNear = async (req, res) => {
  try {
    const { lng, lat, distance } = req.query;

    const polygons = await Polygon.find({
      geometry: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseInt(distance) || 1000, // default 1km
        },
      },
    });

    res.json(polygons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
