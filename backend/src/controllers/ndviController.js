import NDVIResult from "../models/ndviResults.js";

// Single NDVI
export const getNDVI = async (req, res) => {
  try {
    const { polygonId, geometry, startDate, endDate } = req.body;

    if (!geometry || !geometry.coordinates) {
      return res.status(400).json({ message: "Polygon geometry is required" });
    }

    // Simulated NDVI
    const ndviValue = parseFloat((Math.random() * 0.8 + 0.2).toFixed(2));
    const ndviMapURL = `https://via.placeholder.com/400x400.png?text=NDVI+${ndviValue}`;

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

// Before vs After NDVI
export const getNDVIComparison = async (req, res) => {
  try {
    const { polygonId, geometry, beforeDate, afterDate } = req.body;

    if (!geometry || !geometry.coordinates) {
      return res.status(400).json({ message: "Polygon geometry is required" });
    }

    // Simulate NDVI values
    const beforeNDVI = parseFloat((Math.random() * 0.5 + 0.2).toFixed(2));
    const afterNDVI = parseFloat((Math.random() * 0.5 + 0.5).toFixed(2));

    const result = {
      polygonId,
      beforeDate,
      afterDate,
      beforeNDVI,
      afterNDVI,
      beforeMapURL: `https://via.placeholder.com/400x400.png?text=Before+NDVI+${beforeNDVI}`,
      afterMapURL: `https://via.placeholder.com/400x400.png?text=After+NDVI+${afterNDVI}`,
      growth: parseFloat((afterNDVI - beforeNDVI).toFixed(2)),
    };

    res.json(result);
  } catch (err) {
    console.error("NDVI Comparison Error:", err);
    res.status(500).json({ message: err.message });
  }
};
