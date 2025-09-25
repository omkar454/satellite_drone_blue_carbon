// controllers/ndviController.js
import NDVIResult from "../models/ndviResults.js";

// Placeholder: In future integrate real satellite NDVI API
export const getNDVI = async (req, res) => {
  try {
    const { polygonId, geometry, startDate, endDate } = req.body;

    if (!geometry || !geometry.coordinates) {
      return res.status(400).json({ message: "Polygon geometry is required" });
    }

    // Simulate NDVI computation (replace with real satellite API later)
    const ndviValue = parseFloat((Math.random() * 0.8 + 0.2).toFixed(2)); // 0.2–1 healthy vegetation
    const ndviMapURL = `https://via.placeholder.com/400x400.png?text=NDVI+${ndviValue}`;

    // Save result in DB for future reference
    const result = await NDVIResult.create({
      polygonId,
      startDate,
      endDate,
      ndviValue,
      ndviMapURL,
    });

    res.json(result);
  } catch (err) {
    console.error("NDVI Error:", err);
    res.status(500).json({ message: err.message });
  }
};
